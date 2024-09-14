import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const prisma = new PrismaClient();

// Initialize the OpenAI model
const model = new ChatOpenAI({
  modelName: "gpt-4-0125-preview",
  temperature: 0,
});

// Initialize the search tool
const searchTool = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 3
});

if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in the environment variables");
}

// Create the agent with a custom prompt
async function createAgent() {
  const tools = [searchTool];

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are an AI assistant specializing in World of Warcraft item descriptions. " +
      "Your task is to generate brief, accurate descriptions for World of Warcraft items. " +
      "Include the item's purpose, any unique properties, and which type of characters typically use it. " +
      "Use the search tool if you need more information about the item."
    ),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  return createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });
}

async function enrichItemDescription(itemName: string): Promise<string> {
  const agent = await createAgent();
  const executor = new AgentExecutor({
    agent,
    tools: [searchTool],
  });

  try {
    console.log(`Searching for information about '${itemName}'...`);
    const searchResult = await searchTool.invoke(itemName);
    console.log('Tavily Search Result:', JSON.stringify(searchResult, null, 2));

    const result = await executor.invoke({
      input: `Generate a brief, accurate description for the World of Warcraft item '${itemName}'. Include its purpose, any unique properties, and which type of characters typically use it. Use the following search results if relevant: ${JSON.stringify(searchResult)}`,
    });

    console.log('Agent Response:', result.output);

    return result.output.trim() || "No description available";
  } catch (error) {
    console.error(`Error generating description for ${itemName}:`, error);
    return "No description available";
  }
}

async function enrichItems() {
  const items = await prisma.item.findMany({
    where: {
      description: "No description available",
    },
    take: 100,
  });

  console.log(`Found ${items.length} items to enrich.`);

  for (const item of items) {
    console.log(`\nProcessing item ${item.id}: ${item.name}`);
    const enrichedDescription = await enrichItemDescription(item.name);

    await prisma.item.update({
      where: { id: item.id },
      data: { description: enrichedDescription },
    });

    console.log(`Updated description for item ${item.id}: ${item.name}`);
    console.log('New description:', enrichedDescription);

    // Respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function main() {
  try {
    console.log("Starting item enrichment process");
    await enrichItems();
    console.log("Item enrichment process completed");
  } catch (error) {
    console.error("Error during item enrichment:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  prisma.$disconnect();
});
