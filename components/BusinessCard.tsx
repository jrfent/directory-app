import Image from 'next/image'
import Link from 'next/link'
import { Business, Category } from '@prisma/client'

interface BusinessCardProps {
  business: Business & {
    category: Category
  }
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const createSlug = (name: string, city: string, state: string, category: string) => {
    const formatSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `/${formatSlug(city)}-${formatSlug(state)}/${formatSlug(category)}/${formatSlug(name)}`
  }

  const businessSlug = createSlug(business.name, business.city, business.state, business.category.name)

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20">
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {business.thumbnail ? (
          <Image
            src={business.thumbnail}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center shadow-lg z-10">
              <span className="text-3xl font-bold text-blue-600">
                {business.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
            {business.category.name}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          <Link href={businessSlug} className="hover:text-blue-600 transition-colors">
            {business.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {business.description}
        </p>
        
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{business.city}, {business.state}</span>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={businessSlug}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-center"
          >
            View Details
          </Link>
          {business.website && (
            <Link
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium border border-gray-200 shadow-sm"
            >
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}