import { prisma } from '@/lib/prisma'
import BusinessCard from '@/components/BusinessCard'
import SearchForm from '@/components/SearchForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; city?: string; state?: string }
}) {
  const { category, city, state } = searchParams

  const businesses = await prisma.business.findMany({
    where: {
      status: 'APPROVED',
      ...(category && { category: { slug: category } }),
      ...(city && { city: { contains: city } }),
      ...(state && { state: { contains: state } }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 text-balance leading-tight">
              {settings.hero_title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 text-balance mb-8">
              {settings.hero_subtitle}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-16">
          <SearchForm categories={categories} />
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        {/* Empty State */}
        {businesses.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No businesses found</h3>
              <p className="text-gray-600 text-lg mb-2">No businesses match your search criteria.</p>
              <p className="text-gray-500">Try adjusting your filters or browse all listings.</p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}