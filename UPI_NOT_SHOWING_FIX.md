# 🔧 UPI Not Showing - Quick Fix Guide

## Why UPI is Not Showing

The main reason UPI doesn't appear as a separate option is:

**UPI must be enabled in your Razorpay Dashboard settings!**

---

## ✅ Quick Fix (3 Steps)

### Step 1: Enable UPI in Razorpay Dashboard

1. Go to: https://dashboard.razorpay.com
2. Login with your credentials
3. Click **Settings** (⚙️ icon)
4. Click **Payment Methods**
5. Find **UPI** section
6. Toggle **UPI** to **ON** ✅
7. Click **Save**

### Step 2: Restart Your Frontend

```bash
cd frontend
npm run dev
```

### Step 3: Clear Browser Cache

- Press `Ctrl + Shift + R` (Windows/Linux)
- Or `Cmd + Shift + R` (Mac)
- Or clear cache manually

---

## 🎯 What You'll See After Enabling

### Before (Current):
```
Payment Options:
├─ Cards
├─ Netbanking
├─ Wallet (UPI hidden inside)
└─ Pay Later
```

### After (Fixed):
```
Payment Options:
├─ UPI ← Will appear here!
├─ Cards
├─ Netbanking
└─ Wallet
```

---

## 🔍 How to Check if UPI is Enabled

### In Razorpay Dashboard:

1. Login to dashboard
2. Go to Settings → Payment Methods
3. Look for UPI section
4. Check if toggle is **ON** (green)

### Should Look Like:
```
┌─────────────────────────┐
│ UPI            [ON] ✅  │
│ ├─ UPI Collect [ON] ✅  │
│ ├─ UPI Intent  [ON] ✅  │
│ └─ UPI QR      [ON] ✅  │
└─────────────────────────┘
```

---

## 🚨 If UPI Option is Not in Dashboard

### Possible Reasons:

1. **Account Not Activated**
   - Complete KYC verification
   - Wait for approval (24-48 hours)

2. **Test Mode Limitation**
   - Some features limited in test mode
   - Try switching to Live mode to check

3. **Region Restriction**
   - UPI only available for Indian accounts
   - Verify account country is India

### Solution:

**Contact Razorpay Support:**
- Email: support@razorpay.com
- Phone: 1800-102-0555
- Live Chat: Available in dashboard

**Tell them:**
"I want to enable UPI payments but don't see the option in Payment Methods settings."

---

## 🔄 Alternative: Use Default Razorpay UI

If you want UPI to show up automatically without dashboard settings:

### Current Code (Updated):
```javascript
// frontend/src/utils/razorpay.js
method: {
  upi: true,      // ← Enables UPI
  card: true,
  netbanking: true,
  wallet: true
}
```

This tells Razorpay to show UPI if it's available on your account.

---

## 📱 How UPI Appears (When Enabled)

### Desktop View:
```
┌──────────────────────────┐
│  Payment Options         │
├──────────────────────────┤
│  UPI                     │
│  [Enter UPI ID]          │
│  [Scan QR]               │
│  [Select App]            │
├──────────────────────────┤
│  Cards                   │
│  Netbanking             │
│  Wallets                │
└──────────────────────────┘
```

### Mobile View:
```
┌─────────────────┐
│ UPI            │
│ [GPay]         │
│ [PhonePe]      │
│ [Paytm]        │
├─────────────────┤
│ Cards          │
│ Netbanking     │
│ Wallets        │
└─────────────────┘
```

---

## 🧪 Testing UPI (After Enabling)

### Test Mode:

1. Make a test payment
2. When Razorpay modal opens
3. Click on **UPI** option
4. Enter test UPI ID: `success@razorpay`
5. Payment will succeed automatically

### Live Mode:

1. Make a real payment
2. Click on **UPI** option
3. Enter real UPI ID (e.g., `9999999999@paytm`)
4. Approve in your UPI app
5. Payment completes

---

## 💡 Pro Tips

### 1. Enable All Payment Methods
For best results, enable:
- ✅ UPI
- ✅ Cards
- ✅ Netbanking
- ✅ Wallets

### 2. Test in Both Modes
- Test mode: For development
- Live mode: For real payments

### 3. Check Razorpay Status
Sometimes Razorpay has maintenance:
- Check: https://status.razorpay.com
- If UPI is down, it won't show

---

## 📊 Verification Checklist

After enabling UPI:

- [ ] Logged into Razorpay Dashboard
- [ ] Went to Settings → Payment Methods
- [ ] Found UPI section
- [ ] Toggled UPI to ON
- [ ] Saved changes
- [ ] Restarted frontend server
- [ ] Cleared browser cache
- [ ] Tested payment flow
- [ ] UPI option appears
- [ ] Can select UPI
- [ ] Payment works

---

## 🎯 Summary

**Main Issue:** UPI not enabled in Razorpay Dashboard

**Solution:**
1. Enable UPI in Dashboard (Settings → Payment Methods)
2. Restart frontend server
3. Clear browser cache
4. Test payment

**If Still Not Working:**
- Contact Razorpay support
- Verify account is activated
- Check KYC status
- Ensure account region is India

---

## 📞 Get Help

### Razorpay Support:
- **Email:** support@razorpay.com
- **Phone:** 1800-102-0555
- **Chat:** Dashboard (bottom right)
- **Docs:** https://razorpay.com/docs/

### What to Ask:
"I want to enable UPI payments in my checkout. How do I enable UPI in Payment Methods?"

---

**Once enabled in dashboard, UPI will appear automatically! 🚀**
