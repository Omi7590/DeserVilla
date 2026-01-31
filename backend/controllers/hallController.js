import pool from '../config/database.js';
import { razorpay } from '../config/razorpay.js';

// Check slot availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { bookingDate, timeSlot } = req.body;

    if (!bookingDate || !timeSlot) {
      return res.status(400).json({ error: 'Booking date and time slot are required' });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDateObj = new Date(bookingDate);
    
    if (bookingDateObj < today) {
      return res.status(400).json({ error: 'Cannot book dates in the past' });
    }

    // Check if slot is blocked
    const blockedSlot = await pool.query(
      'SELECT id FROM blocked_slots WHERE booking_date = $1 AND time_slot = $2',
      [bookingDate, timeSlot]
    );

    // Also check confirmed bookings with paid status
    const confirmedBooking = await pool.query(
      `SELECT id FROM hall_bookings 
       WHERE booking_date = $1 
       AND time_slot = $2 
       AND payment_status = 'PAID' 
       AND booking_status = 'CONFIRMED'`,
      [bookingDate, timeSlot]
    );

    const isAvailable = blockedSlot.rows.length === 0 && confirmedBooking.rows.length === 0;

    res.json({
      success: true,
      available: isAvailable,
      bookingDate,
      timeSlot
    });
  } catch (error) {
    next(error);
  }
};

// Create booking (before payment)
export const createBooking = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      customerName,
      mobile,
      bookingDate,
      timeSlot,
      peopleCount,
      occasion,
      specialRequest,
      advanceAmount
    } = req.body;

    // Validation
    if (!customerName || !mobile || !bookingDate || !timeSlot || !peopleCount || !advanceAmount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDateObj = new Date(bookingDate);
    
    if (bookingDateObj < today) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot book dates in the past' });
    }

    // Check availability (with lock)
    const availabilityCheck = await client.query(
      `SELECT id FROM blocked_slots 
       WHERE booking_date = $1 AND time_slot = $2
       FOR UPDATE`,
      [bookingDate, timeSlot]
    );

    const confirmedBooking = await client.query(
      `SELECT id FROM hall_bookings 
       WHERE booking_date = $1 
       AND time_slot = $2 
       AND payment_status = 'PAID' 
       AND booking_status = 'CONFIRMED'
       FOR UPDATE`,
      [bookingDate, timeSlot]
    );

    if (availabilityCheck.rows.length > 0 || confirmedBooking.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This slot is no longer available' });
    }

    // Create booking with PENDING payment status
    const bookingResult = await client.query(
      `INSERT INTO hall_bookings 
       (customer_name, mobile, booking_date, time_slot, people_count, occasion, special_request, advance_amount, payment_status, booking_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', 'CONFIRMED')
       RETURNING id, customer_name, mobile, booking_date, time_slot, people_count, occasion, special_request, advance_amount, payment_status, booking_status, created_at`,
      [customerName, mobile, bookingDate, timeSlot, peopleCount, occasion || null, specialRequest || null, advanceAmount]
    );

    const booking = bookingResult.rows[0];

    // Temporarily block the slot
    await client.query(
      'INSERT INTO blocked_slots (booking_date, time_slot, booking_id) VALUES ($1, $2, $3)',
      [bookingDate, timeSlot, booking.id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      booking: {
        id: booking.id,
        customerName: booking.customer_name,
        mobile: booking.mobile,
        bookingDate: booking.booking_date,
        timeSlot: booking.time_slot,
        peopleCount: booking.people_count,
        occasion: booking.occasion,
        specialRequest: booking.special_request,
        advanceAmount: parseFloat(booking.advance_amount),
        paymentStatus: booking.payment_status,
        bookingStatus: booking.booking_status
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Create Razorpay payment order for booking
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Booking ID and amount are required' });
    }

    // Verify booking exists and is pending payment
    const bookingResult = await pool.query(
      'SELECT id, advance_amount, payment_status FROM hall_bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    if (booking.payment_status === 'PAID') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `hall_booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        type: 'hall_booking'
      }
    });

    // Update booking with Razorpay order ID
    await pool.query(
      'UPDATE hall_bookings SET razorpay_order_id = $1 WHERE id = $2',
      [razorpayOrder.id, bookingId]
    );

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    next(error);
  }
};

// Verify payment and confirm booking
export const verifyPayment = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Missing payment verification data' });
    }

    // Verify signature
    const crypto = require('crypto');
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update booking payment status
    const updateResult = await client.query(
      `UPDATE hall_bookings 
       SET payment_status = 'PAID', 
           razorpay_payment_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, customer_name, booking_date, time_slot, payment_status, booking_status`,
      [razorpayPaymentId, bookingId]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Keep the blocked slot (booking is confirmed)
    // The blocked_slots entry already exists from createBooking

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed',
      booking: {
        id: updateResult.rows[0].id,
        customerName: updateResult.rows[0].customer_name,
        bookingDate: updateResult.rows[0].booking_date,
        timeSlot: updateResult.rows[0].time_slot,
        paymentStatus: updateResult.rows[0].payment_status,
        bookingStatus: updateResult.rows[0].booking_status
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Handle payment failure - release slot
export const handlePaymentFailure = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { bookingId } = req.body;

    if (!bookingId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Get booking details
    const bookingResult = await client.query(
      'SELECT id, booking_date, time_slot FROM hall_bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Update payment status to FAILED
    await client.query(
      'UPDATE hall_bookings SET payment_status = $1, booking_status = $2 WHERE id = $3',
      ['FAILED', 'CANCELLED', bookingId]
    );

    // Release the blocked slot
    await client.query(
      'DELETE FROM blocked_slots WHERE booking_id = $1',
      [bookingId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Slot released due to payment failure'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

