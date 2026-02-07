import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ==================== AUTHENTICATION ====================

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const result = await pool.query(
      'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString().slice(0, 19).replace('T', ' ');
    
    // Total orders today
    const ordersTodayResult = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = DATE($1)`,
      [todayStart]
    );
    const totalOrdersToday = parseInt(ordersTodayResult.rows[0].count) || 0;
    
    // Total revenue today (only paid orders)
    const revenueTodayResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE DATE(created_at) = DATE($1) AND payment_status = 'paid'`,
      [todayStart]
    );
    const totalRevenueToday = parseFloat(revenueTodayResult.rows[0].total) || 0;
    
    // Pending orders count
    const pendingResult = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'`
    );
    const pendingCount = parseInt(pendingResult.rows[0].count) || 0;
    
    // Preparing orders count
    const preparingResult = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE order_status = 'preparing'`
    );
    const preparingCount = parseInt(preparingResult.rows[0].count) || 0;
    
    // Served orders count
    const servedResult = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE order_status = 'served'`
    );
    const servedCount = parseInt(servedResult.rows[0].count) || 0;
    
    res.json({
      success: true,
      stats: {
        totalOrdersToday,
        totalRevenueToday,
        pendingCount,
        preparingCount,
        servedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ORDERS MANAGEMENT ====================

export const getOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, tableNumber, date } = req.query;
    
    let query = `
      SELECT 
        o.id,
        o.table_id,
        t.table_number,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.razorpay_order_id,
        o.razorpay_payment_id,
        o.created_at,
        o.updated_at
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND o.order_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (paymentStatus) {
      query += ` AND o.payment_status = $${paramIndex}`;
      params.push(paymentStatus);
      paramIndex++;
    }
    
    if (tableNumber) {
      query += ` AND t.table_number = $${paramIndex}`;
      params.push(parseInt(tableNumber));
      paramIndex++;
    }
    
    if (date) {
      query += ` AND DATE(o.created_at) = DATE($${paramIndex})`;
      params.push(date);
      paramIndex++;
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const result = await pool.query(query, params);
    
    // Get order items for each order
    const orders = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT 
            oi.id,
            oi.quantity,
            oi.price,
            mi.name,
            mi.category,
            mi.id as menu_item_id
           FROM order_items oi
           JOIN menu_items mi ON oi.menu_item_id = mi.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        
        return {
          id: order.id,
          tableId: order.table_id,
          tableNumber: order.table_number,
          totalAmount: parseFloat(order.total_amount),
          paymentStatus: order.payment_status,
          orderStatus: order.order_status,
          razorpayOrderId: order.razorpay_order_id,
          razorpayPaymentId: order.razorpay_payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsResult.rows.map(item => ({
            id: item.id,
            menuItemId: item.menu_item_id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: parseFloat(item.price)
          }))
        };
      })
    );
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    
    const validStatuses = ['pending', 'preparing', 'served'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status. Must be: pending, preparing, or served' });
    }
    
    await pool.query(
      `UPDATE orders 
       SET order_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [orderStatus, orderId]
    );
    
    // Fetch updated order
    const updatedResult = await pool.query(
      `SELECT id, order_status FROM orders WHERE id = $1`,
      [orderId]
    );
    
    if (updatedResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      success: true,
      order: {
        id: updatedResult.rows[0].id,
        orderStatus: updatedResult.rows[0].order_status
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PRODUCTS/MENU MANAGEMENT ====================

export const getProducts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        name,
        price,
        category,
        description,
        image_url,
        is_available,
        created_at
       FROM menu_items
       ORDER BY category, name`
    );
    
    const products = result.rows.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      category: item.category,
      description: item.description,
      imageUrl: item.image_url,
      isAvailable: Boolean(item.is_available),
      createdAt: item.created_at
    }));
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, description, imageUrl, isAvailable } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    await pool.query(
      `INSERT INTO menu_items (name, price, category, description, image_url, is_available)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, parseFloat(price), category, description || null, imageUrl || null, isAvailable !== false]
    );
    
    // Get the inserted product
    const [insertResult] = await pool.pool.execute('SELECT LAST_INSERT_ID() as id');
    const productId = insertResult[0].id;
    
    const productResult = await pool.query(
      `SELECT * FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    res.status(201).json({
      success: true,
      product: {
        id: productResult.rows[0].id,
        name: productResult.rows[0].name,
        price: parseFloat(productResult.rows[0].price),
        category: productResult.rows[0].category,
        description: productResult.rows[0].description,
        imageUrl: productResult.rows[0].image_url,
        isAvailable: Boolean(productResult.rows[0].is_available),
        createdAt: productResult.rows[0].created_at
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, price, category, description, imageUrl } = req.body;
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }
    if (price !== undefined) {
      if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }
      updates.push(`price = $${paramIndex}`);
      params.push(parseFloat(price));
      paramIndex++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }
    if (imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      params.push(imageUrl);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(productId);
    
    await pool.query(
      `UPDATE menu_items SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );
    
    // Fetch updated product
    const productResult = await pool.query(
      `SELECT * FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      product: {
        id: productResult.rows[0].id,
        name: productResult.rows[0].name,
        price: parseFloat(productResult.rows[0].price),
        category: productResult.rows[0].category,
        description: productResult.rows[0].description,
        imageUrl: productResult.rows[0].image_url,
        isAvailable: Boolean(productResult.rows[0].is_available),
        createdAt: productResult.rows[0].created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductAvailability = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { isAvailable } = req.body;
    
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'isAvailable must be a boolean' });
    }
    
    await pool.query(
      `UPDATE menu_items SET is_available = $1 WHERE id = $2`,
      [isAvailable, productId]
    );
    
    const result = await pool.query(
      `SELECT id, name, is_available FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      product: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        isAvailable: Boolean(result.rows[0].is_available)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const checkResult = await pool.query(
      `SELECT id, name, is_available FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = checkResult.rows[0];
    
    // If product is already unavailable, allow deletion
    if (!product.is_available) {
      // First, delete all order items referencing this product
      await pool.query(
        `DELETE FROM order_items WHERE menu_item_id = $1`,
        [productId]
      );
      
      // Then delete the product
      await pool.query(
        `DELETE FROM menu_items WHERE id = $1`,
        [productId]
      );
      
      return res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    }
    
    // For available products, check if used in orders
    const orderItemsResult = await pool.query(
      `SELECT COUNT(*) as count FROM order_items WHERE menu_item_id = $1`,
      [productId]
    );
    
    const orderCount = parseInt(orderItemsResult.rows[0].count) || 0;
    
    if (orderCount > 0) {
      // Instead of preventing deletion, disable the product
      await pool.query(
        `UPDATE menu_items SET is_available = false WHERE id = $1`,
        [productId]
      );
      
      return res.json({
        success: true,
        message: `Product disabled successfully. It was used in ${orderCount} order(s) and has been marked as unavailable.`
      });
    }
    
    // Product not used in orders, safe to delete
    await pool.query(
      `DELETE FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const forceDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const checkResult = await pool.query(
      `SELECT id, name FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const productName = checkResult.rows[0].name;
    
    // Check how many orders will be affected
    const orderItemsResult = await pool.query(
      `SELECT COUNT(*) as count FROM order_items WHERE menu_item_id = $1`,
      [productId]
    );
    
    const orderCount = parseInt(orderItemsResult.rows[0].count) || 0;
    
    // Delete all order items referencing this product
    if (orderCount > 0) {
      await pool.query(
        `DELETE FROM order_items WHERE menu_item_id = $1`,
        [productId]
      );
    }
    
    // Delete the product
    await pool.query(
      `DELETE FROM menu_items WHERE id = $1`,
      [productId]
    );
    
    res.json({
      success: true,
      message: `Product "${productName}" force deleted successfully. ${orderCount} order item(s) were removed.`
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PAYMENTS MANAGEMENT ====================

export const getPayments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    
    let query = `
      SELECT 
        o.id as order_id,
        o.razorpay_payment_id,
        o.razorpay_order_id,
        o.total_amount as amount,
        o.payment_status as status,
        o.created_at,
        o.updated_at,
        t.table_number
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE o.razorpay_payment_id IS NOT NULL
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND o.payment_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (date) {
      query += ` AND DATE(o.created_at) = DATE($${paramIndex})`;
      params.push(date);
      paramIndex++;
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const result = await pool.query(query, params);
    
    const payments = result.rows.map(payment => ({
      orderId: payment.order_id,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      amount: parseFloat(payment.amount),
      status: payment.status,
      tableNumber: payment.table_number,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    }));
    
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CHANGE PASSWORD ====================

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    // Get current admin user
    const result = await pool.query(
      'SELECT id, username, password_hash FROM admin_users WHERE id = $1',
      [adminId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    
    const admin = result.rows[0];
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query(
      'UPDATE admin_users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, adminId]
    );
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
