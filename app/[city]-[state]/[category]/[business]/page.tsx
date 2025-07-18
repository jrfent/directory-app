import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import BusinessDetailPage from '@/components/BusinessDetailPage'
import { Metadata } from 'next'

interface PageProps {
  params: {
    'city]-[state': string
    category: string
    business: string
  }
}

async function getBusiness(city: string, state: string, category: string, business: string) {
  const formatSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  const businesses = await prisma.business.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      category: true,
    },
  })

  const matchingBusiness = businesses.find(b => {
    const businessSlug = formatSlug(b.name)
    const citySlug = formatSlug(b.city)
    const stateSlug = formatSlug(b.state)
    const categorySlug = formatSlug(b.category.name)
    
    return businessSlug === business && 
           citySlug === city && 
           stateSlug === state && 
           categorySlug === category
  })

  return matchingBusiness || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Parse city and state from the compound parameter
  const cityStateParam = params['city]-[state']
  const lastDashIndex = cityStateParam.lastIndexOf('-')
  const city = cityStateParam.substring(0, lastDashIndex)
  const state = cityStateParam.substring(lastDashIndex + 1)
  
  const business = await getBusiness(city, state, params.category, params.business)
  
  if (!business) {
    return {
      title: 'Business Not Found',
    }
  }

  return {
    title: `${business.name} - ${business.city}, ${business.state}`,
    description: business.description,
    openGraph: {
      title: `${business.name} - ${business.city}, ${business.state}`,
      description: business.description,
      images: business.thumbnail ? [business.thumbnail] : [],
    },
  }
}

export default async function BusinessPage({ params }: PageProps) {
  // Parse city and state from the compound parameter
  const cityStateParam = params['city]-[state']
  const lastDashIndex = cityStateParam.lastIndexOf('-')
  const city = cityStateParam.substring(0, lastDashIndex)
  const state = cityStateParam.substring(lastDashIndex + 1)
  
  const business = await getBusiness(city, state, params.category, params.business)

  if (!business) {
    notFound()
  }

  // Generate schema.org LocalBusiness structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": business.website,
    "telephone": business.phone,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.city,
      "addressRegion": business.state,
      "postalCode": business.zipCode,
      "addressCountry": "US"
    },
    "openingHours": business.openingHours,
    "priceRange": business.priceRange,
    "image": business.thumbnail,
    "category": business.category.name
  }

  // Clean up null/undefined values
  const cleanedSchemaData = Object.fromEntries(
    Object.entries(schemaData).filter(([_, value]) => value != null)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cleanedSchemaData)
        }}
      />
      <BusinessDetailPage business={business} />
    </div>
  )
}