import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Editor } from "@/components/Editor"
import { Button } from "@/components/ui/Button"

interface EditPageProps {
  params: {
    slug: string
    postId: string
  }
}

const EditPostPage = async ({ params }: EditPageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      tags: true,
    },
  })

  if (!subreddit) return notFound()

  const post = await db.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      tags: true
    }
  })

  if (!post) return notFound()

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
            Edit Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-muted-foreground'>
            in {params.slug}
          </p>
        </div>
      </div>

      <Editor 
        subredditId={subreddit.id} 
        tags={formattedTags} 
        guideSlug={params.slug}
        postId={params.postId}
      />

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          Update Post
        </Button>
      </div>
    </div>
  )
}

export default EditPostPage