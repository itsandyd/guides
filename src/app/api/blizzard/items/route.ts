import { NextResponse } from 'next/server';
import { getBlizzardClient } from '@/lib/blizzardClient';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const blizzardClient = await getBlizzardClient();
    
    const response = await blizzardClient.itemSearch({
      name: '',
      orderby: 'id',
      page: 1,
      locale: 'en_GB'
    });

    if (!response.data || !response.data.results) {
      throw new Error('No data returned from Blizzard API');
    }

    const items = response.data.results;

    // Prepare item classes data
    const itemClassesData = items.map((item: any) => ({
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
      id: item.data.id,
      name: item.data.name.en_GB || item.data.name.en_US || 'Name not available',
      description: item.data.description || 'No description available',
      itemClassId: item.data.item_class?.id || 0,
      quality: item.data.quality?.type || null,
      level: item.data.level || null,
      requiredLevel: item.data.required_level || null,
      itemSubClassId: item.data.item_subclass?.id || null,
      inventoryType: item.data.inventory_type?.type || null,
    }));

    await db.item.createMany({
      data: itemsData,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Data populated successfully', itemCount: items.length });
  } catch (error) {
    console.error('Error fetching Blizzard data:', error);
    return NextResponse.json({ error: 'Failed to populate data' }, { status: 500 });
  }
}