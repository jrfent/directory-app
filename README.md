# Business Directory App

A comprehensive business directory application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Visit http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## 🔐 Admin Credentials

- **Email:** superadmin@admin.com
- **Password:** Tdnw1#cejr

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── submit/            # Business submission
│   └── [city]-[state]/    # SEO-friendly business URLs
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── scripts/              # Database seeding scripts
```

## ✨ Features

### Core Functionality
- ✅ Business listings with search and filters
- ✅ SEO-friendly URLs (city-state/category/business-name)
- ✅ Business submission with payment integration
- ✅ Admin authentication and management
- ✅ Dynamic sitemap.xml generation
- ✅ Responsive design

### Admin Features
- ✅ Business listing management (approve/reject/delete)
- ✅ Category management
- ✅ User management
- ✅ Settings configuration (pricing, logo)
- ✅ Statistics dashboard

### Payment Integration
- ✅ Stripe payment processing
- ✅ PayPal payment option
- ✅ Annual renewal system
- ✅ Payment tracking

## 🛠 Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Payment:** Stripe & PayPal
- **File Upload:** Native Next.js API

## 📄 Available Pages

- **Homepage:** http://localhost:3000
- **Submit Business:** http://localhost:3000/submit
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin
- **Admin Settings:** http://localhost:3000/admin/settings
- **Privacy Policy:** http://localhost:3000/privacy
- **Terms of Service:** http://localhost:3000/terms
- **Sitemap:** http://localhost:3000/sitemap.xml

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
```

### Database Commands

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed database with initial data
npm run db:seed
```

## 🎯 Usage

1. **Browse Businesses:** Visit the homepage to search and filter businesses
2. **Submit Business:** Use the submission form to add new businesses
3. **Admin Management:** Login to approve/reject submissions and manage the directory
4. **SEO Optimization:** Business pages have SEO-friendly URLs and metadata

## 🚀 Production Deployment

1. Update environment variables for production
2. Configure a production database (PostgreSQL recommended)
3. Set up proper payment processing credentials
4. Deploy to your preferred hosting platform

## 📝 Notes

- The application uses SQLite for development (easily upgradeable to PostgreSQL)
- Payment integration requires valid Stripe/PayPal credentials
- Admin approval is required for all business listings
- All uploads are stored in the `public/uploads` directory