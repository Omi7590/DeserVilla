# 🧪 Razorpay Test Mode - Complete Testing Guide

## ✅ Current Configuration Status

Your Razorpay is **ALREADY CONFIGURED** for test mode:

### Backend Configuration (`backend/.env`)
```env
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
```

✅ **Test Mode Active** - Notice the `rzp_test_` prefix on the key ID

---

## 🚀 How to Test Payments

### 1. Start Your Application

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

---

### 2. Test Regular Menu Orders

#### Step-by-Step:

1. **Open Customer Menu**
   - Navigate to: `http://localhost:5173/menu`

2. **Add Items to Cart**
   - Click on menu items
   - Add multiple items if you want

3. **Enter Table Number**
   - Enter any table number (e.g., 5)

4. **Proceed to Payment**
   - Click "Proceed to Payment" button
   - Razorpay checkout modal will open

5. **Use Test Card Details**
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123 (any 3 digits)
   Expiry: 12/25 (any future date)
   Name: Test User (any name)
   ```

6. **Complete Payment**
   - Click "Pay" button
   - Payment will be processed instantly in test mode

7. **Verify Success**
   - You'll be redirected to success page
   - Order status will show as "PAID"

---

### 3. Test Hall Bookings

#### Step-by-Step:

1. **Open Hall Booking**
   - Navigate to: `http://localhost:5173/hall-booking`

2. **Fill Booking Details**
   - Select date and time
   - Choose booking type (Full Day/Hourly)
   - Enter customer details
   - Enter advance payment amount

3. **Submit Booking**
   - Click "Book Hall" button
   - You'll be redirected to payment page

4. **Complete Payment**
   - Use same test card details as above
   - Payment will process instantly

5. **Verify in Admin Panel**
   - Go to: `http://localhost:5173/admin/hall-bookings`
   - Check payment status shows "PAID"

---

## 💳 Razorpay Test Cards

### Success Scenarios

| Card Number | Type | Result |
|-------------|------|--------|
| `4111 1111 1111 1111` | Visa | Success |
| `5555 5555 5555 4444` | Mastercard | Success |
| `3566 0020 2036 0505` | JCB | Success |

### Failure Scenarios (Optional Testing)

| Card Number | Result |
|-------------|--------|
| `4000 0000 0000 0002` | Card Declined |
| `4000 0000 0000 9995` | Insufficient Funds |

**Note:** For all test cards:
- CVV: Any 3 digits (e.g., 123)
- Expiry: Any future date (e.g., 12/25)
- Name: Any name

---

## 🔍 Verify Payments in Admin Panel

### Check Orders
1. Navigate to: `http://localhost:5173/admin/orders`
2. Look for your test order
3. Payment status should show **"PAID"** in green badge
4. Click on order to see full details

### Check Payments
1. Navigate to: `http://localhost:5173/admin/payments`
2. You'll see all payment transactions
3. Each payment shows:
   - Order ID
   - Amount
   - Status (PAID/PENDING/FAILED)
   - Razorpay Payment ID
   - Date & Time

### Check Hall Bookings
1. Navigate to: `http://localhost:5173/admin/hall-bookings`
2. View booking with payment status
3. See Razorpay Payment ID

---

## 🎯 What Happens During Test Payment

### Payment Flow:

```
1. Customer clicks "Proceed to Payment"
   ↓
2. Backend creates Razorpay order
   - Calls Razorpay API with test keys
   - Returns order ID
   ↓
3. Razorpay Checkout Modal Opens
   - Shows payment form
   - In test mode: accepts test cards
   ↓
4. Customer enters test card details
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/25
   ↓
5. Payment Processed (Instant in test mode)
   - Razorpay returns payment ID
   - Returns signature for verification
   ↓
6. Backend Verifies Payment
   - Validates signature using HMAC SHA256
   - Ensures payment is genuine
   ↓
7. Database Updated
   - Order status → 'paid'
   - Payment record inserted
   - Razorpay IDs stored
   ↓
8. Customer Redirected
   - Success page shown
   - Order confirmation displayed
```

---

## 🔒 Security in Test Mode

Even in test mode, the system maintains security:

1. **Signature Verification**
   - Every payment is verified using HMAC SHA256
   - Prevents tampering even with test data

2. **Read-Only Payment Status**
   - Admin cannot manually change payment status
   - Only Razorpay verification can update it

3. **Order-Payment Linking**
   - Each payment linked to specific order
   - Foreign key constraints maintained

---

## 🐛 Troubleshooting Test Payments

### Payment Modal Not Opening?

**Check:**
- Browser console for errors
- Razorpay script loaded (check Network tab)
- Backend is running on port 5000
- Frontend is running on port 5173

**Fix:**
```bash
# Clear browser cache
# Restart both servers
# Check .env file has correct keys
```

### Payment Not Verifying?

**Check:**
- Backend logs for errors
- Database connection is active
- `payments` table exists

**Fix:**
```bash
# Check backend console for errors
# Verify database schema is up to date
cd backend
npm run dev
```

### "Invalid Key" Error?

**Check:**
- `.env` file has correct test keys
- Keys start with `rzp_test_`
- No extra spaces in .env file

**Fix:**
```env
# Ensure exact format in backend/.env:
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
```

---

## 📊 Test Payment Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Database connected
- [ ] Test keys in `.env` file
- [ ] Razorpay script loads in browser
- [ ] Can add items to cart
- [ ] Payment modal opens
- [ ] Test card accepted
- [ ] Payment verifies successfully
- [ ] Order status updates to "PAID"
- [ ] Payment record appears in admin panel
- [ ] Success page displays

---

## 🎓 Understanding Test vs Live Mode

### Test Mode (Current)
- Key ID starts with: `rzp_test_`
- Uses test cards only
- No real money involved
- Instant processing
- Perfect for development

### Live Mode (Production)
- Key ID starts with: `rzp_live_`
- Uses real cards
- Real money transactions
- Actual payment processing
- Requires KYC verification

---

## 🔄 Switching to Live Mode (When Ready)

### Steps:

1. **Get Live Keys from Razorpay**
   - Login to Razorpay Dashboard
   - Complete KYC verification
   - Go to Settings → API Keys
   - Generate Live Keys

2. **Update Backend .env**
   ```env
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   ```

3. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Test with Real Card**
   - Use actual card details
   - Small amount first (₹1)
   - Verify everything works

---

## 💡 Pro Tips for Testing

1. **Test Different Scenarios**
   - Small orders (₹50)
   - Large orders (₹5000)
   - Multiple items
   - Single item

2. **Test Payment Failures**
   - Use failure test cards
   - Cancel payment modal
   - Check order status remains "pending"

3. **Test Admin Panel**
   - Filter by payment status
   - Search by order ID
   - Check date filters
   - Verify total calculations

4. **Test Hall Bookings**
   - Full day bookings
   - Hourly bookings
   - Different advance amounts
   - Multiple bookings same day

---

## ✅ Your Setup is Ready!

Everything is configured correctly for test mode. Just:

1. Start your servers
2. Use the test card: `4111 1111 1111 1111`
3. Test away!

**No additional configuration needed!** 🎉

---

## 📞 Need Help?

If you encounter issues:
1. Check backend console logs
2. Check browser console
3. Verify database connection
4. Ensure both servers are running
5. Check `.env` file format

---

**Happy Testing! 🚀**
