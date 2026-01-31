import pool from '../config/database.js';
import { razorpay } from '../config/razorpay.js';
import crypto from 'crypto';

export const createOrder = async (req, res, next) => {
  try {
    const { tableId, tableNumber, items, totalAmount } = req.body;
    
    if ((!tableId && !tableNumber) || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    
    // Validate table exists - support both tableId and tableNumber
    let tableCheck;
    if (tableNumber) {
      tableCheck = await pool.query(
        'SELECT id, table_number FROM tables WHERE table_number = $1',
        [tableNumber]
      );
    } else {
      tableCheck = await pool.query(
        'SELECT id, table_number FROM tables WHERE id = $1',
        [tableId]
      );
    }
    
    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    const actualTableId = tableCheck.rows[0].id;
    
    // Validate menu items and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const menuItem = await pool.query(
        'SELECT id, price, is_available FROM menu_items WHERE id = $1',
        [item.menuItemId]
      );
      
      if (menuItem.rows.length === 0) {
        return res.status(404).json({ error: `Menu item ${item.menuItemId} not found` });
      }
      
      if (!menuItem.rows[0].is_available) {
        return res.status(400).json({ error: `Menu item ${item.menuItemId} is not available` });
      }
      
      calculatedTotal += parseFloat(menuItem.rows[0].price) * item.quantity;
    }
    
    // Create order in database
    const orderResult = await pool.query(
      `INSERT INTO orders (table_id, total_amount, payment_status, order_status)
       VALUES ($1, $2, 'pending', 'pending')
       RETURNING id, table_id, total_amount, payment_status, order_status, created_at`,
      [actualTableId, calculatedTotal]
    );
    
    const order = orderResult.rows[0];
    
    // Insert order items
    for (const item of items) {
      const menuItem = await pool.query(
        'SELECT price FROM menu_items WHERE id = $1',
        [item.menuItemId]
      );
      
      await pool.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.menuItemId, item.quantity, menuItem.rows[0].price]
      );
    }
    
    res.json({
      success: true,
      order: {
        id: order.id,
        tableId: order.table_id,
        totalAmount: parseFloat(order.total_amount),
        paymentStatus: order.payment_status,
        orderStatus: order.order_status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }
    
    // Verify order exists
    const orderResult = await pool.query(
      'SELECT id, total_amount, payment_status FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.payment_status === 'paid') {
      return res.status(400).json({ error: 'Order already paid' });
    }
    
    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        error: 'Razorpay configuration missing. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file' 
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString()
      }
    });
    
    // Update order with Razorpay order ID
    await pool.query(
      'UPDATE orders SET razorpay_order_id = $1 WHERE id = $2',
      [razorpayOrder.id, orderId]
    );
    
    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return res.status(400).json({ error: 'Missing payment verification data' });
    }
    
    // Verify signature using Razorpay
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    
    // Get order amount for payment record
    const orderResult = await pool.query(
      'SELECT total_amount FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const orderAmount = parseFloat(orderResult.rows[0].total_amount);
    
    // Update order payment status
    await pool.query(
      `UPDATE orders 
       SET payment_status = 'paid', 
           razorpay_payment_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [razorpayPaymentId, orderId]
    );
    
    // Insert payment record (if payments table exists)
    try {
      // Check if payment record already exists
      const existingPayment = await pool.query(
        'SELECT id FROM payments WHERE order_id = $1',
        [orderId]
      );
      
      if (existingPayment.rows.length > 0) {
        // Update existing payment record
        await pool.query(
          `UPDATE payments 
           SET razorpay_payment_id = $1, 
               razorpay_order_id = $2,
               status = 'paid',
               updated_at = CURRENT_TIMESTAMP
           WHERE order_id = $3`,
          [razorpayPaymentId, razorpayOrderId, orderId]
        );
      } else {
        // Insert new payment record
        await pool.query(
          `INSERT INTO payments (order_id, razorpay_payment_id, razorpay_order_id, amount, status, created_at)
           VALUES ($1, $2, $3, $4, 'paid', CURRENT_TIMESTAMP)`,
          [orderId, razorpayPaymentId, razorpayOrderId, orderAmount]
        );
      }
    } catch (error) {
      // If payments table doesn't exist, just log and continue
      console.log('Payments table not found or error inserting payment:', error.message);
    }
    
    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

