import { Montserrat } from "next/font/google";
import Link from "next/link"
import { cn } from "@/lib/utils";
import { LandingMobileNavbar } from "./mobile-navbar";
import { Button } from "../ui/Button";
import { UserAccountNav } from "../UserAccountNav";
import { Book, Users } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

const Navbar = () => {
  return (
    <nav className="p-4 bg-background border-b border-border text-foreground flex items-center justify-between z-10">
      <LandingMobileNavbar />
      <Link href="/" className="flex items-center">
        <div className='flex items-center gap-2'>
          <Book className='h-8 w-8 sm:h-6 sm:w-6 text-primary' />
          <p className={cn('text-sm font-bold', font.className)}>GuidesForGamers</p>
        </div>
      </Link>
      <div className="hidden md:block">
        <div className="flex items-center gap-x-2">
          <Link href="/categories">
            <Button variant="ghost" className="rounded-full text-foreground hover:text-primary hover:bg-accent">
              Guide Categories
            </Button>
          </Link>
          <Link href="https://emotemaker.ai">
            <Button variant="ghost" className="rounded-full text-foreground hover:text-primary hover:bg-accent">
              AI Emote Generation
            </Button>
          </Link>
          <Link href="/world-of-warcraft/raid-teams">
            <Button variant="ghost" className="rounded-full text-foreground hover:text-primary hover:bg-accent">
              Team Finder
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <ThemeToggle />
        <Link href="/sign-up">
          <Button 
            variant="default" 
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

