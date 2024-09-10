import { Suspense } from 'react'
import Link from 'next/link'
import { db } from '../../lib/db'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'


async function getPopularSubreddits() {
  try {
    return await db.subreddit.findMany({
      take: 4,
      orderBy: {
        updatedAt: 'desc'  // Sort by last update, most recent first
                // subscribers: {
        //   _count: 'desc'
        // }
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
    return <div className="text-foreground">No popular subreddits found.</div>
  }

  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Popular Games</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subreddits.map((subreddit: any) => (
          <Link href={`/guides/${subreddit.name}`} key={subreddit.id}>
            <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-center text-card-foreground">{subreddit.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          asChild 
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        >
          <Link href="/categories">View All Games</Link>
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