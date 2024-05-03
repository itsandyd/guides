/**
 * v0 by Vercel.
 * @see https://v0.dev/t/I834dw7Bvdu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative w-full h-[400px]">
      {/* <img alt="Hero" className="absolute inset-0 object-cover w-full h-full" src="/placeholder.svg" /> */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 p-4 md:gap-10">
        <div className="grid gap-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-gray-50">
          Dive into a Universe Where Gamers Fuel Gamers
          </h1>
          <p className="max-w-[700px] text-gray-500 dark:text-gray-400">
          At GuidesForGamers.com, we believe every player has a unique story to share, a clever trick to teach, and a strategy that could change the game. Whether you're battling through the realms of World of Warcraft, mastering skills in Runescape, conquering opponents in League of Legends, or surviving the dark corners of Path of Exile, our community-driven platform is your go-to destination for all things gaming.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium shadow-sm w-24 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          href="/feed"
        >
          View Feed
        </Link>
      </div>
    </div>
  )
}