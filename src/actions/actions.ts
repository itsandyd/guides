"use server"

import { revalidatePath } from "next/cache"
import { type MessageContent } from "@langchain/core/messages"
import ytdl from "ytdl-core"
import { z } from "zod"

import { db } from "@/lib/db"
import { formSchema } from "@/components/admin/initialForm"
import { summarizeTranscriptWithGpt, summarizeTranscriptWithGroq } from "./summarize"
import { transcribeVideo } from "./transcribe"
import { VerifyFactsFormSchema } from "@/components/admin/verifyFacts"
import { searchUsingTavilly } from "./search"
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';

import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

const uploadToS3 = (filePath: string, bucketName: string, key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: data,
                ContentType: 'image/png',
            };
            s3.upload(params, (s3Err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (s3Err) reject(s3Err);
                console.log(`Uploaded ${filePath} to S3 at ${data.Location}`);
                resolve(data.Location);
            });
        });
    });
};


ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

export type FactCheckerResponse = {
    input: string;
    isAccurate: "true" | "false";
    source: string;
    text: string;
    additionalContext: string; // New field to store more context
}

const downloadVideo = (videoUrl: string, outputFile: string) => {
    return new Promise((resolve, reject) => {
        ytdl(videoUrl)
            .pipe(fs.createWriteStream(outputFile))
            .on('finish', () => {
                console.log(`Video downloaded to ${outputFile}`);
                // resolve();
            })
            .on('error', reject);
    });
};

const captureScreenshots = (videoFile: string, timestamps: number[], outputDir: string) => {
    return new Promise((resolve, reject) => {
        if (timestamps.length === 0) {
            return reject(new Error("No timestamps provided for capturing screenshots."));
        }

        const captureScreenshot = (timestamp: number, index: number) => {
            return new Promise<void>((resolve, reject) => {
                ffmpeg(videoFile)
                    .on('error', (err) => {
                        console.error(`FFmpeg error at timestamp ${timestamp}:`, err);
                        reject(err);
                    })
                    .on('end', resolve)
                    .screenshots({
                        timestamps: [timestamp],
                        folder: outputDir,
                        size: '1280x720',
                        filename: `screenshot-${index + 1}.png`
                    });
            });
        };

        const captureAllScreenshots = async () => {
            for (let i = 0; i < timestamps.length; i++) {
                await captureScreenshot(timestamps[i], i);
            }
        };

        captureAllScreenshots()
            .then(resolve)
            .catch(reject);
    });
};


export const handleInitialFormSubmit = async (
    formData: z.infer<typeof formSchema>
) => {
    const start = Date.now();
    const outputDir = path.join(__dirname, 'screenshots');
    const videoFile = path.join(__dirname, 'video.mp4');
    const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const videoInfo = await ytdl.getInfo(formData.link);
        const videoId = videoInfo.videoDetails.videoId;
        const videoTitle = videoInfo.videoDetails.title;
        const videoDescription = videoInfo.videoDetails.description || "No description available";

        const transcript = await transcribeVideo(formData.link);
        const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

        const searchResult = await searchUsingTavilly(transcript);
        const additionalContext = JSON.parse(searchResult).someRelevantField;

        if (!transcript) {
            throw new Error("Couldn't transcribe the Audio.");
        }

        await downloadVideo(formData.link, videoFile);

        // Extract key moments from the transcript
        let keyMoments = extractKeyMoments(transcript);

        // Fallback to regular intervals if no key moments are found
        if (keyMoments.length === 0) {
            const videoInfo = await ytdl.getBasicInfo(formData.link);
            const videoDuration = parseFloat(videoInfo.videoDetails.lengthSeconds);
            if (isNaN(videoDuration)) {
                throw new Error("Couldn't determine the video duration.");
            }
            const interval = Math.floor(videoDuration / 10); // Capture 10 screenshots evenly spaced
            keyMoments = Array.from({ length: 10 }, (_, i) => i * interval);
            console.log("No key moments found, using regular intervals:", keyMoments);
        }

        await captureScreenshots(videoFile, keyMoments, outputDir);

        // Save screenshots to the database and upload to S3
        const screenshotFiles = fs.readdirSync(outputDir);
        for (const file of screenshotFiles) {
            const filePath = path.join(outputDir, file);
            const s3Url = await uploadToS3(filePath, bucketName, `screenshots/${file}`);

            // Check if the screenshot already exists
            const existingScreenshot = await db.screenshot.findUnique({
                where: { path: filePath }
            });

            if (!existingScreenshot) {
                await db.screenshot.create({
                    data: {
                        videoId: videoId,
                        path: filePath,
                        url: s3Url, // Save the S3 URL
                    }
                });
            }
        }

        const existingVideo = await db.video.findUnique({
            where: {
              videoid: videoId
            }
        });
          
        if (existingVideo) {
            const existingSummary = await db.summary.findFirst({
              where: {
                videoid: existingVideo.videoid
              }
            });
          
            if (existingSummary) {
              return existingSummary.videoid;
            }

            let summary: MessageContent | null = null
            if (formData.model == "gpt-4o") {
                summary = await summarizeTranscriptWithGpt(
                    enhancedTranscription,
                    formData.model,
                    videoTitle,
                    videoDescription,
                    additionalContext
                );
            } else {
                summary = await summarizeTranscriptWithGroq(
                    existingVideo.transcript!,
                    formData.model,
                    additionalContext
                )
            }

            if (!summary) {
                throw new Error("Couldn't summarize the Transcript.")
            }

            await db.summary.create({
                data: {
                    videoid: videoId,
                    summary: summary as string,
                }
            });

            return videoId
        }

        await db.video.create({
            data: {
                videoid: videoId,
                videotitle: videoInfo.videoDetails.title,
                transcript: transcript,
            }
        });

        let summary: MessageContent | null = null
        if (formData.model == "gpt-4o") {
            summary = await summarizeTranscriptWithGpt(
                enhancedTranscription,
                formData.model,
                videoTitle,
                videoDescription,
                additionalContext
            );
        } else {
            summary = await summarizeTranscriptWithGroq(
                enhancedTranscription,
                formData.model,
                additionalContext
            );
        }

        if (!summary) {
            throw new Error("Couldn't summarize the Transcript.")
        }

        await db.summary.create({
            data: {
                videoid: videoId,
                summary: summary as string,
            }
        });

        return videoId
    } catch (e: any) {
        console.error(e)
        return null
    } finally {
        console.log(
            `Generated ${formData.link} in ${(Date.now() - start) / 1000} seconds.`
        );
        revalidatePath("/");
        revalidatePath("/summaries");
    }
}

handleInitialFormSubmit.maxDuration = 300;

export const checkFacts = async (
    formData: z.infer<typeof VerifyFactsFormSchema>
) => {
    try {
        const res = await searchUsingTavilly(formData.summary);
        const parsedResult = JSON.parse(res);

        const additionalContext = parsedResult.someRelevantField;

        return {
            input: formData.summary,
            isAccurate: parsedResult.isAccurate,
            source: parsedResult.source,
            text: parsedResult.text,
            additionalContext: additionalContext
        } as FactCheckerResponse;
    } catch (e) {
        console.error(e);
        return null;
    }
}