# 🧪 Cash Payment System - Testing Guide

## Complete Test Suite

### Prerequisites
- ✅ Database migration completed
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Admin credentials: `admin` / `admin123`

---

## 🎯 Test Case 1: Create Cash Order (Customer Flow)

### Steps:
1. Open `http://localhost:5173`
2. Click "Select Table Number" or select from header
3. Choose table (e.g., Table 1)
4. Browse menu and add items:
   - Click "Add to Cart" on any item
   - Verify cart badge shows count
5. Click cart icon (top right)
6. Verify cart drawer opens with items
7. Select "Pay Cash" option
8. Click "Place Order (Pay at Counter)"

### Expected Results:
✅ Order created successfully
✅ Redirected to success page
✅ Message: "Order Placed! Please pay at the counter."
✅ Cart cleared
✅ Order ID displayed

### Database Verification:
```sql
SELECT 
    id,
    table_id,
    total_amount,
    payment_method,
    payment_status,
    order_status,
    paid_at,
    created_at
FROM orders 
WHERE payment_method = 'CASH'
ORDER BY created_at DESC 
LIMIT 1;
```

Expected:
```
payment_method: CASH
payment_status: pending
order_status: pending
paid_at: NULL
```

---

## 🎯 Test Case 2: View Cash Order in Admin Panel

### Steps:
1. Open `http://localhost:5173/admin/login`
2. Login with `admin` / `admin123`
3. Click "Orders" in sidebar
4. Find the cash order created in Test Case 1

### Expected Results:
✅ Order visible in list
✅ Shows 💵 CASH badge (gray background)
✅ Shows 🟡 PENDING badge (yellow background)
✅ Shows 💰 "Mark as Paid" button (amber color)
✅ Order details visible (table, items, total)

### Visual Indicators:
- **CASH Badge:** Gray background, Banknote icon
- **PENDING Badge:** Yellow background
- **Mark as Paid Button:** Amber background, visible and enabled

---

## 🎯 Test Case 3: Mark Cash Order as Paid

### Steps:
1. In admin orders page, find cash order with PENDING status
2. Click "💰 Mark as Paid" button
3. Verify confirmation dialog appears
4. Click "OK" to confirm

### Expected Results:
✅ Confirmation dialog shows: "Confirm cash payment received?"
✅ Button shows loading state: "Processing..."
✅ Success toast appears: "💰 Cash payment confirmed!"
✅ Order updates immediately (optimistic UI)
✅ PENDING badge changes to ✅ PAID badge (green)
✅ "Mark as Paid" button disappears
✅ Order list refreshes automatically

### Database Verification:
```sql
SELECT 
    id,
    payment_method,
    payment_status,
    paid_at,
    updated_at
FROM orders 
WHERE id = [ORDER_ID];
```

Expected:
```
payment_method: CASH
payment_status: paid
paid_at: [CURRENT_TIMESTAMP]
updated_at: [CURRENT_TIMESTAMP]
```

---

## 🎯 Test Case 4: Prevent Double Payment

### Steps:
1. Find an already paid cash order
2. Try to mark it as paid again using API

### API Test:
```bash
curl -X PUT http://localhost:5000/api/admin/orders/mark-paid/[ORDER_ID] \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json"
```

### Expected Results:
✅ API returns 400 error
✅ Error message: "Order is already marked as paid"
✅ Database unchanged
✅ No duplicate payment records

---

## 🎯 Test Case 5: Prevent Marking Online Orders as Paid

### Steps:
1. Create an online order (with Razorpay)
2. Try to mark it as paid using the API

### API Test:
```bash
curl -X PUT http://localhost:5000/api/admin/orders/mark-paid/[ONLINE_ORDER_ID] \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json"
```

### Expected Results:
✅ API returns 400 error
✅ Error message: "Only cash orders can be marked as paid manually"
✅ Database unchanged

---

## 🎯 Test Case 6: Unauthorized Access Prevention

### Steps:
1. Try to mark order as paid without admin token

### API Test:
```bash
curl -X PUT http://localhost:5000/api/admin/orders/mark-paid/1 \
  -H "Content-Type: application/json"
```

### Expected Results:
✅ API returns 401 error
✅ Error message: "Unauthorized"
✅ No database changes

---

## 🎯 Test Case 7: Invalid Order ID

### Steps:
1. Try to mark non-existent order as paid

### API Test:
```bash
curl -X PUT http://localhost:5000/api/admin/orders/mark-paid/99999 \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json"
```

### Expected Results:
✅ API returns 404 error
✅ Error message: "Order not found"

---

## 🎯 Test Case 8: Filter Cash Orders

### Steps:
1. In admin panel, go to Orders
2. Set filter: Payment Status = "Pending"
3. Verify only pending orders show
4. Set filter: Payment Status = "Paid"
5. Verify only paid orders show

### Expected Results:
✅ Filters work correctly
✅ Cash orders visible in filtered results
✅ Payment method badges show correctly
✅ Count updates based on filter

---

## 🎯 Test Case 9: Real-time Updates

### Steps:
1. Open admin panel in Browser 1
2. Open admin panel in Browser 2
3. In Browser 1, mark a cash order as paid
4. Wait 10 seconds (auto-refresh interval)
5. Check Browser 2

### Expected Results:
✅ Browser 2 shows updated order status
✅ PAID badge appears
✅ "Mark as Paid" button disappears
✅ Auto-refresh works (10-second interval)

---

## 🎯 Test Case 10: Order Status Flow

### Steps:
1. Create cash order (status: pending)
2. Mark as paid
3. Update order status to "preparing"
4. Update order status to "served"

### Expected Results:
✅ Payment status independent of order status
✅ Can mark as paid at any order status
✅ Order status changes don't affect payment status
✅ Both statuses tracked separately

---

## 🎯 Test Case 11: Mobile Responsiveness

### Steps:
1. Open admin panel on mobile device
2. Navigate to Orders
3. Find cash order
4. Click "Mark as Paid"

### Expected Results:
✅ UI responsive on mobile
✅ Buttons accessible and clickable
✅ Badges visible and readable
✅ Confirmation dialog works
✅ Toast notifications appear

---

## 🎯 Test Case 12: Network Error Handling

### Steps:
1. Stop backend server
2. Try to mark order as paid
3. Start backend server

### Expected Results:
✅ Error toast appears
✅ UI reverts optimistic update
✅ Order remains in original state
✅ No data corruption

---

## 🎯 Test Case 13: Concurrent Requests

### Steps:
1. Open admin panel in 2 browsers
2. Both try to mark same order as paid simultaneously

### Expected Results:
✅ First request succeeds
✅ Second request gets "already paid" error
✅ No duplicate payment records
✅ Database consistency maintained

---

## 🎯 Test Case 14: Dashboard Statistics

### Steps:
1. Create multiple cash orders
2. Mark some as paid
3. Go to admin dashboard
4. Check statistics

### Expected Results:
✅ Total orders count includes cash orders
✅ Revenue includes paid cash orders
✅ Revenue excludes pending cash orders
✅ Statistics accurate

### Verification Query:
```sql
SELECT 
    COUNT(*) as total_orders,
    SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN payment_method = 'CASH' AND payment_status = 'paid' THEN total_amount ELSE 0 END) as cash_revenue
FROM orders
WHERE DATE(created_at) = CURDATE();
```

---

## 🎯 Test Case 15: Payment History

### Steps:
1. Create and pay multiple cash orders
2. Query payment history

### Query:
```sql
SELECT 
    o.id,
    o.table_id,
    t.table_number,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    o.created_at,
    o.paid_at,
    TIMESTAMPDIFF(MINUTE, o.created_at, o.paid_at) as minutes_to_payment
FROM orders o
JOIN tables t ON o.table_id = t.id
WHERE o.payment_method = 'CASH'
  AND o.payment_status = 'paid'
ORDER BY o.paid_at DESC;
```

### Expected Results:
✅ All paid cash orders listed
✅ paid_at timestamp populated
✅ Time to payment calculated
✅ Audit trail complete

---

## 📊 Performance Tests

### Test 1: Large Order List
```sql
-- Insert 1000 test orders
INSERT INTO orders (table_id, total_amount, payment_method, payment_status, order_status)
SELECT 
    (FLOOR(RAND() * 7) + 1),
    (FLOOR(RAND() * 1000) + 100),
    IF(RAND() > 0.5, 'CASH', 'ONLINE'),
    IF(RAND() > 0.3, 'paid', 'pending'),
    'pending'
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t4
LIMIT 1000;
```

### Expected Results:
✅ Admin panel loads in < 2 seconds
✅ Filtering works smoothly
✅ No UI lag
✅ Pagination works (if implemented)

---

## 🔒 Security Tests

### Test 1: SQL Injection
```bash
curl -X PUT "http://localhost:5000/api/admin/orders/mark-paid/1' OR '1'='1" \
  -H "Authorization: Bearer [TOKEN]"
```
✅ Should return 400 (Invalid order ID)

### Test 2: XSS Prevention
- Try adding `<script>alert('xss')</script>` in order notes
✅ Should be escaped/sanitized

### Test 3: CSRF Protection
- Try marking order as paid from different origin
✅ CORS should block unauthorized origins

---

## 📝 Test Results Template

```
Test Date: _______________
Tester: _______________
Environment: [ ] Local [ ] Staging [ ] Production

Test Case 1: Create Cash Order
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 2: View in Admin Panel
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 3: Mark as Paid
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 4: Prevent Double Payment
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 5: Prevent Marking Online Orders
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 6: Unauthorized Access
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 7: Invalid Order ID
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 8: Filter Orders
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 9: Real-time Updates
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Test Case 10: Order Status Flow
Status: [ ] Pass [ ] Fail
Notes: _______________________________

Overall Result: [ ] All Pass [ ] Some Failures
Ready for Production: [ ] Yes [ ] No
```

---

## 🐛 Bug Report Template

```
Bug ID: _______________
Date: _______________
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low

Description:
_______________________________

Steps to Reproduce:
1. _______________________________
2. _______________________________
3. _______________________________

Expected Result:
_______________________________

Actual Result:
_______________________________

Screenshots/Logs:
_______________________________

Environment:
- Browser: _______________
- OS: _______________
- Backend Version: _______________
- Frontend Version: _______________
```

---

## ✅ Acceptance Criteria

All tests must pass before production deployment:

- [ ] Customer can create cash orders
- [ ] Admin can view cash orders with proper badges
- [ ] Admin can mark cash orders as paid
- [ ] System prevents double payment
- [ ] System prevents marking online orders manually
- [ ] Unauthorized access blocked
- [ ] Invalid inputs handled gracefully
- [ ] Real-time updates work
- [ ] Mobile responsive
- [ ] Network errors handled
- [ ] Database consistency maintained
- [ ] Performance acceptable (< 2s load time)
- [ ] Security tests pass
- [ ] No console errors
- [ ] No memory leaks

---

## 🚀 Ready for Production

Once all tests pass:
1. Document any issues found and resolved
2. Get stakeholder approval
3. Schedule deployment
4. Prepare rollback plan
5. Monitor production logs
6. Train staff on new features

**Testing Complete! 🎉**
