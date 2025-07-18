import Link from 'next/link'
import { getSiteSettings } from '@/lib/settings'

export default async function Footer() {
  const settings = await getSiteSettings()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{settings.site_name}</h3>
            <p className="text-gray-400">
              Find quality businesses in your area and help your business get discovered.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/submit" className="hover:text-white">Submit Business</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href={`mailto:${settings.contact_email}`} className="hover:text-white">Contact Support</a></li>
              {settings.contact_phone && (
                <li><a href={`tel:${settings.contact_phone}`} className="hover:text-white">{settings.contact_phone}</a></li>
              )}
              <li><Link href="/admin" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}