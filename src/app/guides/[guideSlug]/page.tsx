import { notFound } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import PostFeed from '@/components/PostFeed'

interface PageProps {
  params: {
    guideSlug: string
  }
}

const GuidePage = async ({ params }: PageProps) => {
  const { guideSlug } = params

  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: { name: guideSlug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  })

  if (!subreddit) return notFound()

  return (
    <div className='space-y-6'>
      <h1 className='font-bold text-3xl md:text-4xl'>
        {subreddit.name}
      </h1>
      <PostFeed initialPosts={subreddit.posts} subredditName={guideSlug} />
    </div>
  )
}

export default GuidePage
