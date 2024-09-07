import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/Button'

const games = [
  { name: 'World of Warcraft', image: '/images/wow.jpg', slug: 'world-of-warcraft' },
  { name: 'Runescape', image: '/images/runescape.jpg', slug: 'runescape' },
  { name: 'League of Legends', image: '/images/lol.jpg', slug: 'league-of-legends' },
  { name: 'Path of Exile', image: '/images/poe.jpg', slug: 'path-of-exile' },
]

export default function PopularGames() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Popular Games</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {games.map((game) => (
          <Link key={game.slug} href={`/guides/${game.slug}`} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={game.image}
                alt={game.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform group-hover:scale-110"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-center">{game.name}</h3>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/games">View All Games</Link>
        </Button>
      </div>
    </section>
  )
}