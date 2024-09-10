"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../ui/Card'
import dynamic from 'next/dynamic'

const MotionWrapper = dynamic(() => import('../MotionWrapper'), { ssr: false })

function FeaturedContentInner({ featuredPosts }: { featuredPosts: any[] }) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Featured Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPosts.map((post: any, index: number) => (
          <MotionWrapper
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/guides/${post.subreddit.name}/post/${post.id}`}>
              <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-card-foreground">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {post.description ? post.description.slice(0, 100) + '...' : 'No description available'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </MotionWrapper>
        ))}
      </div>
    </MotionWrapper>
  )
}

export default function FeaturedContent() {
  const [featuredPosts, setFeaturedPosts] = useState([])

  useEffect(() => {
    async function fetchFeaturedPosts() {
      const response = await fetch('/api/featured-posts')
      const data = await response.json()
      setFeaturedPosts(data)
    }
    fetchFeaturedPosts()
  }, [])

  return <FeaturedContentInner featuredPosts={featuredPosts} />
}