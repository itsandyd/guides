'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Link from 'next/link'
import Image from 'next/image'

type Post = {
  id: string
  title: string
  description: string
  thumbnail: string | null
  author: { name: string }
  subreddit: { name: string }
}

export default function FeaturedContent() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchFeaturedPosts() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/featured-posts', {
          signal: abortController.signal
        })
        if (!response.ok) {
          throw new Error('Failed to fetch featured posts')
        }
        const posts = await response.json()
        setFeaturedPosts(posts)
        setError(null)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedPosts()

    return () => {
      abortController.abort()
    }
  }, [])

  if (isLoading) {
    return <div>Loading featured posts...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Guides</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPosts.map((post) => (
          <Link key={post.id} href={`/r/${post.subreddit.name}/post/${post.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                {post.thumbnail && (
                  <Image 
                    src={post.thumbnail} 
                    alt={post.title} 
                    width={300} 
                    height={200} 
                    className="rounded-t-lg"
                  />
                )}
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.description}</p>
                {/* <p className="text-xs mt-2">By {post.} in r/{post.subreddit.name}</p> */}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}