import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: {
        // You might want to add a 'featured' field to your Post model
        // featured: true,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subreddit: true,
        author: true,
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return NextResponse.json({ error: 'Failed to fetch featured posts' }, { status: 500 })
  }
}