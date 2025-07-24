import Link from 'next/link'
import Image from 'next/image'
import { getSiteSetting } from '@/lib/settings'

export default async function Header() {
  const siteName = await getSiteSetting('site_name') || 'Business Directory'
  const siteLogo = await getSiteSetting('site_logo')
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            {siteLogo ? (
              <Image
                src={siteLogo}
                alt={`${siteName} logo`}
                width={40}
                height={40}
                className="rounded-2xl object-contain shadow-md group-hover:shadow-lg transition-all duration-300"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-bold text-lg">
                  {siteName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{siteName}</span>
          </Link>
          
          <nav className="hidden md:flex space-x-2">
            <Link href="/" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-white/60 transition-all duration-200">
              Home
            </Link>
            <Link href="/submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
              Submit Business
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
              Submit
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}