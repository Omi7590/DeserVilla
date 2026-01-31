# 🚀 Razorpay Live Mode Setup Guide - Real Money Transactions

## ⚠️ IMPORTANT WARNING

**Before going live:**
- Test thoroughly in test mode
- Understand all payment flows
- Have proper error handling
- Backup your database
- Review all security measures
- Understand Razorpay fees and charges

---

## 📋 Prerequisites Checklist

Before you can accept real payments, you need:

- [ ] Valid business registration documents
- [ ] PAN Card (for Indian businesses)
- [ ] Bank account details
- [ ] GST Number (if applicable)
- [ ] Business address proof
- [ ] Identity proof of business owner
- [ ] Website/app with proper terms & privacy policy

---

## 🔐 Step 1: Complete KYC on Razorpay

### 1.1 Login to Razorpay Dashboard
```
URL: https://dashboard.razorpay.com
```

### 1.2 Navigate to Account & Settings
- Click on your profile icon (top right)
- Go to "Account & Settings"
- Click on "KYC & Activation"

### 1.3 Submit Required Documents

**For Proprietorship:**
- PAN Card
- Bank Account Proof (Cancelled Cheque/Bank Statement)
- Address Proof (Aadhaar/Passport/Voter ID)
- Business Proof (GST Certificate/Shop Act License)

**For Private Limited Company:**
- Certificate of Incorporation
- PAN Card of Company
- Bank Account Proof
- Address Proof
- Director's KYC (PAN, Aadhaar)
- MOA & AOA

**For Partnership Firm:**
- Partnership Deed
- PAN Card of Firm
- Bank Account Proof
- Partners' KYC Documents

### 1.4 Wait for Approval
- Razorpay team will review (usually 24-48 hours)
- You'll receive email updates
- May require additional documents

---

## 🔑 Step 2: Generate Live API Keys

### 2.1 After KYC Approval
Once your account is activated:

1. Go to **Settings** → **API Keys**
2. Click on **"Generate Live Keys"** button
3. You'll see two keys:
   - **Key ID**: `rzp_live_XXXXXXXXXXXXX`
   - **Key Secret**: `XXXXXXXXXXXXXXXXXXXXXXXX`

### 2.2 Important Notes
- ⚠️ **NEVER share your Key Secret publicly**
- ⚠️ **NEVER commit secrets to Git**
- ⚠️ Store secrets in environment variables only
- ⚠️ Key Secret is shown only once - save it securely

---

## 💳 Step 3: Configure Payment Methods

### 3.1 Enable Payment Methods
Go to **Settings** → **Payment Methods**

**Recommended to Enable:**
- ✅ Credit Cards (Visa, Mastercard, Amex, RuPay)
- ✅ Debit Cards
- ✅ Net Banking (All major banks)
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Wallets (Paytm, PhonePe, Mobikwik, etc.)

**Optional:**
- International Cards (if you want foreign payments)
- EMI Options
- Cardless EMI
- Pay Later options

### 3.2 International Payments
If you want to accept international cards:
1. Go to **Settings** → **Payment Methods**
2. Enable **"International Cards"**
3. Submit additional documents if required
4. Wait for approval (may take 2-3 days)

---

## 🔧 Step 4: Update Your Application

### 4.1 Update Backend Environment Variables

**File: `backend/.env`**

```env
# REPLACE TEST KEYS WITH LIVE KEYS
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET

# Update webhook secret (if using webhooks)
RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret

# Ensure production environment
NODE_ENV=production
```

### 4.2 Verify Configuration

**File: `backend/config/razorpay.js`**

Should already be reading from environment variables:
```javascript
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

✅ No code changes needed - just update .env file!

### 4.3 Restart Backend Server

```bash
cd backend
npm run dev
# or for production:
npm start
```

---

## 🔔 Step 5: Setup Webhooks (Recommended)

Webhooks notify your server about payment events in real-time.

### 5.1 Create Webhook Endpoint

Your app already has webhook handling. Just need to configure on Razorpay.

### 5.2 Configure on Razorpay Dashboard

1. Go to **Settings** → **Webhooks**
2. Click **"Create New Webhook"**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/razorpay
   ```
4. Select events to listen:
   - ✅ payment.authorized
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
   - ✅ refund.created

5. Set **Active** to ON
6. Copy the **Webhook Secret**
7. Add to your `.env`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXX
   ```

---

## 💰 Step 6: Understand Razorpay Fees

### Standard Pricing (as of 2024)
- **Domestic Cards**: 2% per transaction
- **International Cards**: 3% per transaction
- **UPI**: 2% per transaction
- **Net Banking**: 2% per transaction
- **Wallets**: 2% per transaction

### Additional Charges
- **Settlement**: Free (T+3 days standard)
- **Instant Settlement**: 0.25% extra (T+0 days)
- **Refunds**: Free (amount returned to customer)
- **Chargebacks**: ₹100 per chargeback

### GST
- 18% GST applicable on all fees

**Example Calculation:**
```
Order Amount: ₹1,000
Razorpay Fee: ₹20 (2%)
GST on Fee: ₹3.60 (18% of ₹20)
Total Deduction: ₹23.60
You Receive: ₹976.40
```

---

## 🏦 Step 7: Setup Bank Account for Settlements

### 7.1 Add Bank Account
1. Go to **Settings** → **Bank Accounts**
2. Click **"Add Bank Account"**
3. Enter details:
   - Account Holder Name
   - Account Number
   - IFSC Code
   - Account Type (Savings/Current)

### 7.2 Verify Bank Account
- Razorpay will send ₹1 to your account
- Check your bank statement
- Enter the exact amount received
- Account will be verified

### 7.3 Settlement Schedule
- **Standard**: T+3 days (3 working days)
- **Instant**: T+0 (within 30 minutes) - extra 0.25% fee
- **Custom**: Contact Razorpay for custom schedules

---

## 🔒 Step 8: Security Best Practices

### 8.1 Environment Variables
```bash
# NEVER commit these to Git
backend/.env
frontend/.env

# Add to .gitignore
echo "*.env" >> .gitignore
echo ".env.*" >> .gitignore
```

### 8.2 HTTPS Required
- ⚠️ **MUST use HTTPS in production**
- Razorpay requires SSL certificate
- Use Let's Encrypt (free) or paid SSL

### 8.3 Payment Signature Verification
Your app already does this:
```javascript
// backend/controllers/orderController.js
const generatedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
```
✅ Keep this verification - it's critical!

### 8.4 Rate Limiting
Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

### 8.5 Logging
- Log all payment attempts
- Log all failures
- Monitor for suspicious activity
- Set up alerts for failed payments

---

## 🧪 Step 9: Testing Live Mode

### 9.1 Test with Small Amount
1. Make a real payment of ₹1 or ₹10
2. Verify payment success
3. Check database updates
4. Verify webhook received
5. Check Razorpay dashboard

### 9.2 Test Refunds
1. Process a refund from dashboard
2. Verify refund in your system
3. Check customer receives refund

### 9.3 Test Different Payment Methods
- Credit Card
- Debit Card
- UPI
- Net Banking
- Wallets

---

## 📊 Step 10: Monitor & Maintain

### 10.1 Razorpay Dashboard
Monitor daily:
- Total transactions
- Success rate
- Failed payments
- Refunds
- Settlements

### 10.2 Set Up Alerts
Configure email alerts for:
- Failed payments
- Chargebacks
- High-value transactions
- Unusual activity

### 10.3 Reconciliation
Daily reconciliation:
- Match Razorpay settlements with bank deposits
- Verify all orders have payments
- Check for discrepancies

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid Key ID"
**Solution**: 
- Verify you're using live keys (rzp_live_)
- Check .env file is loaded
- Restart server after changing .env

### Issue 2: "Payment Failed"
**Possible Causes**:
- Insufficient funds
- Card declined
- Bank issues
- Network timeout

**Solution**: 
- Show clear error message to customer
- Offer retry option
- Provide alternative payment methods

### Issue 3: "Webhook Not Received"
**Solution**:
- Check webhook URL is accessible
- Verify HTTPS is working
- Check webhook secret is correct
- Review server logs

### Issue 4: "Settlement Delayed"
**Solution**:
- Check if KYC is complete
- Verify bank account
- Contact Razorpay support
- Check for holds/flags

---

## 📞 Support & Resources

### Razorpay Support
- **Email**: support@razorpay.com
- **Phone**: 1800-102-0555
- **Dashboard**: Live chat available
- **Documentation**: https://razorpay.com/docs/

### Your Application Logs
```bash
# Check backend logs
cd backend
npm run dev

# Check for errors
tail -f logs/error.log
```

---

## ✅ Go-Live Checklist

Before accepting real payments:

**Technical:**
- [ ] KYC completed and approved
- [ ] Live API keys generated
- [ ] Keys updated in .env file
- [ ] Backend server restarted
- [ ] HTTPS enabled on domain
- [ ] Webhooks configured
- [ ] Payment signature verification working
- [ ] Error handling implemented
- [ ] Logging enabled

**Business:**
- [ ] Bank account added and verified
- [ ] Payment methods enabled
- [ ] Pricing/fees understood
- [ ] Terms & conditions updated
- [ ] Privacy policy updated
- [ ] Refund policy defined
- [ ] Customer support ready

**Testing:**
- [ ] Test payment successful
- [ ] Order creation working
- [ ] Payment verification working
- [ ] Database updates correct
- [ ] Email notifications sent
- [ ] Refund process tested
- [ ] All payment methods tested

**Legal:**
- [ ] Business registered
- [ ] GST registered (if applicable)
- [ ] Terms of service published
- [ ] Privacy policy published
- [ ] Refund policy published

---

## 🎯 Quick Switch Guide

### From Test to Live (Summary)

1. **Complete KYC** on Razorpay Dashboard
2. **Generate Live Keys** from Settings → API Keys
3. **Update .env file**:
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXX
   RAZORPAY_KEY_SECRET=XXXXX
   ```
4. **Restart server**: `npm run dev` or `npm start`
5. **Test with ₹1** payment
6. **Monitor** Razorpay dashboard

That's it! No code changes needed. ✅

---

## 🔄 Switching Back to Test Mode

If you need to switch back:

```env
# backend/.env
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
```

Restart server. Done!

---

## 📝 Important Notes

1. **Test Thoroughly**: Test everything in test mode first
2. **Start Small**: Begin with small transactions
3. **Monitor Closely**: Watch for issues in first few days
4. **Customer Support**: Be ready to help customers
5. **Backup Plan**: Have alternative payment method ready
6. **Legal Compliance**: Ensure all legal requirements met
7. **Security First**: Never compromise on security

---

## 🎉 You're Ready!

Once you complete all steps above, you're ready to accept real payments!

**Remember:**
- Start with test mode
- Complete KYC properly
- Update keys carefully
- Test before going live
- Monitor continuously
- Provide good customer support

**Good luck with your live payments! 💰🚀**

---

**Need Help?**
- Razorpay Support: support@razorpay.com
- Documentation: https://razorpay.com/docs/
- Community: https://community.razorpay.com/
