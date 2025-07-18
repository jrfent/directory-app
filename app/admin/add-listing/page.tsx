import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/AdminHeader'
import AdminListingForm from '@/components/AdminListingForm'

export default async function AdminAddListingPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Complimentary Listing</h1>
            <p className="text-gray-600">
              Create a complimentary business listing that will be automatically approved.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <AdminListingForm categories={categories} />
          </div>
        </div>
      </main>
    </div>
  )
}