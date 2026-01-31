# ⚡ Import Database Schema - Quick Guide

## The Error You're Seeing
```
Database tables not found. Please import schema_mysql_complete.sql file using phpMyAdmin to create the required tables.
```

## ✅ Quick Fix (3 Steps)

### Step 1: Open phpMyAdmin
1. Make sure XAMPP is running (Apache + MySQL started)
2. Go to: **http://localhost/phpmyadmin**
3. Or click "Admin" button next to MySQL in XAMPP Control Panel

### Step 2: Create Database (if needed)
1. Click **"New"** in the left sidebar
2. Database name: **`cafe_ordering`**
3. Collation: **`utf8mb4_general_ci`** (default)
4. Click **"Create"**

### Step 3: Import Schema
1. Select **`cafe_ordering`** database from left sidebar
2. Click **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to: **`database/schema_mysql_complete.sql`**
5. Click **"Go"** button at the bottom

## ✅ Verify It Worked

After importing, you should see:
- ✅ Success message: "Schema imported successfully!"
- ✅ 9 tables created in the left sidebar:
  - `tables`
  - `menu_items`
  - `orders`
  - `order_items`
  - `payments`
  - `admin_users`
  - `hall_bookings`
  - `hall_booking_slots`
  - `blocked_slots`

## 🔄 After Import

1. **Restart your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Look for this message:**
   ```
   ✅ All required database tables exist
   ```

3. **Refresh your frontend** - the error should be gone!

## 🆘 Still Having Issues?

### Error: "File too large"
- Solution: Increase upload limit in phpMyAdmin settings
- Or use command line method below

### Error: "Access denied"
- Solution: Make sure MySQL is running in XAMPP
- Check `backend/.env` file has correct credentials

### Alternative: Command Line Method
```bash
# Open PowerShell in project directory
cd C:\Users\Personal\Desktop\OMSable

# Run this command (password is usually empty for XAMPP)
mysql -u root -p cafe_ordering < database/schema_mysql_complete.sql
```

When prompted for password, just press Enter (empty password for XAMPP default).

## 📋 What Gets Created

- ✅ All 9 required database tables
- ✅ Sample menu items (Cappuccino, Tiramisu, etc.)
- ✅ Default admin user (username: `admin`, password: `admin123`)
- ✅ Default tables (1-7)
- ✅ All indexes and foreign keys

## 🎉 Done!

Once you see "✅ All required database tables exist" in your backend console, you're all set!

