'use client'

// import { formatTimeToNow } from '@/lib/utils'
import type { Post as PostType, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: PostType & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subredditName: string
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className='rounded-md bg-card shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-muted-foreground'>
            {subredditName ? (
              <>
                <a
                  className='underline text-foreground text-sm underline-offset-2'
                  href={`/guides/${subredditName}`}>
                  guides/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by {post.author.username}</span>{' '}
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          <a href={`/guides/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-foreground'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent'></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className='bg-accent z-20 text-sm px-4 py-4 sm:px-6'>
        <Link
          href={`/guides/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2 text-muted-foreground hover:text-foreground'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}

export default Post
