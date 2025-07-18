import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/AdminHeader'
import AdminSettingsForm from '@/components/AdminSettingsForm'
import CategoryManagement from '@/components/CategoryManagement'
import UserManagement from '@/components/UserManagement'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const settings = await prisma.settings.findMany()
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const settingsObj = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
        
        <div className="space-y-8">
          <AdminSettingsForm settings={settingsObj} />
          <CategoryManagement categories={categories} />
          <UserManagement users={users} />
        </div>
      </main>
    </div>
  )
}