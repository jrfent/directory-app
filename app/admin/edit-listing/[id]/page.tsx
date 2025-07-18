import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/AdminHeader'
import EditListingForm from '@/components/EditListingForm'

interface EditListingPageProps {
  params: {
    id: string
  }
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: {
      category: true,
    },
  })

  if (!business) {
    notFound()
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Business Listing</h1>
            <p className="text-gray-600">
              Update the information for {business.name}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <EditListingForm business={business} categories={categories} />
          </div>
        </div>
      </main>
    </div>
  )
}