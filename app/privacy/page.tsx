import Header from '@/components/Header'
import { getSiteSettings } from '@/lib/settings'

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                submit a business listing, or contact us. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Business name and description</li>
                <li>Contact information (email, phone number)</li>
                <li>Business location (city, state)</li>
                <li>Website URL and other business details</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process business listing submissions</li>
                <li>Communicate with you about your listings</li>
                <li>Process payments and maintain billing records</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>With service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or sale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of certain communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: <a href={`mailto:${settings.contact_email}`} className="text-blue-600 hover:underline">{settings.contact_email}</a><br />
                {settings.contact_phone && (
                  <>
                    Phone: <a href={`tel:${settings.contact_phone}`} className="text-blue-600 hover:underline">{settings.contact_phone}</a><br />
                  </>
                )}
                Website: <a href={settings.site_url} className="text-blue-600 hover:underline">{settings.site_url}</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}