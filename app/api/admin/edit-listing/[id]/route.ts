import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const status = formData.get('status') as string
    const thumbnail = formData.get('thumbnail') as File | null

    if (!name || !description || !city || !state || !categoryId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id }
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    let thumbnailPath = existingBusiness.thumbnail

    // Handle new thumbnail upload
    if (thumbnail && thumbnail.size > 0) {
      const bytes = await thumbnail.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filename = `edit-${Date.now()}-${thumbnail.name}`
      const filepath = join(process.cwd(), 'public/uploads', filename)
      
      try {
        await writeFile(filepath, buffer)
        thumbnailPath = `/uploads/${filename}`
      } catch (error) {
        console.error('Error saving file:', error)
      }
    }

    // Generate new slug if name changed
    let slug = existingBusiness.slug
    if (name !== existingBusiness.name) {
      slug = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`
    }

    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
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
        status,
        thumbnail: thumbnailPath,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      business: updatedBusiness
    })
  } catch (error) {
    console.error('Error updating business listing:', error)
    return NextResponse.json({ error: 'Failed to update business listing' }, { status: 500 })
  }
}