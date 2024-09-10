import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET() {
  try {
    const featuredPosts = await db.post.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subreddit: true
      }
    })
    return NextResponse.json(featuredPosts)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return NextResponse.json({ error: 'Failed to fetch featured posts' }, { status: 500 })
  }
}