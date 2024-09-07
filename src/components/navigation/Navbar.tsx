import { Montserrat } from "next/font/google";
import Link from "next/link"
import { cn } from "@/lib/utils";
import { LandingMobileNavbar } from "./mobile-navbar";
import { Button } from "../ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserAccountNav } from "../UserAccountNav";
import { Book, Users } from "lucide-react";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <>
    <nav className="p-4 bg-[#1a1a1a] text-white flex items-center justify-between z-10">
      <LandingMobileNavbar />
      <Link href="/" className="flex items-center">
        <div className='flex items-center gap-2'>
          <Book className='h-8 w-8 sm:h-6 sm:w-6 ' />
          <p className=' text-white-700 text-sm font-bold'>GuidesForGamers</p>
        </div>
      </Link>
      <div className="hidden md:block">
        <div className="flex items-center gap-x-2">
          <Link href="/categories">
            <Button variant="ghost" className="rounded-full">
              Guide Categories
            </Button>
          </Link>
          {/* <Link href="/guidecraft">
            <Button variant="ghost" className="rounded-full">
              GuideCraft
            </Button>
          </Link> */}
          <Link href="https://emotemaker.ai">
            <Button variant="ghost" className="rounded-full">
              AI Emote Generation
            </Button>
          </Link>
          {/* New Raid Team Finder Button */}
          <Link href="/world-of-warcraft/raid-teams">
            <Button variant="ghost" className="rounded-full">
              {/* <Users className="mr-2 h-4 w-4" /> */}
              Team Finder
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-up">
            <Button variant="ghost" className="rounded-full bg-white text-black">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </nav>
    </>
  )
}

export default Navbar

