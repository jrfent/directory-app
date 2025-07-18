import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { getSiteSetting } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  const siteName = await getSiteSetting('site_name') || 'Business Directory'
  
  return {
    title: `${siteName} - Find Top-Ranked Businesses`,
    description: 'Discover quality businesses in your area. Browse our comprehensive directory of verified local businesses.',
    keywords: 'business directory, local businesses, services, companies, reviews',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}