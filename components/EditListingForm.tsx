'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Business, Category } from '@prisma/client'
import Image from 'next/image'

interface EditListingFormProps {
  business: Business & { category: Category }
  categories: Category[]
}

export default function EditListingForm({ business, categories }: EditListingFormProps) {
  const [formData, setFormData] = useState({
    name: business.name,
    description: business.description,
    city: business.city,
    state: business.state,
    website: business.website || '',
    linkText: business.linkText || '',
    categoryId: business.categoryId,
    thumbnail: null as File | null,
    status: business.status,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, thumbnail: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('state', formData.state)
      formDataToSend.append('website', formData.website)
      formDataToSend.append('linkText', formData.linkText)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('status', formData.status)
      
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail)
      }

      const response = await fetch(`/api/admin/edit-listing/${business.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (response.ok) {
        setMessage('Business listing updated successfully!')
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to update listing')
      }
    } catch (error) {
      console.error('Error updating listing:', error)
      setMessage('Error updating listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Business Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Business Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          value={formData.categoryId}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-1">
          Link Text
        </label>
        <input
          type="text"
          id="linkText"
          name="linkText"
          value={formData.linkText}
          onChange={handleInputChange}
          placeholder="Visit Our Website"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Listing Status *
        </label>
        <select
          id="status"
          name="status"
          required
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDING">Pending Review</option>
          <option value="APPROVED">Approved (Live)</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
          Business Thumbnail Image
        </label>
        
        {business.thumbnail && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current thumbnail:</p>
            <div className="relative w-32 h-24">
              <Image
                src={business.thumbnail}
                alt={business.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        )}
        
        <input
          type="file"
          id="thumbnail"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload a new image to replace the current thumbnail (optional)
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Updating...' : 'Update Listing'}
        </button>
      </div>
    </form>
  )
}