# Testing Guide - Demo Business Listings

## 🎯 **10 Demo Listings Created Successfully!**

Your business directory now has 10 demo listings across different categories and locations for comprehensive testing.

## 📋 **Demo Listings Overview**

| Business Name | Category | City | State | Website |
|---------------|----------|------|-------|---------|
| Tony's Pizza Palace | Restaurants | Las Vegas | Nevada | https://tonys-pizza-palace.com |
| Superior Hood Cleaning | Services | Las Vegas | Nevada | https://superior-hood-cleaning.com |
| TechFix Computer Repair | Technology | Austin | Texas | https://techfix-austin.com |
| Sunset Fitness Gym | Health & Fitness | Miami | Florida | https://sunset-fitness.com |
| Downtown Auto Repair | Automotive | Denver | Colorado | https://downtown-auto-denver.com |
| Bloom Garden Center | Home & Garden | Portland | Oregon | https://bloom-garden-center.com |
| Smith & Associates Law Firm | Professional Services | Chicago | Illinois | https://smith-associates-law.com |
| Fashion Forward Boutique | Retail | Seattle | Washington | https://fashion-forward-boutique.com |
| Metro Real Estate Group | Real Estate | Atlanta | Georgia | https://metro-real-estate.com |
| Star Cinema Complex | Entertainment | Phoenix | Arizona | https://star-cinema-complex.com |

## 🧪 **Testing Scenarios**

### 1. **Homepage Functionality**
- **URL:** http://localhost:3000
- **Test:** View all 10 listings displayed in a grid layout
- **Expected:** Clean, responsive cards with business info

### 2. **Search by Category**
- **URL:** http://localhost:3000/?category=restaurants
- **Test:** Filter by "Restaurants" category
- **Expected:** Shows Tony's Pizza Palace only

- **URL:** http://localhost:3000/?category=technology
- **Test:** Filter by "Technology" category
- **Expected:** Shows TechFix Computer Repair only

### 3. **Search by City**
- **URL:** http://localhost:3000/?city=las-vegas
- **Test:** Filter by "Las Vegas" city
- **Expected:** Shows both Tony's Pizza Palace and Superior Hood Cleaning

- **URL:** http://localhost:3000/?city=austin
- **Test:** Filter by "Austin" city
- **Expected:** Shows TechFix Computer Repair only

### 4. **Search by State**
- **URL:** http://localhost:3000/?state=nevada
- **Test:** Filter by "Nevada" state
- **Expected:** Shows both Las Vegas businesses

- **URL:** http://localhost:3000/?state=texas
- **Test:** Filter by "Texas" state
- **Expected:** Shows TechFix Computer Repair only

### 5. **Combined Search**
- **URL:** http://localhost:3000/?category=services&city=las-vegas
- **Test:** Filter by category AND city
- **Expected:** Shows Superior Hood Cleaning only

### 6. **SEO-Friendly Business URLs**
Test these individual business page URLs:

- **Tony's Pizza Palace:** http://localhost:3000/las-vegas-nevada/restaurants/tonys-pizza-palace
- **Superior Hood Cleaning:** http://localhost:3000/las-vegas-nevada/services/superior-hood-cleaning
- **TechFix Computer Repair:** http://localhost:3000/austin-texas/technology/techfix-computer-repair
- **Sunset Fitness Gym:** http://localhost:3000/miami-florida/health-fitness/sunset-fitness-gym
- **Downtown Auto Repair:** http://localhost:3000/denver-colorado/automotive/downtown-auto-repair

**Expected:** Each URL shows a detailed business page with full description, contact info, and website link.

### 7. **Admin Panel Testing**
- **URL:** http://localhost:3000/admin/login
- **Login:** superadmin@admin.com / Tdnw1#cejr
- **Test Dashboard:** View all 10 listings in admin panel
- **Test Management:** Try approving/rejecting/deleting listings

### 8. **Sitemap Testing**
- **URL:** http://localhost:3000/sitemap.xml
- **Test:** Verify sitemap includes all demo business URLs
- **Expected:** XML sitemap with all 10 business URLs in SEO-friendly format

### 9. **Mobile Responsiveness**
- **Test:** Resize browser window or use mobile device
- **Expected:** All layouts adapt properly to different screen sizes

### 10. **Business Submission Flow**
- **URL:** http://localhost:3000/submit
- **Test:** Submit a new business listing
- **Expected:** Form validation, payment options, success page

## 🔄 **Reset Demo Data**

If you need to reset or recreate demo data:

```bash
# Delete existing demo data (optional)
rm prisma/dev.db

# Recreate database and seed
npm run db:push
npm run db:seed
npm run db:demo
```

## 📊 **Performance Testing**

- **Load Time:** All pages should load within 2 seconds
- **Search Performance:** Filtering should be instant
- **Database Queries:** Check console for efficient queries
- **Image Loading:** Test with and without business thumbnails

## 🎨 **Visual Testing**

- **Typography:** Check font consistency and readability
- **Colors:** Verify color scheme and contrast
- **Spacing:** Ensure proper margins and padding
- **Buttons:** Test hover states and click feedback
- **Forms:** Verify form styling and validation messages

## 🔒 **Security Testing**

- **Admin Access:** Verify non-admin users can't access admin pages
- **Data Validation:** Test form inputs with invalid data
- **File Upload:** Test thumbnail upload with various file types
- **SQL Injection:** Basic security testing on search forms

## 🌐 **Cross-Browser Testing**

Test the application in:
- Chrome
- Firefox
- Safari
- Edge

All features should work consistently across browsers.

---

## 🚀 **Quick Start Testing**

1. Open http://localhost:3000
2. Browse the 10 demo listings
3. Test search filters
4. Click on a business to view details
5. Test admin login and management
6. Try submitting a new business

**Everything should work smoothly with the demo data!**