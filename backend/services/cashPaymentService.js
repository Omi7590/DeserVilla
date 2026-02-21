// Cash Payment Service
// Handles all cash payment related business logic

import pool from '../config/database.js';

class CashPaymentService {
  /**
   * Mark a cash order as paid
   * @param {number} orderId - Order ID
   * @param {number} adminId - Admin user ID who marked it paid
   * @returns {Promise<Object>} Updated order
   */
  async markOrderAsPaid(orderId, adminId) {
    const connection = await pool.connect();
    
    try {
      await connection.query('BEGIN');

      // Get order details
      const orderResult = await connection.query(
        `SELECT id, payment_method, payment_status, total_amount 
         FROM orders 
         WHERE id = $1 
         FOR UPDATE`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      // Validate payment method
      if (order.payment_method !== 'CASH') {
        throw new Error('Only cash orders can be marked as paid manually');
      }

      // Check if already paid
      if (order.payment_status === 'paid') {
        throw new Error('Order is already marked as paid');
      }

      // Update order payment status
      const updateResult = await connection.query(
        `UPDATE orders 
         SET payment_status = 'paid', 
             paid_at = NOW(),
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, payment_status, paid_at`,
        [orderId]
      );

      await connection.query('COMMIT');

      return {
        success: true,
        order: updateResult.rows[0],
        message: 'Cash payment confirmed successfully'
      };
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get all pending cash orders
   * @returns {Promise<Array>} List of pending cash orders
   */
  async getPendingCashOrders() {
    const result = await pool.query(
      `SELECT 
        o.id,
        o.table_id,
        t.table_number,
        o.total_amount,
        o.payment_status,
        o.payment_method,
        o.order_status,
        o.created_at
       FROM orders o
       JOIN tables t ON o.table_id = t.id
       WHERE o.payment_method = 'CASH' 
         AND o.payment_status = 'pending'
       ORDER BY o.created_at DESC`
    );

    return result.rows;
  }

  /**
   * Get cash payment statistics
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Statistics
   */
  async getCashPaymentStats(startDate, endDate) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_cash_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_collected,
        SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as total_pending
       FROM orders
       WHERE payment_method = 'CASH'
         AND created_at BETWEEN $1 AND $2`,
      [startDate, endDate]
    );

    return result.rows[0];
  }
}

export default new CashPaymentService();
