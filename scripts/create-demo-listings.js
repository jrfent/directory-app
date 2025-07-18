const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDemoListings() {
  try {
    // Get categories
    const categories = await prisma.category.findMany()
    
    const demoListings = [
      {
        name: "Tony's Pizza Palace",
        description: "Authentic New York style pizza with fresh ingredients. Family-owned since 1985, we serve the best pizza in town with our secret sauce recipe passed down through generations.",
        city: "Las Vegas",
        state: "Nevada",
        website: "https://tonys-pizza-palace.com",
        linkText: "Order Online",
        categorySlug: "restaurants",
        status: "APPROVED"
      },
      {
        name: "Superior Hood Cleaning",
        description: "Professional commercial kitchen hood cleaning services. We provide thorough cleaning and maintenance for restaurants, ensuring compliance with fire safety regulations.",
        city: "Las Vegas",
        state: "Nevada",
        website: "https://superior-hood-cleaning.com",
        linkText: "Get Quote",
        categorySlug: "services",
        status: "APPROVED"
      },
      {
        name: "TechFix Computer Repair",
        description: "Expert computer and laptop repair services. We fix hardware issues, remove viruses, upgrade systems, and provide IT support for businesses and individuals.",
        city: "Austin",
        state: "Texas",
        website: "https://techfix-austin.com",
        linkText: "Book Service",
        categorySlug: "technology",
        status: "APPROVED"
      },
      {
        name: "Sunset Fitness Gym",
        description: "Full-service fitness center with modern equipment, personal training, group classes, and nutrition counseling. Open 24/7 for your convenience.",
        city: "Miami",
        state: "Florida",
        website: "https://sunset-fitness.com",
        linkText: "Join Now",
        categorySlug: "health-fitness",
        status: "APPROVED"
      },
      {
        name: "Downtown Auto Repair",
        description: "Trusted automotive repair shop specializing in all makes and models. We offer oil changes, brake service, engine repair, and comprehensive diagnostics.",
        city: "Denver",
        state: "Colorado",
        website: "https://downtown-auto-denver.com",
        linkText: "Schedule Service",
        categorySlug: "automotive",
        status: "APPROVED"
      },
      {
        name: "Bloom Garden Center",
        description: "Your one-stop shop for plants, flowers, garden supplies, and landscaping materials. We also offer professional landscaping design and installation services.",
        city: "Portland",
        state: "Oregon",
        website: "https://bloom-garden-center.com",
        linkText: "Visit Store",
        categorySlug: "home-garden",
        status: "APPROVED"
      },
      {
        name: "Smith & Associates Law Firm",
        description: "Experienced attorneys providing legal services in family law, personal injury, business law, and estate planning. Free consultations available.",
        city: "Chicago",
        state: "Illinois",
        website: "https://smith-associates-law.com",
        linkText: "Free Consultation",
        categorySlug: "professional-services",
        status: "APPROVED"
      },
      {
        name: "Fashion Forward Boutique",
        description: "Trendy clothing boutique featuring the latest fashion for women. We carry designer brands, accessories, and offer personal styling services.",
        city: "Seattle",
        state: "Washington",
        website: "https://fashion-forward-boutique.com",
        linkText: "Shop Collection",
        categorySlug: "retail",
        status: "APPROVED"
      },
      {
        name: "Metro Real Estate Group",
        description: "Premier real estate agency helping you buy, sell, or rent properties. Our experienced agents provide personalized service and market expertise.",
        city: "Atlanta",
        state: "Georgia",
        website: "https://metro-real-estate.com",
        linkText: "Find Properties",
        categorySlug: "real-estate",
        status: "APPROVED"
      },
      {
        name: "Star Cinema Complex",
        description: "Modern movie theater with 12 screens, IMAX, comfortable seating, and full concession stand. Now showing the latest blockbusters and indie films.",
        city: "Phoenix",
        state: "Arizona",
        website: "https://star-cinema-complex.com",
        linkText: "Movie Times",
        categorySlug: "entertainment",
        status: "APPROVED"
      }
    ]

    console.log('Creating demo business listings...')

    for (const listing of demoListings) {
      // Find the category
      const category = categories.find(cat => cat.slug === listing.categorySlug)
      
      if (!category) {
        console.log(`Category not found: ${listing.categorySlug}`)
        continue
      }

      // Create slug for the business
      const slug = `${listing.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

      // Create the business listing
      await prisma.business.create({
        data: {
          name: listing.name,
          slug: slug,
          description: listing.description,
          city: listing.city,
          state: listing.state,
          website: listing.website,
          linkText: listing.linkText,
          categoryId: category.id,
          status: listing.status,
          paidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      })

      console.log(`✓ Created: ${listing.name} in ${listing.city}, ${listing.state}`)
    }

    console.log('\n🎉 Demo listings created successfully!')
    console.log('You can now test the following functionality:')
    console.log('- Browse businesses on the homepage')
    console.log('- Search by category, city, or state')
    console.log('- View individual business detail pages')
    console.log('- Test the SEO-friendly URLs')
    
  } catch (error) {
    console.error('Error creating demo listings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoListings()