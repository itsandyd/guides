import CustomFeed from '@/components/homepage/CustomFeed'
import GeneralFeed from '@/components/homepage/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getAuthSession } from '@/lib/auth'
import { Home as HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Feed from './feed/page'
import Hero from '@/components/landing/hero'
import LatestPosts from '@/components/landing/latest-posts'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <div className='gap-4 mb-12'>
      <Hero />
      <LatestPosts />
    </div>
  )
}
