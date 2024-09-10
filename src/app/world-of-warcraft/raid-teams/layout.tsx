import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
    title: {
        default: 'Group Finder | World of Warcraft',
        template: '%s | Group Finder',
    },
    description: 'Find or create groups for World of Warcraft. Join a team that matches your schedule and goals.',
    openGraph: {
        title: 'Group Finder | World of Warcraft',
        description: 'Find or create groups for World of Warcraft. Join a team that matches your schedule and goals.',
        type: 'website',
        url: 'https://guidesforgamers.com/world-of-warcraft/raid-teams',
        // Uncomment and update the image URL when you have one
        // images: [
        //   {
        //     url: 'https://guidesforgamers.com/images/raid-team-finder-og.jpg',
        //     width: 1200,
        //     height: 630,
        //     alt: 'Raid Team Finder',
        //   },
        // ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Group Finder | World of Warcraft',
        description: 'Find or create groups for World of Warcraft. Join a team that matches your schedule and goals.',
        // Uncomment and update the image URL when you have one
        // images: ['https://guidesforgamers.com/images/raid-team-finder-og.jpg'],
    },
}

export default function RaidTeamsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen transition-colors duration-200 bg-background text-foreground">
            {children}
        </div>
    )
}