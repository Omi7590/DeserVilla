import express from 'express';
import {
  checkAvailability,
  createBooking,
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure
} from '../controllers/hallController.js';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.post('/book', createBooking);
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);
router.post('/payment/failure', handlePaymentFailure);

export default router;

