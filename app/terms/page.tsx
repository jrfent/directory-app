import Header from '@/components/Header'
import { getSiteSettings } from '@/lib/settings'

export default async function TermsOfServicePage() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using this business directory service, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-700 mb-4">
                Our business directory provides a platform for businesses to list their services and for 
                users to discover local businesses. We offer both free browsing and paid listing services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listing Requirements</h2>
              <p className="text-gray-700 mb-4">
                When submitting a business listing, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Provide accurate and truthful information</li>
                <li>Own or have authorization to list the business</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not submit duplicate or spam listings</li>
                <li>Maintain current and accurate business information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Listing fees are charged annually and are non-refundable. Payment is required before 
                listing approval. We reserve the right to modify pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Guidelines</h2>
              <p className="text-gray-700 mb-4">
                All content must be:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Accurate and not misleading</li>
                <li>Appropriate for all audiences</li>
                <li>Free from illegal or harmful content</li>
                <li>Respectful of intellectual property rights</li>
                <li>Compliant with our content policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Submitting false or misleading information</li>
                <li>Attempting to manipulate search results</li>
                <li>Harassing other users or businesses</li>
                <li>Violating any applicable laws</li>
                <li>Interfering with the platform's operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend any listing or user account at our discretion, 
                particularly for violations of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                This service is provided "as is" without warranties of any kind. We do not guarantee 
                the accuracy of business information or the quality of listed services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages arising from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on this 
                page with an updated effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions regarding these terms, please contact us at:
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