import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    })

    if (!post) {
      return new NextResponse('Post not found', { status: 404 })
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await db.post.delete({
      where: { id: params.postId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}