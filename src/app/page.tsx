"use client"

import Link from 'next/link'
import Hero from '../components/guidecraft/hero'
import PopularGames from '../components/guidecraft/PopularGames'
import FeaturedContent from '../components/guidecraft/FeaturedContent'
import { Button } from '../components/ui/Button'
import dynamic from 'next/dynamic'

const MotionDiv = dynamic(() => import('../components/MotionWrapper'), { ssr: false })

// Rename 'dynamic' to 'dynamicConfig' to avoid naming conflict
export const dynamicConfig = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Home() {
  return (
    <MotionDiv 
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <main className="container mx-auto px-4 py-12 space-y-16">
        <PopularGames />
        <FeaturedContent />
      </main>
    </MotionDiv>
  )
}