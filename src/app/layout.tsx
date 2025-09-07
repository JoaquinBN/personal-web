import type { Metadata } from 'next'
import './globals.css'
import { getSiteConfig } from '@/lib/data'

const config = getSiteConfig()

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description,
  authors: [{ name: config.site.author }],
  creator: config.site.author,
  metadataBase: new URL(config.site.url),
  openGraph: {
    title: config.site.title,
    description: config.site.description,
    url: config.site.url,
    siteName: config.site.title,
    images: [
      {
        url: config.site.logo,
        width: 500,
        height: 500,
        alt: `${config.site.author} Logo`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site.title,
    description: config.site.description,
    images: [config.site.logo],
    creator: '@joaquinbressan', // Update this with your actual Twitter handle
  },
  icons: {
    icon: config.site.logo,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
