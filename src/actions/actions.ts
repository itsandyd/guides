import { maxDuration } from './../app/admin/create/page';
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

export type FactCheckerResponse = {
    input: "string"
    isAccurate: "true" | "false"
    source: string
    text: string
}

export const handleInitialFormSubmit = async (
    formData: z.infer<typeof formSchema>
) => {
    const start = Date.now()

    try {
        const videoInfo = await ytdl.getInfo(formData.link)
        const videoId = videoInfo.videoDetails.videoId
        const videoTitle = videoInfo.videoDetails.title;
        const videoDescription = videoInfo.videoDetails.description || "No description available"; 

// Include title and description in the transcription
const transcription = await transcribeVideo(formData.link);
const enhancedTranscription = `${videoTitle}. ${videoDescription}. ${transcription}`;

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
            if (
                formData.model == "gpt-3.5-turbo" ||
                formData.model == "gpt-4o"
            ) {
                summary = await summarizeTranscriptWithGpt(
                    enhancedTranscription,
                    formData.model,
                    videoTitle, // Pass this argument
                    videoDescription // Pass this argument
                );
            } else {
                summary = await summarizeTranscriptWithGroq(
                    existingVideo.transcript!,
                    formData.model
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

        const transcript = await transcribeVideo(formData.link)
        if (!transcript) {
            throw new Error("Couldn't transcribe the Audio.")
        }

        await db.video.create({
            data: {
                videoid: videoId,
                videotitle: videoInfo.videoDetails.title,
                transcript: transcript,
            }
        });

        let summary: MessageContent | null = null
        if (formData.model == "gpt-3.5-turbo" || formData.model == "gpt-4o") {
            summary = await summarizeTranscriptWithGpt(
                enhancedTranscription,
                formData.model,
                videoTitle, // Pass this argument
                videoDescription // Pass this argument
            );
        } else {
            summary = await summarizeTranscriptWithGroq(
                transcript,
                formData.model
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
    } catch (e: any) {
        console.error(e)
        return null
    } finally {
        console.log(
            `Generated ${formData.link} in ${
                (Date.now() - start) / 1000
            } seconds.`
        )
        revalidatePath("/")
        revalidatePath("/summaries")
    }
}

handleInitialFormSubmit.maxDuration = 600;

// export const handleRegenerateSummary = async (
//     formData: z.infer<typeof RegenerateFormSchema>
// ) => {
//     const start = Date.now()

//     try {
//         const video = await db.video.findUnique({
//             where: { videoid: formData.videoid }
//         });

//         if (!video) {
//             throw new Error("Couldn't find the transcription of this video.");
//         }

//         let summary: MessageContent | null = null;
//         if (formData.model == "gpt-3.5-turbo" || formData.model == "gpt-4o") {
//             summary = await summarizeTranscriptWithGpt(
//                 video.transcript!,
//                 formData.model
//             );
//         } else {
//             summary = await summarizeTranscriptWithGroq(
//                 video.transcript!,
//                 formData.model
//             );
//         }

//         if (!summary) {
//             throw new Error("Couldn't summarize the Transcript.");
//         }

//         // First, find the summary ID using the videoid
//         const existingSummary = await db.summary.findFirst({
//             where: { videoid: formData.videoid }
//         });

//         if (!existingSummary) {
//             throw new Error("Summary not found.");
//         }

//         // Then, use the retrieved ID to update the summary
//         await db.summary.update({
//             where: { id: existingSummary.id },
//             data: { summary: summary as string }
//         });

//         return true;
//     } catch (e: any) {
//         console.error(e);
//         return false;
//     } finally {
//         console.log(
//             `Re-Generated ${formData.videoid} in ${
//                 (Date.now() - start) / 1000
//             } seconds.`
//         );
//         revalidatePath(`/${formData.videoid}`);
//     }
// };

export const checkFacts = async (
    formData: z.infer<typeof VerifyFactsFormSchema>
) => {
    try {
        const res = await searchUsingTavilly(formData.summary)
        return await JSON.parse(res)
    } catch (e) {
        console.error(e)
        return null
    }
}