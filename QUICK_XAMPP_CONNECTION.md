# Quick Guide: Connect Database to XAMPP

## 🚀 Step-by-Step Connection Process

### **Step 1: Start MySQL in XAMPP**

1. Open **XAMPP Control Panel** (search for "XAMPP" in Windows)
2. Find **MySQL** in the list
3. Click the **"Start"** button next to MySQL
4. Wait until the status turns **GREEN** and shows "Running"
   - ✅ Green = MySQL is running
   - ❌ Red = MySQL is not running

---

### **Step 2: Open phpMyAdmin**

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **`http://localhost/phpmyadmin`**
3. You should see the phpMyAdmin interface

**Note:** If phpMyAdmin doesn't open:
- Make sure **Apache** is also started in XAMPP Control Panel
- Try: `http://127.0.0.1/phpmyadmin`

---

### **Step 3: Create the Database**

**Method 1: Using phpMyAdmin Interface (Easiest)**

1. In phpMyAdmin, look at the **left sidebar**
2. Click **"New"** (or click "Databases" tab at the top)
3. In "Database name" field, type: **`cafe_ordering`**
4. Leave collation as default (or select `utf8mb4_general_ci`)
5. Click **"Create"** button
6. You should see `cafe_ordering` appear in the left sidebar

**Method 2: Using SQL Command**

1. Click the **"SQL"** tab in phpMyAdmin
2. Copy and paste this command:
```sql
CREATE DATABASE IF NOT EXISTS cafe_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```
3. Click **"Go"** button

---

### **Step 4: Import the Database Schema**

**Method 1: Using Import Feature (Recommended)**

1. Click on **`cafe_ordering`** database in the left sidebar (to select it)
2. Click the **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to your project folder: `C:\Users\Personal\Desktop\OMSable\database\`
5. Select **`schema_mysql.sql`** file
6. Scroll down and click **"Go"** button
7. Wait for import to complete
8. You should see: "Import has been successfully finished"

**Method 2: Using SQL Tab**

1. Select **`cafe_ordering`** database
2. Click **"SQL"** tab
3. Open `database/schema_mysql.sql` file in Notepad
4. Copy ALL the content (Ctrl+A, Ctrl+C)
5. Paste into the SQL textarea in phpMyAdmin
6. Click **"Go"** button

---

### **Step 5: Verify Tables Are Created**

1. Make sure **`cafe_ordering`** is selected in left sidebar
2. You should see these **7 tables**:
   - ✅ `tables`
   - ✅ `menu_items`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `admin_users`
   - ✅ `hall_bookings`
   - ✅ `blocked_slots`

3. Click on **`menu_items`** table → Click **"Browse"** tab
   - You should see sample menu items (Chocolate Lava Cake, Tiramisu, etc.)

4. Click on **`tables`** table → Click **"Browse"** tab
   - You should see 7 rows (table numbers 1-7)

---

### **Step 6: Configure Backend .env File**

1. Open your project folder: `C:\Users\Personal\Desktop\OMSable\backend\`
2. Open or create **`.env`** file (use Notepad or VS Code)

3. Add/update these lines:

```env
# Database Configuration for XAMPP MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cafe_ordering
DB_USER=root
DB_PASSWORD=

# Server Configuration
PORT=5000
NODE_ENV=development

# Razorpay (add your keys later)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# JWT Secret (change in production!)
JWT_SECRET=your_jwt_secret_key_change_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:**
- `DB_USER=root` ← Default XAMPP MySQL username
- `DB_PASSWORD=` ← Leave empty (XAMPP default has no password)
- If you set a MySQL password, add it: `DB_PASSWORD=yourpassword`

4. **Save** the `.env` file

---

### **Step 7: Test Database Connection**

1. Open **PowerShell** or **Command Prompt**
2. Navigate to backend folder:
```powershell
cd C:\Users\Personal\Desktop\OMSable\backend
```

3. Run the test script:
```powershell
node scripts/testDatabase.js
```

4. You should see:
```
✅ Database connection successful!
✅ All required tables exist!
```

**If you see errors:**
- Make sure MySQL is running in XAMPP
- Check `.env` file has correct settings
- Verify database name is exactly `cafe_ordering`

---

### **Step 8: Set Up Admin User**

Run this command in the backend folder:
```powershell
node scripts/setupAdmin.js
```

Follow the prompts to create admin account.

**Or use default:**
```powershell
node scripts/initAdmin.js
```
This creates: username=`admin`, password=`admin123`

---

## ✅ Connection Checklist

Before starting your app, verify:

- [ ] MySQL is **Running** (green) in XAMPP Control Panel
- [ ] Database **`cafe_ordering`** exists in phpMyAdmin
- [ ] All **7 tables** are created
- [ ] **`.env`** file has correct database settings
- [ ] **`testDatabase.js`** shows success message
- [ ] Admin user is created

---

## 🎯 Quick Reference

| Setting | Value |
|---------|-------|
| **Host** | `localhost` |
| **Port** | `3306` |
| **Database** | `cafe_ordering` |
| **Username** | `root` |
| **Password** | (empty) |
| **phpMyAdmin** | `http://localhost/phpmyadmin` |

---

## 🐛 Common Issues & Solutions

### ❌ "MySQL won't start"
- **Solution:** Check if port 3306 is in use
- Stop other MySQL services
- Restart XAMPP

### ❌ "Access denied"
- **Solution:** Check `.env` file
- Default XAMPP: `DB_USER=root`, `DB_PASSWORD=` (empty)

### ❌ "Database not found"
- **Solution:** Create database in phpMyAdmin
- Name must be exactly: `cafe_ordering`

### ❌ "Tables not found"
- **Solution:** Import `schema_mysql.sql` again
- Make sure you selected `cafe_ordering` database first

---

## 🚀 After Connection is Successful

1. **Start Backend:**
```powershell
cd backend
npm run dev
```

2. **Start Frontend** (new terminal):
```powershell
cd frontend
npm run dev
```

3. **Open Browser:** `http://localhost:5173`

Your database is now connected! 🎉

