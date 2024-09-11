import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(128, {
      message: 'Title must be less than 128 characters long',
    }),
  subredditId: z.string(),
  content: z.any(),
  tags: z.array(z.string()),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
})

export type PostCreationRequest = {
  title: string
  content: any
  subredditId: string
  tags: string[]
  // ... any other properties ...
}