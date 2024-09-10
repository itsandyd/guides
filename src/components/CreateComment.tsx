'use client'

import { useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios from 'axios'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import LoadingButton from './ui/LoadingButton'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState<string>('')
  const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(`/api/subreddit/post/comment/`, payload)
      return data
    },

    onError: () => {
      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment' className='text-foreground'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts?'
          className='bg-background text-foreground resize-none max-h-40 min-h-[2.5rem]'
        />

        <div className='mt-2 flex justify-end'>
          <LoadingButton
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
            className='bg-primary text-primary-foreground hover:bg-primary/90'>
            Post
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
