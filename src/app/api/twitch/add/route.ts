import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Parse the request body
  const body = await req.json();

  // Extract the channel name and user ID from the parsed body
  const { channelName, userId } = body;

  // Use Prisma to add a streamer to the database
  const streamer = await db.user.update({
    where: { id: userId },
    data: { channelName },
  });

  // Send a response back to the client
  return NextResponse.json({ message: 'Streamer added successfully', streamer });
}