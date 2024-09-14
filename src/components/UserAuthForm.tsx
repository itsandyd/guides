'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'
import { FC } from 'react'
import { Button } from '@/components/ui/Button'
import { Icons } from './Icons'
import { Twitch } from 'lucide-react'
import { SignInButton } from "@clerk/nextjs";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-4', className)} {...props}>
      <SignInButton mode="modal">
        <Button
          type='button'
          size='lg'
          className='w-full bg-background text-foreground hover:bg-accent hover:text-accent-foreground border border-input'
        >
          <Icons.google className='mr-2 h-4 w-4' />
          Sign in with Google
        </Button>
      </SignInButton>
      <SignInButton mode="modal">
        <Button
          type='button'
          size='lg'
          className='w-full bg-[#9146FF] hover:bg-[#7C3AED] text-white'
        >
          <Twitch className='mr-2 h-4 w-4' />
          Sign in with Twitch
        </Button>
      </SignInButton>
    </div>
  )
}

export default UserAuthForm
