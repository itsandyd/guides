import Link from "next/link"

export default function Hero() {
  return (
    <section className="container mt-10 flex items-center md:mt-28">
      <div className="flex max-w-5xl flex-col items-start gap-5">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Dive into a Universe Where Gamers Fuel Gamers
        </h1>
        <p className="text-sm text-muted-foreground">
          At GuidesForGamers.com, we believe every player has a unique story to share, a clever trick to teach, and a strategy that could change the game. Whether you're battling through the realms of World of Warcraft, mastering skills in Runescape, conquering opponents in League of Legends, or surviving the dark corners of Path of Exile, our community-driven platform is your go-to destination for all things gaming.
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium shadow-sm w-24 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          href="/feed"
        >
          View Feed
        </Link>
      </div>
    </section>
  )
}