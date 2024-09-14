import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId: clerkUserId } = auth()
    const session = await getServerSession(authOptions)
    const nextAuthUserId = session?.user?.id
    const userId = clerkUserId || nextAuthUserId

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        tags: true,
      },
    })

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    return new Response(JSON.stringify(post), { status: 200 })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}