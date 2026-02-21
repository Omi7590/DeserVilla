import { adminAPI } from './api';

/**
 * Notification Service
 * Handles fetching and managing notifications
 */

export const getNotifications = async () => {
  try {
    const response = await adminAPI.getNotifications();
    return response.data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await adminAPI.markNotificationAsRead(notificationId);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await adminAPI.markAllNotificationsAsRead();
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

// Format notification time
export const formatNotificationTime = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - notificationTime) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Get notification icon based on type
export const getNotificationIcon = (type) => {
  switch (type) {
    case 'new_order':
      return '🛒';
    case 'payment_received':
      return '💰';
    case 'order_completed':
      return '✅';
    case 'order_cancelled':
      return '❌';
    case 'hall_booking':
      return '🏛️';
    default:
      return '🔔';
  }
};

// Get notification color based on type
export const getNotificationColor = (type) => {
  switch (type) {
    case 'new_order':
      return 'bg-blue-500';
    case 'payment_received':
      return 'bg-green-500';
    case 'order_completed':
      return 'bg-green-500';
    case 'order_cancelled':
      return 'bg-red-500';
    case 'hall_booking':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};
