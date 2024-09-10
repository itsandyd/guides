import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET() {
  try {
    const subreddits = await db.subreddit.findMany({
      take: 4,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        game: {
          select: {
            name: true
          }
        }
      }
    })
    return NextResponse.json(subreddits)
  } catch (error) {
    console.error('Error fetching popular subreddits:', error)
    return NextResponse.json({ error: 'Failed to fetch subreddits' }, { status: 500 })
  }
}