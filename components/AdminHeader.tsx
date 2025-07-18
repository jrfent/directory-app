import Link from 'next/link'
import { signOut } from 'next-auth/react'
import AdminLogoutButton from './AdminLogoutButton'

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/add-listing" className="text-gray-600 hover:text-gray-900">
                Add Listing
              </Link>
              <Link href="/admin/discount-codes" className="text-gray-600 hover:text-gray-900">
                Discount Codes
              </Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
            </nav>
          </div>
          
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  )
}