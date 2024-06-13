import CustomFeed from '@/components/homepage/CustomFeed'
import GeneralFeed from '@/components/homepage/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getAuthSession } from '@/lib/auth'
import { Home as HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/landing/hero'
import LatestPosts from '@/components/landing/latest-posts'
import Component from '@/components/landing/landing'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
    title: 'GuidesforGamers - GuideCraft: Transform Your Gaming Videos into SEO-Friendly Guides',
    description: 'GuideCraft by GuidesforGamers helps content creators convert their YouTube gaming tutorials into comprehensive, SEO-optimized written guides. Save time and effortlessly repurpose your video content.',
    keywords: ['Guides', 'Gamers', 'Gaming', 'YouTube', 'SEO', 'Content Creation', 'Tutorials', 'GuideCraft'],
    applicationName: 'GuideCraft by GuidesforGamers',
    authors: [{ name: 'GuidesforGamers Team', url: 'https://guidesforgamers.com' }],
    generator: 'Next.js',
    themeColor: '#1a1a1d',
    colorScheme: 'dark',
    viewport: 'width=device-width, initial-scale=1',
    creator: 'GuidesforGamers Development Team',
    publisher: 'GuidesforGamers',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://guidesforgamers.com/guidecraft',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      url: 'https://guidesforgamers.com/guidecraft',
      title: 'GuideCraft - Effortless Gaming Guide Creation by GuidesforGamers',
      description: 'Convert your YouTube gaming tutorials into polished, SEO-optimized written guides with GuideCraft by GuidesforGamers.',
      siteName: 'GuidesforGamers',
      images: [
        {
          url: 'https://guidesforgamers.com/guidecraft/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'GuideCraft - Convert YouTube Videos into Written Guides by GuidesforGamers',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@GuidesforGamers',
      creator: '@GuidesforGamers',
      title: 'GuideCraft by GuidesforGamers - Transform Your Gaming Videos into SEO-Friendly Guides',
      description: 'Effortlessly convert your YouTube gaming tutorials into polished, SEO-friendly written guides with GuideCraft by GuidesforGamers.',
      images: ['https://guidesforgamers.com/guidecraft/og-image.jpg'],
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE',
      yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    },
    appleWebApp: {
      capable: true,
      title: 'GuideCraft by GuidesforGamers',
      statusBarStyle: 'black-translucent',
    },
    formatDetection: {
      telephone: false,
    },
    category: 'Gaming, Content Creation, SEO',
};
  

export default async function Home() {
  const session = await getAuthSession()

  return (
    <div className="bg-[#1a1a1a] text-white">
      <Component />
    </div>
  )
}
