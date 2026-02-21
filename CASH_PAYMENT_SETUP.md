# Cash Payment System - Quick Setup Guide

## 🚀 Installation Steps

### Step 1: Database Migration
Run the SQL migration to add required fields:

```bash
# Connect to your MySQL database
mysql -u your_user -p your_database < backend/migrations/add_cash_payment_fields.sql
```

Or manually execute the SQL in your database management tool.

### Step 2: Verify Database Changes
Check that the following columns exist in `orders` table:
- `payment_method` VARCHAR(20)
- `paid_at` DATETIME

```sql
DESCRIBE orders;
```

### Step 3: Restart Backend Server
```bash
cd backend
npm restart
# or
node server.js
```

### Step 4: Clear Frontend Cache
```bash
cd frontend
npm run build
# or just refresh browser with Ctrl+Shift+R
```

---

## ✅ Verification

### Test the System

1. **Create a Cash Order:**
   - Go to customer menu
   - Add items to cart
   - Select "CASH" payment
   - Submit order
   - Verify message: "Please pay at counter"

2. **Mark as Paid (Admin):**
   - Login to admin panel
   - Go to Orders Management
   - Find the cash order
   - Verify you see:
     - "CASH" badge (white)
     - "PENDING" status (gray)
     - "💰 Mark as Paid" button (orange)
   - Click the button
   - Confirm the dialog
   - Verify:
     - Success toast appears
     - Button disappears
     - Status changes to "PAID" (green)

3. **Check Revenue:**
   - Go to Dashboard
   - Verify the order amount is included in today's revenue

---

## 🔧 Configuration

### Environment Variables
No additional environment variables needed. The system uses existing database connection.

### Permissions
Ensure admin users have JWT authentication enabled.

---

## 📊 Monitoring

### Check Pending Cash Orders
```sql
SELECT 
  id, 
  table_number, 
  total_amount, 
  payment_status,
  created_at
FROM orders o
JOIN tables t ON o.table_id = t.id
WHERE payment_method = 'CASH' 
  AND payment_status = 'pending'
ORDER BY created_at DESC;
```

### Check Today's Cash Revenue
```sql
SELECT 
  COUNT(*) as total_cash_orders,
  SUM(total_amount) as total_cash_revenue
FROM orders
WHERE payment_method = 'CASH'
  AND payment_status = 'paid'
  AND DATE(created_at) = CURDATE();
```

---

## 🐛 Troubleshooting

### Issue: Button Not Showing

**Solution:**
1. Check browser console for errors
2. Verify order has `payment_method = 'CASH'`
3. Verify order has `payment_status = 'pending'`
4. Clear browser cache
5. Check admin is logged in

### Issue: API Returns 400 Error

**Solution:**
1. Check order exists: `SELECT * FROM orders WHERE id = ?`
2. Verify payment_method: Should be 'CASH'
3. Verify payment_status: Should be 'pending'
4. Check backend logs for detailed error

### Issue: Revenue Not Updating

**Solution:**
1. Verify order marked as paid: `payment_status = 'paid'`
2. Check `paid_at` timestamp is set
3. Refresh dashboard page
4. Check dashboard query includes cash orders

---

## 📞 Support

If you encounter issues:
1. Check `CASH_PAYMENT_SYSTEM.md` for detailed documentation
2. Review backend logs: `backend/logs/`
3. Check browser console for frontend errors
4. Verify database migration completed successfully

---

## ✨ Features Included

- ✅ Cash payment tracking
- ✅ Admin confirmation system
- ✅ Optimistic UI updates
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Revenue calculation
- ✅ Security (JWT auth)
- ✅ Transaction safety
- ✅ Audit trail (paid_at timestamp)

---

**Status:** Production Ready ✅  
**Version:** 1.0.0  
**Date:** February 16, 2026
