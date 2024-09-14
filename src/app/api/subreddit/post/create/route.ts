import { auth } from '@clerk/nextjs/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    // Try to get user from Clerk
    const { userId: clerkUserId } = auth()
    
    // Try to get user from NextAuth
    const session = await getServerSession(authOptions)
    const nextAuthUserId = session?.user?.id

    // Use Clerk userId if available, otherwise use NextAuth userId
    const userId = clerkUserId || nextAuthUserId

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, content, subredditId, selectedTags } = PostValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId,
      },
    })

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 403 })
    }

    // Generate a base slug
    let slug = generateSlug(title)
    let slugExists = true
    let slugCounter = 1

    // Keep checking and modifying the slug until we find a unique one
    while (slugExists) {
      const existingPost = await db.post.findUnique({
        where: { slug },
      })

      if (!existingPost) {
        slugExists = false
      } else {
        slug = `${generateSlug(title)}-${slugCounter}`
        slugCounter++
      }
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: userId,
        subredditId,
        slug,
      },
    })

    // Handle tags
    if (selectedTags && selectedTags.length > 0) {
      await db.postTag.createMany({
        data: selectedTags.map((tagId) => ({
          postId: post.id,
          tagId,
        })),
      })
    }

    return new Response(JSON.stringify({ postId: post.id, slug: post.slug }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try again later',
      { status: 500 }
    )
  }
}