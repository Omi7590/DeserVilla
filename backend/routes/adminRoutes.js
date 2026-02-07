import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  updateProduct,
  updateProductAvailability,
  deleteProduct,
  forceDeleteProduct,
  getPayments,
  changePassword
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Authentication
router.post('/login', adminLogin);
router.post('/change-password', authenticateAdmin, changePassword);

// Dashboard
router.get('/dashboard-stats', authenticateAdmin, getDashboardStats);

// Orders Management
router.get('/orders', authenticateAdmin, getOrders);
router.patch('/orders/:orderId/status', authenticateAdmin, updateOrderStatus);

// Products/Menu Management
router.get('/products', authenticateAdmin, getProducts);
router.post('/products', authenticateAdmin, createProduct);
router.put('/products/:productId', authenticateAdmin, updateProduct);
router.patch('/products/:productId/availability', authenticateAdmin, updateProductAvailability);
router.delete('/products/:productId', authenticateAdmin, deleteProduct);
router.delete('/products/:productId/force', authenticateAdmin, forceDeleteProduct);

// Payments
router.get('/payments', authenticateAdmin, getPayments);

export default router;
