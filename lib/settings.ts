import { prisma } from '@/lib/prisma'

export interface SiteSettings {
  site_name: string
  site_url: string
  contact_email: string
  contact_phone: string
  listing_price: string
  site_logo: string
  hero_title: string
  hero_subtitle: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: ['site_name', 'site_url', 'contact_email', 'contact_phone', 'listing_price', 'site_logo', 'hero_title', 'hero_subtitle']
      }
    }
  })

  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  return {
    site_name: settingsMap.site_name || 'Business Directory',
    site_url: settingsMap.site_url || process.env.NEXTAUTH_URL || 'http://localhost:3000',
    contact_email: settingsMap.contact_email || 'contact@example.com',
    contact_phone: settingsMap.contact_phone || '',
    listing_price: settingsMap.listing_price || '99.00',
    site_logo: settingsMap.site_logo || '',
    hero_title: settingsMap.hero_title || 'Find Top-Ranked Businesses',
    hero_subtitle: settingsMap.hero_subtitle || 'Discover quality businesses in your area',
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const setting = await prisma.settings.findUnique({
    where: { key }
  })
  return setting?.value || null
}