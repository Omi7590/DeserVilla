# 💰 Cash Payment System - Cheat Sheet

## 🚀 Quick Setup (5 Minutes)

### 1. Database Migration
```bash
# Open phpMyAdmin → cafe_ordering → SQL tab
# Copy/paste: scripts/setup-cash-payment.sql
# Click "Go"
```

### 2. Verify Setup
```sql
SHOW COLUMNS FROM orders LIKE 'payment_method';
-- Should return: enum('ONLINE','CASH')
```

### 3. Test
```
Customer: localhost:5173 → Add items → Pay Cash → Place Order
Admin: localhost:5173/admin → Orders → Mark as Paid
```

---

## 📋 Key Files

| File | Purpose |
|------|---------|
| `scripts/setup-cash-payment.sql` | Database migration |
| `backend/controllers/adminController.js` | Mark as paid API |
| `frontend/src/pages/admin/AdminOrders.jsx` | Admin UI |
| `CASH_PAYMENT_QUICK_START.md` | Full setup guide |

---

## 🔌 API Endpoints

### Mark Order as Paid
```bash
PUT /api/admin/orders/mark-paid/:orderId
Headers: Authorization: Bearer <token>

# Success: 200
{
  "success": true,
  "message": "Cash payment confirmed successfully",
  "order": { ... }
}

# Errors:
# 400 - Already paid / Not cash order
# 401 - Unauthorized
# 404 - Order not found
```

---

## 🎨 UI Components

### Customer Cart
```
Payment Method:
[ Pay Online ] [ Pay Cash ] ← Select this
↓
"Place Order (Pay at Counter)"
```

### Admin Orders
```
Order Card:
┌─────────────────────────────┐
│ Table 1  [PENDING] [CASH]💵 │
│ Total: ₹500                 │
│ [💰 Mark as Paid] ← Click   │
└─────────────────────────────┘
↓ After marking
┌─────────────────────────────┐
│ Table 1  [✅ PAID] [CASH]💵 │
│ Total: ₹500                 │
│ (Button gone)               │
└─────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
orders table:
- payment_method ENUM('ONLINE','CASH') DEFAULT 'ONLINE'
- paid_at DATETIME NULL
- payment_status VARCHAR(50) -- 'pending' or 'paid'
```

---

## 🔄 Complete Flow

```
Customer → Select CASH → Place Order
         ↓
Order saved: payment_status='pending'
         ↓
Customer pays at counter
         ↓
Admin → Click "Mark as Paid"
         ↓
Order updated: payment_status='paid', paid_at=NOW()
         ↓
UI updates instantly ✅
```

---

## 🧪 Quick Tests

### Test 1: Create Cash Order
```bash
curl -X POST http://localhost:5000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": 1,
    "items": [{"menuItemId": 3, "quantity": 1}],
    "totalAmount": 279,
    "paymentMethod": "CASH"
  }'
```

### Test 2: Mark as Paid
```bash
curl -X PUT http://localhost:5000/api/admin/orders/mark-paid/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Verify Database
```sql
SELECT id, payment_method, payment_status, paid_at 
FROM orders 
WHERE payment_method = 'CASH' 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Column doesn't exist | Run migration script |
| Button not showing | Check: CASH + PENDING status |
| 401 Unauthorized | Re-login to admin panel |
| Already paid error | Order was already marked paid |
| Not cash order error | Order is ONLINE payment |

---

## 🔒 Security Checklist

- ✅ JWT authentication required
- ✅ Admin role verified
- ✅ Order ID validated
- ✅ Payment method checked
- ✅ Double payment prevented
- ✅ SQL injection protected

---

## 📊 Useful Queries

### Today's Cash Revenue
```sql
SELECT SUM(total_amount) as cash_revenue
FROM orders
WHERE payment_method = 'CASH'
  AND payment_status = 'paid'
  AND DATE(created_at) = CURDATE();
```

### Pending Cash Orders
```sql
SELECT id, table_id, total_amount, created_at
FROM orders
WHERE payment_method = 'CASH'
  AND payment_status = 'pending'
ORDER BY created_at DESC;
```

### Payment Statistics
```sql
SELECT 
    payment_method,
    payment_status,
    COUNT(*) as count,
    SUM(total_amount) as total
FROM orders
GROUP BY payment_method, payment_status;
```

---

## 🎯 Admin Panel Quick Guide

### Login
```
URL: localhost:5173/admin/login
User: admin
Pass: admin123
```

### Mark Order as Paid
```
1. Go to "Orders" section
2. Find order with:
   - 💵 CASH badge
   - 🟡 PENDING badge
3. Click "💰 Mark as Paid"
4. Confirm in dialog
5. ✅ Done! Badge changes to PAID
```

---

## 📱 Mobile Testing

```bash
# Find your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Open on phone
http://YOUR_IP:5173
```

---

## 🚀 Production Deployment

```bash
# 1. Backup database
mysqldump -u root -p cafe_ordering > backup.sql

# 2. Run migration
mysql -u root -p cafe_ordering < scripts/setup-cash-payment.sql

# 3. Deploy backend
cd backend
npm run build  # if needed
pm2 restart cafe-backend

# 4. Deploy frontend
cd frontend
npm run build
# Upload dist/ to hosting

# 5. Verify
curl https://your-domain.com/api/health
```

---

## 📞 Quick Support

### Check Logs
```bash
# Backend
cd backend
npm start
# Watch console

# Frontend
# Open browser console (F12)
```

### Common Errors

**"Column 'payment_method' doesn't exist"**
→ Run migration script

**"401 Unauthorized"**
→ Re-login to admin panel

**"Order not found"**
→ Check order ID in database

---

## ✅ Pre-Launch Checklist

- [ ] Migration completed
- [ ] Backend running
- [ ] Frontend running
- [ ] Test cash order creation
- [ ] Test mark as paid
- [ ] Test on mobile
- [ ] Train staff
- [ ] Monitor logs

---

## 🎉 Success Indicators

✅ Customer can select cash payment
✅ Order saves with PENDING status
✅ Admin sees CASH badge
✅ Admin can mark as paid
✅ UI updates instantly
✅ No errors in console
✅ Mobile responsive

---

## 📚 Full Documentation

- `CASH_PAYMENT_QUICK_START.md` - Setup guide
- `CASH_PAYMENT_COMPLETE_GUIDE.md` - Full documentation
- `CASH_PAYMENT_TESTING.md` - Test cases
- `CASH_PAYMENT_IMPLEMENTATION_SUMMARY.md` - Technical details

---

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** Feb 16, 2026
