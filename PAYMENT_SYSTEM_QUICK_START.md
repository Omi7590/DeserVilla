# 🚀 Payment Management System - Quick Start

## 3-Step Setup

### Step 1: Run Migration (30 seconds)
```powershell
.\run-payment-migration.ps1
```

### Step 2: Restart Servers (1 minute)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 3: Test It! (2 minutes)

1. **Place a Cash Order**:
   - Visit: `http://localhost:5173/menu?table=1`
   - Add items → Checkout → Select "Cash on Delivery"
   - Place order

2. **Mark as Paid**:
   - Visit: `http://localhost:5173/admin/orders`
   - Find your cash order (yellow PENDING badge)
   - Click "💰 Mark as Paid"
   - Confirm

3. **Check Revenue**:
   - Visit: `http://localhost:5173/admin/payments`
   - See updated revenue cards
   - View payment details

---

## What You Get

### 💰 Revenue Dashboard
- Total Revenue (all paid orders)
- Online Revenue (Razorpay payments)
- Cash Revenue (paid cash orders)
- Pending Cash (unpaid cash orders)

### 📋 Orders Management
- View all orders (online + cash)
- Mark cash orders as paid
- Real-time status updates
- Payment method badges

### 🔍 Advanced Filtering
- Filter by payment method
- Filter by payment status
- Search by order ID
- Filter by date

---

## API Endpoints

### Get Payment Summary
```
GET /api/admin/payments/summary
```

### Get Payments List
```
GET /api/admin/payments/list?paymentMethod=CASH&paymentStatus=pending
```

### Mark Cash as Paid
```
PUT /api/admin/orders/:id/mark-cash-paid
```

---

## Payment Flow

### Online Payment
```
Customer → Razorpay → Success → Order PAID ✅
```

### Cash Payment
```
Customer → Place Order → PENDING ⏳
Admin → Deliver → Collect Cash → Mark Paid → PAID ✅
```

---

## Features

✅ Complete payment tracking  
✅ Revenue analytics  
✅ Cash payment management  
✅ Real-time updates  
✅ Advanced filtering  
✅ Secure & validated  
✅ Error handling  
✅ Production ready  

---

## Troubleshooting

**Migration fails?**
- Check MySQL is running
- Verify database credentials in `backend/.env`

**Button not showing?**
- Order must be CASH payment
- Payment status must be PENDING
- Refresh the page

**Revenue not updating?**
- Refresh the payments page
- Check backend logs
- Verify database connection

---

## Done! 🎉

Your payment management system is ready. Start taking orders and managing payments like a pro!
