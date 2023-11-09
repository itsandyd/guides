import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { Button, buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'
import { Box, GithubIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between'>

        <Link href='/'>
          <div className='flex gap-2 items-center'>
            <Box className='h-8 w-8 sm:h-6 sm:w-6' />
            <p className='hidden text-zinc-700 text-sm font-medium md:block'>Neat Guides</p>
          </div>
        </Link>

        {/* search bar */}
        {/* <SearchBar /> */}
        <Link href="categories">
          <Button variant="link">Guide Categories</Button>
        </Link>
        <Link href="https://emotemaker.ai">
          <Button variant="link">Emote Maker</Button>
        </Link>
        <Link href="twitch">
          <Button variant="link">Streamers</Button>
        </Link>

        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              <Link href="https://github.com/neatgang/guides">
                {/* <Button> */}
                <GithubIcon />
                {/* </Button>s */}
              </Link>
              <UserAccountNav user={session.user} />
            </>
          ) : (
            <Link href='/sign-in'>
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar