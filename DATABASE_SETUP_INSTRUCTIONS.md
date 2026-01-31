# Database Setup Instructions

## Quick Setup Guide

### Option 1: Using phpMyAdmin (Recommended)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Open phpMyAdmin**
   - Go to: `http://localhost/phpmyadmin`
   - Or click "Admin" button next to MySQL in XAMPP

3. **Create Database (if not exists)**
   - Click "New" in left sidebar
   - Database name: `cafe_ordering`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

4. **Import Schema**
   - Select `cafe_ordering` database
   - Click "Import" tab
   - Click "Choose File"
   - Select: `database/schema_mysql_complete.sql`
   - Click "Go" at bottom

5. **Verify Tables**
   - You should see these tables:
     - `tables`
     - `menu_items`
     - `orders`
     - `order_items`
     - `payments`
     - `admin_users`
     - `hall_bookings`
     - `hall_booking_slots`
     - `blocked_slots`

### Option 2: Using MySQL Command Line

```bash
# Navigate to project directory
cd C:\Users\Personal\Desktop\OMSable

# Run the schema file
mysql -u root -p cafe_ordering < database/schema_mysql_complete.sql
```

When prompted, enter your MySQL password (usually empty for XAMPP default).

### Option 3: Copy-Paste SQL

1. Open `database/schema_mysql_complete.sql` in a text editor
2. Copy all contents
3. Open phpMyAdmin → Select `cafe_ordering` database
4. Go to SQL tab
5. Paste the SQL
6. Click "Go"

## Verify Setup

After importing, verify tables exist:

```sql
-- Run this in phpMyAdmin SQL tab
SHOW TABLES;
```

You should see 9 tables listed.

## Check Backend Connection

1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for this message:
   - ✅ `All required database tables exist` - Success!
   - ⚠️ `WARNING: Missing database tables detected!` - Run import again

## Troubleshooting

### Error: "Database not found"
- Create database first: `CREATE DATABASE cafe_ordering;`

### Error: "Access denied"
- Check MySQL username/password in `backend/.env`
- Default XAMPP: `DB_USER=root`, `DB_PASSWORD=` (empty)

### Error: "Table already exists"
- This is OK - the schema uses `CREATE TABLE IF NOT EXISTS`
- Existing data will be preserved

### Error: "Unknown column"
- Make sure you ran the complete schema file
- Check if all columns exist: `DESCRIBE hall_bookings;`

## Schema File Location

- **Complete Schema**: `database/schema_mysql_complete.sql`
- **Hourly Booking**: `database/hall_booking_hourly_schema.sql` (already included)
- **Advance Payment**: `database/hall_booking_advance_payment_schema.sql` (already included)

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the admin password after first login!

## Next Steps

1. ✅ Import schema
2. ✅ Verify tables exist
3. ✅ Start backend server
4. ✅ Check console for table verification
5. ✅ Test the application

## Support

If you encounter issues:
1. Check backend console logs
2. Verify MySQL is running in XAMPP
3. Check database connection in `backend/.env`
4. Try importing schema again

