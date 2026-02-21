import express from 'express';
import { createOrder, createPaymentOrder, verifyPayment, markOrderAsPaid } from '../controllers/orderController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);
router.put('/mark-paid/:orderId', authenticateAdmin, markOrderAsPaid);

export default router;

