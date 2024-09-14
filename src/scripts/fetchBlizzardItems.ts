import { getBlizzardClient } from '@/lib/blizzardClient';
import 'dotenv/config';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BlizzardItem {
  data: {
    id: number;
    name: {
      en_GB?: string;
      en_US?: string;
      [key: string]: string | undefined;
    };
    description: string;
    item_class?: {
      id: number;
      name: {
        en_GB?: string;
        en_US?: string;
        [key: string]: string | undefined;
      };
    };
  };
}

export interface PrismaItemCreateManyInput {
  id: number;
  name: string;
  description: string;
  itemClassId: number;
}

async function fetchAllItems(): Promise<BlizzardItem[]> {
  const blizzardClient = await getBlizzardClient();
  
  let allItems: BlizzardItem[] = [];
  let pageNumber = 1;
  const totalItemsNeeded = 500000;

  while (allItems.length < totalItemsNeeded) {
    try {
      const response = await blizzardClient.itemSearch({
        name: '',
        orderby: 'id',
        page: pageNumber,
        locale: 'en_GB'
      });

      if (!response.data || !response.data.results) {
        throw new Error(`No data returned from Blizzard API for page ${pageNumber}`);
      }

      console.log(`Total items returned by API on page ${pageNumber}: ${response.data.results.length}`);

      allItems = allItems.concat(response.data.results);
      pageNumber++;

      if (response.data.pageCount <= pageNumber) {
        break; // No more pages available
      }

      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between requests
    } catch (error) {
      console.error(`Failed to fetch items on page ${pageNumber}:`, error);
      break;
    }
  }

  // Trim excess items if we fetched more than needed
  return allItems.slice(0, totalItemsNeeded);
}

async function populateDatabase(items: BlizzardItem[]) {
  console.log(`Attempting to populate database with ${items.length} items`);
  
  // Prepare item classes data
  const itemClassesData = items.map((item) => ({
    id: item.data.item_class?.id || 0,
    name: item.data.item_class?.name?.en_GB || item.data.item_class?.name?.en_US || 'Name not available',
  }));

  // Insert item classes into the database
  await db.itemClass.createMany({
    data: itemClassesData,
    skipDuplicates: true,
  });

  // Now prepare and insert items
  const itemsData = items.map((item: any) => ({
    id: item.data.id || 0,
    name: item.data.name?.en_GB || item.data.name?.en_US || 'Name not available',
    description: item.data.description || 'No description available',
    itemClassId: item.data.item_class?.id || 0,
    quality: item.data.quality?.type || null,
    level: item.data.level || null,
    requiredLevel: item.data.required_level || null,
    itemSubClassId: item.data.item_subclass?.id || null,
    inventoryType: item.data.inventory_type?.type || null,
  }));

  const result = await db.item.createMany({
    data: itemsData,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} items into the database.`);
}

async function main() {
  try {
    console.log('Fetching items');
    const items = await fetchAllItems();
    await populateDatabase(items);
    console.log(`Data populated successfully. Fetched ${items.length} items.`);
  } catch (error) {
    console.error('Error fetching Blizzard data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  prisma.$disconnect();
});