# Razorpay Environment Variables Setup

## Quick Setup

Add these lines to your `backend/.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
```

## Steps:

1. Open `backend/.env` file
2. Add or update these two lines:
   ```
   RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
   RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
   ```
3. Save the file
4. Restart your backend server

## Verify Setup:

After adding the keys, restart the backend:
```bash
# Stop the current backend (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

## Test Payment:

1. Go to customer menu: `http://localhost:5173/menu`
2. Add items to cart
3. Click "Proceed to Payment"
4. Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## Production:

For production, replace test keys with your live keys from Razorpay Dashboard:
- Login to Razorpay Dashboard
- Go to Settings → API Keys
- Copy your Live Key ID and Secret
- Update `.env` file

---

**✅ After updating .env, restart backend server!**

