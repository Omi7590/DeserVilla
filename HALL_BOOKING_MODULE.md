# Hall Booking Module Documentation

## Overview

The Hall Booking Module allows customers to book the café hall from home for events like birthdays, parties, meetings, etc. This module is fully integrated with the existing QR-based ordering system.

## Features

- ✅ Date and time slot selection (Morning/Evening/Full Day)
- ✅ Real-time availability checking
- ✅ Customer booking form with validation
- ✅ Razorpay advance payment integration
- ✅ Booking confirmation after payment
- ✅ Admin panel for managing bookings
- ✅ Transaction-safe booking logic (no double bookings)

## Database Schema

### `hall_bookings` Table

```sql
CREATE TABLE hall_bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    people_count INTEGER NOT NULL CHECK (people_count > 0),
    occasion VARCHAR(255),
    special_request TEXT,
    advance_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'COMPLETED', 'CANCELLED')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `blocked_slots` Table

```sql
CREATE TABLE blocked_slots (
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    booking_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES hall_bookings(id) ON DELETE CASCADE,
    UNIQUE(booking_date, time_slot)
);
```

## API Endpoints

### Customer APIs

#### 1. Check Availability
```
POST /api/hall/check-availability
Body: {
  "bookingDate": "2024-12-25",
  "timeSlot": "morning"
}
Response: {
  "success": true,
  "available": true,
  "bookingDate": "2024-12-25",
  "timeSlot": "morning"
}
```

#### 2. Create Booking
```
POST /api/hall/book
Body: {
  "customerName": "John Doe",
  "mobile": "9876543210",
  "bookingDate": "2024-12-25",
  "timeSlot": "morning",
  "peopleCount": 20,
  "occasion": "Birthday Party",
  "specialRequest": "Need decoration",
  "advanceAmount": 5000
}
Response: {
  "success": true,
  "booking": {
    "id": 1,
    "customerName": "John Doe",
    "bookingDate": "2024-12-25",
    "timeSlot": "morning",
    "advanceAmount": 5000,
    "paymentStatus": "PENDING",
    "bookingStatus": "CONFIRMED"
  }
}
```

#### 3. Create Payment Order
```
POST /api/hall/payment/create
Body: {
  "bookingId": 1,
  "amount": 5000
}
Response: {
  "success": true,
  "razorpayOrderId": "order_xxx",
  "amount": 500000,
  "currency": "INR",
  "key": "rzp_test_xxx"
}
```

#### 4. Verify Payment
```
POST /api/hall/payment/verify
Body: {
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "xxx",
  "bookingId": 1
}
Response: {
  "success": true,
  "message": "Payment verified and booking confirmed successfully"
}
```

### Admin APIs

#### 1. Get All Bookings
```
GET /api/hall/admin/hall-bookings?status=CONFIRMED
Headers: {
  "Authorization": "Bearer <admin_token>"
}
Response: {
  "success": true,
  "bookings": [...]
}
```

#### 2. Update Booking Status
```
PATCH /api/hall/admin/hall-booking-status/:bookingId
Headers: {
  "Authorization": "Bearer <admin_token>"
}
Body: {
  "bookingStatus": "COMPLETED"
}
Response: {
  "success": true,
  "booking": {
    "id": 1,
    "bookingStatus": "COMPLETED"
  }
}
```

## Frontend Pages

### 1. Hall Booking Page (`/hall-booking`)

**Features:**
- Date picker (prevents past dates)
- Time slot selection (Morning/Evening/Full Day)
- Real-time availability checking
- Multi-step form (Date/Slot → Details → Review)
- Form validation
- Mobile-responsive design

**Time Slots:**
- Morning: 9 AM - 2 PM (₹5,000)
- Evening: 5 PM - 10 PM (₹6,000)
- Full Day: 9 AM - 10 PM (₹10,000)

### 2. Checkout Page (`/hall-booking/checkout`)

**Features:**
- Booking summary display
- Razorpay payment integration
- Payment processing overlay
- Error handling

### 3. Success Page (`/hall-booking/success`)

**Features:**
- Booking confirmation
- Booking details display
- Booking ID
- Navigation options

## Admin Panel Integration

The admin dashboard includes a new "Hall Bookings" tab with:

- **View All Bookings**: List of all hall bookings
- **Filter by Status**: CONFIRMED, COMPLETED, CANCELLED
- **Booking Details**: Customer info, date, slot, occasion, special requests
- **Status Management**: Update booking status
- **Payment Status**: View payment status for each booking

## Payment Flow

1. Customer selects date and time slot
2. System checks availability
3. Customer fills booking form
4. System creates booking with PENDING payment status
5. Slot is temporarily blocked
6. Customer proceeds to payment
7. Razorpay order is created
8. Customer completes payment
9. Payment is verified via signature
10. Booking status updated to PAID
11. Slot is permanently blocked
12. Confirmation page shown

## Security Features

- ✅ Transaction-safe booking creation (prevents double bookings)
- ✅ Razorpay signature verification
- ✅ Slot locking mechanism
- ✅ Payment verification before confirmation
- ✅ Admin authentication required for management

## Pricing Configuration

Pricing is currently hardcoded in `HallBookingPage.jsx`:

```javascript
const slotPricing = {
  morning: 5000,
  evening: 6000,
  full_day: 10000
};
```

To make it configurable:
1. Add a `hall_pricing` table in database
2. Create admin API to manage pricing
3. Fetch pricing from backend in frontend

## Usage

### For Customers

1. Visit the website
2. Click "Book Hall" button (visible on menu page)
3. Select date and time slot
4. Fill booking details
5. Review and proceed to payment
6. Complete Razorpay payment
7. Receive confirmation

### For Admins

1. Login to admin panel
2. Click "Hall Bookings" tab
3. View all bookings
4. Filter by status if needed
5. Update booking status as needed
6. View customer details and special requests

## Error Handling

- **Slot Not Available**: Shows error message, customer can select different date/slot
- **Payment Failed**: Booking remains in PENDING status, slot is released
- **Payment Cancelled**: Booking remains in PENDING status, slot is released
- **Invalid Data**: Form validation prevents submission

## Future Enhancements

- [ ] Configurable pricing via admin panel
- [ ] Email/SMS notifications
- [ ] Booking calendar view
- [ ] Recurring bookings
- [ ] Booking cancellation by customer
- [ ] Refund processing
- [ ] Booking reminders

## Testing

### Test Scenarios

1. **Availability Check**
   - Check available slot → Should return available: true
   - Check booked slot → Should return available: false

2. **Booking Creation**
   - Create booking with valid data → Should succeed
   - Create booking for already booked slot → Should fail

3. **Payment Flow**
   - Complete payment → Booking should be confirmed
   - Cancel payment → Booking should remain pending
   - Failed payment → Booking should remain pending

4. **Admin Management**
   - Update booking status → Should update successfully
   - Filter bookings → Should show filtered results

## Troubleshooting

### Booking Not Created
- Check database connection
- Verify slot availability
- Check form validation errors

### Payment Not Processing
- Verify Razorpay keys in `.env`
- Check Razorpay dashboard for errors
- Verify payment signature

### Slot Still Available After Booking
- Check transaction isolation
- Verify blocked_slots table
- Check payment verification logic

## Support

For issues or questions:
1. Check backend logs
2. Verify database state
3. Check Razorpay dashboard
4. Review API responses

