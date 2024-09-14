import { auth } from '@clerk/nextjs/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)
  
  // Try to get user from Clerk
  const { userId: clerkUserId } = auth()
  
  // Try to get user from NextAuth
  const session = await getServerSession(authOptions)
  const nextAuthUserId = session?.user?.id

  // Use Clerk userId if available, otherwise use NextAuth userId
  const userId = clerkUserId || nextAuthUserId

  let followedCommunitiesIds: string[] = []

  if (userId) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: userId,
      },
      include: {
        subreddit: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (userId) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}
