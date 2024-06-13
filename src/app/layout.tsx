import Navbar from '@/components/navigation/Navbar'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'

import '@/styles/globals.css'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guides for Gamers - Guidesforgamers.com',
  description: 'Guides for Gamers is your ultimate resource for video game guides, walkthroughs, tips and tricks. Find detailed step-by-step guides for the latest PC, console and mobile games. Our expert gaming guides help you master gameplay, find all collectibles, earn achievements and get the most out of your gaming experience. Game smarter with Guides for Gamers.',
  keywords: ['Guides', 'Gamers', 'Gaming', 'Guide', 'Gamer'],
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn(
        // 'bg-white text-slate-900 light',
        inter.className
      )}>
      <body className=''>
      {/* bg-slate-50 */}
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {authModal}

          <div className='h-full'>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
