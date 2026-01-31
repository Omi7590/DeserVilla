# How to Run the Project

## Current Status

✅ **Frontend Server**: Starting on http://localhost:5173  
✅ **Backend Server**: Starting on http://localhost:5000  
❌ **Database**: Not running (needs setup)

## Quick Start (3 Steps)

### Step 1: Set Up Database

**Option A: Using Docker (Easiest)**
```powershell
# 1. Start Docker Desktop application
# 2. Wait for it to fully start
# 3. Run:
.\start-database.ps1
```

**Option B: Install PostgreSQL**
1. Download from: https://www.postgresql.org/download/windows/
2. Install and remember the password
3. Update `backend/.env` with your password
4. Create database:
   ```powershell
   psql -U postgres
   CREATE DATABASE cafe_ordering;
   \q
   ```
5. Run schema:
   ```powershell
   psql -U postgres -d cafe_ordering -f database\schema.sql
   ```

### Step 2: Verify Database

```powershell
cd backend
node scripts/testDatabase.js
```

You should see: ✅ Database connection successful!

### Step 3: Access the Application

Open your browser and visit:
- **Frontend**: http://localhost:5173
- **Menu Page**: http://localhost:5173/menu?table=1
- **Hall Booking**: http://localhost:5173/hall-booking
- **Admin Login**: http://localhost:5173/admin/login

## Troubleshooting

### "Failed to load menu" Error
- Database is not running or not set up
- Run Step 1 above

### "Connection refused" Error
- PostgreSQL service is not running
- Start it: `Start-Service postgresql-x64-15` (adjust version)

### Servers Not Starting
- Check if ports 5000 and 5173 are available
- Kill existing processes if needed

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ Change this in production!

## Need Help?

See `QUICK_FIX.md` for detailed database setup instructions.

