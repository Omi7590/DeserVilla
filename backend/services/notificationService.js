import pool from '../config/database.js';

/**
 * Notification Service
 * Handles creating and managing notifications
 */

export const createNotification = async (type, title, message, link = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (type, title, message, link, is_read, created_at)
       VALUES (?, ?, ?, ?, 0, NOW())`,
      [type, title, message, link]
    );
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

export const getNotifications = async (limit = 50) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, type, title, message, link, is_read, created_at
       FROM notifications
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    return rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      link: row.link,
      isRead: Boolean(row.is_read),
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ?`,
      [notificationId]
    );
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await pool.query(`UPDATE notifications SET is_read = 1 WHERE is_read = 0`);
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

export const getUnreadCount = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM notifications WHERE is_read = 0`
    );
    return parseInt(rows[0].count) || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Notification types and helpers
export const NotificationType = {
  NEW_ORDER: 'new_order',
  PAYMENT_RECEIVED: 'payment_received',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  HALL_BOOKING: 'hall_booking',
  CASH_PAYMENT_PENDING: 'cash_payment_pending'
};

// Create notification for new order
export const notifyNewOrder = async (orderId, tableNumber, totalAmount) => {
  return await createNotification(
    NotificationType.NEW_ORDER,
    'New Order Received',
    `Table ${tableNumber} placed a new order of ₹${totalAmount.toFixed(2)}`,
    `/admin/orders`
  );
};

// Create notification for payment received
export const notifyPaymentReceived = async (orderId, amount, paymentMethod) => {
  return await createNotification(
    NotificationType.PAYMENT_RECEIVED,
    'Payment Received',
    `${paymentMethod} payment of ₹${amount.toFixed(2)} received for Order #${orderId}`,
    `/admin/payments`
  );
};

// Create notification for order completed
export const notifyOrderCompleted = async (orderId, tableNumber) => {
  return await createNotification(
    NotificationType.ORDER_COMPLETED,
    'Order Completed',
    `Order #${orderId} from Table ${tableNumber} marked as served`,
    `/admin/orders`
  );
};

// Create notification for cash payment pending
export const notifyCashPaymentPending = async (orderId, tableNumber, amount) => {
  return await createNotification(
    NotificationType.CASH_PAYMENT_PENDING,
    'Cash Payment Pending',
    `Table ${tableNumber} has a pending cash payment of ₹${amount.toFixed(2)}`,
    `/admin/orders`
  );
};

// Create notification for hall booking
export const notifyHallBooking = async (bookingId, customerName, date) => {
  return await createNotification(
    NotificationType.HALL_BOOKING,
    'New Hall Booking',
    `${customerName} booked the hall for ${date}`,
    `/admin/hall-bookings`
  );
};
