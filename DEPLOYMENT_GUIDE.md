# Production Deployment Guide

This guide will help you deploy your Business Directory app to a production Plesk server and set up payment processing.

## Prerequisites

- Plesk hosting account with Node.js support
- Domain name configured in Plesk
- SSL certificate installed
- Access to Plesk control panel

## Step 1: Server Requirements

### Plesk Server Setup
1. **Enable Node.js** in Plesk for your domain
2. **Node.js Version**: Ensure Node.js 18.x or higher is available
3. **Database**: SQLite is included (or upgrade to PostgreSQL/MySQL if needed)
4. **File Upload**: Ensure file upload limits are appropriate (recommend 10MB+)

### Required Plesk Extensions
- Node.js support
- Git support (if using Git deployment)
- Let's Encrypt (for SSL)

## Step 2: Environment Setup

### 2.1 Create Production Environment File
Create a `.env` file in your project root:

```env
# Database
DATABASE_URL="file:./production.db"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-here-32-characters-minimum"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# PayPal Configuration (optional)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# Email Configuration (optional - for notifications)
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="your-email@yourdomain.com"
SMTP_PASSWORD="your-email-password"

# Node Environment
NODE_ENV="production"
```

### 2.2 Security Considerations
- Generate a strong `NEXTAUTH_SECRET` (32+ characters)
- Use environment variables for all sensitive data
- Never commit `.env` files to version control

## Step 3: Payment Processing Setup

### 3.1 Stripe Setup (Primary Payment Method)

#### Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Create a business account
3. Complete business verification
4. Get your live API keys

#### Stripe Configuration
1. **API Keys**: Get your live secret and publishable keys
2. **Webhooks**: Configure webhook endpoint at `https://yourdomain.com/api/webhooks/stripe`
3. **Webhook Events**: Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

#### Webhook Setup
1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events listed above
4. Copy the webhook secret to your `.env` file

### 3.2 PayPal Setup (Optional Secondary Method)

#### PayPal Business Account
1. Create PayPal Business account
2. Go to [PayPal Developer](https://developer.paypal.com)
3. Create a live app
4. Get Client ID and Client Secret

#### PayPal Configuration
- Add PayPal credentials to `.env` file
- PayPal integration uses their standard checkout flow

## Step 4: Database Setup

### 4.1 Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed

# Create demo listings (optional)
npm run db:demo
```

### 4.2 Database Backup Strategy
- Regular backups of `production.db`
- Consider upgrading to PostgreSQL for production
- Set up automated backups in Plesk

## Step 5: File Upload Configuration

### 5.1 Upload Directory
Ensure the `public/uploads` directory exists and is writable:
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### 5.2 File Upload Limits
Configure in Plesk:
- PHP upload limit: 10MB+
- Node.js memory limit: 512MB+
- Disk space: Adequate for business logos

## Step 6: Deployment to Plesk

### 6.1 Upload Files
**Option A: Direct Upload**
1. Compress your project files (exclude `node_modules` and `.git`)
2. Upload via Plesk File Manager
3. Extract in your domain's root directory

**Option B: Git Deployment**
1. Push code to Git repository
2. Use Plesk Git integration
3. Configure auto-deployment

### 6.2 Install Dependencies
In Plesk Node.js settings:
```bash
npm install
```

### 6.3 Build the Application
```bash
npm run build
```

### 6.4 Configure Plesk Node.js
1. **Application Root**: `/httpdocs` (or your domain root)
2. **Application Startup File**: `server.js` or use Next.js start script
3. **Environment**: Production
4. **Node.js Version**: 18.x or higher

## Step 7: SSL and Security

### 7.1 SSL Certificate
1. Install SSL certificate (Let's Encrypt recommended)
2. Force HTTPS redirects
3. Update `NEXTAUTH_URL` to use `https://`

### 7.2 Security Headers
Add to your Plesk Apache/Nginx configuration:
```
# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

## Step 8: Admin Configuration

### 8.1 Initial Admin Setup
1. Run the seed script to create admin user
2. Login credentials:
   - Email: `superadmin@admin.com`
   - Password: `Tdnw1#cejr`
3. **IMPORTANT**: Change admin password immediately after first login

### 8.2 Site Configuration
Navigate to `/admin/settings` and configure:
- **Site Name**: Your business directory name
- **Site URL**: Your production domain (https://yourdomain.com)
- **Contact Email**: Your business email
- **Contact Phone**: Your business phone (optional)
- **Site Logo**: Upload your logo
- **Listing Price**: Set your annual listing fee

## Step 9: Testing

### 9.1 Payment Testing
1. **Test with Stripe**: Use test cards (4242 4242 4242 4242)
2. **Test PayPal**: Use PayPal sandbox initially
3. **Verify Webhooks**: Check webhook delivery in Stripe dashboard

### 9.2 Functionality Testing
- [ ] Business listing submission
- [ ] Payment processing
- [ ] Admin approval workflow
- [ ] Email notifications
- [ ] Search functionality
- [ ] Mobile responsiveness

## Step 10: Monitoring and Maintenance

### 10.1 Error Monitoring
- Monitor Plesk logs for errors
- Set up uptime monitoring
- Configure error notifications

### 10.2 Regular Maintenance
- Database backups
- Security updates
- Performance monitoring
- Content moderation

## Step 11: Going Live Checklist

### Pre-Launch
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Payment processing tested
- [ ] Admin account secured
- [ ] Site settings configured
- [ ] Database seeded
- [ ] Error pages working
- [ ] Contact forms working
- [ ] Search functionality working

### Launch Day
- [ ] Switch to live payment keys
- [ ] Update DNS if needed
- [ ] Test all critical paths
- [ ] Monitor for errors
- [ ] Backup database

### Post-Launch
- [ ] Monitor payment processing
- [ ] Check webhook deliveries
- [ ] Review error logs
- [ ] Test user registration flow
- [ ] Monitor site performance

## Troubleshooting Common Issues

### Payment Issues
- **Stripe payments failing**: Check webhook configuration
- **PayPal redirects not working**: Verify return URLs
- **Invalid signatures**: Regenerate webhook secrets

### Database Issues
- **Connection errors**: Check file permissions
- **Migration failures**: Run prisma generate and db:push
- **Seeding issues**: Check for existing data conflicts

### File Upload Issues
- **Images not displaying**: Check file permissions and paths
- **Upload failures**: Verify upload directory exists and is writable
- **Size limits**: Adjust Plesk file upload limits

## Support Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)
- [Stripe Integration](https://stripe.com/docs)
- [Plesk Node.js](https://docs.plesk.com/en-US/obsidian/administrator-guide/website-management/nodejs/)

### Emergency Contacts
- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- Plesk Support: [https://support.plesk.com](https://support.plesk.com)
- PayPal Support: [https://www.paypal.com/us/smarthelp/contact-us](https://www.paypal.com/us/smarthelp/contact-us)

## Security Best Practices

1. **Regular Updates**: Keep dependencies updated
2. **Strong Passwords**: Use complex passwords for admin accounts
3. **Database Security**: Regular backups and access controls
4. **File Permissions**: Proper file and directory permissions
5. **Error Handling**: Don't expose sensitive information in errors
6. **Rate Limiting**: Implement rate limiting for API endpoints
7. **Content Validation**: Sanitize all user inputs

## Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Database Optimization**: Index frequently queried fields
3. **Caching**: Implement appropriate caching strategies
4. **CDN**: Consider using a CDN for static assets
5. **Monitoring**: Set up performance monitoring

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Generate database client
npm run db:generate

# Setup database
npm run db:push

# Seed initial data
npm run db:seed

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables Template

```env
DATABASE_URL="file:./production.db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-32-character-secret-here"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NODE_ENV="production"
```

Good luck with your deployment! 🚀