# 🔔 Notification System - Complete Guide

## Overview

A real-time notification system for the admin panel that alerts admins when important events occur, such as new orders, payments received, and order completions.

---

## ✨ Features

### Notification Bell Icon
- 🔔 Bell icon in the admin header
- 🔴 Red badge showing unread count
- ✨ Animated pulse effect for new notifications
- 📱 Responsive dropdown panel

### Notification Types
- 🛒 **New Order** - When a customer places an order
- 💰 **Payment Received** - When online payment is successful
- ⏳ **Cash Payment Pending** - When cash order is placed
- ✅ **Order Completed** - When order is marked as served
- 🏛️ **Hall Booking** - When hall is booked

### Features
- ✅ Real-time updates (polls every 10 seconds)
- ✅ Unread count badge
- ✅ Mark individual notifications as read
- ✅ Mark all notifications as read
- ✅ Click notification to navigate to relevant page
- ✅ Time ago formatting (2 min ago, 1 hour ago)
- ✅ Icon-based notification types
- ✅ Smooth animations

---

## 🚀 Quick Start

### Step 1: Run Migration
```powershell
.\run-notifications-migration.ps1
```

### Step 2: Restart Backend
```powershell
cd backend
npm run dev
```

### Step 3: Restart Frontend
```powershell
cd frontend
npm run dev
```

### Step 4: Test It
1. Place a test order
2. Check the notification bell in admin panel
3. Click to see the notification
4. Click notification to navigate to orders page

---

## 📊 Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  INDEX idx_type (type)
);
```

---

## 🔧 API Endpoints

### Get Notifications
```http
GET /api/admin/notifications?limit=50
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "new_order",
      "title": "New Order Received",
      "message": "Table 5 placed a new order of ₹500.00",
      "link": "/admin/orders",
      "isRead": false,
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Mark as Read
```http
PATCH /api/admin/notifications/:id/read
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Mark All as Read
```http
PATCH /api/admin/notifications/read-all
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Get Unread Count
```http
GET /api/admin/notifications/unread-count
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 5
}
```

---

## 🎨 UI Components

### Notification Bell
```jsx
<button className="relative">
  <Bell className="w-5 h-5" />
  {unreadCount > 0 && (
    <span className="absolute top-1 right-1 bg-red-500 text-white">
      {unreadCount}
    </span>
  )}
</button>
```

### Notification Item
```jsx
<div className={`notification ${!isRead ? 'unread' : ''}`}>
  <div className="icon">{getNotificationIcon(type)}</div>
  <div className="content">
    <h4>{title}</h4>
    <p>{message}</p>
    <span>{formatTime(createdAt)}</span>
  </div>
  {!isRead && <div className="unread-dot"></div>}
</div>
```

---

## 🔔 Notification Triggers

### New Order
**Triggered when:** Customer places an order  
**Type:** `new_order`  
**Title:** "New Order Received"  
**Message:** "Table {X} placed a new order of ₹{amount}"  
**Link:** `/admin/orders`

### Payment Received
**Triggered when:** Online payment is verified  
**Type:** `payment_received`  
**Title:** "Payment Received"  
**Message:** "ONLINE payment of ₹{amount} received for Order #{id}"  
**Link:** `/admin/payments`

### Cash Payment Pending
**Triggered when:** Customer selects cash payment  
**Type:** `cash_payment_pending`  
**Title:** "Cash Payment Pending"  
**Message:** "Table {X} has a pending cash payment of ₹{amount}"  
**Link:** `/admin/orders`

### Order Completed
**Triggered when:** Admin marks order as served  
**Type:** `order_completed`  
**Title:** "Order Completed"  
**Message:** "Order #{id} from Table {X} marked as served"  
**Link:** `/admin/orders`

### Hall Booking
**Triggered when:** Customer books the hall  
**Type:** `hall_booking`  
**Title:** "New Hall Booking"  
**Message:** "{name} booked the hall for {date}"  
**Link:** `/admin/hall-bookings`

---

## 🎯 How It Works

### Frontend Flow
```
1. AdminLayout component mounts
2. Fetch notifications from API
3. Display unread count on bell icon
4. Poll for new notifications every 10 seconds
5. User clicks bell → Show dropdown
6. User clicks notification → Mark as read + Navigate
7. User clicks "Mark all read" → Update all
```

### Backend Flow
```
1. Event occurs (new order, payment, etc.)
2. Create notification in database
3. Admin fetches notifications via API
4. Notification displayed in UI
5. Admin clicks notification
6. Mark as read in database
7. Update UI
```

---

## 🎨 Visual Design

### Notification Bell States

**No Notifications:**
```
🔔 (gray bell icon)
```

**Unread Notifications:**
```
🔔 (blue bell icon with pulse)
🔴 5 (red badge with count)
```

**Dropdown Open:**
```
┌─────────────────────────────────┐
│ Notifications            🔴 5   │
│ [Mark all read]                 │
├─────────────────────────────────┤
│ 🛒 New Order                    │
│ Table 5 placed a new order      │
│ 2 min ago                  🔵   │
├─────────────────────────────────┤
│ 💰 Payment Received             │
│ Payment of ₹500 received        │
│ 10 min ago                 🔵   │
├─────────────────────────────────┤
│ ✅ Order Completed              │
│ Order #123 marked as served     │
│ 1 hour ago                      │
├─────────────────────────────────┤
│ [View All Notifications]        │
└─────────────────────────────────┘
```

---

## 🧪 Testing

### Test New Order Notification
1. Go to: `http://localhost:5173/menu?table=1`
2. Add items to cart
3. Place order (cash or online)
4. Go to admin panel
5. Check notification bell
6. Should show "New Order Received"

### Test Payment Notification
1. Place order with online payment
2. Complete Razorpay payment
3. Go to admin panel
4. Check notification bell
5. Should show "Payment Received"

### Test Mark as Read
1. Click notification bell
2. Click on a notification
3. Blue dot should disappear
4. Count should decrease

### Test Mark All as Read
1. Have multiple unread notifications
2. Click "Mark all read"
3. All blue dots should disappear
4. Count should become 0

---

## 🔧 Customization

### Add New Notification Type

**1. Add to NotificationType enum:**
```javascript
export const NotificationType = {
  // ... existing types
  NEW_TYPE: 'new_type'
};
```

**2. Create helper function:**
```javascript
export const notifyNewType = async (data) => {
  return await createNotification(
    NotificationType.NEW_TYPE,
    'Title',
    'Message',
    '/admin/link'
  );
};
```

**3. Add icon mapping:**
```javascript
export const getNotificationIcon = (type) => {
  switch (type) {
    // ... existing cases
    case 'new_type':
      return '🎉';
  }
};
```

**4. Trigger notification:**
```javascript
import { notifyNewType } from '../services/notificationService.js';

// In your controller
await notifyNewType(data);
```

---

## 📊 Performance

### Optimization Strategies
- ✅ Indexed database queries
- ✅ Limit notifications to 50 most recent
- ✅ Poll every 10 seconds (not too frequent)
- ✅ Efficient React state updates
- ✅ Debounced API calls

### Database Indexes
```sql
INDEX idx_notifications_is_read (is_read)
INDEX idx_notifications_created_at (created_at)
INDEX idx_notifications_type (type)
```

---

## 🐛 Troubleshooting

### Notifications Not Showing
**Solution:**
- Check backend is running
- Verify notifications table exists
- Check browser console for errors
- Verify JWT token is valid

### Count Not Updating
**Solution:**
- Check polling is working (every 10 seconds)
- Verify API endpoint is accessible
- Check network tab for API calls

### Notifications Not Marked as Read
**Solution:**
- Check API endpoint is working
- Verify notification ID is correct
- Check database update query

---

## 🎉 Features Summary

✅ Real-time notifications  
✅ Unread count badge  
✅ Animated bell icon  
✅ Click to navigate  
✅ Mark as read  
✅ Mark all as read  
✅ Time ago formatting  
✅ Icon-based types  
✅ Smooth animations  
✅ Responsive design  
✅ Auto-refresh  
✅ Production ready  

---

## 📞 Support

If you encounter issues:
1. Check migration ran successfully
2. Verify backend logs
3. Check browser console
4. Test API endpoints with Postman
5. Verify database table exists

---

**Status: ✅ COMPLETE & READY TO USE**

**Version: 1.0.0 - Notification System**
