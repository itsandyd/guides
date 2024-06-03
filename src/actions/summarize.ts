// import { env } from "@/env.mjs"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatGroq } from "@langchain/groq"
import { ChatOpenAI } from "@langchain/openai"
import { TokenTextSplitter } from "langchain/text_splitter"

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export const summarizeTranscriptWithGroq = async (
    transcript: string,
    model: "llama3-70b-8192" | "mixtral-8x7b-32768" | "gemma-7b-it"
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
        const outputs = await splitter.createDocuments([transcript])

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
    transcript: string,
    model: "gpt-3.5-turbo" | "gpt-4o"
) => {
    const splitter = new TokenTextSplitter({
        encodingName: "gpt2",
        chunkSize: model == "gpt-4o" ? 128000 : 16000,
        chunkOverlap: 0,
    })

    const gpt = new ChatOpenAI({
        model,
        temperature: 0,
    })

    try {
        const outputs = await splitter.createDocuments([transcript])

        const summaryPromises = outputs.map(
            async (output: { pageContent: string }) => {
                const prompt = ChatPromptTemplate.fromMessages([
                    [
                        "system",
                        // "You are a highly skilled AI trained in language comprehension. I would like you to read the following sub-section of a transcript from a youtube video retain the most important points, providing a coherent and readable paragraph that could help a person understand the main points of the video without needing to read the entire text or watch the video. Please avoid unnecessary details or tangential points. The output should only be in English language.",
                        "You are a highly skilled AI trained in SEO blog writing. Your task is to write an in-depth, 2,000 word SEO-optimized blog post based on the search results provided, following these steps: Carefully review the search results to identify the main topic and key points to cover in the blog post. Look for common themes, important facts and statistics, and authoritative sources to cite. Conduct keyword research using tools like Semrush or Ahrefs to identify the primary keyword to target and any secondary related keywords. Aim for keywords with decent search volume and moderate competition. Create an outline for a comprehensive blog post on the topic, organizing it into logical sections with descriptive headings that incorporate the primary and related keywords. Aim for a clear introduction, detailed body paragraphs covering each key point, and a conclusion summarizing the main takeaways. Write the blog post section by section, naturally incorporating the primary keyword and related keywords throughout the headers, meta description, and body content. Provide unique insights and aim for at least 1500 words of high-quality, reader-friendly content that matches search intent. Optimize the post for featured snippets by including definitions, bullet point lists, and how-to steps where relevant. Use short paragraphs, images with descriptive alt text, and both internal and external links to authoritative sources. Cite sources using brackets, e.g., [1]. Ensure the writing style is engaging, conversational, and easy to understand while still demonstrating expertise on the topic. Break up text with subheadings, bullet points, and images. Provide actionable advice and original insights that go beyond just summarizing the search results. Conclude with a strong call-to-action or final takeaway that provides value to the reader and encourages them to read more. Avoid fluff or repetition. Proofread and edit the final post for clarity, flow, grammar, and readability before publishing. Aim for a Flesch reading ease score of 60+. The blog post should be the best resource available on the topic, demonstrating subject matter expertise while still being accessible and interesting to the target audience. The post should be fully optimized to rank on the first page for the primary keyword."
                        // "Identify and summarize the key moments from the following transcript segment. Focus on capturing the most impactful and relevant points that provide a clear overview of the content's main themes and highlights.",
                    ],
                    ["human", output.pageContent],
                ])

                const chain = prompt.pipe(gpt)
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
                // "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following array of concise description generated from sub-sections of a transcript from a youtube video; summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the video without needing to read the entire text. Please avoid unnecessary details or tangential points. The output should only be in English language.",
                "You are a highly skilled AI trained in SEO blog writing. Your task is to write an in-depth, SEO-optimized blog post based on the search results provided, following these steps: Carefully review the search results to identify the main topic and key points to cover in the blog post. Look for common themes, important facts and statistics, and authoritative sources to cite. Create an outline for a comprehensive blog post on the topic, organizing it into logical sections with descriptive headings. Aim for a clear introduction, detailed body paragraphs covering each key point, and a conclusion that summarizes the main takeaways. Write the blog post section by section, incorporating relevant information from the search results. Put key facts in context and provide in-depth explanations where needed. Aim for at least 1500 words of unique, valuable content. Organically integrate primary and related keywords from your research throughout the post to optimize for search engines. Include the main keyword in the title, headings, introduction, and conclusion. Follow SEO best practices like using short paragraphs, bulleted lists, images with descriptive alt text, and internal and external links to authoritative sources. Cite sources using brackets, e.g., [1]. Ensure the writing style is engaging, easy to understand, and matches the search intent. Use transition words for coherence. Provide actionable advice, opinions, or analysis that offers unique value beyond the search results. Conclude with a strong call-to-action or final thought that satisfies the reader. Avoid fluff or repetition. Proofread and edit the final draft for clarity, accuracy, grammar, and readability before publishing. The blog post should demonstrate expertise on the topic and be the best resource available to a reader searching for information about this subject."
            ],
            ["human", summaries.join()],
        ])

        const chain = prompt.pipe(gpt)
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
