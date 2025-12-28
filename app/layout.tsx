import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
    themeColor: '#ffffff',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export const metadata: Metadata = {
    title: {
        default: 'Omegle - Talk to Strangers!',
        template: '%s | Omegle'
    },
    description: 'Free online chat with strangers. Meet new people, make friends, and have fun in a safe and anonymous environment.',
    keywords: ['omegle', 'chat', 'strangers', 'video chat', 'text chat', 'anonymous', 'meet people', 'random chat'],
    authors: [{ name: 'Omegle Team' }],
    creator: 'Omegle Team',
    publisher: 'Omegle',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://omegle-clone.vercel.app', // Replace with actual domain
        title: 'Omegle - Talk to Strangers!',
        description: 'Free online chat with strangers. Meet new people, make friends, and have fun.',
        siteName: 'Omegle',
        images: [
            {
                url: '/og-image.png', // Needs to be added to public folder
                width: 1200,
                height: 630,
                alt: 'Omegle - Talk to Strangers',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Omegle - Talk to Strangers!',
        description: 'Free online chat with strangers. Meet new people, make friends, and have fun.',
        images: ['/og-image.png'],
        creator: '@omegle',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Omegle',
        url: 'https://omegle-clone.vercel.app',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://omegle-clone.vercel.app/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <html lang="en">
            <body className={inter.className}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Suppress MetaMask injection errors
                            window.addEventListener('error', (e) => {
                                if (e.message.includes('MetaMask') || e.filename?.includes('inpage.js')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            });
                        `
                    }}
                />
                {children}
            </body>
        </html>
    )
}
