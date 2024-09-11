'use client'

import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import * as React from 'react'
import { FC } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { Icons } from './Icons'
import { Loader2, Twitch } from 'lucide-react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const loginWithProvider = async (provider: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, { callbackUrl: '/', redirect: false })
      if (result?.error) {
        toast({
          title: 'Error',
          description: `There was an error logging in with ${provider}`,
          variant: 'destructive',
        })
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `There was an error logging in with ${provider}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col space-y-4', className)} {...props}>
      <Button
        type='button'
        size='lg'
        className='w-full bg-background text-foreground hover:bg-accent hover:text-accent-foreground border border-input'
        onClick={() => loginWithProvider('google')}
        disabled={isLoading}>
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Icons.google className='mr-2 h-4 w-4' />
        )}
        Continue with Google
      </Button>
      <Button
        type='button'
        size='lg'
        className='w-full bg-[#9146FF] hover:bg-[#7C3AED] text-white'
        onClick={() => loginWithProvider('twitch')}
        disabled={isLoading}>
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Twitch className='mr-2 h-4 w-4' />
        )}
        Continue with Twitch
      </Button>
    </div>
  )
}

export default UserAuthForm
