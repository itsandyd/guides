import { notFound } from "next/navigation"
import { db } from "../../../../lib/db"
import { Editor } from "@/components/Editor"  // Ensure this path is correct
import { Button } from "../../../../components/ui/Button"

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      tag: true, // This is correct
    },
  })

  if (!subreddit) return notFound()

  // Fetch all tags for this subreddit
  const allTags = await db.tag.findMany({
    where: {
      subredditId: subreddit.id
    }
  })

  // Transform the tags to match the expected format
  const formattedTags = allTags.map(tag => ({
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
            in {params.slug}
          </p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} tags={formattedTags} />

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          Post
        </Button>
      </div>
    </div>
  )
}

export default page
