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

    const { businessId, status } = await request.json()

    const business = await prisma.business.update({
      where: { id: businessId },
      data: { 
        status,
        ...(status === 'APPROVED' && { paidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }) // 1 year from now
      },
    })

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Error updating business status:', error)
    return NextResponse.json({ error: 'Failed to update business status' }, { status: 500 })
  }
}