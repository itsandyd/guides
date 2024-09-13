import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, content, subredditId, selectedTags, slug } = PostValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 403 })
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
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