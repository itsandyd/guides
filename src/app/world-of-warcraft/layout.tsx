import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'World of Warcraft Guides',
    template: '%s | World of Warcraft Guides',
  },
  description: 'Find guides and resources for World of Warcraft',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}