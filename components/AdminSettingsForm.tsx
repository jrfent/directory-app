'use client'

import { useState } from 'react'

interface AdminSettingsFormProps {
  settings: Record<string, string>
}

export default function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [formData, setFormData] = useState({
    listing_price: settings.listing_price || '99.00',
    site_name: settings.site_name || 'Business Directory',
    site_url: settings.site_url || 'http://localhost:3000',
    contact_email: settings.contact_email || 'contact@example.com',
    contact_phone: settings.contact_phone || '',
    site_logo: settings.site_logo || '',
    hero_title: settings.hero_title || 'Find Top-Ranked Businesses',
    hero_subtitle: settings.hero_subtitle || 'Discover quality businesses in your area',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, site_logo: data.logoUrl }))
        setMessage('Logo uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      setMessage('Error uploading logo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      console.log('Submitting form data:', formData)
      const response = await fetch('/api/admin/update-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Settings updated successfully!')
        // Force page reload to see changes
        window.location.reload()
      } else {
        setMessage('Error updating settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage('Error updating settings')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-1">
            Site Name
          </label>
          <input
            type="text"
            id="site_name"
            name="site_name"
            value={formData.site_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            The name of your business directory site
          </p>
        </div>

        <div>
          <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 mb-1">
            Site URL
          </label>
          <input
            type="url"
            id="site_url"
            name="site_url"
            value={formData.site_url}
            onChange={handleInputChange}
            placeholder="https://yourdomain.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            The full URL of your site (used for emails, sitemaps, etc.)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              placeholder="contact@yourdomain.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="listing_price" className="block text-sm font-medium text-gray-700 mb-1">
            Listing Price (USD/year)
          </label>
          <input
            type="number"
            id="listing_price"
            name="listing_price"
            step="0.01"
            value={formData.listing_price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="hero_title" className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title (H1)
              </label>
              <input
                type="text"
                id="hero_title"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                The main headline on your homepage
              </p>
            </div>

            <div>
              <label htmlFor="hero_subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle (H2)
              </label>
              <input
                type="text"
                id="hero_subtitle"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                The descriptive text under your main headline
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Site Logo
          </label>
          <div className="space-y-4">
            {formData.site_logo && (
              <div className="flex items-center space-x-4">
                <img 
                  src={formData.site_logo} 
                  alt="Current logo" 
                  className="h-12 w-12 object-contain"
                />
                <span className="text-sm text-gray-600">Current logo</span>
              </div>
            )}
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}