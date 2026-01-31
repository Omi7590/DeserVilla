# Quick Start Guide

Get your QR-based café ordering system up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Razorpay account (test mode is fine for development)

## 5-Minute Setup

### 1. Database Setup (2 minutes)

```bash
# Create database
createdb cafe_ordering

# Run schema
psql -d cafe_ordering -f database/schema.sql
```

### 2. Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and Razorpay keys
npm run dev
```

**Required .env variables:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cafe_ordering
DB_USER=postgres
DB_PASSWORD=your_password
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 3. Frontend Setup (1 minute)

```bash
cd frontend
npm install
# Create .env file with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Test It!

1. **Customer Flow:**
   - Visit: http://localhost:5173/menu?table=1
   - Add items to cart
   - Proceed to payment (use Razorpay test mode)

2. **Admin Panel:**
   - Visit: http://localhost:5173/admin/login
   - Login: `admin` / `admin123`
   - View and manage orders

## Generate QR Codes

```bash
# Install QR code generator
npm install qrcode

# Update FRONTEND_URL in scripts/generateQR.js
node scripts/generateQR.js
```

QR codes will be saved in `qr-codes/` directory.

## Default Credentials

- **Admin Username:** `admin`
- **Admin Password:** `admin123`

⚠️ **Change this in production!**

To change password:
```bash
cd backend
node scripts/setupAdmin.js
```

## Troubleshooting

**Database connection fails:**
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists

**Frontend can't connect to backend:**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`

**Payment fails:**
- Use Razorpay test keys for development
- Check Razorpay dashboard for test card numbers

## Next Steps

- Customize menu items in `database/schema.sql`
- Adjust styling in `frontend/tailwind.config.js`
- Deploy to production (see `DEPLOYMENT.md`)

## Need Help?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for production setup
- Check code comments for implementation details

