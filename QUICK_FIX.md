# Quick Fix for "Failed to load menu" Error

## The Problem
The error occurs because PostgreSQL database is not running or not set up.

## Solution 1: Start Docker Desktop (Easiest if Docker is installed)

1. **Start Docker Desktop:**
   - Open Docker Desktop application
   - Wait for it to fully start (whale icon in system tray)

2. **Then run these commands:**
   ```powershell
   # Start PostgreSQL container
   docker run --name cafe-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cafe_ordering -p 5432:5432 -d postgres:15-alpine
   
   # Wait 5 seconds, then run schema
   Start-Sleep -Seconds 5
   Get-Content database\schema.sql | docker exec -i cafe-postgres psql -U postgres -d cafe_ordering
   
   # Test connection
   cd backend
   node scripts/testDatabase.js
   ```

3. **Restart backend server** (if it's running)

## Solution 2: Install PostgreSQL Directly

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL 15 or 16
   - During installation, set password for `postgres` user
   - Remember this password!

2. **Update backend/.env:**
   ```env
   DB_PASSWORD=your_postgres_password_here
   ```

3. **Create database:**
   ```powershell
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter password when prompted
   
   # In psql prompt:
   CREATE DATABASE cafe_ordering;
   \q
   ```

4. **Run schema:**
   ```powershell
   psql -U postgres -d cafe_ordering -f database\schema.sql
   # Enter password when prompted
   ```

5. **Test:**
   ```powershell
   cd backend
   node scripts/testDatabase.js
   ```

## Solution 3: Use Online PostgreSQL (Temporary)

You can use a free PostgreSQL service like:
- https://www.elephantsql.com/ (Free tier available)
- https://supabase.com/ (Free tier)

Then update `backend/.env` with their connection details.

## After Setup

1. ✅ Database is running
2. ✅ Tables are created
3. **Restart your backend server**
4. **Refresh frontend page**
5. Menu should load! 🎉

## Verify It's Working

After setup, you should see:
- ✅ Backend server connects to database
- ✅ Menu loads in frontend
- ✅ No more "Failed to load menu" errors

