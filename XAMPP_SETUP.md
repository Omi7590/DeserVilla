# XAMPP Setup Guide for MySQL Database

This guide will help you set up the database using XAMPP's MySQL/MariaDB.

## Prerequisites

- XAMPP installed on your system
- Node.js installed (for backend)

## Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (if needed for phpMyAdmin)
3. Start **MySQL** - Click the "Start" button next to MySQL
4. Wait until MySQL status shows "Running" (green)

## Step 2: Access phpMyAdmin

1. Open your web browser
2. Go to: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin interface

## Step 3: Create Database

### Option A: Using phpMyAdmin (Recommended)

1. Click on **"New"** in the left sidebar (or "Databases" tab)
2. Enter database name: `cafe_ordering`
3. Select collation: `utf8mb4_general_ci` (or leave default)
4. Click **"Create"**

### Option B: Using SQL Command

1. Click on **"SQL"** tab in phpMyAdmin
2. Run this command:
```sql
CREATE DATABASE IF NOT EXISTS cafe_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

## Step 4: Import Database Schema

### Option A: Using phpMyAdmin Import

1. Select the `cafe_ordering` database from the left sidebar
2. Click on the **"Import"** tab
3. Click **"Choose File"** button
4. Navigate to: `database/schema_mysql.sql`
5. Click **"Go"** at the bottom
6. Wait for the import to complete
7. You should see a success message

### Option B: Using SQL Tab

1. Select the `cafe_ordering` database
2. Click on the **"SQL"** tab
3. Open `database/schema_mysql.sql` in a text editor
4. Copy the entire contents
5. Paste into the SQL textarea
6. Click **"Go"**
7. You should see success messages for each table created

## Step 5: Verify Database Setup

1. In phpMyAdmin, select `cafe_ordering` database
2. You should see these tables:
   - `tables`
   - `menu_items`
   - `orders`
   - `order_items`
   - `admin_users`
   - `hall_bookings`
   - `blocked_slots`

3. Click on `menu_items` table and verify it has sample menu items
4. Click on `tables` table and verify it has 7 tables (1-7)

## Step 6: Configure Backend .env File

1. Navigate to `backend` folder
2. Open or create `.env` file
3. Add/update these database settings:

```env
# Database Configuration for XAMPP MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cafe_ordering
DB_USER=root
DB_PASSWORD=

# Other required settings
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- `DB_USER=root` (default XAMPP MySQL user)
- `DB_PASSWORD=` (empty by default in XAMPP)
- If you set a MySQL password in XAMPP, update `DB_PASSWORD` accordingly

## Step 7: Install MySQL Dependencies

1. Open terminal/command prompt
2. Navigate to `backend` folder:
```bash
cd backend
```

3. Install dependencies (this will install mysql2 instead of pg):
```bash
npm install
```

## Step 8: Test Database Connection

1. In the `backend` folder, run:
```bash
node scripts/testDatabase.js
```

2. You should see:
```
✅ Database connection successful!
✅ All required tables exist!
```

## Step 9: Set Up Admin User

1. In the `backend` folder, run:
```bash
node scripts/setupAdmin.js
```

2. Follow the prompts to set admin username and password
3. Default credentials (if using initAdmin.js):
   - Username: `admin`
   - Password: `admin123`

## Step 10: Start the Application

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Open browser: `http://localhost:5173`

## Troubleshooting

### MySQL Not Starting in XAMPP

- Check if port 3306 is already in use
- Stop other MySQL services
- Check XAMPP error logs

### Connection Refused Error

- Make sure MySQL is running in XAMPP Control Panel
- Verify `DB_HOST=localhost` and `DB_PORT=3306` in `.env`
- Check if MySQL password is set (update `DB_PASSWORD` if needed)

### Access Denied Error

- Default XAMPP MySQL user is `root` with no password
- If you set a password, update `DB_PASSWORD` in `.env`
- To reset MySQL password in XAMPP, see XAMPP documentation

### Database Not Found Error

- Make sure you created the `cafe_ordering` database
- Verify database name in `.env` matches exactly

### Tables Not Found

- Re-import `database/schema_mysql.sql`
- Make sure you selected the correct database before importing

### Import Errors in phpMyAdmin

- Check file encoding (should be UTF-8)
- Make sure you're importing `schema_mysql.sql` (not `schema.sql`)
- Try importing via SQL tab instead of Import tab

## Default XAMPP MySQL Settings

- **Host:** `localhost`
- **Port:** `3306`
- **Username:** `root`
- **Password:** (empty by default)
- **phpMyAdmin URL:** `http://localhost/phpmyadmin`

## Next Steps

After setup is complete:
1. ✅ Database is running
2. ✅ Tables are created
3. ✅ Backend can connect
4. ✅ Frontend can access backend API

Your application should now be fully functional with XAMPP MySQL!

