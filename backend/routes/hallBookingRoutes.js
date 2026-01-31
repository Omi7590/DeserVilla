import express from 'express';
import {
  checkAvailability,
  checkHourlyAvailability,
  createBooking,
  createHourlyBooking,
  createPaymentOrder,
  verifyPayment,
  getAllBookings,
  getBookingSlots,
  updateBookingStatus,
  markRemainingPaymentPaid
} from '../controllers/hallBookingController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (customer)
router.post('/check-availability', checkAvailability); // Legacy
router.post('/check-hourly-availability', checkHourlyAvailability); // New hourly
router.post('/book', createBooking); // Legacy
router.post('/book-hourly', createHourlyBooking); // New hourly
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);

// Admin routes
router.get('/admin/hall-bookings', authenticateAdmin, getAllBookings);
router.get('/admin/hall-booking-slots/:bookingId', authenticateAdmin, getBookingSlots);
router.patch('/admin/hall-booking-status/:bookingId', authenticateAdmin, updateBookingStatus);
router.patch('/admin/hall-booking-remaining-payment/:bookingId', authenticateAdmin, markRemainingPaymentPaid);

export default router;

