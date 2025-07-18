import Header from '@/components/Header'
import BusinessSubmissionForm from '@/components/BusinessSubmissionForm'
import { prisma } from '@/lib/prisma'

export default async function SubmitPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const listingPrice = await prisma.settings.findUnique({
    where: { key: 'listing_price' },
  })

  const price = listingPrice?.value || '99.00'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6">
              Submit Your Business
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Get your business listed in our directory
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold">${price}/year</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <BusinessSubmissionForm categories={categories} price={price} />
          </div>
        </div>
      </main>
    </div>
  )
}