const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Tdnw1#cejr', 12)
    
    // Create or update the admin user
    const admin = await prisma.user.upsert({
      where: { email: 'superadmin@admin.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'superadmin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('Admin user created/updated successfully:')
    console.log('Email: superadmin@admin.com')
    console.log('Password: Tdnw1#cejr')
    console.log('Role: ADMIN')
    
    // Create default settings
    await prisma.settings.upsert({
      where: { key: 'listing_price' },
      update: { value: '99.00' },
      create: {
        key: 'listing_price',
        value: '99.00',
        description: 'Annual listing price in USD',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'site_name' },
      update: { value: 'Business Directory' },
      create: {
        key: 'site_name',
        value: 'Business Directory',
        description: 'Site name displayed in header',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'site_url' },
      update: { value: 'http://localhost:3000' },
      create: {
        key: 'site_url',
        value: 'http://localhost:3000',
        description: 'Full URL of the site',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'contact_email' },
      update: { value: 'contact@businessdirectory.com' },
      create: {
        key: 'contact_email',
        value: 'contact@businessdirectory.com',
        description: 'Contact email for the site',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'contact_phone' },
      update: { value: '' },
      create: {
        key: 'contact_phone',
        value: '',
        description: 'Contact phone number for the site',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'site_logo' },
      update: { value: '' },
      create: {
        key: 'site_logo',
        value: '',
        description: 'URL to site logo image',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'hero_title' },
      update: { value: 'Find Top-Ranked Businesses' },
      create: {
        key: 'hero_title',
        value: 'Find Top-Ranked Businesses',
        description: 'Main headline on homepage',
      },
    })

    await prisma.settings.upsert({
      where: { key: 'hero_subtitle' },
      update: { value: 'Discover quality businesses in your area' },
      create: {
        key: 'hero_subtitle',
        value: 'Discover quality businesses in your area',
        description: 'Subtitle text on homepage',
      },
    })

    // Create default categories
    const categories = [
      { name: 'Restaurants', slug: 'restaurants' },
      { name: 'Retail', slug: 'retail' },
      { name: 'Services', slug: 'services' },
      { name: 'Health & Fitness', slug: 'health-fitness' },
      { name: 'Automotive', slug: 'automotive' },
      { name: 'Technology', slug: 'technology' },
      { name: 'Real Estate', slug: 'real-estate' },
      { name: 'Professional Services', slug: 'professional-services' },
      { name: 'Entertainment', slug: 'entertainment' },
      { name: 'Home & Garden', slug: 'home-garden' },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: category,
      })
    }

    console.log('Default categories created')
    console.log('Default settings created')
    
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()