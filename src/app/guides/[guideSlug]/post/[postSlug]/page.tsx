import '@/styles/editor.css'
import { ArrowBigDown, ArrowBigUp, Loader2, Edit, Clock, User } from 'lucide-react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { getAuthSession } from '@/lib/auth'
import { formatTimeToNow } from '@/lib/utils'
import EditorOutput from '@/components/EditorOutput'
import DeletePostButton from '@/components/DeletePostButton'
import { buttonVariants } from '@/components/ui/Button'
import { CachedPost } from '@/types/redis'
import { Post, User as PrismaUser, Vote } from '@prisma/client'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import CommentsSection from '@/components/CommentsSection'
import Link from 'next/link'

interface SubRedditPostPageProps {
    params: {
      guideSlug: string
      postSlug: string
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
    const post = await db.post.findUnique({
        where: {
          slug: params.postSlug,
        },
        include: {
          votes: true,
          author: true,
          postTags: {
            include: {
              tag: true
            }
          },
          subreddit: {
            select: {
              name: true
            }
          },
        },
      })

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

  const tagNames = post.postTags.map(postTag => postTag.tag.name).join(', '); // Change this line

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
        `post:${params.postSlug}`
      )) as CachedPost

  let post: (Post & { votes: Vote[]; author: PrismaUser; subreddit: { name: string } }) | null = null

  if (!cachedPost) {
    post = await db.post.findUnique({
      where: {
        slug: params.postSlug,
      },
      include: {
        votes: true,
        author: true,
        subreddit: {
          select: {
            name: true
          }
        },
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  const authSession = await getAuthSession()
  const isAuthor = post?.author.id === authSession?.user?.id || cachedPost?.authorUsername === authSession?.user?.name

  return (
    <div className="container mx-auto py-10">
      <div className='max-w-4xl mx-auto bg-background text-foreground rounded-lg shadow-lg overflow-hidden'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
              <User className='h-4 w-4' />
              <span>{post?.author.username ?? cachedPost.authorUsername}</span>
              <span>•</span>
              <Clock className='h-4 w-4' />
              <span>{formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}</span>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
            <Link
            href={`/guides/${post?.subreddit.name ?? cachedPost.subredditName}/edit/${post?.id ?? cachedPost.id}`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
            <Edit className="h-4 w-4 mr-2" />
            Edit
            </Link>
                <DeletePostButton postId={post?.id ?? cachedPost.id} />
              </div>
            )}
          </div>
          
          <h1 className='text-3xl font-bold mb-6 text-foreground'>
            {post?.title ?? cachedPost.title}
          </h1>

          <div className='prose prose-stone dark:prose-invert max-w-none'>
            <EditorOutput content={post?.content ?? cachedPost.content} />
          </div>
        </div>

        <div className='bg-muted p-6 mt-6'>
          <h2 className='text-xl font-semibold mb-4'>Comments</h2>
          <Suspense
            fallback={
              <div className='flex justify-center'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            }>
            {/* @ts-expect-error Server Component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default SubRedditPostPage
