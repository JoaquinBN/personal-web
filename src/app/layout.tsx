import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joaquin Bressan',
  description: 'Software developer passionate about creating meaningful digital experiences',
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
