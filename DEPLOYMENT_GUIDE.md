# AWS Lightsail Ubuntu 24 Deployment Guide

This guide will help you deploy your Business Directory app to an AWS Lightsail instance running Ubuntu 24.04 LTS.

## Prerequisites

- AWS account with Lightsail access
- Domain name (optional but recommended)
- Basic knowledge of Linux command line
- SSH key pair for secure access

## Step 1: Create Lightsail Instance

### 1.1 Launch Instance
1. **Log into AWS Lightsail**: https://lightsail.aws.amazon.com
2. **Create Instance**:
   - **Platform**: Linux/Unix
   - **Blueprint**: Ubuntu 24.04 LTS
   - **Instance Plan**: $10/month (2 GB RAM, 1 vCPU) minimum recommended
   - **Instance Name**: `business-directory-app`
3. **Configure Networking**:
   - Create static IP address
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (Node.js)

### 1.2 Connect to Instance
```bash
# Download your SSH key from Lightsail console
# Connect to your instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_STATIC_IP
```

## Step 2: Server Setup

### 2.1 Update System
```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip build-essential
```

### 2.2 Install Node.js
```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.3 Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Set PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### 2.4 Install Nginx (Reverse Proxy)
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Deploy Application

### 3.1 Clone Repository
```bash
# Navigate to home directory
cd /home/ubuntu

# Clone your repository (replace with your Git URL)
git clone https://github.com/yourusername/directory-app.git
cd directory-app
```

### 3.2 Environment Configuration
```bash
# Create production environment file
nano .env
```

Add the following configuration:
```env
# Database
DATABASE_URL="file:./production.db"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-here-32-characters-minimum"

# PayPal Configuration
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# Email Configuration (optional)
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="your-email@yourdomain.com"
SMTP_PASSWORD="your-email-password"

# Node Environment
NODE_ENV="production"
```

### 3.3 Install Dependencies and Build
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Build the application
npm run build

# Setup database
npm run db:push

# Seed initial data (creates admin user)
npm run db:seed

# Optional: Create demo listings
npm run db:demo
```

### 3.4 Create Upload Directory
```bash
# Create uploads directory with proper permissions
mkdir -p public/uploads
chmod 755 public/uploads
```

## Step 4: PayPal Setup

### 4.1 PayPal Business Account
1. **Create PayPal Business Account**: https://www.paypal.com/business
2. **Access Developer Portal**: https://developer.paypal.com
3. **Create Live Application**:
   - App Name: "Business Directory"
   - Merchant: Your business account
   - Features: Accept payments, PayPal checkout
4. **Get Credentials**:
   - Copy Client ID and Client Secret
   - Update your `.env` file

### 4.2 Configure Return URLs
In PayPal app settings, set return URLs:
- **Return URL**: `https://yourdomain.com/submit/success`
- **Cancel URL**: `https://yourdomain.com/submit`

## Step 5: Configure PM2

### 5.1 Create PM2 Configuration
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'business-directory',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/directory-app',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/logs/app.err.log',
    out_file: '/home/ubuntu/logs/app.out.log',
    log_file: '/home/ubuntu/logs/app.log',
    time: true
  }]
};
```

### 5.2 Create Log Directory
```bash
# Create logs directory
mkdir -p /home/ubuntu/logs
```

### 5.3 Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs business-directory
```

## Step 6: Configure Nginx

### 6.1 Create Nginx Configuration
```bash
# Create nginx site configuration
sudo nano /etc/nginx/sites-available/business-directory
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (to be added after SSL setup)
    # ssl_certificate /etc/ssl/certs/yourdomain.crt;
    # ssl_certificate_key /etc/ssl/private/yourdomain.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # File upload limit
    client_max_body_size 10M;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # Handle uploads directory
    location /uploads/ {
        alias /home/ubuntu/directory-app/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/business-directory /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 7: SSL Setup with Let's Encrypt

### 7.1 Install Certbot
```bash
# Install snapd (if not already installed)
sudo apt install -y snapd

# Install certbot
sudo snap install --classic certbot

# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 7.2 Obtain SSL Certificate
```bash
# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### 7.3 Update Environment
```bash
# Update your .env file with HTTPS URL
nano .env
```

Update the NEXTAUTH_URL:
```env
NEXTAUTH_URL="https://yourdomain.com"
```

Restart the application:
```bash
pm2 restart business-directory
```

## Step 8: Domain Configuration

### 8.1 DNS Setup
In your domain registrar's DNS settings:
- **A Record**: `@` → Your Lightsail static IP
- **A Record**: `www` → Your Lightsail static IP

### 8.2 Lightsail DNS Zone (Optional)
1. Create DNS zone in Lightsail
2. Update nameservers at your domain registrar
3. Add A records pointing to your static IP

## Step 9: Admin Configuration

### 9.1 Initial Admin Setup
1. **Default Admin Credentials**:
   - Email: `superadmin@admin.com`
   - Password: `Tdnw1#cejr`
2. **IMPORTANT**: Change password immediately after first login

### 9.2 Site Configuration
Navigate to `https://yourdomain.com/admin/settings`:
- **Site Name**: Your business directory name
- **Site URL**: `https://yourdomain.com`
- **Contact Email**: Your business email
- **Contact Phone**: Your business phone
- **Site Logo**: Upload your logo
- **Listing Price**: Set annual listing fee

## Step 10: Monitoring and Maintenance

### 10.1 Setup Log Rotation
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/business-directory
```

Add:
```
/home/ubuntu/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reload business-directory
    endscript
}
```

### 10.2 Setup Monitoring
```bash
# Install htop for system monitoring
sudo apt install -y htop

# Monitor PM2 processes
pm2 monit

# Check system resources
htop
```

### 10.3 Database Backup Script
```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp /home/ubuntu/directory-app/prisma/dev.db $BACKUP_DIR/database_backup_$DATE.db

# Keep only last 7 backups
find $BACKUP_DIR -name "database_backup_*.db" -type f -mtime +7 -delete
```

Make executable and add to cron:
```bash
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab (daily backup at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/ubuntu/backup-db.sh
```

## Step 11: Security Hardening

### 11.1 Firewall Configuration
```bash
# Install and configure UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Check status
sudo ufw status
```

### 11.2 Fail2Ban (Optional)
```bash
# Install fail2ban for SSH protection
sudo apt install -y fail2ban

# Configure fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 11.3 Automatic Security Updates
```bash
# Install unattended upgrades
sudo apt install -y unattended-upgrades

# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Step 12: Testing Checklist

### 12.1 Application Testing
- [ ] Website loads at your domain
- [ ] SSL certificate is valid
- [ ] Business submission form works
- [ ] PayPal payment flow works
- [ ] Admin login works
- [ ] File uploads work
- [ ] Search functionality works
- [ ] Mobile responsiveness

### 12.2 Server Testing
- [ ] PM2 process is running
- [ ] Nginx is serving requests
- [ ] SSL redirects work
- [ ] Logs are being written
- [ ] Database backups work

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check PM2 logs
pm2 logs business-directory

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart business-directory
```

**Nginx errors:**
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

**SSL certificate issues:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check nginx SSL configuration
sudo nginx -t
```

**Database issues:**
```bash
# Check database file permissions
ls -la prisma/dev.db

# Regenerate Prisma client
npm run db:generate

# Reset database (DANGER: loses data)
npm run db:push --force-reset
```

## Useful Commands

```bash
# PM2 commands
pm2 status                    # Check application status
pm2 logs business-directory   # View logs
pm2 restart business-directory # Restart app
pm2 stop business-directory   # Stop app
pm2 delete business-directory # Delete app from PM2

# System monitoring
htop                          # System resources
pm2 monit                     # PM2 monitoring
sudo systemctl status nginx  # Nginx status
sudo ufw status              # Firewall status

# Log files
tail -f /home/ubuntu/logs/app.log        # Application logs
sudo tail -f /var/log/nginx/access.log   # Nginx access logs
sudo tail -f /var/log/nginx/error.log    # Nginx error logs
```

## Support Resources

- **AWS Lightsail Documentation**: https://docs.aws.amazon.com/lightsail/
- **Ubuntu 24.04 Documentation**: https://help.ubuntu.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **PayPal Developer**: https://developer.paypal.com/docs/

---

## Quick Deployment Commands

```bash
# After connecting to server:
cd /home/ubuntu/directory-app
git pull origin main          # Update code
npm install                   # Install dependencies
npm run build                 # Build application
pm2 restart business-directory # Restart app
```

Good luck with your AWS Lightsail deployment! 🚀