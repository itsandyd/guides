import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { db } from "@/lib/db"
import Link from 'next/link'

const CategoriesPage = async () => {
  const subreddits = await db.subreddit.findMany()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {subreddits.map((subreddit) => (
          <Link href={`/guides/${subreddit.name}`} key={subreddit.id}>
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{subreddit.name}</CardTitle>
              </CardHeader>
              {/* <CardContent>
                Insert content here
              </CardContent>
              <CardFooter>
                Insert footer here
              </CardFooter> */}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage