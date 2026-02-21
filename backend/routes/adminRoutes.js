import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getOrders,
  updateOrderStatus,
  markOrderAsPaid,
  getProducts,
  createProduct,
  updateProduct,
  updateProductAvailability,
  deleteProduct,
  forceDeleteProduct,
  getPayments,
  changePassword
} from '../controllers/adminController.js';
import {
  getPaymentsSummary,
  getPaymentsList,
  markOrderCashPaid
} from '../controllers/paymentController.js';
import {
  getNotificationsList,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationCount
} from '../controllers/notificationController.js';
import {
  getHallSettings,
  updateHallSetting
} from '../controllers/hallSettingsController.js';
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
router.put('/orders/mark-paid/:orderId', authenticateAdmin, markOrderAsPaid);
router.put('/orders/:id/mark-cash-paid', authenticateAdmin, markOrderCashPaid);

// Products/Menu Management
router.get('/products', authenticateAdmin, getProducts);
router.post('/products', authenticateAdmin, createProduct);
router.put('/products/:productId', authenticateAdmin, updateProduct);
router.patch('/products/:productId/availability', authenticateAdmin, updateProductAvailability);
router.delete('/products/:productId', authenticateAdmin, deleteProduct);
router.delete('/products/:productId/force', authenticateAdmin, forceDeleteProduct);

// Payments Management
router.get('/payments', authenticateAdmin, getPayments); // Legacy endpoint
router.get('/payments/list', authenticateAdmin, getPaymentsList);
router.get('/payments/summary', authenticateAdmin, getPaymentsSummary);

// Notifications Management
router.get('/notifications', authenticateAdmin, getNotificationsList);
router.get('/notifications/unread-count', authenticateAdmin, getUnreadNotificationCount);
router.patch('/notifications/:id/read', authenticateAdmin, markAsRead);
router.patch('/notifications/read-all', authenticateAdmin, markAllAsRead);

// Hall Settings Management
router.get('/hall-settings', authenticateAdmin, getHallSettings);
router.put('/hall-settings', authenticateAdmin, updateHallSetting);

export default router;
