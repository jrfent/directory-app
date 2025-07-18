import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, description, discount, expiresAt } = await request.json()

    if (!code || !discount) {
      return NextResponse.json({ error: 'Code and discount are required' }, { status: 400 })
    }

    const discountCode = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discount: parseFloat(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(discountCode)
  } catch (error) {
    console.error('Error creating discount code:', error)
    return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const discountCodes = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(discountCodes)
  } catch (error) {
    console.error('Error fetching discount codes:', error)
    return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 })
  }
}