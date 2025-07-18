import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminHeader from '@/components/AdminHeader'
import BusinessManagement from '@/components/BusinessManagement'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const businesses = await prisma.business.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const stats = {
    total: businesses.length,
    pending: businesses.filter(b => b.status === 'PENDING').length,
    approved: businesses.filter(b => b.status === 'APPROVED').length,
    expired: businesses.filter(b => b.status === 'EXPIRED').length,
    rejected: businesses.filter(b => b.status === 'REJECTED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Live</h3>
              <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Expired</h3>
              <p className="text-2xl font-semibold text-orange-600">{stats.expired}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <BusinessManagement businesses={businesses} />
      </main>
    </div>
  )
}