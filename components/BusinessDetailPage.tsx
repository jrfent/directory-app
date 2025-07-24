'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Business, Category } from '@prisma/client'

interface BusinessDetailPageProps {
  business: Business & { category: Category }
}

export default function BusinessDetailPage({ business }: BusinessDetailPageProps) {
  const router = useRouter()
  
  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Return Button */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-all duration-200 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              <svg 
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20">
          {/* Hero Image */}
          {business.thumbnail ? (
            <div className="relative h-80 md:h-96 lg:h-[32rem]">
              <Image
                src={business.thumbnail}
                alt={business.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  <div className="flex items-center text-gray-600 text-lg">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{business.city}, {business.state}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 md:h-96 lg:h-[32rem] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
              <div className="text-center z-10">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-bold text-blue-600">
                    {business.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {business.name}
                </h1>
                <div className="flex items-center justify-center text-gray-600 text-lg">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{business.city}, {business.state}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-8 lg:p-12">
            {/* Category Badge */}
            <div className="mb-8 flex justify-center">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-6 py-2 rounded-full shadow-lg">
                {business.category.name}
              </span>
            </div>

            {/* Description Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                About This Business
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap text-center max-w-4xl mx-auto">
                  {business.description}
                </p>
              </div>
            </div>

            {/* Website Section */}
            {business.website && (
              <div className="mb-12 text-center">
                <div className="bg-gradient-to-r from-blue-50 via-blue-50 to-blue-100 rounded-2xl p-8 shadow-sm border border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Website</h2>
                  <Link
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {business.linkText || 'Visit Website'}
                  </Link>
                  <p className="text-gray-500 mt-4 text-sm break-all">
                    {business.website}
                  </p>
                </div>
              </div>
            )}

            {/* Location Card */}
            <div className="mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Location
                </h2>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-4">
                    {business.address && (
                      <div className="mb-2">{business.address}</div>
                    )}
                    <div>{business.city}, {business.state} {business.zipCode}</div>
                  </div>
                  {business.address && (
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${business.address}, ${business.city}, ${business.state} ${business.zipCode || ''}`.trim()
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Google Maps
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional Business Information */}
            {(business.openingHours || business.priceRange) && (
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {business.openingHours && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Opening Hours</h3>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{business.openingHours}</p>
                    </div>
                  )}
                  {business.priceRange && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
                      <p className="text-gray-700 font-medium">{business.priceRange}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </main>
  )
}