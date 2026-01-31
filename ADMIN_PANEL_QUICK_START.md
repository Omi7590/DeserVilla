# Admin Panel Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup
```bash
# Make sure MySQL is running in XAMPP
# Run the schema update (if not already done)
mysql -u root -p cafe_ordering < database/admin_schema_update.sql
```

### Step 2: Create Admin User
```bash
cd backend
node scripts/setupAdmin.js
```

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change the password after first login!

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access Admin Panel

1. Open browser: `http://localhost:5173/admin/login`
2. Login with admin credentials
3. You're in! 🎉

---

## 📍 Admin Panel Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard with stats
- `/admin/orders` - Orders management
- `/admin/products` - Products/menu management
- `/admin/payments` - Payments view

---

## 🔑 Key Features

### Dashboard
- Real-time stats (orders, revenue, status counts)
- Auto-refresh every 30 seconds

### Orders
- View all orders
- Filter by status, payment, table, date
- Update order status (pending → preparing → served)
- Auto-refresh every 10 seconds

### Products
- Add new products
- Edit existing products
- Toggle availability (instantly affects customer menu)
- Delete products (with safety checks)

### Payments
- View all payment transactions
- Filter by status and date
- See Razorpay payment IDs
- Total revenue calculation

---

## 🛠️ Troubleshooting

**Can't login?**
```bash
# Check admin exists
mysql -u root -p -e "SELECT * FROM cafe_ordering.admin_users;"

# Create admin if missing
cd backend && node scripts/setupAdmin.js
```

**401 Unauthorized?**
- Token expired - login again
- Check JWT_SECRET in backend/.env

**Orders not showing?**
- Check database connection
- Verify orders table has data
- Check browser console for errors

---

## 📚 Full Documentation

See `ADMIN_PANEL_DOCUMENTATION.md` for complete details.

---

**Ready to manage your café! 🎊**

