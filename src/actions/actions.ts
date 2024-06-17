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

const downloadVideo = (videoUrl: string, outputFile: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ytdl(videoUrl)
            .pipe(fs.createWriteStream(outputFile))
            .on('finish', () => {
                console.log(`Video downloaded to ${outputFile}`);
                resolve(); // Resolve the promise with void
            })
            .on('error', reject);
    });
};

const captureScreenshots = (videoFile: string, outputDir: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoFile)
            .on('end', () => {
                console.log('Screenshots captured');
                resolve(); // Resolve the promise with void
            })
            .on('error', reject)
            .screenshots({
                count: 10,
                folder: outputDir,
                size: '1280x720',
                filename: 'screenshot-%i.png'
            });
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
        console.log('Creating screenshots directory if it does not exist');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        console.log('Fetching video info');
        const videoInfo = await ytdl.getInfo(formData.link);
        const videoId = videoInfo.videoDetails.videoId;
        const videoTitle = videoInfo.videoDetails.title;
        const videoDescription = videoInfo.videoDetails.description || "No description available";

        console.log('Transcribing video');
        const transcript = await transcribeVideo(formData.link);
        const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

        console.log('Searching using Tavilly');
        const searchResult = await searchUsingTavilly(transcript);
        const additionalContext = JSON.parse(searchResult).someRelevantField;

        if (!transcript) {
            throw new Error("Couldn't transcribe the Audio.");
        }

        console.log('Downloading video');
        await downloadVideo(formData.link, videoFile);

        console.log('Capturing screenshots');
        await captureScreenshots(videoFile, outputDir);

        console.log('Uploading screenshots to S3 and saving to database');
        const screenshotFiles = fs.readdirSync(outputDir);
        for (const file of screenshotFiles) {
            const filePath = path.join(outputDir, file);
            const s3Url = await uploadToS3(filePath, bucketName, `screenshots/${videoTitle}-${file}`);

            // Check if the screenshot already exists
            const existingScreenshot = await db.screenshot.findUnique({
                where: { url: s3Url } // Use URL as the unique identifier
            });

            if (!existingScreenshot) {
                console.log(`Saving screenshot ${s3Url} to database`);
                await db.screenshot.create({
                    data: {
                        videoId: videoId,
                        url: s3Url, // Save the S3 URL
                    }
                });
                console.log(`Saved screenshot ${s3Url} to database`);
            }
        }

        console.log('Checking if video already exists in database');
        const existingVideo = await db.video.findUnique({
            where: {
              videoid: videoId
            }
        });
          
        if (existingVideo) {
            console.log('Video exists, checking for existing summary');
            const existingSummary = await db.summary.findFirst({
              where: {
                videoid: existingVideo.videoid
              }
            });
          
            if (existingSummary) {
              console.log('Summary exists, returning video ID');
              return existingSummary.videoid;
            }

            console.log('Generating summary');
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

            console.log('Saving summary to database');
            await db.summary.create({
                data: {
                    videoid: videoId,
                    summary: summary as string,
                }
            });

            return videoId
        }

        console.log('Creating new video entry in database');
        await db.video.create({
            data: {
                videoid: videoId,
                videotitle: videoInfo.videoDetails.title,
                transcript: transcript,
            }
        });

        console.log('Generating summary');
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

        console.log('Saving summary to database');
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
        console.log('Cleaning up: Deleting video and screenshots');
        try {
            if (fs.existsSync(videoFile)) {
                fs.unlinkSync(videoFile);
                console.log(`Deleted video file: ${videoFile}`);
            }

            if (fs.existsSync(outputDir)) {
                const screenshotFiles = fs.readdirSync(outputDir);
                for (const file of screenshotFiles) {
                    const filePath = path.join(outputDir, file);
                    fs.unlinkSync(filePath);
                    console.log(`Deleted screenshot file: ${filePath}`);
                }
                fs.rmdirSync(outputDir);
                console.log(`Deleted screenshots directory: ${outputDir}`);
            }
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }

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
        console.log('Checking facts');
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