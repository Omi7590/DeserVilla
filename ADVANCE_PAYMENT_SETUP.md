# 50% Advance Payment System - Hall Booking

## Overview

The Hall Booking system now supports **50% advance payment** with the remaining 50% paid offline at the café. The system always shows the full price to customers but only charges 50% online.

## Features

- ✅ Full price always displayed (₹500 per hour)
- ✅ 50% advance payment online via Razorpay
- ✅ 50% remaining amount paid at café
- ✅ Clear UI showing both amounts
- ✅ Admin can mark remaining payment as paid
- ✅ Payment status tracking (ADVANCE_PAID, FULL_PAID)

## Database Setup

### Step 1: Run the Migration SQL

Execute the SQL script to add advance payment support:

```bash
# Using phpMyAdmin or MySQL command line
mysql -u root -p cafe_ordering < database/hall_booking_advance_payment_schema.sql
```

Or manually run in phpMyAdmin:
1. Open phpMyAdmin
2. Select `cafe_ordering` database
3. Go to SQL tab
4. Copy and paste contents of `database/hall_booking_advance_payment_schema.sql`
5. Click "Go"

### What the Migration Does

1. Adds `advance_amount` column to `hall_bookings`
2. Adds `remaining_amount` column to `hall_bookings`
3. Adds `payment_mode` column (ONLINE_ADVANCE / FULL)
4. Updates existing records with calculated values
5. Adds indexes for performance

## Pricing Logic

### Calculation

- **Total Amount** = `selected_hours × ₹500`
- **Advance Amount** = `total_amount / 2` (50%)
- **Remaining Amount** = `total_amount - advance_amount` (50%)

### Example

For 4 hours booking:
- Total: 4 × ₹500 = ₹2,000
- Advance: ₹2,000 / 2 = ₹1,000 (paid online)
- Remaining: ₹2,000 - ₹1,000 = ₹1,000 (paid at café)

## Customer Flow

1. **Select Date & Slots**
   - Customer selects booking date
   - Chooses hourly slots (10 AM - 8 PM)
   - System shows full price calculation

2. **View Pricing**
   - Total Amount: ₹X,XXX
   - Advance Payable Now: ₹X,XXX (50%)
   - Balance at Café: ₹X,XXX (50%)

3. **Fill Details**
   - Customer name
   - Mobile number
   - Occasion (optional)
   - Special requests (optional)

4. **Pay Advance**
   - Click "Pay Advance ₹X,XXX"
   - Redirected to Razorpay checkout
   - Pay only the advance amount (50%)

5. **Booking Confirmed**
   - After successful payment, booking is confirmed
   - Slots are reserved
   - Customer receives confirmation

## Payment Status

### Status Values

- **PENDING**: No payment made
- **ADVANCE_PAID**: 50% advance paid online
- **FULL_PAID**: Both advance and remaining paid
- **FAILED**: Payment failed
- **REFUNDED**: Payment refunded

### Status Flow

```
PENDING → ADVANCE_PAID → FULL_PAID
   ↓
FAILED
```

## Backend APIs

### Create Hourly Booking
```
POST /api/hall/book-hourly
Body: {
  "customerName": "John Doe",
  "mobile": "9876543210",
  "bookingDate": "2026-01-27",
  "selectedSlots": [10, 11, 12, 13],
  "occasion": "Birthday",
  "specialRequest": "Need decorations"
}
Response: {
  "success": true,
  "bookingId": 123,
  "totalHours": 4,
  "totalAmount": 2000,
  "advanceAmount": 1000,
  "remainingAmount": 1000
}
```

### Create Payment Order (Advance Only)
```
POST /api/hall/payment/create
Body: { "bookingId": 123 }
Response: {
  "success": true,
  "razorpayOrderId": "order_xxx",
  "amount": 100000,  // Advance amount in paise
  "advanceAmount": 1000,
  "totalAmount": 2000,
  "remainingAmount": 1000
}
```

### Verify Payment
```
POST /api/hall/payment/verify
Body: {
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature",
  "bookingId": 123
}
Response: {
  "success": true,
  "message": "Payment verified and booking confirmed"
}
```

### Admin: Mark Remaining Payment Paid
```
PATCH /api/hall/admin/hall-booking-remaining-payment/:bookingId
Headers: { "Authorization": "Bearer <admin_token>" }
Response: {
  "success": true,
  "message": "Remaining payment marked as paid",
  "booking": {
    "id": 123,
    "paymentStatus": "FULL_PAID",
    "totalPaid": 2000
  }
}
```

## Frontend UI

### Booking Page (`/hall-booking`)

**Price Display:**
- Shows total amount prominently
- Displays advance amount (50%)
- Shows remaining amount (50%)
- Clear visual separation

**Payment Button:**
- Text: "Pay Advance ₹X,XXX"
- Only processes advance payment
- Disabled until customer details filled

### Checkout Page (`/hall-booking/checkout`)

**Summary Section:**
- Total Amount breakdown
- Advance Payable Now (highlighted)
- Balance at Café (highlighted)
- Clear messaging about payment split

## Admin Panel

### Hall Bookings Page (`/admin/hall-bookings`)

**Display:**
- Total amount
- Advance paid amount
- Remaining amount
- Payment status badge

**Actions:**
- View booking details
- Update booking status
- **Mark Remaining Payment Paid** (button appears for ADVANCE_PAID bookings)

### Mark Remaining Payment Paid

1. Admin sees bookings with `ADVANCE_PAID` status
2. Button "Mark Remaining Paid" appears
3. Click button → Confirmation dialog
4. System updates:
   - `payment_status` → `FULL_PAID`
   - `remaining_amount` → `0`

## Business Rules

1. **Advance Mandatory**: Booking cannot be confirmed without advance payment
2. **Full Price Visible**: Always show total amount to customers
3. **50% Split**: Exactly 50% advance, 50% remaining
4. **No Overlaps**: Slots blocked after advance payment
5. **Past Slots**: Cannot book past time slots

## Testing

### Test Scenarios

1. **Single Hour Booking**
   - Total: ₹500
   - Advance: ₹250
   - Remaining: ₹250

2. **Multiple Hours**
   - 4 hours: Total ₹2,000, Advance ₹1,000, Remaining ₹1,000
   - 8 hours: Total ₹4,000, Advance ₹2,000, Remaining ₹2,000

3. **Payment Flow**
   - Create booking → Get advance amount
   - Pay via Razorpay → Verify payment
   - Check status: `ADVANCE_PAID`
   - Admin marks remaining → Status: `FULL_PAID`

### Razorpay Test Card

- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## Troubleshooting

### Issue: Advance amount not calculated correctly
- Check database migration ran successfully
- Verify `advance_amount` and `remaining_amount` columns exist
- Check booking creation response

### Issue: Payment status not updating
- Verify Razorpay keys in `.env`
- Check payment verification endpoint
- Review backend logs

### Issue: Admin cannot mark remaining paid
- Ensure booking status is `ADVANCE_PAID`
- Check `remaining_amount` > 0
- Verify admin authentication

## Environment Variables

Ensure these are set in `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cafe_ordering
DB_USER=root
DB_PASSWORD=
```

## Next Steps

1. Run database migration
2. Restart backend server
3. Test booking flow
4. Verify admin panel functionality
5. Test payment scenarios

## Support

For issues:
- Check backend logs
- Review browser console
- Verify database schema
- Test API endpoints directly

