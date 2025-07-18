import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/AdminHeader'
import DiscountCodeManagement from '@/components/DiscountCodeManagement'

export default async function DiscountCodesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  let discountCodes: any[] = []
  try {
    discountCodes = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching discount codes:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Discount Code Management</h1>
          <DiscountCodeManagement discountCodes={discountCodes} />
        </div>
      </div>
    </div>
  )
}