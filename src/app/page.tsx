import Hero from '@/components/guidecraft/hero'
import PopularGames from '@/components/guidecraft/PopularGames'
import UserBenefits from '@/components/guidecraft/UserBenefits'
import FeaturedContent from '@/components/guidecraft/FeaturedContent'
import LatestPosts from '@/components/guidecraft/latest-posts'
import Newsletter from '@/components/guidecraft/Newsletter'
import Testimonials from '@/components/guidecraft/Testimonials'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <PopularGames />
      <UserBenefits />
      <FeaturedContent />
      <Testimonials />
      {/* <LatestPosts /> */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
        <p className="text-xl mb-6">
          <span className="font-bold">10,000+</span> guides available | <span className="font-bold">100,000+</span> active users
        </p>
        <Button size="lg" asChild>
          <Link href="/guides">Start Exploring Guides</Link>
        </Button>
      </section>
      {/* <Newsletter /> */}
    </div>
  )
}