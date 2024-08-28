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
import OpenAI from "openai";
import AWS from 'aws-sdk';

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const streamVideoToS3 = async (url: string, bucketName: string, key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const videoStream = ytdl(url, { quality: 'lowest' });
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: videoStream,
            ContentType: 'video/mp4',
        };

        s3.upload(uploadParams, (err: any, data: any) => {
            if (err) {
                if (err.statusCode === 403) {
                    console.error('Error uploading video to S3: Access Denied (403)');
                } else {
                    console.error(`Error uploading video to S3: ${err.message}`);
                }
                reject(err);
            } else {
                console.log(`Uploaded video to S3 at ${data.Location}`);
                resolve(data.Location);
            }
        });

        videoStream.on('error', (err) => {
            console.error(`Error downloading video: ${err.message}`);
            reject(err);
        });
    });
};

const captureScreenshotsFromCloudinary = async (videoId: string, videoDuration: number): Promise<string[]> => {
    const screenshotUrls: string[] = [];

    for (let i = 0; i < videoDuration; i += 30) {
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


  const openai = new OpenAI();
  
  const generateCaptionForScreenshot = async (screenshotUrl: string): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": "Please generate a detailed caption describing what is shown in the provided image."
                        },
                        {
                            "type": "image_url", 
                            "image_url": {
                                "url": screenshotUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 100,
        });

        const choice = response.choices?.[0]?.message?.content?.trim();
        if (choice) {
            return choice;
        } else {
            console.error("Unexpected response from OpenAI API:", response);
            return "Error generating caption.";
        }
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "Error generating caption.";
    }
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

        // console.log('Streaming video to S3');
        // const s3Url = await streamVideoToS3(formData.link, process.env.AWS_S3_BUCKET_NAME!, `videos/${videoId}.mp4`);

        // console.log('Capturing screenshots from Cloudinary');
        // const screenshotUrls = await captureScreenshotsFromCloudinary(videoId, videoDuration);

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
    
