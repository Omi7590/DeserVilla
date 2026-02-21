# 🔔 Notification System - Quick Start

## 3-Step Setup (2 Minutes)

### Step 1: Run Migration (30 seconds)
```powershell
.\run-notifications-migration.ps1
```

### Step 2: Restart Servers (1 minute)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 3: Test It! (30 seconds)

1. **Place a Test Order:**
   - Visit: `http://localhost:5173/menu?table=1`
   - Add items → Place order

2. **Check Notifications:**
   - Visit: `http://localhost:5173/admin/dashboard`
   - Look at the bell icon in the header
   - You should see a red badge with count
   - Click the bell to see notifications

---

## What You Get

### 🔔 Notification Bell
- Red badge showing unread count
- Animated pulse effect
- Click to see dropdown

### 📋 Notification Types
- 🛒 New Order Received
- 💰 Payment Received
- ⏳ Cash Payment Pending
- ✅ Order Completed
- 🏛️ Hall Booking

### ✨ Features
- Real-time updates (every 10 seconds)
- Click notification to navigate
- Mark as read
- Mark all as read
- Time ago formatting

---

## Visual Preview

```
┌─────────────────────────────────┐
│  🔔 (5)  ← Bell with badge      │
└─────────────────────────────────┘

Click bell ↓

┌─────────────────────────────────┐
│ Notifications            🔴 5   │
│ [Mark all read]                 │
├─────────────────────────────────┤
│ 🛒 New Order               🔵   │
│ Table 5 placed a new order      │
│ 2 min ago                       │
├─────────────────────────────────┤
│ 💰 Payment Received        🔵   │
│ Payment of ₹500 received        │
│ 10 min ago                      │
└─────────────────────────────────┘
```

---

## Troubleshooting

### Migration Fails
- Check MySQL is running
- Verify database credentials

### Notifications Not Showing
- Refresh the page
- Check backend logs
- Verify table was created

### Count Not Updating
- Wait 10 seconds for auto-refresh
- Click refresh button manually

---

## Done! 🎉

Your notification system is ready. Admins will now be alerted when:
- New orders arrive
- Payments are received
- Orders are completed
- Hall bookings are made

**Status: ✅ READY TO USE**
