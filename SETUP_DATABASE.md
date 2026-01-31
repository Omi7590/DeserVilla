# Quick Database Setup Guide

## The Error You're Seeing

The "Failed to load menu" error occurs because PostgreSQL database is not set up or not running.

## Quick Fix Options

### Option 1: Install PostgreSQL (Recommended)

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the Windows installer
   - Run the installer
   - Remember the password you set for the `postgres` user

2. **After Installation:**
   ```powershell
   # Update backend/.env with your PostgreSQL password
   # Change: DB_PASSWORD=postgres
   # To: DB_PASSWORD=your_actual_password
   ```

3. **Create Database:**
   ```powershell
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter your password when prompted
   
   # In psql, run:
   CREATE DATABASE cafe_ordering;
   \q
   ```

4. **Run Schema:**
   ```powershell
   psql -U postgres -d cafe_ordering -f database/schema.sql
   # Enter password when prompted
   ```

### Option 2: Use Docker (If you have Docker Desktop)

```powershell
# Start PostgreSQL container
docker run --name cafe-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cafe_ordering -p 5432:5432 -d postgres

# Wait a few seconds, then run schema
docker exec -i cafe-postgres psql -U postgres -d cafe_ordering < database/schema.sql
```

### Option 3: Use SQLite (Quick Test - Not for Production)

If you just want to test quickly, we can modify the code to use SQLite temporarily.

## Verify Setup

After setting up, test the connection:

```powershell
cd backend
node scripts/testDatabase.js
```

You should see:
- ✅ Database connection successful!
- ✅ All required tables exist!

## Common Issues

### "psql: command not found"
- PostgreSQL is not installed or not in PATH
- Add PostgreSQL bin folder to your PATH environment variable
- Or use full path: `C:\Program Files\PostgreSQL\15\bin\psql.exe`

### "Connection refused"
- PostgreSQL service is not running
- Start it: `Start-Service postgresql-x64-15` (adjust version number)

### "Authentication failed"
- Wrong password in `.env` file
- Update `DB_PASSWORD` in `backend/.env`

### "Database does not exist"
- Run: `createdb cafe_ordering` or create it via pgAdmin

## After Setup

1. Restart the backend server
2. Refresh the frontend page
3. The menu should load successfully!

