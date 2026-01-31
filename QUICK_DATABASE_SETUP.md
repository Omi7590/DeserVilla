# Quick Database Setup Guide

## ⚡ Fast Setup (3 Steps)

### Step 1: Start XAMPP
- Open XAMPP Control Panel
- Click "Start" for **Apache** and **MySQL**

### Step 2: Import Schema
**Option A: phpMyAdmin (Easiest)**
1. Go to: `http://localhost/phpmyadmin`
2. Click "New" → Database name: `cafe_ordering` → Create
3. Select `cafe_ordering` database
4. Click "Import" tab
5. Choose file: `database/schema_mysql_complete.sql`
6. Click "Go"

**Option B: Command Line**
```bash
mysql -u root -p cafe_ordering < database/schema_mysql_complete.sql
```
(Password is usually empty for XAMPP)

### Step 3: Verify
1. Start backend: `cd backend && npm run dev`
2. Look for: `✅ All required database tables exist`
3. If you see warnings, re-run Step 2

## ✅ That's It!

Your database is now ready. The schema includes:
- ✅ All 9 required tables
- ✅ Sample menu items
- ✅ Default admin user
- ✅ All indexes and constraints

## 🔑 Default Admin Login
- Username: `admin`
- Password: `admin123`

**Change password after first login!**

