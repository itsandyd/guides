import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Editor } from "@/components/Editor"
import { Button } from "@/components/ui/Button"

interface PageProps {
  params: {
    guideSlug: string
  }
}

const SubmitPostPage = async ({ params }: PageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.guideSlug,
    },
  })

  if (!subreddit) return notFound()

  // Fetch tags separately
  const tags = await db.tag.findMany({
    where: {
      subredditId: subreddit.id
    }
  })

  const formattedTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name
  }))

  return (
    <div className='flex flex-col items-start gap-6 bg-background text-foreground'>
      <div className='border-b border-border pb-5 w-full'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-foreground'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-muted-foreground'>
            in {params.guideSlug}
          </p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} tags={formattedTags} guideSlug={params.guideSlug} />
    </div>
  )
}

export default SubmitPostPage
