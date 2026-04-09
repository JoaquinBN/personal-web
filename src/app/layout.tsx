import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joaquin Bressan',
  description: 'Builder for the agent era. Building infrastructure for a web where AI agents are the users.',
  authors: [{ name: 'Joaquin Bressan' }],
  creator: 'Joaquin Bressan',
  metadataBase: new URL('https://joaquinbressan.com'),
  openGraph: {
    title: 'Joaquin Bressan',
    description: 'Builder for the agent era. Building infrastructure for a web where AI agents are the users.',
    url: 'https://joaquinbressan.com',
    siteName: 'Joaquin Bressan',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Joaquin Bressan',
    description: 'Builder for the agent era.',
    creator: '@joaquinbressann',
  },
  icons: {
    icon: '/favicon.png',
  },
  alternates: {
    types: {
      'text/markdown': '/api/info',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Joaquin Bressan',
    url: 'https://joaquinbressan.com',
    jobTitle: 'Co-Founder',
    sameAs: [
      'https://github.com/JoaquinBN',
      'https://x.com/joaquinbressann',
      'https://linkedin.com/in/joaquin-bressan',
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.className = theme;
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
