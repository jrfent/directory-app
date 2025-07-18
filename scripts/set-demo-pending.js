const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setDemoListingsPending() {
  try {
    // Update all existing listings to PENDING status
    const result = await prisma.business.updateMany({
      where: {
        status: 'APPROVED'
      },
      data: {
        status: 'PENDING'
      }
    })

    console.log(`Updated ${result.count} listings to PENDING status`)
    console.log('Demo listings are now pending for admin approval testing')
    
  } catch (error) {
    console.error('Error updating listings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setDemoListingsPending()