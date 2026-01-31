# 🔧 How to Enable UPI in Razorpay

## ⚠️ Important: UPI Must Be Enabled in Dashboard

The reason you're not seeing UPI as a separate option is because **UPI needs to be enabled in your Razorpay Dashboard**.

---

## 📋 Step-by-Step: Enable UPI

### Step 1: Login to Razorpay Dashboard
```
URL: https://dashboard.razorpay.com
```

### Step 2: Go to Settings
1. Click on **Settings** (gear icon) in the left sidebar
2. Or click your profile icon → **Settings**

### Step 3: Navigate to Payment Methods
1. In Settings, find **"Payment Methods"** or **"Configuration"**
2. Click on **"Payment Methods"**

### Step 4: Enable UPI
1. Look for **"UPI"** in the list
2. Toggle the switch to **ON** (enable)
3. You should see:
   - ✅ UPI Collect (UPI ID)
   - ✅ UPI Intent (UPI Apps)
   - ✅ UPI QR Code

### Step 5: Save Changes
1. Click **"Save"** or **"Update"**
2. Changes take effect immediately

---

## 🎯 What to Enable

In Payment Methods, make sure these are enabled:

### UPI Options:
- ✅ **UPI** (Main toggle - MUST be ON)
- ✅ **UPI Collect** (for UPI ID payments)
- ✅ **UPI Intent** (for UPI app payments)
- ✅ **UPI QR** (for QR code payments)

### Other Payment Methods:
- ✅ **Cards** (Credit/Debit)
- ✅ **Netbanking**
- ✅ **Wallets**

---

## 🔍 Visual Guide

### Dashboard Navigation:
```
Razorpay Dashboard
    ↓
Settings (⚙️)
    ↓
Payment Methods
    ↓
UPI Section
    ↓
Toggle ON ✅
    ↓
Save
```

### What You Should See:
```
┌─────────────────────────────────┐
│ Payment Methods                 │
├─────────────────────────────────┤
│                                 │
│ UPI                    [ON] ✅  │
│ ├─ UPI Collect        [ON] ✅  │
│ ├─ UPI Intent         [ON] ✅  │
│ └─ UPI QR             [ON] ✅  │
│                                 │
│ Cards                  [ON] ✅  │
│ Netbanking            [ON] ✅  │
│ Wallets               [ON] ✅  │
│                                 │
└─────────────────────────────────┘
```

---

## 🧪 Test Mode vs Live Mode

### Important Note:
- UPI settings are **separate** for Test and Live modes
- Enable UPI in **both** modes if needed

### For Test Mode:
1. Switch to **Test Mode** (toggle at top)
2. Go to Settings → Payment Methods
3. Enable UPI
4. Test with test UPI ID: `success@razorpay`

### For Live Mode:
1. Switch to **Live Mode** (toggle at top)
2. Go to Settings → Payment Methods
3. Enable UPI
4. Real UPI payments will work

---

## 🚨 Common Issues

### Issue 1: UPI Option Not in Dashboard
**Reason:** Account not activated or KYC pending

**Solution:**
1. Complete KYC verification
2. Wait for account activation
3. Contact Razorpay support

### Issue 2: UPI Grayed Out
**Reason:** Not available in test mode or region restricted

**Solution:**
1. Check if you're in correct mode (Test/Live)
2. Verify account region (India only)
3. Contact support if issue persists

### Issue 3: UPI Still Not Showing in Checkout
**Possible Reasons:**
- Dashboard settings not saved
- Browser cache
- Old Razorpay SDK version

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart frontend server
4. Check Razorpay SDK is latest

---

## 🔄 After Enabling UPI

### What Happens:
1. ✅ UPI appears in payment modal
2. ✅ Customers can pay via UPI
3. ✅ All UPI apps supported
4. ✅ UPI ID payment works
5. ✅ QR code payment works

### How It Looks:
```
Payment Options:
├─ UPI ← Will appear here
├─ Cards
├─ Netbanking
└─ Wallets
```

---

## 📞 Need Help?

### If UPI is Not Available:

**Contact Razorpay Support:**
- Email: support@razorpay.com
- Phone: 1800-102-0555
- Dashboard: Live chat (bottom right)

**Tell them:**
"I want to enable UPI payments in my account. UPI option is not showing in Payment Methods settings."

---

## ✅ Verification Steps

After enabling UPI:

1. **Check Dashboard**
   - [ ] UPI toggle is ON
   - [ ] Settings saved successfully
   - [ ] No error messages

2. **Test Payment**
   - [ ] Restart frontend: `npm run dev`
   - [ ] Clear browser cache
   - [ ] Try making a payment
   - [ ] UPI should appear in options

3. **Test UPI Payment**
   - [ ] Click on UPI option
   - [ ] Enter test UPI ID: `success@razorpay`
   - [ ] Payment should succeed
   - [ ] Order should be created

---

## 🎯 Quick Checklist

Before testing UPI:

- [ ] Logged into Razorpay Dashboard
- [ ] In correct mode (Test/Live)
- [ ] Navigated to Settings → Payment Methods
- [ ] Found UPI section
- [ ] Toggled UPI to ON
- [ ] Enabled UPI Collect
- [ ] Enabled UPI Intent
- [ ] Enabled UPI QR
- [ ] Clicked Save
- [ ] Saw success message
- [ ] Cleared browser cache
- [ ] Restarted frontend server
- [ ] Tested payment flow

---

## 🔮 Alternative: Check Current Settings

### Via Razorpay API:

You can check if UPI is enabled using Razorpay API:

```bash
curl -u YOUR_KEY_ID:YOUR_KEY_SECRET \
  https://api.razorpay.com/v1/methods
```

This will show all enabled payment methods including UPI.

---

## 💡 Pro Tip

### Enable All Payment Methods:

For best customer experience, enable:
- ✅ UPI (Most popular in India)
- ✅ Cards (Credit/Debit)
- ✅ Netbanking (All banks)
- ✅ Wallets (Paytm, PhonePe, etc.)
- ✅ EMI (if applicable)

This gives customers maximum flexibility!

---

## 🎉 Summary

**To enable UPI:**
1. Login to Razorpay Dashboard
2. Go to Settings → Payment Methods
3. Toggle UPI to ON
4. Save changes
5. Clear cache and test

**If UPI option is not in dashboard:**
- Complete KYC first
- Contact Razorpay support
- Verify account is activated

---

**Once enabled, UPI will appear automatically in your payment modal! 🚀**
