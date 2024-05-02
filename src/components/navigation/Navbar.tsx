// import { authOptions } from '@/lib/auth'
// import { getServerSession } from 'next-auth'
// import Link from 'next/link'
// import { Icons } from '../Icons'
// import { Button, buttonVariants } from '../ui/Button'
// import { UserAccountNav } from '../UserAccountNav'
// import SearchBar from '../SearchBar'
// import { Box, GithubIcon } from 'lucide-react'
// import { useEffect, useState } from 'react'

// const Navbar = async () => {
//   const session = await getServerSession(authOptions)

//   return (
//     <div className='fixed top-0 inset-x-0 bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
//       <div className='container max-w-7xl h-full mx-auto flex items-center justify-between'>

//         <Link href='/'>
//           <div className='flex gap-2 items-center'>
//             <Box className='h-8 w-8 sm:h-6 sm:w-6' />
//             <p className='hidden text-zinc-700 text-sm font-medium md:block'>Neat Guides</p>
//           </div>
//         </Link>

//         {/* search bar */}
//         {/* <SearchBar /> */}
//         <Link href="categories">
//           <Button variant="link">Guide Categories</Button>
//         </Link>
//         <Link href="https://emotemaker.ai">
//           <Button variant="link">Emote Maker</Button>
//         </Link>
//         <Link href="twitch">
//           <Button variant="link">Streamers</Button>
//         </Link>

//         <div className="flex gap-4 items-center">
//           {session?.user ? (
//             <>
//               <Link href="https://github.com/neatgang/guides">
//                 {/* <Button> */}
//                 <GithubIcon />
//                 {/* </Button>s */}
//               </Link>
//               <UserAccountNav user={session.user} />
//             </>
//           ) : (
//             <Link href='/sign-in'>
//               <Button>Sign In</Button>
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Navbar



import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"


import { cn } from "@/lib/utils";
import { LandingMobileNavbar } from "./mobile-navbar";
import { Button } from "../ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserAccountNav } from "../UserAccountNav";
import { Box, BoxIcon } from "lucide-react";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

const Navbar = async () => {
  // const { isSignedIn } = useAuth();
  const session = await getServerSession(authOptions)

  return (
    <>
    <nav className="p-4 bg-transparent flex items-center justify-between z-10">
    <LandingMobileNavbar />
    <Link href="/" className="flex items-center">
  <div className='flex items-center gap-2 ml-4'>
    <Box className='h-8 w-8 sm:h-6 sm:w-6 ' />
    <p className=' text-zinc-700 text-sm font-medium'>GuidesForGamers</p>
  </div>
</Link>
<div className="hidden md:block">
       <div className="flex items-center gap-x-2">
        <Link href="/categories">
            <Button variant="ghost" className="rounded-full">
                Guide Categories
            </Button>
        </Link>
        <Link href="/twitch">
            <Button variant="ghost" className="rounded-full">
                Streamers
            </Button>
        </Link>
        <Link href="https://emotemaker.ai">
            <Button variant="ghost" className="rounded-full">
                AI Emote Generation
            </Button>
        </Link>
      </div>
      </div>
      <div className="flex items-center gap-x-2">
      {session?.user ? (

        <UserAccountNav user={session.user} />
) : (
    <Link href="/sign-up">
        <Button variant="default" className="rounded-full">
            Get Started
        </Button>
    </Link>
)}
        {/* <ModeToggle /> */}
        </div>
    </nav>
    </>
  )
}

export default Navbar

