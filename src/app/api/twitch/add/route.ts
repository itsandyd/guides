import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }
  // Parse the request body
  const body = await req.json();

  // Extract the channel name from the parsed body
  const { channelName } = body;

  // Check if channel name is taken
  const channel = await db.twitchChannel.findFirst({
    where: {
      channelName: channelName,
    },
  });

  if (channel) {
    return new Response('Channel name is taken', { status: 409 })
  }

  // Use Prisma to add a streamer to the database
  try {
    const streamer = await db.twitchChannel.create({
      data: { 
        channelName,
        userId: session.user.id
      },
    });
  
    // Send a response back to the client
    return NextResponse.json({ message: 'Streamer added successfully', streamer });
  } catch (error) {
    console.error('Error updating user in database:', error);
    return NextResponse.json({ message: 'Error updating user in database' });
  }
}