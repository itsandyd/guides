// import { env } from "@/env.mjs"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatGroq } from "@langchain/groq"
import { ChatOpenAI } from "@langchain/openai"
import { TokenTextSplitter } from "langchain/text_splitter"

// export const maxDuration = 60; // This function can run for a maximum of 5 seconds
// export const dynamic = 'force-dynamic';

// const formatSummary = (summary: any) => {
//     return {
//         time: Date.now(),
//         blocks: [
//             {
//                 id: "summary_block",
//                 data: { text: summary },
//                 type: "paragraph"
//             }
//         ],
//         version: "2.29.0-rc.1"
//     };
// };

export const summarizeTranscriptWithGroq = async (
    enhancedTranscription: string,
    model: string,
    additionalContext?: string // New parameter
) => {
    const splitter = new TokenTextSplitter({
        encodingName: "gpt2",
        chunkSize:
            model == "llama3-70b-8192" || model == "gemma-7b-it" ? 8000 : 32000,
        chunkOverlap: 0,
    })

    const groq = new ChatGroq({
        model,
        temperature: 0,
        streaming: false,
        apiKey: process.env.GROQ_API_KEY,
    })

    try {
        const outputs = await splitter.createDocuments([enhancedTranscription])

        const summaryPromises = outputs.map(
            async (output: { pageContent: string }) => {
                const prompt = ChatPromptTemplate.fromMessages([
                    [
                        "system",
                        "You are a highly skilled AI trained in language comprehension. I would like you to read the following sub-section of a transcript from a youtube video retain the most important points, providing a coherent and readable paragraph that could help a person understand the main points of the video without needing to read the entire text or watch the video. Please avoid unnecessary details or tangential points. The output should only be in English language.",
                    ],
                    ["human", output.pageContent],
                ])

                const chain = prompt.pipe(groq)
                const res = await chain.invoke({})
                if (!res) {
                    throw new Error(
                        "An Error Occurred while Summarizing the Sub-section of the transcript"
                    )
                }

                return res.content as string
            }
        )

        const summaries = await Promise.all(summaryPromises)
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following array of concise description generated from sub-sections of a transcript from a youtube video; summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the video without needing to read the entire text. Please avoid unnecessary details or tangential points. The output should only be in English language.",
            ],
            ["human", summaries.join()],
        ])

        const chain = prompt.pipe(groq)
        const res = await chain.invoke({})

        if (!res) {
            throw new Error(
                "An Error Occurred while Summarizing the transcript."
            )
        }

        return res.content
    } catch (e) {
        console.error(e)
        return null
    }
}

export const summarizeTranscriptWithGpt = async (
    enhancedTranscription: string, 
    model: "gpt-3.5-turbo" | "gpt-4o",
    videoTitle: string,
    videoDescription: string,
    additionalContext?: string // New parameter
) => {
    const splitter = new TokenTextSplitter({
        encodingName: "gpt2",
        chunkSize: model === "gpt-4o" ? 128000 : 16000,
        chunkOverlap: 0,
    });

    const gpt = new ChatOpenAI({
        model,
        temperature: 0,
    });

    try {
        const outputs = await splitter.createDocuments([enhancedTranscription]);

        const summaryPromises = outputs.map(async (output) => {
            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    "You are a highly skilled AI trained in language comprehension. Please summarize the following transcript segment into a coherent and readable paragraph."
                ],
                ["human", output.pageContent]
            ]);

            const chain = prompt.pipe(gpt);
            const res = await chain.invoke({});
            if (!res) {
                throw new Error("An Error Occurred while Summarizing the Sub-section of the transcript");
            }

            return res.content;
        });

        const summaries = await Promise.all(summaryPromises);
        // const combinedSummaries = summaries.join();

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                // `You are a highly skilled AI trained in summarization. Based on the provided summaries, create a final abstract summary that covers the main points.`
                `You are a highly skilled AI trained in SEO blog writing. Based on the provided YouTube video titled "${videoTitle}" with the description "${videoDescription}", create an in-depth, SEO-optimized blog post.`
            ],
            ["human", summaries.join()],
        ]);

        const chain = prompt.pipe(gpt);
        const res = await chain.invoke({});

        if (!res) {
            throw new Error("An Error Occurred while Summarizing the transcript.");
        }

        return res.content
        // Format the summary before returning
        // return formatSummary(res.content);
    } catch (e) {
        console.error(e);
        return null;
    }
};