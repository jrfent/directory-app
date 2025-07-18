import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLoginForm from '@/components/AdminLoginForm'

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role === 'ADMIN') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}