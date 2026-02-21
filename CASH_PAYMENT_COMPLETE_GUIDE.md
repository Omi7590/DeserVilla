# 💰 Complete Cash Payment Confirmation System

## Overview
This system allows customers to order via QR code and pay with CASH at the counter. Admin can then confirm payment receipt through the admin panel.

---

## 🗄️ Database Setup

### Step 1: Run Migration
Execute the migration SQL to add required columns:

```bash
# Using MySQL command line
mysql -u root -p cafe_ordering < database/migrations/001_add_cash_payment_fields.sql

# Or using XAMPP phpMyAdmin
# 1. Open phpMyAdmin
# 2. Select 'cafe_ordering' database
# 3. Go to SQL tab
# 4. Copy and paste contents of database/migrations/001_add_cash_payment_fields.sql
# 5. Click 'Go'
```

### Step 2: Verify Schema
After migration, your `orders` table should have:

```sql
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `payment_method` ENUM('ONLINE','CASH') NOT NULL DEFAULT 'ONLINE',
  `paid_at` DATETIME NULL DEFAULT NULL,
  `order_status` varchar(50) DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_orders_payment_method` (`payment_method`)
);
```

---

## 🔧 Backend Implementation

### API Endpoint: Mark Order as Paid

**Route:** `PUT /api/admin/orders/mark-paid/:orderId`

**Controller:** `backend/controllers/adminController.js`

**Function:** `markOrderAsPaid()`

**Features:**
- ✅ Admin JWT authentication required
- ✅ Validates order exists
- ✅ Checks payment_method = 'CASH'
- ✅ Prevents double payment
- ✅ Updates payment_status to 'paid'
- ✅ Sets paid_at timestamp
- ✅ Returns updated order data

**Security:**
- Only authenticated admins can access
- Validates order ID format
- Prevents marking online orders as paid manually
- Prevents marking already paid orders again

---

## 🎨 Frontend Implementation

### Admin Orders Page

**File:** `frontend/src/pages/admin/AdminOrders.jsx`

**Features:**

1. **Visual Indicators:**
   - 💵 CASH badge for cash orders
   - 🟡 PENDING badge for unpaid orders
   - 🟢 PAID badge for paid orders

2. **Mark as Paid Button:**
   - Only shows for CASH orders with PENDING payment
   - Confirmation dialog before marking
   - Loading state during API call
   - Optimistic UI update
   - Success/error toast notifications

3. **Real-time Updates:**
   - Auto-refresh every 10 seconds
   - Manual refresh button
   - Instant UI update after payment confirmation

---

## 🔄 Complete Flow

### Customer Flow (CASH Payment)

1. **Scan QR Code** → Opens menu
2. **Add items to cart** → Select products
3. **Choose CASH payment** → At checkout
4. **Place order** → Order saved with:
   - `payment_method` = 'CASH'
   - `payment_status` = 'pending'
   - `order_status` = 'pending'
5. **See confirmation** → "Please pay at counter"
6. **Go to counter** → Pay cash to staff

### Admin Flow (Payment Confirmation)

1. **Login to admin panel** → `/admin/login`
2. **Go to Orders** → See all orders
3. **Identify CASH order** → Look for:
   - 💵 CASH badge
   - 🟡 PENDING payment badge
   - 💰 "Mark as Paid" button
4. **Verify payment received** → Check cash received
5. **Click "Mark as Paid"** → Confirm in dialog
6. **Payment confirmed** → Order updated:
   - `payment_status` = 'paid'
   - `paid_at` = NOW()
   - Button disappears
   - ✅ PAID badge shows

---

## 🧪 Testing Guide

### Test Case 1: Create Cash Order

```javascript
// Customer places cash order
POST /api/order
{
  "tableId": 1,
  "items": [
    { "menuItemId": 3, "quantity": 2, "price": 279 }
  ],
  "totalAmount": 558,
  "paymentMethod": "CASH"
}

// Expected Response:
{
  "success": true,
  "order": {
    "id": 123,
    "paymentMethod": "CASH",
    "paymentStatus": "pending",
    "orderStatus": "pending"
  }
}
```

### Test Case 2: Mark as Paid

```javascript
// Admin marks order as paid
PUT /api/admin/orders/mark-paid/123
Headers: { Authorization: "Bearer <admin_token>" }

// Expected Response:
{
  "success": true,
  "message": "Cash payment confirmed successfully",
  "order": {
    "id": 123,
    "paymentStatus": "paid",
    "paymentMethod": "CASH",
    "paidAt": "2026-02-16T10:30:00.000Z"
  }
}
```

### Test Case 3: Error Handling

```javascript
// Try to mark already paid order
PUT /api/admin/orders/mark-paid/123

// Expected Response:
{
  "success": false,
  "error": "Order is already marked as paid"
}

// Try to mark online order
PUT /api/admin/orders/mark-paid/124

// Expected Response:
{
  "success": false,
  "error": "Only cash orders can be marked as paid manually"
}
```

---

## 📊 Database Queries

### Get All Pending Cash Orders

```sql
SELECT 
  o.id,
  o.table_id,
  t.table_number,
  o.total_amount,
  o.payment_method,
  o.payment_status,
  o.created_at
FROM orders o
JOIN tables t ON o.table_id = t.id
WHERE o.payment_method = 'CASH' 
  AND o.payment_status = 'pending'
ORDER BY o.created_at DESC;
```

### Get Today's Cash Revenue

```sql
SELECT 
  COUNT(*) as total_cash_orders,
  SUM(total_amount) as total_cash_revenue
FROM orders
WHERE payment_method = 'CASH'
  AND payment_status = 'paid'
  AND DATE(created_at) = CURDATE();
```

### Get Payment Statistics

```sql
SELECT 
  payment_method,
  payment_status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_amount
FROM orders
GROUP BY payment_method, payment_status
ORDER BY payment_method, payment_status;
```

---

## 🔒 Security Features

1. **Authentication:**
   - JWT token required for admin endpoints
   - Token validated on every request
   - Expired tokens rejected

2. **Authorization:**
   - Only admin role can mark orders as paid
   - Admin ID logged for audit trail

3. **Validation:**
   - Order ID format validated
   - Payment method checked
   - Payment status verified
   - Prevents double payment

4. **Error Handling:**
   - Clear error messages
   - Proper HTTP status codes
   - No sensitive data in errors

---

## 🎯 Key Features

✅ **Complete Cash Payment Flow**
- Customer selects CASH at checkout
- Order saved with pending payment
- Admin confirms payment receipt
- Real-time UI updates

✅ **Admin Controls**
- Visual indicators for payment status
- One-click payment confirmation
- Confirmation dialog prevents mistakes
- Optimistic UI for better UX

✅ **Data Integrity**
- Prevents double payment
- Tracks payment timestamp
- Maintains order history
- Audit trail for payments

✅ **User Experience**
- Clear visual feedback
- Toast notifications
- Loading states
- Error handling

---

## 🚀 Deployment Checklist

- [ ] Run database migration
- [ ] Verify schema changes
- [ ] Test cash order creation
- [ ] Test payment confirmation
- [ ] Test error scenarios
- [ ] Verify admin authentication
- [ ] Check UI responsiveness
- [ ] Test on mobile devices
- [ ] Verify toast notifications
- [ ] Check real-time updates

---

## 📝 API Reference

### Mark Order as Paid

**Endpoint:** `PUT /api/admin/orders/mark-paid/:orderId`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Parameters:**
- `orderId` (path) - Order ID to mark as paid

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cash payment confirmed successfully",
  "order": {
    "id": 123,
    "tableNumber": 5,
    "totalAmount": 558.00,
    "paymentStatus": "paid",
    "paymentMethod": "CASH",
    "orderStatus": "pending",
    "paidAt": "2026-02-16T10:30:00.000Z",
    "createdAt": "2026-02-16T10:15:00.000Z",
    "updatedAt": "2026-02-16T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 - Invalid Order ID:
```json
{
  "success": false,
  "error": "Invalid order ID"
}
```

400 - Not a Cash Order:
```json
{
  "success": false,
  "error": "Only cash orders can be marked as paid manually"
}
```

400 - Already Paid:
```json
{
  "success": false,
  "error": "Order is already marked as paid"
}
```

404 - Order Not Found:
```json
{
  "success": false,
  "error": "Order not found"
}
```

401 - Unauthorized:
```json
{
  "error": "Unauthorized"
}
```

---

## 🐛 Troubleshooting

### Issue: Migration fails

**Solution:**
```sql
-- Check if columns already exist
SHOW COLUMNS FROM orders LIKE 'payment_method';
SHOW COLUMNS FROM orders LIKE 'paid_at';

-- If they exist, skip migration or drop them first
ALTER TABLE orders DROP COLUMN payment_method;
ALTER TABLE orders DROP COLUMN paid_at;
```

### Issue: Button not showing

**Check:**
1. Order has `payment_method` = 'CASH'
2. Order has `payment_status` = 'pending'
3. Admin is logged in
4. Frontend is fetching latest data

### Issue: API returns 401

**Solution:**
1. Check admin token in localStorage
2. Verify token hasn't expired
3. Re-login to get new token

### Issue: Optimistic update not working

**Check:**
1. Order ID matches
2. State update logic correct
3. No console errors
4. API call succeeds

---

## 📞 Support

For issues or questions:
1. Check console logs (browser & server)
2. Verify database schema
3. Test API endpoints with Postman
4. Check network requests in DevTools

---

## ✨ Summary

This complete cash payment system provides:
- Seamless customer experience
- Easy admin workflow
- Secure payment tracking
- Real-time updates
- Production-ready code

**Status:** ✅ PRODUCTION READY
