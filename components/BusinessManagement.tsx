'use client'

import { useState } from 'react'
import { Business, Category } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

interface BusinessManagementProps {
  businesses: (Business & { category: Category })[]
}

export default function BusinessManagement({ businesses: initialBusinesses }: BusinessManagementProps) {
  const [businesses, setBusinesses] = useState(initialBusinesses)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'expired' | 'rejected'>('all')

  const filteredBusinesses = businesses.filter(business => {
    if (filter === 'all') return true
    return business.status === filter.toUpperCase()
  })

  const updateBusinessStatus = async (businessId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/update-business-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId, status }),
      })

      if (response.ok) {
        setBusinesses(prev => 
          prev.map(business => 
            business.id === businessId 
              ? { ...business, status: status as any }
              : business
          )
        )
      }
    } catch (error) {
      console.error('Error updating business status:', error)
    }
  }

  const deleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return

    try {
      const response = await fetch('/api/admin/delete-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      })

      if (response.ok) {
        setBusinesses(prev => prev.filter(business => business.id !== businessId))
      }
    } catch (error) {
      console.error('Error deleting business:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Business Listings</h2>
          
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'expired', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBusinesses.map((business) => (
              <tr key={business.id}>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      {business.thumbnail ? (
                        <Image
                          src={business.thumbnail}
                          alt={business.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium text-sm">
                            {business.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {business.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {business.description.substring(0, 40)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-900">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {business.category.name}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-900">
                  <div className="text-xs">
                    {business.city}<br />
                    {business.state}
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    business.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {business.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-1">
                    {business.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateBusinessStatus(business.id, 'APPROVED')}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => updateBusinessStatus(business.id, 'REJECTED')}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    {business.status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs hover:bg-yellow-200 transition-colors"
                          title="Unpublish"
                        >
                          ⏸
                        </button>
                        <button
                          onClick={() => updateBusinessStatus(business.id, 'EXPIRED')}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                          title="Expire"
                        >
                          ⏰
                        </button>
                      </>
                    )}
                    {business.status === 'REJECTED' && (
                      <button
                        onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                        title="Review Again"
                      >
                        ↺
                      </button>
                    )}
                    {business.status === 'EXPIRED' && (
                      <button
                        onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                        title="Renew"
                      >
                        ↺
                      </button>
                    )}
                    <Link
                      href={`/admin/edit-listing/${business.id}`}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => deleteBusiness(business.id)}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden">
        <div className="space-y-4 p-4">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {business.thumbnail ? (
                      <Image
                        src={business.thumbnail}
                        alt={business.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {business.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {business.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {business.category.name} • {business.city}, {business.state}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  business.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {business.status.toLowerCase()}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 mb-3">
                {business.description.substring(0, 100)}...
              </div>
              
              <div className="flex flex-wrap gap-2">
                {business.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateBusinessStatus(business.id, 'APPROVED')}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateBusinessStatus(business.id, 'REJECTED')}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                {business.status === 'APPROVED' && (
                  <>
                    <button
                      onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
                    >
                      ⏸ Unpublish
                    </button>
                    <button
                      onClick={() => updateBusinessStatus(business.id, 'EXPIRED')}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      ⏰ Expire
                    </button>
                  </>
                )}
                {business.status === 'REJECTED' && (
                  <button
                    onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    ↺ Review Again
                  </button>
                )}
                {business.status === 'EXPIRED' && (
                  <button
                    onClick={() => updateBusinessStatus(business.id, 'PENDING')}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    ↺ Renew
                  </button>
                )}
                <Link
                  href={`/admin/edit-listing/${business.id}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => deleteBusiness(business.id)}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}