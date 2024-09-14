'use client'

import Link from 'next/link'
import { UserResource } from '@clerk/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { UserAvatar } from '@/components/UserAvatar'
import { useClerk } from '@clerk/nextjs'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserResource
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.fullName || null, image: user.imageUrl || null }}
          className='h-8 w-8'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.fullName && <p className='font-medium'>{user.fullName}</p>}
            {user.primaryEmailAddress && (
              <p className='w-[200px] truncate text-sm text-muted-foreground'>
                {user.primaryEmailAddress.emailAddress}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/feed'>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            // signOut(() => window.location.href = `${window.location.origin}/sign-in`)
          }}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
