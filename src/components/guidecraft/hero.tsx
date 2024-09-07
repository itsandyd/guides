import Link from "next/link"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"


const gameOptions = [
  { value: "all", label: "All Games" },
  { value: "wow", label: "World of Warcraft" },
  { value: "lol", label: "League of Legends" },
  { value: "poe", label: "Path of Exile" },
  { value: "runescape", label: "RuneScape" },
]

export default function Hero() {
  return (
    <section className="container mt-10 flex flex-col items-center md:mt-28">
      <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl">
          Find Expert Guides for Your Favorite Games
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Dive into a universe where gamers fuel gamers. Discover strategies, tips, and tricks to elevate your gameplay across World of Warcraft, Runescape, League of Legends, Path of Exile, and more!
        </p>
        <div className="flex w-full max-w-md items-center space-x-2">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              {gameOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Search guides..." className="flex-grow" />
          <Button type="submit">Search</Button>
        </div>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary text-primary-foreground px-6 font-medium shadow-sm transition-colors hover:bg-primary/90"
          href="/guides"
        >
          Explore Guides
        </Link>
      </div>
      <div className="mt-8 flex items-center space-x-4">
        <span className="text-sm font-medium">Why choose us?</span>
        <span className="text-sm">Expert Strategies</span>
        <span className="text-sm">Up-to-date Information</span>
        <span className="text-sm">Community-tested Tactics</span>
      </div>
    </section>
  )
}