import Link from 'next/link'

import { Suspense } from 'react'
import { db } from '../../lib/db'
import { Card, CardContent } from '../ui/Card'

async function getFeaturedPosts() {
  try {
    return await db.post.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subreddit: true
      }
    })
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

async function FeaturedContentInner() {
  const featuredPosts = await getFeaturedPosts()

  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Featured Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPosts.map((post: any) => (
          <Link href={`/guides/${post.subreddit.name}/post/${post.id}`} key={post.id}>
            <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-card-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {post.description ? post.description.slice(0, 100) + '...' : 'No description available'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function FeaturedContent() {
  return (
    <Suspense fallback={<div>Loading featured content...</div>}>
      {/* @ts-expect-error Server Component */}
      <FeaturedContentInner />
    </Suspense>
  )
}