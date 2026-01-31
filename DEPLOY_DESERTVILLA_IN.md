# 🚀 Deploy desertvilla.in - Complete Guide

## Stack:
- **Frontend:** Vercel (desertvilla.in)
- **Backend:** Render (api.desertvilla.in)
- **Database:** Aiven (Free MySQL)

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Domain: desertvilla.in (you have this ✅)
- [ ] Razorpay account with API keys
- [ ] Email for signups

---

## STEP 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub (go to github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/desert-villa.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Setup Database (Aiven)

### 2.1 Create Account
1. Go to https://aiven.io
2. Click "Sign up" → Sign up with Google/GitHub
3. Select "Free trial" (no credit card required)

### 2.2 Create MySQL Service
1. Click "Create service"
2. Select **MySQL**
3. Choose plan: **Hobbyist** (FREE)
4. Select cloud: **Google Cloud**
5. Select region: **asia-south1** (Mumbai, India)
6. Service name: `desertvilla-mysql`
7. Click "Create service"
8. Wait 5-10 minutes for service to start

### 2.3 Get Connection Details
1. Once service is running, click on it
2. Go to "Overview" tab
3. Copy these details:
   - **Host** (Service URI hostname)
   - **Port** (usually 3306)
   - **User** (usually `avnadmin`)
   - **Password** (click eye icon to reveal)
   - **Database** (usually `defaultdb`)

### 2.4 Create Tables
1. Click "Query editor" tab (or use MySQL Workbench)
2. Connect using the credentials above
3. Run your database schema:

```sql
-- Copy and paste your entire database schema here
-- (All CREATE TABLE statements)
```

**Alternative:** Use MySQL Workbench or any MySQL client to connect and import your schema.

---

## STEP 3: Deploy Backend (Render)

### 3.1 Create Account
1. Go to https://render.com
2. Sign up with GitHub

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `desertvilla-backend`
   - **Region:** Singapore (closest to India)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

### 3.3 Add Environment Variables
Click "Environment" tab and add:

```
NODE_ENV=production
PORT=10000

# Aiven MySQL Database
DB_HOST=your-service-name.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
DB_PORT=3306

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Admin Credentials
ADMIN_EMAIL=admin@desertvilla.in
ADMIN_PASSWORD=YourSecurePassword123!

# CORS (add your domain)
FRONTEND_URL=https://desertvilla.in
```

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://desertvilla-backend.onrender.com`

### 3.5 Add Custom Domain (Optional)
1. Go to "Settings" → "Custom Domain"
2. Add: `api.desertvilla.in`
3. You'll get a CNAME record to add to your DNS

---

## STEP 4: Deploy Frontend (Vercel)

### 4.1 Create Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 4.3 Add Environment Variables
Click "Environment Variables" and add:

```
VITE_API_URL=https://desertvilla-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://desert-villa.vercel.app`

---

## STEP 5: Connect Your Domain (desertvilla.in)

### 5.1 Add Domain to Vercel
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add domain: `desertvilla.in`
4. Also add: `www.desertvilla.in`

### 5.2 Update DNS Records
Go to your domain registrar (where you bought desertvilla.in) and add these DNS records:

**For main domain:**
```
Type    Name    Value                           TTL
A       @       76.76.21.21                     3600
CNAME   www     cname.vercel-dns.com           3600
```

**For API (if using custom domain on Render):**
```
Type    Name    Value                                       TTL
CNAME   api     desertvilla-backend.onrender.com           3600
```

### 5.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Can take up to 24 hours
- Check status: https://dnschecker.org

---

## STEP 6: Update Frontend API URL

Once your custom domain is working, update the environment variable:

1. Go to Vercel project → "Settings" → "Environment Variables"
2. Update `VITE_API_URL`:
   - If using custom domain: `https://api.desertvilla.in/api`
   - If using Render URL: `https://desertvilla-backend.onrender.com/api`
3. Redeploy: Go to "Deployments" → Click "..." → "Redeploy"

---

## STEP 7: Configure Razorpay Webhook

1. Go to Razorpay Dashboard
2. Settings → Webhooks
3. Add webhook URL:
   - `https://api.desertvilla.in/api/orders/webhook` (or your Render URL)
4. Select events:
   - `payment.captured`
   - `payment.failed`
5. Copy webhook secret and add to Render environment variables:
   ```
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

---

## STEP 8: Test Everything

### Test Checklist:
- [ ] Visit https://desertvilla.in
- [ ] Browse menu items
- [ ] Add items to cart
- [ ] Place a test order
- [ ] Test payment (use Razorpay test cards)
- [ ] Check admin login: https://desertvilla.in/admin/login
- [ ] Test hall booking
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Using strong JWT secret (32+ characters)
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] Environment variables set correctly
- [ ] Database credentials secure
- [ ] Razorpay in live mode (when ready)
- [ ] CORS configured properly

---

## 💾 Database Backup

### Manual Backup (Aiven):
1. Go to Aiven dashboard
2. Click your MySQL service
3. Go to "Backups" tab
4. Backups are automatic

### Automated Backups:
- Aiven automatically backs up every 12 hours
- Backups retained for 2 days on free tier
- Can restore from any backup point

---

## 📊 Monitoring

### Render:
- View logs: Dashboard → Your service → "Logs" tab
- Monitor uptime: Dashboard → "Metrics"

### Vercel:
- View deployments: Dashboard → "Deployments"
- Check analytics: Dashboard → "Analytics"

### Aiven:
- Monitor queries: Dashboard → Your service → "Metrics"
- Check connections: Dashboard → "Overview"
- View logs: Dashboard → "Logs"

---

## 🚨 Troubleshooting

### Backend not responding:
1. Check Render logs
2. Verify environment variables
3. Check database connection
4. Restart service: Settings → "Manual Deploy"

### Frontend not loading:
1. Check Vercel deployment logs
2. Verify API URL in environment variables
3. Check browser console for errors
4. Redeploy if needed

### Database connection failed:
1. Verify Aiven credentials
2. Check if service is running (green status)
3. Verify connection string format
4. Check if SSL is required (Aiven requires SSL by default)

### Payment not working:
1. Verify Razorpay keys (live vs test)
2. Check webhook configuration
3. Check Razorpay dashboard for errors
4. Verify CORS settings

---

## 💰 Costs

### Free Tier Limits:
- **Vercel:** Unlimited bandwidth, 100GB/month
- **Render:** 750 hours/month (enough for 1 service)
- **Aiven:** 1GB storage, 5GB data transfer/month

### When to Upgrade:
- Render: If you need 24/7 uptime (free tier sleeps after 15 min inactivity)
- Aiven: If you exceed 1GB storage or need more performance
- Vercel: Usually free tier is enough

### Upgrade Costs:
- **Render:** $7/month for always-on
- **Aiven:** $10/month for 5GB storage
- **Vercel:** Usually stays free

---

## 🎯 Post-Launch Tasks

### Week 1:
- [ ] Monitor error logs daily
- [ ] Test all features thoroughly
- [ ] Get feedback from test users
- [ ] Fix any bugs found

### Week 2:
- [ ] Switch Razorpay to live mode
- [ ] Setup Google Analytics (optional)
- [ ] Add social media links
- [ ] Create backup admin account

### Ongoing:
- [ ] Weekly database backups
- [ ] Monitor server performance
- [ ] Update dependencies monthly
- [ ] Check security updates

---

## 📞 Support

### If something goes wrong:

1. **Check logs first:**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployments → View logs
   - Browser: F12 → Console tab

2. **Common issues:**
   - 502 Bad Gateway: Backend is down or starting
   - CORS errors: Check FRONTEND_URL in backend env
   - Database errors: Check PlanetScale connection
   - Payment errors: Check Razorpay keys

3. **Need help?**
   - Share error logs
   - Describe what you were doing
   - Include screenshots

---

## 🎉 You're Live!

Once everything is working:
1. Share your site: https://desertvilla.in
2. Test with real customers
3. Monitor performance
4. Collect feedback
5. Keep improving!

**Good luck with Desert Villa! 🚀**
