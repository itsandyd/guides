import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, description, thumbnail, subredditId, tags } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // check if user is subscribed to the subreddit
    let subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    // if not subscribed, create a subscription
    if (!subscription) {
      subscription = await db.subscription.create({
        data: {
          subredditId,
          userId: session.user.id,
        },
      })
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        description,
        thumbnail,
        authorId: session.user.id,
        subredditId,
        tags: {
          connect: tags.map((tagId: string) => ({ id: tagId })),
        },
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}