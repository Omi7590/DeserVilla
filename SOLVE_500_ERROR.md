# How to Fix the 500 Internal Server Error

## The Problem

The error `Failed to load resource: the server responded with a status of 500` occurs because:
- MySQL/MariaDB database is not running in XAMPP
- Database tables don't exist
- Backend can't connect to the database

## Quick Fix (XAMPP MySQL)

### ✅ Solution: Set Up XAMPP MySQL (Recommended)

**Step 1:** Start MySQL in XAMPP
- Open XAMPP Control Panel
- Click "Start" next to MySQL
- Wait until status shows "Running" (green)

**Step 2:** Create Database in phpMyAdmin
- Open browser: `http://localhost/phpmyadmin`
- Click "New" in left sidebar
- Database name: `cafe_ordering`
- Click "Create"

**Step 3:** Import Schema
- Select `cafe_ordering` database
- Click "Import" tab
- Choose file: `database/schema_mysql.sql`
- Click "Go"

**Step 4:** Configure backend/.env
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cafe_ordering
DB_USER=root
DB_PASSWORD=
```

**Step 5:** Test Connection
```powershell
cd backend
node scripts/testDatabase.js
```

You should see: ✅ Database connection successful!

**Step 6:** Restart backend server
- Stop the current backend (Ctrl+C in terminal)
- Start again: `cd backend && npm run dev`

**Step 7:** Refresh your browser
- The menu should now load! ✅

---

### ✅ Alternative: Use Docker (PostgreSQL)

If you prefer PostgreSQL with Docker:

**Step 1:** Start Docker Desktop
- Open Docker Desktop application from Start Menu
- Wait until it shows "Docker Desktop is running" in system tray

**Step 2:** Run the setup script
```powershell
.\start-database.ps1
```

This will:
- Start PostgreSQL in Docker
- Create the database
- Run the schema
- Test the connection

**Note:** If using Docker, update `.env` with PostgreSQL settings (port 5432, user postgres)

---

## Verify It's Fixed

After setup, check:

1. **Backend logs** should show:
   ```
   Connected to MySQL database
   Server running on port 5000
   ```

2. **Test endpoint:**
   ```
   http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

3. **Frontend should load menu** without errors

4. **Browser console** should have no 500 errors

---

## Still Getting Errors?

### Check Backend Logs
Look at the terminal where backend is running. You should see the actual error message.

### Common Issues:

**"Connection refused" or "ETIMEDOUT"**
- MySQL not running in XAMPP
- Start MySQL from XAMPP Control Panel
- Check port 3306 is not blocked

**"Authentication failed" or "Access denied"**
- Wrong credentials in `.env` file
- Default XAMPP: `DB_USER=root`, `DB_PASSWORD=` (empty)
- Update `backend/.env` if you set a MySQL password

**"Database does not exist" or "ER_BAD_DB_ERROR"**
- Database wasn't created
- Create `cafe_ordering` database in phpMyAdmin

**"Table does not exist" or "ER_NO_SUCH_TABLE"**
- Schema wasn't imported
- Import `database/schema_mysql.sql` via phpMyAdmin Import tab

---

## Need More Help?

- Check `QUICK_FIX.md` for detailed instructions
- Check `RUN_PROJECT.md` for complete setup guide
- Verify database connection: `cd backend && node scripts/testDatabase.js`

