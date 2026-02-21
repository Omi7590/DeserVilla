import pool from '../config/database.js';

/**
 * Payment Service
 * Handles all payment-related business logic
 */

export const getPaymentSummary = async () => {
  try {
    // Get total revenue (all paid orders)
    const [totalRevenueResult] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE payment_status = 'paid'`
    );
    const totalRevenue = parseFloat(totalRevenueResult[0].total) || 0;

    // Get online revenue (paid online orders)
    const [onlineRevenueResult] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE payment_method = 'ONLINE' AND payment_status = 'paid'`
    );
    const onlineRevenue = parseFloat(onlineRevenueResult[0].total) || 0;

    // Get cash revenue (paid cash orders)
    const [cashRevenueResult] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE payment_method = 'CASH' AND payment_status = 'paid'`
    );
    const cashRevenue = parseFloat(cashRevenueResult[0].total) || 0;

    // Get pending cash amount
    const [pendingCashResult] = await pool.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE payment_method = 'CASH' AND payment_status = 'pending'`
    );
    const pendingCash = parseFloat(pendingCashResult[0].total) || 0;

    // Get total orders count
    const [totalOrdersResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM orders`
    );
    const totalOrders = parseInt(totalOrdersResult[0].count) || 0;

    // Get online orders count
    const [onlineOrdersResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM orders WHERE payment_method = 'ONLINE'`
    );
    const onlineOrders = parseInt(onlineOrdersResult[0].count) || 0;

    // Get cash orders count (both paid and pending)
    const [cashOrdersResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM orders WHERE payment_method = 'CASH'`
    );
    const cashOrders = parseInt(cashOrdersResult[0].count) || 0;

    // Get cash paid orders count
    const [cashPaidOrdersResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM orders WHERE payment_method = 'CASH' AND payment_status = 'paid'`
    );
    const cashPaidOrders = parseInt(cashPaidOrdersResult[0].count) || 0;

    // Get cash pending orders count
    const [cashPendingOrdersResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM orders WHERE payment_method = 'CASH' AND payment_status = 'pending'`
    );
    const cashPendingOrders = parseInt(cashPendingOrdersResult[0].count) || 0;

    return {
      totalRevenue,
      onlineRevenue,
      cashRevenue,
      pendingCash,
      totalOrders,
      onlineOrders,
      cashOrders,
      cashPaidOrders,
      cashPendingOrders
    };
  } catch (error) {
    console.error('Error getting payment summary:', error);
    throw error;
  }
};

export const getAllPayments = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        o.id,
        o.table_id,
        t.table_number,
        o.total_amount,
        o.payment_status,
        o.payment_method,
        o.order_status,
        o.razorpay_order_id,
        o.razorpay_payment_id,
        o.paid_at,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE 1=1
    `;

    const params = [];

    // Filter by payment method
    if (filters.paymentMethod) {
      query += ` AND o.payment_method = ?`;
      params.push(filters.paymentMethod);
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      query += ` AND o.payment_status = ?`;
      params.push(filters.paymentStatus);
    }

    // Filter by date
    if (filters.date) {
      query += ` AND DATE(o.created_at) = DATE(?)`;
      params.push(filters.date);
    }

    // Filter by table number
    if (filters.tableNumber) {
      query += ` AND t.table_number = ?`;
      params.push(parseInt(filters.tableNumber));
    }

    // Filter by search term (order ID or table number)
    if (filters.search) {
      query += ` AND (o.id = ? OR t.table_number = ?)`;
      const searchNum = parseInt(filters.search) || 0;
      params.push(searchNum, searchNum);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.execute(query, params);

    return rows.map(row => ({
      id: row.id,
      tableId: row.table_id,
      tableNumber: row.table_number,
      totalAmount: parseFloat(row.total_amount),
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      orderStatus: row.order_status,
      razorpayOrderId: row.razorpay_order_id,
      razorpayPaymentId: row.razorpay_payment_id,
      paidAt: row.paid_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting all payments:', error);
    throw error;
  }
};

export const markCashOrderAsPaid = async (orderId, adminId) => {
  const connection = await pool.connect();
  
  try {
    console.log(`[Payment Service] Marking order ${orderId} as paid...`);
    
    await connection.query('BEGIN');

    // Get order details with lock
    const orderResult = await connection.query(
      `SELECT id, payment_method, payment_status, total_amount, order_status 
       FROM orders 
       WHERE id = $1 
       FOR UPDATE`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    const order = orderResult.rows[0];
    console.log(`[Payment Service] Current status: ${order.payment_status}, Method: ${order.payment_method}`);

    // Validate payment method
    if (order.payment_method !== 'CASH') {
      throw new Error('Only cash orders can be marked as paid manually');
    }

    // Check if already paid
    if (order.payment_status === 'paid') {
      throw new Error('Order is already marked as paid');
    }

    // Update payment status
    console.log(`[Payment Service] Updating order ${orderId} to paid...`);
    await connection.query(
      `UPDATE orders 
       SET payment_status = 'paid', 
           paid_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [orderId]
    );

    await connection.query('COMMIT');
    console.log(`[Payment Service] Transaction committed for order ${orderId}`);

    // Get updated order
    const updatedResult = await connection.query(
      `SELECT 
        o.id,
        o.table_id,
        t.table_number,
        o.total_amount,
        o.payment_status,
        o.payment_method,
        o.order_status,
        o.paid_at,
        o.created_at,
        o.updated_at
       FROM orders o
       JOIN tables t ON o.table_id = t.id
       WHERE o.id = $1`,
      [orderId]
    );

    const updatedOrder = updatedResult.rows[0];
    console.log(`[Payment Service] Order ${orderId} updated successfully. New status: ${updatedOrder.payment_status}`);

    // Send notification for cash payment received
    try {
      const { notifyPaymentReceived } = await import('../services/notificationService.js');
      await notifyPaymentReceived(orderId, parseFloat(updatedOrder.total_amount), 'CASH');
    } catch (notifError) {
      console.error('Error sending payment notification:', notifError);
      // Don't fail the payment update if notification fails
    }

    return {
      id: updatedOrder.id,
      tableNumber: updatedOrder.table_number,
      totalAmount: parseFloat(updatedOrder.total_amount),
      paymentStatus: updatedOrder.payment_status,
      paymentMethod: updatedOrder.payment_method,
      orderStatus: updatedOrder.order_status,
      paidAt: updatedOrder.paid_at,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at
    };
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
  }
};
