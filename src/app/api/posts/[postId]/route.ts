import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // Try to get user from Clerk
    const { userId: clerkUserId } = auth()
    
    // Try to get user from NextAuth
    const session = await getServerSession(authOptions)
    const nextAuthUserId = session?.user?.id

    // Use Clerk userId if available, otherwise use NextAuth userId
    const userId = clerkUserId || nextAuthUserId

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const post = await db.post.findUnique({
      where: { id: params.postId },
      select: { authorId: true },
    })

    if (!post) {
      return new NextResponse('Post not found', { status: 404 })
    }

    if (post.authorId !== userId) {
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