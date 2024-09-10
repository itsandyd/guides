import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '../components/theme-provider'
import Providers from '../components/Providers'
import Navbar from '@/components/navigation/Navbar'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guides for Gamers - Guidesforgamers.com',
  description: 'Guides for Gamers is your ultimate resource for video game guides, walkthroughs, tips and tricks. Find detailed step-by-step guides for the latest PC, console and mobile games. Our expert gaming guides help you master gameplay, find all collectibles, earn achievements and get the most out of your gaming experience. Game smarter with Guides for Gamers.',
  keywords: ['Guides', 'Gamers', 'Gaming', 'Guide', 'Gamer'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            <main className="dark:bg-[#1a1a1a] dark:text-white min-h-screen">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
