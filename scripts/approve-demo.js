const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function approveDemoListings() {
  try {
    // Approve a few demo listings for testing
    const result = await prisma.business.updateMany({
      where: {
        status: 'PENDING'
      },
      data: {
        status: 'APPROVED'
      }
    })

    console.log(`Approved ${result.count} listings for testing`)
    
  } catch (error) {
    console.error('Error approving listings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

approveDemoListings()