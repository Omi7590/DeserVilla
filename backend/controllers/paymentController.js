import { getPaymentSummary, getAllPayments, markCashOrderAsPaid } from '../services/paymentService.js';

/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */

// GET /api/admin/payments/summary
export const getPaymentsSummary = async (req, res, next) => {
  try {
    const summary = await getPaymentSummary();

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error in getPaymentsSummary:', error);
    next(error);
  }
};

// GET /api/admin/payments
export const getPaymentsList = async (req, res, next) => {
  try {
    const { paymentMethod, paymentStatus, date, tableNumber, search } = req.query;

    const filters = {};
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (date) filters.date = date;
    if (tableNumber) filters.tableNumber = tableNumber;
    if (search) filters.search = search;

    const payments = await getAllPayments(filters);

    res.json({
      success: true,
      payments,
      count: payments.length
    });
  } catch (error) {
    console.error('Error in getPaymentsList:', error);
    next(error);
  }
};

// PUT /api/admin/orders/:id/mark-cash-paid
export const markOrderCashPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.adminId;

    // Validate order ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    const orderId = parseInt(id);

    const updatedOrder = await markCashOrderAsPaid(orderId, adminId);

    res.json({
      success: true,
      message: 'Cash payment confirmed successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error in markOrderCashPaid:', error);

    // Handle specific errors
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (error.message === 'Only cash orders can be marked as paid manually') {
      return res.status(400).json({
        success: false,
        error: 'Only cash orders can be marked as paid manually'
      });
    }

    if (error.message === 'Order is already marked as paid') {
      return res.status(400).json({
        success: false,
        error: 'Order is already marked as paid'
      });
    }

    next(error);
  }
};
