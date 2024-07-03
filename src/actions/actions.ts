
"use server"

import ytdl from "ytdl-core";
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { z } from "zod";
import { db } from "@/lib/db";
import { transcribeVideo } from "./transcribe";
import { summarizeTranscriptWithGpt, summarizeTranscriptWithGroq } from "./summarize";
import { revalidatePath } from "next/cache";
import { formSchema } from "@/components/admin/initialForm";
import { VerifyFactsFormSchema } from "@/components/admin/verifyFacts";
import { searchUsingTavilly } from "./search";

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export type FactCheckerResponse = {
    input: string;
    isAccurate: "true" | "false";
    source: string;
    text: string;
    additionalContext: string;
};

const downloadAndUploadVideo = async (url: string, videoId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
        }
        const tempFilePath = path.join(tempDir, `${videoId}.mp4`);
        const writeStream = fs.createWriteStream(tempFilePath);

        // Download the video to a temporary file
        ytdl(url)
            .pipe(writeStream)
            .on('finish', async () => {
                try {
                    console.log('Video downloaded to temporary file:', tempFilePath);

                    // Upload the video to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                        resource_type: 'video',
                        public_id: `video_${videoId}`,
                        overwrite: true
                    });

                    console.log(`Uploaded video to Cloudinary at ${uploadResult.secure_url}`);

                    // Clean up: delete the temporary video file
                    fs.unlinkSync(tempFilePath);
                    console.log(`Deleted temporary video file: ${tempFilePath}`);

                    resolve(uploadResult.secure_url); // Return the Cloudinary URL
                } catch (err) {
                    console.error(`Error uploading video to Cloudinary: ${err}`);
                    reject(err);
                }
            })
            .on('error', (err) => {
                console.error(`Error downloading video: ${err}`);
                reject(err);
            });
    });
};

// Handle form submit
export const handleInitialFormSubmit = async (
    formData: z.infer<typeof formSchema>
) => {
    const start = Date.now();
    try {
        console.log('Fetching video info');
        const videoInfo = await ytdl.getInfo(formData.link);
        const videoId = videoInfo.videoDetails.videoId;
        const videoTitle = videoInfo.videoDetails.title;
        const videoDescription = videoInfo.videoDetails.description || "No description available";

        console.log('Transcribing video');
        const transcript = await transcribeVideo(formData.link);
        const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

        if (!transcript) {
            throw new Error("Couldn't transcribe the Audio.");
        }

        console.log('Downloading and uploading video');
        const cloudinaryUrl = await downloadAndUploadVideo(formData.link, videoId);

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
            let summary = null;
            if (formData.model == "gpt-4o") {
                summary = await summarizeTranscriptWithGpt(
                    enhancedTranscription,
                    formData.model,
                    videoTitle,
                    videoDescription
                );
            } else {
                summary = await summarizeTranscriptWithGroq(
                    enhancedTranscription,
                    formData.model
                );
            }

            if (!summary) {
                throw new Error("Couldn't summarize the Transcript.");
            }

            console.log('Saving summary to database');
            await db.summary.create({
                data: {
                    videoid: videoId,
                    summary: summary as string,
                }
            });

            return videoId;
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
        let summary = null;
        if (formData.model == "gpt-4o") {
            summary = await summarizeTranscriptWithGpt(
                enhancedTranscription,
                formData.model,
                videoTitle,
                videoDescription
            );
        } else {
            summary = await summarizeTranscriptWithGroq(
                enhancedTranscription,
                formData.model
            );
        }

        if (!summary) {
            throw new Error("Couldn't summarize the Transcript.");
        }

        console.log('Saving summary to database');
        await db.summary.create({
            data: {
                videoid: videoId,
                summary: summary as string,
            }
        });

        return videoId;
    } catch (e: any) {
        console.error(e);
        return null;
    } finally {
        console.log(
            `Processed ${formData.link} in ${(Date.now() - start) / 1000} seconds.`
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
