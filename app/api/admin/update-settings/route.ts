import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listing_price, site_name, site_url, contact_email, contact_phone, site_logo, hero_title, hero_subtitle } = await request.json()

    const settingsToUpdate = [
      { key: 'listing_price', value: listing_price },
      { key: 'site_name', value: site_name },
      { key: 'site_url', value: site_url },
      { key: 'contact_email', value: contact_email },
      { key: 'contact_phone', value: contact_phone },
      { key: 'site_logo', value: site_logo },
      { key: 'hero_title', value: hero_title },
      { key: 'hero_subtitle', value: hero_subtitle },
    ]

    for (const setting of settingsToUpdate) {
      await prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value,
          description: `${setting.key.replace('_', ' ')} setting`,
        },
      })
    }

    // Revalidate the home page to clear cached data
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}