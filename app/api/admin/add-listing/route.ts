import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const address = formData.get('address') as string
    const zipCode = formData.get('zipCode') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string
    const linkText = formData.get('linkText') as string
    const openingHours = formData.get('openingHours') as string
    const priceRange = formData.get('priceRange') as string
    const categoryId = formData.get('categoryId') as string
    const thumbnail = formData.get('thumbnail') as File | null

    if (!name || !description || !city || !state || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let thumbnailPath = null
    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filename = `admin-${Date.now()}-${thumbnail.name}`
      const filepath = join(process.cwd(), 'public/uploads', filename)
      
      try {
        await writeFile(filepath, buffer)
        thumbnailPath = `/uploads/${filename}`
      } catch (error) {
        console.error('Error saving file:', error)
      }
    }

    const slug = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        city,
        state,
        address: address || null,
        zipCode: zipCode || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        linkText: linkText || null,
        openingHours: openingHours || null,
        priceRange: priceRange || null,
        categoryId,
        thumbnail: thumbnailPath,
        status: 'APPROVED', // Complimentary listings are automatically approved
        paidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    })

    return NextResponse.json({ 
      success: true, 
      business: {
        id: business.id,
        name: business.name,
        status: business.status
      }
    })
  } catch (error) {
    console.error('Error creating admin listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}