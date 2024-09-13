import { Vote } from '@prisma/client'

export type CachedPost = {
  id: string
  title: string
  authorUsername: string
  content: string
  currentVote: Vote['type'] | null
  createdAt: Date
  slug: string  // Add this line
  subredditName: string  // Add this line as well
}