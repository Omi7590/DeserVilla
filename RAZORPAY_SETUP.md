# Razorpay Payment Integration Setup

## ✅ Complete Razorpay Integration Guide

### STEP 1: Environment Variables

Add these to your `backend/.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
```

**⚠️ Important**: These are TEST keys. For production, use your live keys from Razorpay Dashboard.

---

### STEP 2: Backend Dependencies

The Razorpay package is already installed. If not, run:

```bash
cd backend
npm install razorpay crypto
```

**Note**: `crypto` is a built-in Node.js module, no installation needed.

---

### STEP 3: Razorpay Configuration

✅ Already configured in `backend/config/razorpay.js`:

```javascript
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

---

### STEP 4: Payment Endpoints

✅ Already implemented in `backend/controllers/orderController.js`:

#### Create Payment Order
**Endpoint**: `POST /api/order/payment/create`

```javascript
// Creates Razorpay order
// Returns: { razorpayOrderId, amount, currency, key }
```

#### Verify Payment
**Endpoint**: `POST /api/order/payment/verify`

```javascript
// Verifies payment signature
// Updates order payment_status to 'paid'
// Inserts record into payments table
```

---

### STEP 5: Database Setup

Run this SQL to ensure payments table exists:

```sql
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at)
);
```

**Or run the schema update:**
```bash
mysql -u root -p cafe_ordering < database/admin_schema_update.sql
```

---

### STEP 6: Frontend Payment Flow

✅ Already implemented in `frontend/src/utils/razorpay.js`:

1. **Load Razorpay Script** - Automatically loaded
2. **Create Payment Order** - Calls `/api/order/payment/create`
3. **Open Razorpay Checkout** - Uses Razorpay SDK
4. **Verify Payment** - Calls `/api/order/payment/verify` after payment

**Payment Flow:**
```javascript
1. Customer clicks "Proceed to Payment"
2. Backend creates Razorpay order
3. Razorpay checkout modal opens
4. Customer completes payment
5. Backend verifies payment signature
6. Order status updated to 'paid'
7. Payment record inserted
8. Customer redirected to success page
```

---

### STEP 7: Admin Panel Integration

✅ **Already Implemented:**

#### Orders Page (`/admin/orders`)
- Shows payment status (PAID / PENDING / FAILED)
- Color-coded badges
- Filter by payment status
- **Admin CANNOT edit payment status** (security rule)

#### Payments Page (`/admin/payments`)
- Lists all payment transactions
- Shows:
  - Order ID
  - Table number
  - Amount
  - Payment status
  - Razorpay Payment ID
  - Date & Time
- Filter by status and date
- Total revenue calculation

---

## 🔒 Security Features

1. **Payment Signature Verification**
   - Uses HMAC SHA256
   - Prevents payment tampering
   - Verifies authenticity

2. **Read-Only Payment Status**
   - Admin cannot modify payment status
   - Only Razorpay verification can update it
   - Prevents fraud

3. **Order-Payment Linking**
   - Each payment linked to order
   - Foreign key constraints
   - Prevents orphaned records

---

## 📊 Payment Status Flow

```
PENDING → (Payment Initiated)
    ↓
PAID → (Payment Verified Successfully)
    ↓
FAILED → (Payment Failed/Cancelled)
```

---

## 🧪 Testing

### Test Payment Flow:

1. **Create Order** - Add items to cart
2. **Proceed to Payment** - Click checkout
3. **Razorpay Test Cards:**
   - Success: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

4. **Verify in Admin Panel:**
   - Check Orders page - should show "PAID"
   - Check Payments page - should show transaction

---

## 🔧 Troubleshooting

### Payment not verifying?
- Check Razorpay keys in `.env`
- Verify signature generation matches Razorpay
- Check backend logs for errors

### Payment status not updating?
- Check database connection
- Verify payment verification endpoint called
- Check order ID matches

### Razorpay modal not opening?
- Check Razorpay script loaded
- Verify API key is correct
- Check browser console for errors

---

## 📝 API Reference

### Create Payment Order
```http
POST /api/order/payment/create
Content-Type: application/json

{
  "orderId": 123,
  "amount": 500.00
}

Response:
{
  "success": true,
  "razorpayOrderId": "order_xxx",
  "amount": 50000,
  "currency": "INR",
  "key": "rzp_test_xxx"
}
```

### Verify Payment
```http
POST /api/order/payment/verify
Content-Type: application/json

{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx",
  "orderId": 123
}

Response:
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## ✅ Checklist

- [x] Razorpay keys added to `.env`
- [x] Payment endpoints implemented
- [x] Payment verification with signature
- [x] Payments table created
- [x] Admin panel shows payment status
- [x] Payment records inserted on verification
- [x] Frontend payment flow working
- [x] Security: Admin cannot edit payments

---

**🎉 Razorpay Integration Complete!**

Your payment system is fully functional and secure.

