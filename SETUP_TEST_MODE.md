# 🧪 Setup Razorpay Test Mode

## Step 1: Get Your Test Keys

1. **Login to Razorpay Dashboard**
   - Go to: https://dashboard.razorpay.com/
   - Login with your account

2. **Switch to Test Mode**
   - Look at the top right corner
   - Toggle the switch to **"Test Mode"**
   - The switch should show "Test Mode" (not "Live Mode")

3. **Get Test API Keys**
   - Go to: **Settings** → **API Keys**
   - Click **"Generate Test Key"** (if not already generated)
   - You'll see:
     - **Key ID**: Starts with `rzp_test_` (e.g., `rzp_test_ABC123xyz`)
     - **Key Secret**: Click "Show" to reveal (e.g., `XYZ789abc`)

## Step 2: Update Backend Configuration

Open `backend/.env` and replace the test keys:

```env
# Razorpay Configuration - TEST MODE
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_TEST_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Step 3: Update Frontend Configuration

Open `frontend/.env` and update:

```env
VITE_API_URL=http://192.168.56.1:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_ID
```

**Example:**
```env
VITE_API_URL=http://192.168.56.1:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
```

⚠️ **Important**: Use the SAME test Key ID in both files!

## Step 4: Restart Your Servers

```powershell
# Stop both servers (Ctrl+C in each terminal)

# Restart Backend
cd backend
npm run dev

# Restart Frontend (in new terminal)
cd frontend
npm run dev
```

## Step 5: Test Payment

### Test Card Details (Use These):

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

### Testing Steps:

1. **Open Menu**: http://localhost:5173/menu?table=1
2. **Add items** to cart
3. **Click "Proceed to Payment"**
4. **Razorpay modal opens**
5. **Enter test card details** (above)
6. **Click Pay**
7. **Payment succeeds instantly!**

## ✅ Verification Checklist

- [ ] Razorpay dashboard is in **Test Mode**
- [ ] Test keys copied from dashboard
- [ ] `backend/.env` updated with test keys
- [ ] `frontend/.env` updated with test Key ID
- [ ] Both keys start with `rzp_test_`
- [ ] Backend server restarted
- [ ] Frontend server restarted
- [ ] Test payment works with test card

## 🎯 What You'll See

### In Test Mode:
- Payment modal shows **"TEST MODE"** banner
- Test cards work instantly
- No real money involved
- All transactions visible in Razorpay Test Dashboard

### Success Indicators:
- ✅ Order status changes to "PAID"
- ✅ Payment appears in Admin Panel
- ✅ Razorpay Payment ID stored
- ✅ Success page displays

## 🔄 Common Test Cards

| Card Number | Result |
|-------------|--------|
| `4111 1111 1111 1111` | ✅ Success |
| `5555 5555 5555 4444` | ✅ Success (Mastercard) |
| `4000 0000 0000 0002` | ❌ Card Declined |
| `4000 0000 0000 9995` | ❌ Insufficient Funds |

**For all cards:**
- CVV: Any 3 digits (e.g., 123)
- Expiry: Any future date (e.g., 12/25)
- Name: Any name

## 🐛 Troubleshooting

### "Invalid Key ID" Error
- Check if key starts with `rzp_test_`
- Verify no extra spaces in .env file
- Restart servers after changing .env

### Payment Modal Not Opening
- Check browser console for errors
- Verify Razorpay script loaded
- Check if backend is running

### Payment Not Verifying
- Check backend console logs
- Verify database connection
- Check if Key Secret is correct

## 📞 Where to Get Help

1. **Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Razorpay Docs**: https://razorpay.com/docs/
3. **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/

---

**Once test mode works, you can switch to live mode later!** 🚀
