import pool from '../config/database.js';
import { razorpay } from '../config/razorpay.js';
import crypto from 'crypto';

// Constants for hourly booking
const HOUR_PRICE = 500; // ₹500 per hour
const START_HOUR = 10; // 10:00 AM
const END_HOUR = 20; // 8:00 PM (20:00)

// Helper: Generate hourly slots for a day
const generateHourlySlots = () => {
  const slots = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
    slots.push({
      hour: hour,
      startTime,
      endTime,
      display: `${hour}:00 - ${hour + 1}:00`
    });
  }
  return slots;
};

// Check hourly slot availability
export const checkHourlyAvailability = async (req, res, next) => {
  try {
    const { bookingDate } = req.body;

    if (!bookingDate) {
      return res.status(400).json({ error: 'Booking date is required' });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ error: 'Cannot book past dates' });
    }

    // Get all booked slots for this date (only confirmed bookings with advance paid)
    const bookedSlotsResult = await pool.query(
      `SELECT start_time 
       FROM hall_booking_slots hbs
       JOIN hall_bookings hb ON hbs.booking_id = hb.id
       WHERE hbs.booking_date = ?
       AND hb.booking_status = 'CONFIRMED'
       AND (hb.payment_status = 'ADVANCE_PAID' OR hb.payment_status = 'FULL_PAID')`,
      [bookingDate]
    );

    const bookedTimes = bookedSlotsResult.rows.map(row => row.start_time);

    // Generate all available slots
    const allSlots = generateHourlySlots();
    
    // If it's today, filter out past hours
    const now = new Date();
    const currentHour = now.getHours();
    const isToday = selectedDate.getTime() === today.getTime();

    const availableSlots = allSlots.map(slot => {
      const isBooked = bookedTimes.includes(slot.startTime);
      const isPast = isToday && slot.hour < currentHour;
      
      return {
        hour: slot.hour,
        startTime: slot.startTime,
        endTime: slot.endTime,
        display: slot.display,
        available: !isBooked && !isPast,
        booked: isBooked,
        past: isPast
      };
    });

    res.json({
      success: true,
      bookingDate,
      slots: availableSlots,
      pricePerHour: HOUR_PRICE
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    next(error);
  }
};

// Check slot availability (legacy - for backward compatibility)
export const checkAvailability = async (req, res, next) => {
  try {
    const { bookingDate, timeSlot } = req.body;

    if (!bookingDate || !timeSlot) {
      return res.status(400).json({ error: 'Booking date and time slot are required' });
    }

    // Validate time slot
    const validSlots = ['morning', 'evening', 'full_day'];
    if (!validSlots.includes(timeSlot)) {
      return res.status(400).json({ error: 'Invalid time slot' });
    }

    // Check if slot is blocked
    const blockedCheck = await pool.query(
      `SELECT id FROM blocked_slots 
       WHERE booking_date = ? AND time_slot = ?`,
      [bookingDate, timeSlot]
    );

    // Also check confirmed bookings
    const bookingCheck = await pool.query(
      `SELECT id FROM hall_bookings 
       WHERE booking_date = ? 
       AND time_slot = ? 
       AND booking_status = 'CONFIRMED' 
       AND (payment_status = 'ADVANCE_PAID' OR payment_status = 'FULL_PAID')`,
      [bookingDate, timeSlot]
    );

    const isAvailable = blockedCheck.rows.length === 0 && bookingCheck.rows.length === 0;

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

// Create hourly booking (before payment)
export const createHourlyBooking = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      customerName,
      mobile,
      bookingDate,
      selectedSlots, // Array of hour numbers [10, 11, 12, 13]
      occasion,
      specialRequest
    } = req.body;

    // Validation
    if (!customerName || !mobile || !bookingDate || !selectedSlots || !Array.isArray(selectedSlots) || selectedSlots.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate slots are consecutive
    const sortedSlots = [...selectedSlots].sort((a, b) => a - b);
    for (let i = 1; i < sortedSlots.length; i++) {
      if (sortedSlots[i] !== sortedSlots[i - 1] + 1) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Slots must be consecutive' });
      }
    }

    // Validate slots are within range
    if (sortedSlots[0] < START_HOUR || sortedSlots[sortedSlots.length - 1] >= END_HOUR) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid time slot range' });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot book past dates' });
    }

    // Check if any selected slots are already booked (transaction-safe)
    const slotTimeStrings = sortedSlots.map(hour => `${hour.toString().padStart(2, '0')}:00:00`);
    
    const availabilityCheck = await client.query(
      `SELECT hbs.start_time 
       FROM hall_booking_slots hbs
       JOIN hall_bookings hb ON hbs.booking_id = hb.id
       WHERE hbs.booking_date = $1
       AND hbs.start_time IN (${slotTimeStrings.map((_, i) => `$${i + 2}`).join(', ')})
       AND hb.booking_status = 'CONFIRMED'
       AND (hb.payment_status = 'ADVANCE_PAID' OR hb.payment_status = 'FULL_PAID')
       FOR UPDATE`,
      [bookingDate, ...slotTimeStrings]
    );

    if (availabilityCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Some selected slots are already booked',
        bookedSlots: availabilityCheck.rows.map(row => row.start_time)
      });
    }

    // Calculate amounts (50% advance payment)
    const totalHours = sortedSlots.length;
    const totalAmount = totalHours * HOUR_PRICE;
    const advanceAmount = Math.round((totalAmount / 2) * 100) / 100; // Round to 2 decimals
    const remainingAmount = totalAmount - advanceAmount;

    // Create booking entry
    const bookingResult = await client.query(
      `INSERT INTO hall_bookings 
       (customer_name, mobile, booking_date, time_slot, people_count, occasion, special_request, advance_amount, remaining_amount, total_hours, total_amount, payment_mode, payment_status, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING')`,
      [
        customerName,
        mobile,
        bookingDate,
        'hourly', // Store as 'hourly' for new bookings
        1, // Default people count (can be updated if needed)
        occasion || null,
        specialRequest || null,
        advanceAmount,
        remainingAmount,
        totalHours,
        totalAmount,
        'ONLINE_ADVANCE'
      ]
    );

    // Get the inserted booking ID
    const idResult = await client.query('SELECT LAST_INSERT_ID() as id');
    const bookingId = idResult.rows[0]?.id;

    // Create slot entries (but don't commit yet - wait for payment)
    for (const hour of sortedSlots) {
      const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
      
      await client.query(
        `INSERT INTO hall_booking_slots (booking_id, booking_date, start_time, end_time)
         VALUES (?, ?, ?, ?)`,
        [bookingId, bookingDate, startTime, endTime]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      bookingId,
      totalHours,
      totalAmount,
      advanceAmount,
      remainingAmount,
      selectedSlots: sortedSlots,
      message: 'Booking created. Proceed to advance payment.'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    
    // Handle duplicate key error
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      return res.status(400).json({ error: 'Some slots are already booked. Please refresh and try again.' });
    }
    
    next(error);
  } finally {
    client.release();
  }
};

// Create booking (legacy - for backward compatibility)
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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate time slot
    const validSlots = ['morning', 'evening', 'full_day'];
    if (!validSlots.includes(timeSlot)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid time slot' });
    }

    // Check availability (transaction-safe)
    const blockedCheck = await client.query(
      `SELECT id FROM blocked_slots 
       WHERE booking_date = ? AND time_slot = ? 
       FOR UPDATE`,
      [bookingDate, timeSlot]
    );

    const bookingCheck = await client.query(
      `SELECT id FROM hall_bookings 
       WHERE booking_date = ? 
       AND time_slot = ? 
       AND booking_status = 'CONFIRMED' 
       AND (payment_status = 'ADVANCE_PAID' OR payment_status = 'FULL_PAID')
       FOR UPDATE`,
      [bookingDate, timeSlot]
    );

    if (blockedCheck.rows.length > 0 || bookingCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Slot is not available' });
    }

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO hall_bookings 
       (customer_name, mobile, booking_date, time_slot, people_count, occasion, special_request, advance_amount, payment_status, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING')`,
      [customerName, mobile, bookingDate, timeSlot, peopleCount, occasion || null, specialRequest || null, advanceAmount]
    );

    // Get the inserted booking ID
    const idResult = await client.query('SELECT LAST_INSERT_ID() as id');
    const bookingId = idResult.rows[0]?.id;

    // Block slot
    await client.query(
      `INSERT INTO blocked_slots (booking_date, time_slot, booking_id)
       VALUES (?, ?, ?)`,
      [bookingDate, timeSlot, bookingId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      bookingId,
      message: 'Booking created. Proceed to payment.'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Create Razorpay payment order (for advance payment)
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        error: 'Razorpay configuration missing. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file' 
      });
    }

    // Verify booking exists and is pending payment
    const bookingResult = await pool.query(
      `SELECT id, total_amount, advance_amount, remaining_amount, payment_status, payment_mode, booking_date, time_slot 
       FROM hall_bookings 
       WHERE id = ?`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    if (booking.payment_status === 'ADVANCE_PAID' || booking.payment_status === 'FULL_PAID') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    // Use advance_amount for payment (50% of total)
    const advanceAmount = parseFloat(booking.advance_amount || (booking.total_amount / 2));

    // Create Razorpay order for advance amount only
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(advanceAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `hall_booking_advance_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        type: 'hall_booking_advance',
        totalAmount: booking.total_amount.toString(),
        advanceAmount: advanceAmount.toString()
      }
    });

    // Update booking with Razorpay order ID
    await pool.query(
      `UPDATE hall_bookings 
       SET razorpay_order_id = ? 
       WHERE id = ?`,
      [razorpayOrder.id, bookingId]
    );

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // This is the advance amount in paise
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      advanceAmount: advanceAmount,
      totalAmount: parseFloat(booking.total_amount),
      remainingAmount: parseFloat(booking.remaining_amount)
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
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Get booking details
    const bookingResult = await client.query(
      `SELECT id, booking_date, time_slot, payment_status, total_hours 
       FROM hall_bookings 
       WHERE id = ? 
       FOR UPDATE`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    if (booking.payment_status === 'PAID') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Booking already paid' });
    }

    // Update booking payment status to ADVANCE_PAID
    await client.query(
      `UPDATE hall_bookings 
       SET payment_status = 'ADVANCE_PAID', 
           razorpay_payment_id = ?,
           booking_status = 'CONFIRMED',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [razorpayPaymentId, bookingId]
    );

    // For hourly bookings, slots are already created, just ensure they're marked as confirmed
    // For legacy bookings, ensure slot is blocked
    if (booking.time_slot === 'hourly') {
      // Slots already exist in hall_booking_slots, no need to do anything
    } else {
      // Legacy booking - ensure slot is blocked
      try {
        await client.query(
          `INSERT INTO blocked_slots (booking_date, time_slot, booking_id)
           VALUES (?, ?, ?)`,
          [booking.booking_date, booking.time_slot, bookingId]
        );
      } catch (insertError) {
        // If duplicate key error, update instead
        if (insertError.code === 'ER_DUP_ENTRY' || insertError.code === '23505') {
          await client.query(
            `UPDATE blocked_slots 
             SET booking_id = ? 
             WHERE booking_date = ? AND time_slot = ?`,
            [bookingId, booking.booking_date, booking.time_slot]
          );
        } else {
          throw insertError;
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      bookingId: bookingId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Payment verification error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bookingId: req.body?.bookingId,
      razorpayOrderId: req.body?.razorpayOrderId
    });
    
    // Return more detailed error response
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Payment verification failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    client.release();
  }
};

// Get all bookings (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    // Build query with optional columns (handle missing columns gracefully)
    // First, try to select all columns, but handle errors if they don't exist
    let query = `
      SELECT 
        id,
        customer_name,
        mobile,
        booking_date,
        time_slot,
        people_count,
        occasion,
        special_request,
        advance_amount,
        IFNULL(remaining_amount, 0) as remaining_amount,
        total_hours,
        IFNULL(total_amount, IFNULL(advance_amount, 0)) as total_amount,
        IFNULL(payment_mode, 'ONLINE_ADVANCE') as payment_mode,
        payment_status,
        booking_status,
        razorpay_payment_id,
        created_at,
        updated_at
      FROM hall_bookings
    `;

    const params = [];
    if (status) {
      query += ' WHERE booking_status = ?';
      params.push(status);
    }

    query += ' ORDER BY booking_date DESC, created_at DESC';

    const result = await pool.query(query, params);

    // Get slots for each booking
    const bookings = await Promise.all(result.rows.map(async (booking) => {
      let slots = [];
      
      // Check if it's an hourly booking (new system) or legacy booking
      if (booking.time_slot === 'hourly' || booking.total_hours) {
        // Get hourly slots
        const slotsResult = await pool.query(
          `SELECT start_time, end_time 
           FROM hall_booking_slots 
           WHERE booking_id = ? 
           ORDER BY start_time`,
          [booking.id]
        );
        slots = slotsResult.rows.map(row => ({
          startTime: row.start_time,
          endTime: row.end_time,
          display: `${row.start_time.substring(0, 5)} - ${row.end_time.substring(0, 5)}`
        }));
      }

      return {
        id: booking.id,
        customerName: booking.customer_name,
        mobile: booking.mobile,
        bookingDate: booking.booking_date,
        timeSlot: booking.time_slot,
        peopleCount: booking.people_count,
        occasion: booking.occasion,
        specialRequest: booking.special_request,
        advanceAmount: parseFloat(booking.advance_amount || 0),
        remainingAmount: parseFloat(booking.remaining_amount || 0),
        totalHours: booking.total_hours || null,
        totalAmount: parseFloat(booking.total_amount || booking.advance_amount || 0),
        paymentMode: booking.payment_mode || 'ONLINE_ADVANCE',
        paymentStatus: booking.payment_status,
        bookingStatus: booking.booking_status,
        razorpayPaymentId: booking.razorpay_payment_id,
        slots: slots,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      };
    }));

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching hall bookings:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    // Return more specific error
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        error: 'Database schema mismatch. Please run the migration scripts: hall_booking_hourly_schema.sql and hall_booking_advance_payment_schema.sql',
        details: error.sqlMessage
      });
    }
    
    next(error);
  }
};

// Get booking slots (Admin)
export const getBookingSlots = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const slotsResult = await pool.query(
      `SELECT id, booking_id, booking_date, start_time, end_time, created_at
       FROM hall_booking_slots
       WHERE booking_id = ?
       ORDER BY start_time`,
      [bookingId]
    );

    res.json({
      success: true,
      slots: slotsResult.rows
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;

    const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    // Get booking details
    const bookingResult = await pool.query(
      `SELECT id, booking_date, time_slot FROM hall_bookings WHERE id = ?`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Update booking status
    await pool.query(
      `UPDATE hall_bookings 
       SET booking_status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [bookingStatus, bookingId]
    );

    // If cancelled, we can optionally delete the slots (or keep them for history)
    // For now, we'll keep them but mark booking as cancelled

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Mark remaining payment as paid (Admin)
export const markRemainingPaymentPaid = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Get booking details
    const bookingResult = await pool.query(
      `SELECT id, payment_status, remaining_amount, total_amount, advance_amount
       FROM hall_bookings 
       WHERE id = ?`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check if advance is already paid
    if (booking.payment_status !== 'ADVANCE_PAID') {
      return res.status(400).json({ 
        error: 'Advance payment must be paid before marking remaining as paid',
        currentStatus: booking.payment_status
      });
    }

    // Check if remaining amount exists
    const remainingAmount = parseFloat(booking.remaining_amount || 0);
    if (remainingAmount <= 0) {
      return res.status(400).json({ error: 'No remaining amount to mark as paid' });
    }

    // Update payment status to FULL_PAID
    await pool.query(
      `UPDATE hall_bookings 
       SET payment_status = 'FULL_PAID', 
           remaining_amount = 0,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [bookingId]
    );

    res.json({
      success: true,
      message: 'Remaining payment marked as paid successfully',
      booking: {
        id: bookingId,
        paymentStatus: 'FULL_PAID',
        totalPaid: parseFloat(booking.total_amount || 0)
      }
    });
  } catch (error) {
    console.error('Error marking remaining payment:', error);
    next(error);
  }
};
