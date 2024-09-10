import Link from 'next/link'
import Hero from '../components/guidecraft/hero'
import PopularGames from '../components/guidecraft/PopularGames'
import UserBenefits from '../components/guidecraft/UserBenefits'
import FeaturedContent from '../components/guidecraft/FeaturedContent'
import Testimonials from '../components/guidecraft/Testimonials'
import { Button } from '../components/ui/Button'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 text-foreground">
      <Hero />
      <main className="container mx-auto px-4 py-12 space-y-16">
        <PopularGames />
        {/* <UserBenefits /> */}
        <FeaturedContent />
        {/* <Testimonials /> */}
        {/* <section className="text-center bg-card rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-4 text-card-foreground">Join Our Growing Community</h2>
          <p className="text-xl mb-6 text-card-foreground/80">
            <span className="font-bold">10,000+</span> guides available | <span className="font-bold">500,000+</span> active users
          </p>
          <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/guides">Start Exploring Guides</Link>
          </Button>
        </section> */}
      </main>
      {/* <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Expert Game Guides. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  )
}