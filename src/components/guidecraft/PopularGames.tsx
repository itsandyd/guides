"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import dynamic from 'next/dynamic'

const MotionWrapper = dynamic(() => import('../MotionWrapper'), { ssr: false })

function SubredditList({ subreddits }: { subreddits: any[] }) {
  if (subreddits.length === 0) {
    return <div className="text-foreground">No popular subreddits found.</div>
  }

  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Popular Games</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subreddits.map((subreddit: any, index: number) => (
          <MotionWrapper
            key={subreddit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/guides/${subreddit.name}`}>
              <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-center text-card-foreground">{subreddit.name}</h3>
                </CardContent>
              </Card>
            </Link>
          </MotionWrapper>
        ))}
      </div>
      <MotionWrapper
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          variant="outline" 
          asChild 
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        >
          <Link href="/categories">View All Games</Link>
        </Button>
      </MotionWrapper>
    </MotionWrapper>
  )
}

export default function PopularGames() {
  const [subreddits, setSubreddits] = useState([])

  useEffect(() => {
    async function fetchSubreddits() {
      const response = await fetch('/api/popular-subreddits')
      const data = await response.json()
      setSubreddits(data)
    }
    fetchSubreddits()
  }, [])

  return <SubredditList subreddits={subreddits} />
}