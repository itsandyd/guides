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
import ffmpeg from 'fluent-ffmpeg'; // Commented out
import fs from 'fs';
import path from 'path';
import ffmpegPath from '@ffmpeg-installer/ffmpeg'; // Commented out
import ffprobePath from '@ffprobe-installer/ffprobe'; // Commented out

import AWS from 'aws-sdk';
import StreamPot from '@streampot/client';
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import * as stream from 'stream';

import { v2 as cloudinary } from 'cloudinary';


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

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

ffmpeg.setFfmpegPath(ffmpegPath.path); // Commented out
ffmpeg.setFfprobePath(ffprobePath.path); // Commented out

const streampotApiKey = process.env.STREAMPOT_API_KEY;
if (!streampotApiKey) {
    throw new Error("STREAMPOT_API_KEY environment variable is not defined");
}

const streampot = new StreamPot({
    secret: streampotApiKey,
});

export type FactCheckerResponse = {
    input: string;
    isAccurate: "true" | "false";
    source: string;
    text: string;
    additionalContext: string; // New field to store more context
}

// const downloadVideo = (videoUrl: string, outputFile: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//         ytdl(videoUrl)
//             .pipe(fs.createWriteStream(outputFile))
//             .on('finish', () => {
//                 console.log(`Video downloaded to ${outputFile}`);
//                 resolve(); // Resolve the promise with void
//             })
//             .on('error', reject);
//     });
// };

// const downloadVideo = (videoUrl: string, bucketName: string, key: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//         const passThroughStream = new stream.PassThrough();
//         const uploadParams = {
//             Bucket: bucketName, // Use the correct bucket name
//             Key: key,
//             Body: passThroughStream,
//             ContentType: 'video/mp4'
//         };

//         const upload = s3.upload(uploadParams, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 console.log(`Uploaded to S3 at ${data.Location}`);
//                 resolve();
//             }
//         });

//         ytdl(videoUrl)
//             .pipe(passThroughStream)
//             .on('error', reject);

//         upload.on('httpUploadProgress', (progress) => {
//             console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
//         });
//     });
// };


// const downloadVideo = (url: string, bucketName: string, key: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const videoStream = ytdl(url);
//         const tempFilePath = path.join(__dirname, 'temp-video.mp4');
//         const writeStream = fs.createWriteStream(tempFilePath);

//         // Download the video to a temporary file
//         videoStream.pipe(writeStream);

//         writeStream.on('finish', () => {
//             console.log('Video downloaded to temporary file');

//             // Upload the video to S3
//             const uploadParams = {
//                 Bucket: bucketName,
//                 Key: key,
//                 Body: fs.createReadStream(tempFilePath),
//                 ContentType: 'video/mp4',
//             };

//             s3.upload(uploadParams, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
//                 if (err) {
//                     console.error(`Error uploading video to S3: ${err}`);
//                     reject(err);
//                 } else {
//                     console.log(`Uploaded video to S3 at ${data.Location}`);
//                     // Clean up the temporary file
//                     fs.unlink(tempFilePath, (unlinkErr) => {
//                         if (unlinkErr) {
//                             console.error(`Error deleting temporary file: ${unlinkErr}`);
//                         }
//                         resolve(data.Location); // Return the S3 URL
//                     });
//                 }
//             });
//         });

//         writeStream.on('error', (err) => {
//             console.error(`Error downloading video: ${err}`);
//             reject(err);
//         });
//     });
// };

// const downloadVideo = (url: string, bucketName: string, key: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const videoStream = ytdl(url);
//         const tempDir = path.join(process.cwd(), 'temp');
//         if (!fs.existsSync(tempDir)) {
//             fs.mkdirSync(tempDir, { recursive: true });
//         }
//         const tempFilePath = path.join(tempDir, `${path.basename(key)}`);
//         const writeStream = fs.createWriteStream(tempFilePath);

//         // Download the video to a temporary file
//         videoStream.pipe(writeStream);

//         writeStream.on('finish', () => {
//             console.log('Video downloaded to temporary file:', tempFilePath);

//             // Upload the video to S3
//             const uploadParams = {
//                 Bucket: bucketName,
//                 Key: key,
//                 Body: fs.createReadStream(tempFilePath),
//                 ContentType: 'video/mp4',
//             };

//             s3.upload(uploadParams, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
//                 if (err) {
//                     console.error(`Error uploading video to S3: ${err}`);
//                     reject(err);
//                 } else {
//                     console.log(`Uploaded video to S3 at ${data.Location}`);
//                     resolve(tempFilePath); // Return the local file path
//                 }
//             });
//         });

//         writeStream.on('error', (err) => {
//             console.error(`Error downloading video: ${err}`);
//             reject(err);
//         });
//     });
// };

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

// // Commented out ffmpeg code and replaced with StreamPot integration
// const captureScreenshots = async (videoFile: string, outputDir: string): Promise<void> => {
//     try {
//         if (!fs.existsSync(videoFile)) {
//             throw new Error(`Video file does not exist: ${videoFile}`);
//         }

//         const job = await streampot
//         .input(videoFile)
//         .FPS(25)
//         .output(`${outputDir}/frame-%i.png`)
//         .runAndWait();
      
//       console.log('Frames extracted');
//     } catch (error) {
//         console.error('Error capturing screenshots:', error);
//         throw error;
//     }
// };

// const captureScreenshots = (videoFile: string, outputDir: string, videoId: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//         ffmpeg.ffprobe(videoFile, async (err, metadata) => {
//             if (err) {
//                 return reject(err);
//             }

//             const duration = metadata.format.duration;
//             if (duration === undefined) {
//                 return reject(new Error("Unable to determine video duration"));
//             }

//             const interval = 5; // seconds
//             const screenshotPromises = [];

//             for (let time = 0; time < duration; time += interval) {
//                 screenshotPromises.push(
//                     new Promise<void>(async (resolve, reject) => {
//                         const screenshotPath = path.join(outputDir, `screenshot-${time}.png`);
//                         // ffmpeg(videoFile)
//                         //     .screenshots({
//                         //         timestamps: [time],
//                         //         folder: outputDir,
//                         //         size: '1280x720',
//                         //         filename: `screenshot-${time}.png`
//                         //     })
//                         //     .on('end', async () => {
//                         //         try {
//                         //             // const caption = await generateCaptionForScreenshot(screenshotPath);
//                         //             console.log(`Generated caption for ${screenshotPath}`);
//                         //             // Save the caption to the database or handle it as needed
//                         //             await db.screenshot.create({
//                         //                 data: {
//                         //                     videoId: videoId,
//                         //                     filename: `screenshot-${time}.png`,
//                         //                     url: screenshotPath,
//                         //                     // caption: caption
//                         //                 }
//                         //             });
//                         //             resolve();
//                         //         } catch (captionError) {
//                         //             reject(captionError);
//                         //         }
//                         //     })
//                         //     .on('error', reject);
//                          ffmpeg(videoFile)
//             .on('end', () => {
//                 console.log('Screenshots captured');
//                 resolve(); // Resolve the promise with void
//             })
//             .on('error', reject)
//             .screenshots({
//                 // timestamps: [time],
//                 count: 20,
//                 folder: outputDir,
//                 size: '1280x720',
//                 filename: `${videoId}-%i.png`
//             });
//                     })
//                 );
//             }

//             Promise.all(screenshotPromises)
//                 .then(() => {
//                     console.log('Screenshots captured and captioned');
//                     resolve();
//                 })
//                 .catch(reject);
//         });
//     });
// };

// ------------------- CAPTURE SCREENSHOTS ------------------- 

// const captureScreenshots = (videoUrl: string, outputDir: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//         ffmpeg(videoUrl)
//             .on('end', () => {
//                 console.log('Screenshots captured');
//                 resolve();
//             })
//             .on('error', reject)
//             .screenshots({
//                 count: 50,
//                 folder: outputDir,
//                 size: '1920x1080',
//                 filename: 'screenshot-%i.png'
//             });
//     });
// };

const captureScreenshots = async (videoFilePath: string, videoId: string): Promise<void> => {
    try {
        console.log('Uploading video to Cloudinary');
        const uploadResult = await cloudinary.uploader.upload(videoFilePath, {
            resource_type: 'video',
            public_id: `video_${videoId}`,
            overwrite: true
        });

        console.log('Generating screenshot URLs');
        const videoDuration = uploadResult.duration; // Get the duration of the video
        const screenshotUrls = [];

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

        console.log('Saving screenshots to database');
        for (let i = 0; i < screenshotUrls.length; i++) {
            const url = screenshotUrls[i];
            const filename = `screenshot-${videoId}-${i+1}.jpg`;

            try {
                // Generate caption for the screenshot using the Cloudinary URL
                const caption = await generateCaptionForScreenshot(url);

                // Check if a screenshot with this filename and videoId already exists
                const existingScreenshot = await db.screenshot.findFirst({
                    where: {
                        videoId: videoId,
                        filename: filename
                    }
                });

                if (existingScreenshot) {
                    // Update existing screenshot
                    await db.screenshot.update({
                        where: { id: existingScreenshot.id },
                        data: { url: url, caption: caption }
                    });
                    console.log(`Updated screenshot ${filename} in database`);
                } else {
                    // Create new screenshot
                    await db.screenshot.create({
                        data: {
                            videoId: videoId,
                            filename: filename,
                            url: url,
                            caption: caption
                        }
                    });
                    console.log(`Saved new screenshot ${filename} to database`);
                }
            } catch (dbError) {
                console.error(`Error saving/updating screenshot ${filename}:`, dbError);
            }
        }

    } catch (error) {
        console.error('Error capturing screenshots:', error);
        throw error;
    } finally {
        // Clean up: delete the temporary video file
        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
            console.log(`Deleted temporary video file: ${videoFilePath}`);
        }
    }
};

// const captureScreenshots = async (videoUrl: string, videoId: string): Promise<void> => {
//     try {
//         const job = await streampot
//             .input(videoUrl) // Use the S3 URL directly
//             .outputOptions('-frames:v 1') 
//             .output(`${videoId}.png`)
//             .runAndWait();

//         console.log(job.outputs[`-%03d.png`])

//         // Upload each screenshot to S3
//         const outputDir = path.join(__dirname, 'screenshots');
//         const files = fs.readdirSync(outputDir);
//         for (const file of files) {
//             const filePath = path.join(outputDir, file);
//             const s3Url = await uploadToS3(filePath, process.env.AWS_S3_BUCKET_NAME as string, `screenshots/${file}`);
//             console.log(`Uploaded ${file} to ${s3Url}`);
//         }
//     } catch (error) {
//         console.error('Error capturing screenshots:', error);
//         throw error;
//     }
// };


// const captureScreenshots = (videoFile: string, outputDir: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//     ffmpeg(videoFile)
//     .on('end', () => {
//     console.log('Screenshots captured');
//     resolve(); // Resolve the promise with void
//     })
//     .on('error', reject)
//     .screenshots({
//     count: 50,
//     folder: outputDir,
//     size: '1920x1080',
//     filename: 'screenshot-%i.png'
//     });
//     });
//     }

const generateCaptionForScreenshot = async (screenshotUrl: string): Promise<string> => {
    const gpt = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
    });

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are a highly skilled AI trained in image captioning. Please provide a descriptive caption for the following image. Ensure the caption is relevant to the content of the image."
        ],
        ["human", `Here is the image URL: ${screenshotUrl}`]
    ]);

    const chain = prompt.pipe(gpt);
    const res = await chain.invoke({});
    
    // Log the response for debugging
    console.log("Model response:", res);

    if (!res || typeof res.content !== 'string') {
        throw new Error("An error occurred while generating the caption for the screenshot");
    }

    return res.content;
};

// const formatSummary = (summary: string) => {
//     return {
//         time: Date.now(),
//         blocks: [
//             {
//                 id: "xdC8tm5t_5",
//                 data: { text: summary },
//                 type: "paragraph"
//             }
//         ],
//         version: "2.29.0-rc.1"
//     };
// };

// export const handleInitialFormSubmit = async (
//     formData: z.infer<typeof formSchema>
// ) => {
//     const start = Date.now();
//     const outputDir = path.join(__dirname, 'screenshots');
//     const videoFile = path.join(__dirname, 'video.mp4');
//     const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

//     try {
//         console.log('Creating screenshots directory if it does not exist');
//         if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir);
//         }

//         console.log('Fetching video info');
//         const videoInfo = await ytdl.getInfo(formData.link);
//         const videoId = videoInfo.videoDetails.videoId;
//         const videoTitle = videoInfo.videoDetails.title;
//         const videoDescription = videoInfo.videoDetails.description || "No description available";

//         console.log('Transcribing video');
//         const transcript = await transcribeVideo(formData.link);
//         const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

//         if (!transcript) {
//             throw new Error("Couldn't transcribe the Audio.");
//         }

//         console.log('Downloading video');
//         await downloadVideo(formData.link, bucketName, `videos/${videoId}.mp4`); // Provide the key argument

//         console.log('Checking if video file exists');
//         if (!fs.existsSync(videoFile)) {
//             throw new Error(`Video file does not exist after download: ${videoFile}`);
//         }

//         console.log('Capturing screenshots');
//         await captureScreenshots(videoFile, outputDir);

//         console.log('Uploading screenshots to S3 and saving to database');
//         const screenshotFiles = fs.readdirSync(outputDir);
//         for (const file of screenshotFiles) {
//             const filePath = path.join(outputDir, file);
//             const s3Url = await uploadToS3(filePath, bucketName, `screenshots/${videoTitle}-${file}`);
//             const filename = `screenshots/${file}`;

//             const existingScreenshot = await db.screenshot.findUnique({
//                 where: { url: s3Url }
//             });

//             if (!existingScreenshot) {
//                 console.log(`Saving screenshot ${filename} to database`);
//                 await db.screenshot.create({
//                     data: {
//                         videoId: videoId,
//                         filename,
//                         url: s3Url
//                     }
//                 });
//                 console.log(`Saved screenshot ${filename} to database`);
//             }
//         }

//         console.log('Checking if video already exists in database');
//         const existingVideo = await db.video.findUnique({
//             where: {
//                 videoid: videoId
//             }
//         });

//         if (existingVideo) {
//             console.log('Video exists, checking for existing summary');
//             const existingSummary = await db.summary.findFirst({
//                 where: {
//                     videoid: existingVideo.videoid
//                 }
//             });

//             if (existingSummary) {
//                 console.log('Summary exists, returning video ID');
//                 return existingSummary.videoid;
//             }

//             console.log('Generating summary');
//             let summary = null;
//             if (formData.model == "gpt-4o") {
//                 summary = await summarizeTranscriptWithGpt(
//                     enhancedTranscription,
//                     formData.model,
//                     videoTitle,
//                     videoDescription
//                 );
//             } else {
//                 summary = await summarizeTranscriptWithGroq(
//                     enhancedTranscription,
//                     formData.model
//                 );
//             }

//             if (!summary) {
//                 throw new Error("Couldn't summarize the Transcript.");
//             }

//             console.log('Saving summary to database');
//             await db.summary.create({
//                 data: {
//                     videoid: videoId,
//                     summary: summary as string,
//                 }
//             });

//             return videoId;
//         }

//         console.log('Creating new video entry in database');
//         await db.video.create({
//             data: {
//                 videoid: videoId,
//                 videotitle: videoInfo.videoDetails.title,
//                 transcript: transcript,
//             }
//         });

//         console.log('Generating summary');
//         let summary = null;
//         if (formData.model == "gpt-4o") {
//             summary = await summarizeTranscriptWithGpt(
//                 enhancedTranscription,
//                 formData.model,
//                 videoTitle,
//                 videoDescription
//             );
//         } else {
//             summary = await summarizeTranscriptWithGroq(
//                 enhancedTranscription,
//                 formData.model
//             );
//         }

//         if (!summary) {
//             throw new Error("Couldn't summarize the Transcript.");
//         }

//         console.log('Saving summary to database');
//         await db.summary.create({
//             data: {
//                 videoid: videoId,
//                 summary: summary as string,
//             }
//         });

//         return videoId;
//     } catch (e: any) {
//         console.error(e);
//         return null;
//     } finally {
//         console.log('Cleaning up: Deleting video and screenshots');
//         try {
//             if (fs.existsSync(videoFile)) {
//                 fs.unlinkSync(videoFile);
//                 console.log(`Deleted video file: ${videoFile}`);
//             }

//             if (fs.existsSync(outputDir)) {
//                 const screenshotFiles = fs.readdirSync(outputDir);
//                 for (const file of screenshotFiles) {
//                     const filePath = path.join(outputDir, file);
//                     fs.unlinkSync(filePath);
//                     console.log(`Deleted screenshot file: ${filePath}`);
//                 }
//                 fs.rmdirSync(outputDir);
//                 console.log(`Deleted screenshots directory: ${outputDir}`);
//             }
//         } catch (cleanupError) {
//             console.error("Error during cleanup:", cleanupError);
//         }

//         console.log(
//             `Generated ${formData.link} in ${(Date.now() - start) / 1000} seconds.`
//         );
//         revalidatePath("/");
//         revalidatePath("/summaries");
//     }
// }

// handleInitialFormSubmit.maxDuration = 300;


// export const checkFacts = async (
//     formData: z.infer<typeof VerifyFactsFormSchema>
// ) => {
//     try {
//         console.log('Checking facts');
//         const res = await searchUsingTavilly(formData.summary);
//         const parsedResult = JSON.parse(res);

//         const additionalContext = parsedResult.someRelevantField;

//         return {
//             input: formData.summary,
//             isAccurate: parsedResult.isAccurate,
//             source: parsedResult.source,
//             text: parsedResult.text,
//             additionalContext: additionalContext
//         } as FactCheckerResponse;
//     } catch (e) {
//         console.error(e);
//         return null;
//     }
// }

// export const handleInitialFormSubmit = async (
//     formData: z.infer<typeof formSchema>
// ) => {
//     const start = Date.now();
//     const outputDir = path.join(__dirname, 'screenshots');
//     const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

//     try {
//         console.log('Creating screenshots directory if it does not exist');
//         if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir);
//         }

//         console.log('Fetching video info');
//         const videoInfo = await ytdl.getInfo(formData.link);
//         const videoId = videoInfo.videoDetails.videoId;
//         const videoTitle = videoInfo.videoDetails.title;
//         const videoDescription = videoInfo.videoDetails.description || "No description available";

//         console.log('Transcribing video');
//         const transcript = await transcribeVideo(formData.link);
//         const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcript}`;

//         if (!transcript) {
//             throw new Error("Couldn't transcribe the Audio.");
//         }

//         console.log('Downloading video');
//         // const s3Url = await downloadVideo(formData.link, bucketName, `videos/${videoId}.mp4`);
//         const videoFilePath = await downloadVideo(formData.link, bucketName, `videos/${videoId}.mp4`);

//         console.log('Capturing screenshots');
//         // await captureScreenshots(s3Url, videoId);
//         // await captureScreenshots(formData.link, videoId);

//         // await captureScreenshots(videoFilePath, videoId);

//         // console.log('Uploading screenshots to S3 and saving to database');
//         // const screenshotFiles = fs.readdirSync(outputDir);
//         // for (const file of screenshotFiles) {
//         //     const filePath = path.join(outputDir, file);
//         //     const s3Url = await uploadToS3(filePath, bucketName, `screenshots/${videoTitle}-${file}`);
//         //     const filename = `screenshots/${file}`;

//         //     const existingScreenshot = await db.screenshot.findUnique({
//         //         where: { url: s3Url }
//         //     });

//         //     if (!existingScreenshot) {
//         //         console.log(`Saving screenshot ${filename} to database`);
//         //         await db.screenshot.create({
//         //             data: {
//         //                 videoId: videoId,
//         //                 filename,
//         //                 url: s3Url
//         //             }
//         //         });
//         //         console.log(`Saved screenshot ${filename} to database`);
//         //     }
//         // }

//         console.log('Checking if video already exists in database');
//         const existingVideo = await db.video.findUnique({
//             where: {
//                 videoid: videoId
//             }
//         });

//         if (existingVideo) {
//             console.log('Video exists, checking for existing summary');
//             const existingSummary = await db.summary.findFirst({
//                 where: {
//                     videoid: existingVideo.videoid
//                 }
//             });

//             if (existingSummary) {
//                 console.log('Summary exists, returning video ID');
//                 return existingSummary.videoid;
//             }

//             console.log('Generating summary');
//             let summary = null;
//             if (formData.model == "gpt-4o") {
//                 summary = await summarizeTranscriptWithGpt(
//                     enhancedTranscription,
//                     formData.model,
//                     videoTitle,
//                     videoDescription
//                 );
//             } else {
//                 summary = await summarizeTranscriptWithGroq(
//                     enhancedTranscription,
//                     formData.model
//                 );
//             }

//             if (!summary) {
//                 throw new Error("Couldn't summarize the Transcript.");
//             }

//             console.log('Saving summary to database');
//             await db.summary.create({
//                 data: {
//                     videoid: videoId,
//                     summary: summary as string,
//                 }
//             });

//             return videoId;
//         }

//         console.log('Creating new video entry in database');
//         await db.video.create({
//             data: {
//                 videoid: videoId,
//                 videotitle: videoInfo.videoDetails.title,
//                 transcript: transcript,
//             }
//         });

//         console.log('Generating summary');
//         let summary = null;
//         if (formData.model == "gpt-4o") {
//             summary = await summarizeTranscriptWithGpt(
//                 enhancedTranscription,
//                 formData.model,
//                 videoTitle,
//                 videoDescription
//             );
//         } else {
//             summary = await summarizeTranscriptWithGroq(
//                 enhancedTranscription,
//                 formData.model
//             );
//         }

//         if (!summary) {
//             throw new Error("Couldn't summarize the Transcript.");
//         }

//         console.log('Saving summary to database');
//         await db.summary.create({
//             data: {
//                 videoid: videoId,
//                 summary: summary as string,
//             }
//         });

//         return videoId;
//     } catch (e: any) {
//         console.error(e);
//         return null;
//     } finally {
//         console.log('Cleaning up: Deleting video and screenshots');
//         try {
//             if (fs.existsSync(outputDir)) {
//                 const screenshotFiles = fs.readdirSync(outputDir);
//                 for (const file of screenshotFiles) {
//                     const filePath = path.join(outputDir, file);
//                     fs.unlinkSync(filePath);
//                     console.log(`Deleted screenshot file: ${filePath}`);
//                 }
//                 fs.rmdirSync(outputDir);
//                 console.log(`Deleted screenshots directory: ${outputDir}`);
//             }
//         } catch (cleanupError) {
//             console.error("Error during cleanup:", cleanupError);
//         }

//         console.log(
//             `Generated ${formData.link} in ${(Date.now() - start) / 1000} seconds.`
//         );
//         revalidatePath("/");
//         revalidatePath("/summaries");
//     }
// }

// handleInitialFormSubmit.maxDuration = 300;

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
      