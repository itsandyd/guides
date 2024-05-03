'use server'

import { db } from '@/lib/db'

export default async function getLatestPosts() {
  const subreddits = await db.subreddit.findMany({
    include: {
      posts: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  return subreddits.map(subreddit => ({
    subredditName: subreddit.name,
    latestPosts: subreddit.posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      subredditId: post.subredditId,
      tagId: post.tagId,
    })),
  }));
}