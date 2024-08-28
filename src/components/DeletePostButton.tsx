'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'

interface DeletePostButtonProps {
  postId: string
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)

    try {
      await axios.delete(`/api/posts/${postId}`)
      toast({
        title: 'Post deleted',
        description: 'Your post has been successfully deleted.',
        variant: 'default',
      })
      router.push('/') // Redirect to home page after deletion
      router.refresh() // Refresh the current route
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the post. Please try again.',
        variant: 'destructive',
      })
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="destructive"
      className="mt-4"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? 'Deleting...' : 'Delete Post'}
    </Button>
  )
}

export default DeletePostButton