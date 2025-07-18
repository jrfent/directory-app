import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSiteSetting } from '@/lib/settings'

export async function GET() {
  try {
    const baseUrl = await getSiteSetting('site_url') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const businesses = await prisma.business.findMany({
      where: { status: 'APPROVED' },
      include: {
        category: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })

    const createSlug = (name: string, city: string, state: string, category: string) => {
      const formatSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return `${formatSlug(city)}-${formatSlug(state)}/${formatSlug(category)}/${formatSlug(name)}`
    }

    const escapeXml = (str: string) => {
      return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(baseUrl)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/submit</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/privacy</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/terms</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`

    // Add category pages
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${escapeXml(baseUrl)}/?category=${category.slug}</loc>
    <lastmod>${formatDate(category.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Add individual business pages
    businesses.forEach(business => {
      const businessSlug = createSlug(business.name, business.city, business.state, business.category.name)
      sitemap += `
  <url>
    <loc>${escapeXml(baseUrl)}/${businessSlug}</loc>
    <lastmod>${formatDate(business.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`
    })

    // Add location-based pages (city combinations)
    const locations = new Set<string>()
    businesses.forEach(business => {
      const locationSlug = `${business.city.toLowerCase().replace(/\s+/g, '-')}-${business.state.toLowerCase().replace(/\s+/g, '-')}`
      locations.add(locationSlug)
    })

    locations.forEach(location => {
      const parts = location.split('-')
      const city = parts.slice(0, -1).join('-') // Everything except the last part
      const state = parts[parts.length - 1] // Last part is the state
      sitemap += `
  <url>
    <loc>${escapeXml(baseUrl)}/?city=${city}&amp;state=${state}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}