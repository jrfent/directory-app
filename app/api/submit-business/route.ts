import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(request: NextRequest) {
  try {
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
    const paymentMethod = formData.get('paymentMethod') as string
    const discountCode = formData.get('discountCode') as string
    const thumbnail = formData.get('thumbnail') as File | null

    let thumbnailPath = null
    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filename = `${Date.now()}-${thumbnail.name}`
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
        status: 'PENDING', // Always keep new submissions as pending
      },
    })

    const listingPrice = await prisma.settings.findUnique({
      where: { key: 'listing_price' },
    })
    let price = parseFloat(listingPrice?.value || '99.00')

    // Apply discount code if provided
    if (discountCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { 
          code: discountCode.toUpperCase(),
        },
      })

      if (discount && discount.active && (!discount.expiresAt || discount.expiresAt > new Date())) {
        const discountAmount = price * (discount.discount / 100)
        price = price - discountAmount
      }
    }

    if (paymentMethod === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Business Directory Listing',
                description: `Annual listing for ${name}`,
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/submit/success?business_id=${business.id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/submit`,
        metadata: {
          business_id: business.id,
        },
      })

      return NextResponse.json({ stripeUrl: session.url })
    } else if (paymentMethod === 'paypal') {
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${process.env.PAYPAL_CLIENT_ID}&item_name=Business Directory Listing&amount=${price}&currency_code=USD&custom=${business.id}`
      
      return NextResponse.json({ paypalUrl })
    }

    return NextResponse.json({ success: true, businessId: business.id })
  } catch (error) {
    console.error('Error submitting business:', error)
    return NextResponse.json({ error: 'Failed to submit business' }, { status: 500 })
  }
}