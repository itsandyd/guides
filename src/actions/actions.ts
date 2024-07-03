"use server"

import ytdl from "ytdl-core";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
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

const streamVideoToCloudinary = async (url: string, videoId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                public_id: `video_${videoId}`,
                overwrite: true,
                // timeout: 300000,
                eager: [
                    {
                        width: 1280,
                        height: 720,
                        crop: 'fit',
                        format: 'mp4',
                        // quality: 'auto'
                    }
                ]
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    console.error('Error uploading video to Cloudinary:', error || 'Upload result is undefined');
                    reject(error || new Error('Upload result is undefined'));
                } else {
                    console.log(`Uploaded video to Cloudinary at ${result.secure_url}`);
                    resolve(result.secure_url); // Return the Cloudinary URL
                }
            }
        );

        // Stream the video to Cloudinary
        ytdl(url, { quality: 'highestvideo' })
            .pipe(uploadStream)
            .on('error', (err) => {
                console.error('Error downloading video:', err);
                reject(err);
            });
    });
};

const captureScreenshotsFromCloudinary = async (videoId: string, videoDuration: number): Promise<string[]> => {
    const screenshotUrls: string[] = [];

    for (let i = 0; i < videoDuration; i += 2) {
        const screenshotUrl = cloudinary.url(`video_${videoId}.jpg`, {
            resource_type: 'video',
            transformation: [
                { width: 1920, height: 1080, crop: "fill" },
                { format: "jpg" },
                { start_offset: i }
            ]
        });
        screenshotUrls.push(screenshotUrl);
    }

    return screenshotUrls;
};

const generateCaptionForScreenshot = async (screenshotUrl: string): Promise<string> => {
    // Replace this with your caption generation logic
    return `Caption for ${screenshotUrl}`;
};

// Define FactCheckerResponse type
export type FactCheckerResponse = {
    input: string;
    isAccurate: "true" | "false";
    source: string;
    text: string;
    additionalContext: string;
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
        const videoDuration = parseInt(videoInfo.videoDetails.lengthSeconds); // Get video duration in seconds

        console.log('Transcribing video');
        const transcript = await transcribeVideo(formData.link);
        const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

        if (!transcript) {
            throw new Error("Couldn't transcribe the Audio.");
        }

        console.log('Streaming video to Cloudinary');
        const cloudinaryUrl = await streamVideoToCloudinary(formData.link, videoId);

        console.log('Capturing screenshots from Cloudinary');
        const screenshotUrls = await captureScreenshotsFromCloudinary(videoId, videoDuration);

        console.log('Saving screenshots to database');
        for (const [index, screenshotUrl] of Array.from(screenshotUrls.entries())) {
            try {
                const caption = await generateCaptionForScreenshot(screenshotUrl);
                console.log(`Saving screenshot ${index + 1} with URL ${screenshotUrl}`);
                await db.screenshot.create({
                    data: {
                        videoId: videoId,
                        filename: `screenshot-${index + 1}.jpg`,
                        url: screenshotUrl,
                        caption: caption
                    }
                });
                console.log(`Saved screenshot ${index + 1} to database`);
            } catch (error) {
                console.error(`Error saving screenshot ${index + 1} to database: ${error}`);
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
        console.error('Unhandled error:', e);
        return null;
    } finally {
        console.log(
            `Processed ${formData.link} in ${(Date.now() - start) / 1000} seconds.`
        );
        revalidatePath("/");
        revalidatePath("/summaries");
    }
}

handleInitialFormSubmit.maxDuration = 500;

export const checkFacts = async (
    formData: z.infer<typeof VerifyFactsFormSchema>
): Promise<FactCheckerResponse | null> => {
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
