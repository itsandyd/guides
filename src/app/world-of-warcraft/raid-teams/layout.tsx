import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: 'Raid Team Finder | World of Warcraft',
        template: '%s | Raid Team Finder',
    },
    description: 'Find or create raid teams for World of Warcraft. Join a team that matches your schedule and goals.',
    openGraph: {
        title: 'Raid Team Finder | World of Warcraft',
        description: 'Find or create raid teams for World of Warcraft. Join a team that matches your schedule and goals.',
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
        title: 'Raid Team Finder | World of Warcraft',
        description: 'Find or create raid teams for World of Warcraft. Join a team that matches your schedule and goals.',
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
        <section>
            {/* You can add any common UI elements for all raid team pages here */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </section>
    )
}