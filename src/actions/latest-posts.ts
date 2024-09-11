'use server'

import { db } from '@/lib/db'

export default async function getLatestPosts() {
  const subreddits = await db.subreddit.findMany({
    include: {
      posts: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          PostTag: {
            include: {
              tag: true
            }
          }
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
      tags: post.PostTag.map(postTag => ({
        id: postTag.tag.id,
        name: postTag.tag.name
      }))
    })),
  }));
}