import CommentsSection from '@/components/CommentsSection'
import EditorOutput from '@/components/EditorOutput'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, Prisma, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface SubRedditPostPageProps {
  params: {
    postId: string
  }
}

interface Block {
  id: string;
  type: string;
  data: {
    text?: string;
    items?: string[];
    level?: number;
  };
}

interface PostContent {
  time: number;
  blocks: Block[];
  version: string;
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function generateMetadata(
  { params }: SubRedditPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      votes: true,
      author: true,
      tags: { // Correctly include tags through the PostTag relation
        include: {
          tag: true
        }
      }
    },
  });

  if (!post) {
    return {
      title: "Post not found",
      description: "No content available",
      keywords: ["Subreddit", "Post", "NotFound"],
      openGraph: {
        images: [],
      },
    };
  }

  const tagNames = post.tags.map(postTag => postTag.tag.name).join(', ');

  return {
    title: post.title.length > 60 ? `${post.title.slice(0, 60)}...` : post.title,
    description: post.description || 'Guides for Gamers is your ultimate resource for video game guides, walkthroughs, tips and tricks. Find detailed step-by-step guides for the latest PC, console and mobile games. Our expert gaming guides help you master gameplay, find all collectibles, earn achievements and get the most out of your gaming experience. Game smarter with Guides for Gamers.',
    keywords: tagNames,
    openGraph: {
      images: [/* Array of images if available */],
    },
  };
}


const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>

        <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
          <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
            Posted by {post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
            }>
            {/* @ts-expect-error Server Component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}

export default SubRedditPostPage
