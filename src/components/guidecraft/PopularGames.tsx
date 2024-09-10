import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { db } from '@/lib/db'

async function getPopularSubreddits() {
  try {
    return await db.subreddit.findMany({
      take: 4,
      orderBy: {
        subscribers: {
          _count: 'desc'
        }
      },
      include: {
        game: {
          select: {
            name: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching popular subreddits:', error)
    return []
  }
}

function SubredditList({ subreddits }: { subreddits: Awaited<ReturnType<typeof getPopularSubreddits>> }) {
  if (subreddits.length === 0) {
    return <div>No popular subreddits found.</div>
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Popular Subreddits</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {subreddits.map((subreddit) => (
          <Link key={subreddit.id} href={`/guides/${subreddit.name}`} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              {/* <Image
                src={`/images/${subreddit.name.toLowerCase()}.jpg`}
                alt={subreddit.name}
                width={300}
                height={300}
                className="object-cover transition-transform group-hover:scale-110"
              /> */}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-center">{subreddit.name}</h3>
            <p className="text-sm text-center text-gray-600">
              {subreddit.game ? subreddit.game.name : 'General'}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/subreddits">View All Subreddits</Link>
        </Button>
      </div>
    </section>
  )
}

async function PopularSubredditsContent() {
  const subreddits = await getPopularSubreddits()
  return <SubredditList subreddits={subreddits} />
}

export default function PopularGames() {
  return (
    <Suspense fallback={<div>Loading popular subreddits...</div>}>
      {/* @ts-expect-error Server Component */}
      <PopularSubredditsContent />
    </Suspense>
  )
}