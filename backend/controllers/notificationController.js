import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadCount 
} from '../services/notificationService.js';

/**
 * Notification Controller
 * Handles notification-related HTTP requests
 */

// GET /api/admin/notifications
export const getNotificationsList = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const notifications = await getNotifications(limit);

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error in getNotificationsList:', error);
    next(error);
  }
};

// PATCH /api/admin/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid notification ID'
      });
    }

    const success = await markNotificationAsRead(parseInt(id));

    if (success) {
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read'
      });
    }
  } catch (error) {
    console.error('Error in markAsRead:', error);
    next(error);
  }
};

// PATCH /api/admin/notifications/read-all
export const markAllAsRead = async (req, res, next) => {
  try {
    const success = await markAllNotificationsAsRead();

    if (success) {
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read'
      });
    }
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    next(error);
  }
};

// GET /api/admin/notifications/unread-count
export const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const count = await getUnreadCount();

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error in getUnreadNotificationCount:', error);
    next(error);
  }
};
