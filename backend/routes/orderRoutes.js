import express from 'express';
import { createOrder, createPaymentOrder, verifyPayment } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);

export default router;

