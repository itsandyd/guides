import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract the channel name from the request body
    const { channelName, userId } = req.body;

    // Use Prisma to add a streamer to the database
    const streamer = await db.user.update({
      where: { id: userId },
      data: { channelName },
    });

    // Send a response back to the client
    res.status(200).json({ message: 'Streamer added successfully', streamer });
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}