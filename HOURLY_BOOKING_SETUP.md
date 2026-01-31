# Hourly Slot-Based Hall Booking System

## Overview

The Hall Booking system has been upgraded to support **hourly slot-based booking** instead of fixed time slots (Morning/Evening/Full Day). Customers can now select multiple consecutive hourly slots from 10:00 AM to 8:00 PM.

## Features

- ✅ Hourly slot selection (10:00 AM - 8:00 PM)
- ✅ Multiple consecutive slot booking
- ✅ Real-time availability checking
- ✅ Dynamic price calculation (₹500 per hour)
- ✅ Prevents double booking
- ✅ Payment integration (Razorpay)
- ✅ Admin panel with slot visibility

## Database Setup

### Step 1: Run the Migration SQL

Execute the SQL script to add hourly booking support:

```bash
# Using phpMyAdmin or MySQL command line
mysql -u root -p cafe_ordering < database/hall_booking_hourly_schema.sql
```

Or manually run the SQL file in phpMyAdmin:
1. Open phpMyAdmin
2. Select `cafe_ordering` database
3. Go to SQL tab
4. Copy and paste contents of `database/hall_booking_hourly_schema.sql`
5. Click "Go"

### What the Migration Does

1. Adds `total_hours` and `total_amount` columns to `hall_bookings` table
2. Creates `hall_booking_slots` table for storing individual hour slots
3. Adds unique constraint on `(booking_date, start_time)` to prevent double booking
4. Adds indexes for performance

## API Endpoints

### Customer APIs

#### Check Hourly Availability
```
POST /api/hall/check-hourly-availability
Body: { "bookingDate": "2026-01-27" }
Response: {
  "success": true,
  "bookingDate": "2026-01-27",
  "slots": [
    {
      "hour": 10,
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "display": "10:00 - 11:00",
      "available": true,
      "booked": false,
      "past": false
    },
    ...
  ],
  "pricePerHour": 500
}
```

#### Create Hourly Booking
```
POST /api/hall/book-hourly
Body: {
  "customerName": "John Doe",
  "mobile": "9876543210",
  "bookingDate": "2026-01-27",
  "selectedSlots": [10, 11, 12, 13],  // Array of hour numbers
  "occasion": "Birthday",
  "specialRequest": "Need decorations"
}
Response: {
  "success": true,
  "bookingId": 123,
  "totalHours": 4,
  "totalAmount": 2000,
  "selectedSlots": [10, 11, 12, 13]
}
```

#### Payment APIs (Same as before)
- `POST /api/hall/payment/create` - Create Razorpay order
- `POST /api/hall/payment/verify` - Verify payment

### Admin APIs

#### Get All Bookings (with slots)
```
GET /api/hall/admin/hall-bookings?status=CONFIRMED
Response: {
  "success": true,
  "bookings": [
    {
      "id": 123,
      "customerName": "John Doe",
      "bookingDate": "2026-01-27",
      "totalHours": 4,
      "totalAmount": 2000,
      "slots": [
        {
          "startTime": "10:00:00",
          "endTime": "11:00:00",
          "display": "10:00 - 11:00"
        },
        ...
      ],
      ...
    }
  ]
}
```

#### Get Booking Slots
```
GET /api/hall/admin/hall-booking-slots/:bookingId
Response: {
  "success": true,
  "slots": [
    {
      "id": 1,
      "booking_id": 123,
      "booking_date": "2026-01-27",
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    }
  ]
}
```

## Business Rules

1. **Time Range**: Hall can only be booked between 10:00 AM and 8:00 PM
2. **Hourly Slots**: Each slot = 1 hour
3. **Price**: ₹500 per hour (fixed)
4. **Consecutive Slots**: Customer must select consecutive hours (e.g., 10-11, 11-12, 12-1)
5. **No Overlaps**: System prevents double booking of the same hour
6. **Past Slots**: Cannot book past time slots
7. **Payment Required**: Booking confirmed only after successful payment

## Frontend Usage

### Customer Flow

1. Navigate to `/hall-booking`
2. Select a booking date
3. System shows hourly slots (10 AM - 8 PM)
4. Select multiple consecutive slots
5. Fill customer details
6. Proceed to payment
7. Booking confirmed after payment

### Slot States

- **Available** (white): Can be selected
- **Selected** (orange): Currently selected
- **Booked** (gray): Already booked by someone else
- **Past** (gray): Time has passed (if booking today)

## Admin Panel

The admin panel (`/admin/hall-bookings`) now shows:

- Booking date
- Customer details
- **Booked hours** (e.g., "10:00 - 11:00, 11:00 - 12:00")
- Total hours
- Total amount
- Payment status
- Booking status

## Backward Compatibility

The system maintains backward compatibility:

- Legacy bookings (Morning/Evening/Full Day) still work
- Old API endpoints still functional
- Admin panel shows both hourly and legacy bookings

## Testing

### Test Payment Flow

1. Use Razorpay test credentials:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Test Scenarios

1. **Single Hour Booking**: Select 1 hour (e.g., 10:00 - 11:00)
2. **Multiple Hours**: Select 4 consecutive hours (e.g., 10:00 - 14:00)
3. **Double Booking Prevention**: Try booking an already booked slot
4. **Non-Consecutive**: Try selecting non-consecutive slots (should show error)
5. **Past Slots**: Try booking past time slots (should be disabled)

## Troubleshooting

### Issue: Slots not showing
- Check if date is selected
- Check browser console for API errors
- Verify backend is running

### Issue: Cannot select slots
- Ensure slots are available (not booked)
- Check if slots are consecutive
- Verify date is not in the past

### Issue: Payment fails
- Check Razorpay keys in `backend/.env`
- Verify backend server is running
- Check browser console for errors

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

1. Run the database migration
2. Restart backend server
3. Test the booking flow
4. Verify admin panel shows slots correctly

## Support

For issues or questions, check:
- Backend logs: `backend/server.js` console output
- Frontend console: Browser DevTools
- Database: phpMyAdmin for data verification

