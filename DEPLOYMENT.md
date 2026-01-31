# Deployment Guide

This guide provides step-by-step instructions for deploying the QR-Based Café Ordering System to Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Razorpay account with API keys
- PostgreSQL database (Render provides this)

## Step 1: Prepare Your Code

1. Push your code to a GitHub repository
2. Ensure all environment variables are documented in `.env.example` files

## Step 2: Deploy Backend to Render

### 2.1 Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `cafe-ordering-db`
   - **Database**: `cafe_ordering`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. **Save the connection details** (Internal Database URL)

### 2.2 Deploy Backend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `cafe-ordering-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid for better performance)

4. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<from-database-connection>
   DB_PORT=5432
   DB_NAME=cafe_ordering
   DB_USER=<from-database-connection>
   DB_PASSWORD=<from-database-connection>
   RAZORPAY_KEY_ID=<your-razorpay-key-id>
   RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
   RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
   JWT_SECRET=<generate-strong-random-string>
   FRONTEND_URL=<will-update-after-vercel-deployment>
   ```

5. Click "Create Web Service"
6. **Copy the service URL** (e.g., `https://cafe-ordering-backend.onrender.com`)

### 2.3 Initialize Database

1. In Render Dashboard, go to your PostgreSQL database
2. Click "Connect" → "External Connection"
3. Use a PostgreSQL client (pgAdmin, DBeaver, or psql) to connect
4. Run the SQL schema from `database/schema.sql`
5. Set up admin user (optional):
   ```sql
   -- Update admin password hash
   UPDATE admin_users 
   SET password_hash = '<bcrypt-hash-of-your-password>'
   WHERE username = 'admin';
   ```

### 2.4 Set Up Razorpay Webhook

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://your-backend-url.onrender.com/api/payment/webhook`
4. Select events: `payment.captured`, `payment.failed`
5. Copy the webhook secret and update `RAZORPAY_WEBHOOK_SECRET` in Render

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"
7. **Copy the deployment URL** (e.g., `https://cafe-ordering.vercel.app`)

### 3.2 Update Backend CORS

1. Go back to Render Dashboard
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. Render will automatically redeploy

### 3.3 Alternative: Deploy via CLI

```bash
cd frontend
npm i -g vercel
vercel login
vercel
```

Follow the prompts and set `VITE_API_URL` when asked.

## Step 4: Generate QR Codes

1. Update the `FRONTEND_URL` in `scripts/generateQR.js`:
   ```javascript
   const FRONTEND_URL = 'https://your-frontend-url.vercel.app';
   ```

2. Install dependencies and run:
   ```bash
   npm install qrcode
   node scripts/generateQR.js
   ```

3. QR codes will be generated in `qr-codes/` directory
4. Print and place QR codes on each table

## Step 5: Test Deployment

### Test Customer Flow

1. Scan a QR code or visit: `https://your-frontend-url.vercel.app/menu?table=1`
2. Add items to cart
3. Proceed to payment (use Razorpay test mode)
4. Verify order appears in admin panel

### Test Admin Panel

1. Visit: `https://your-frontend-url.vercel.app/admin/login`
2. Login with admin credentials
3. Verify you can see orders and update statuses
4. Test menu availability toggle

## Step 6: Production Checklist

- [ ] Change default admin password
- [ ] Use Razorpay live keys (not test keys)
- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify database credentials in Render
- Check if database is accessible from web service
- Ensure database is not paused (free tier pauses after inactivity)

**CORS Errors**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check for trailing slashes

**Payment Verification Fails**
- Verify Razorpay keys are correct
- Check webhook secret matches
- Ensure webhook URL is accessible

### Frontend Issues

**API Calls Fail**
- Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Verify CORS is configured

**Build Fails**
- Check Node.js version (Vercel uses Node 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

## Monitoring

### Render

- View logs in Render Dashboard → Your Service → Logs
- Set up alerts for service downtime
- Monitor database usage

### Vercel

- View deployment logs in Vercel Dashboard
- Check Analytics for traffic
- Monitor function execution times

## Scaling

### Free Tier Limitations

- **Render**: Services sleep after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth/month
- **PostgreSQL**: 90 days retention, 1GB storage

### Upgrade Options

- **Render Paid**: No sleep, better performance
- **Vercel Pro**: More bandwidth, better analytics
- **Database**: Upgrade for more storage/performance

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong passwords** for admin accounts
3. **Rotate API keys** regularly
4. **Enable 2FA** on Razorpay account
5. **Monitor** for suspicious activity
6. **Keep dependencies** updated
7. **Use HTTPS** (automatic on Vercel/Render)

## Support

For deployment issues:
- Check Render/Vercel documentation
- Review application logs
- Verify environment variables
- Test locally first

