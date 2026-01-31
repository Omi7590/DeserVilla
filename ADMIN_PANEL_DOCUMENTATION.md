# Admin Panel Documentation

## Complete Admin Panel for Desert Villa Café

This is a comprehensive, production-ready admin panel for managing the entire café ordering system.

---

## 🚀 Features

### 1. **Dashboard**
- Real-time statistics (orders today, revenue, status counts)
- Quick action buttons
- Auto-refresh every 30 seconds

### 2. **Orders Management**
- View all orders with detailed information
- Filter by:
  - Order status (pending, preparing, served)
  - Payment status (paid, pending, failed)
  - Table number
  - Date
- Update order status in real-time
- View order items, quantities, and totals
- Auto-refresh every 10 seconds

### 3. **Products/Menu Management**
- Full CRUD operations (Create, Read, Update, Delete)
- Add new products with:
  - Name, price, category
  - Description
  - Image URL
  - Availability status
- Edit existing products
- Toggle availability (instantly affects customer menu)
- Delete products (with safety checks)
- Beautiful table view with images

### 4. **Payments**
- View all payment transactions
- Filter by payment status and date
- See Razorpay payment IDs
- Total revenue calculation
- Order and table information

### 5. **Authentication**
- Secure JWT-based authentication
- Protected routes (frontend and backend)
- Session management
- Auto-logout on token expiry

---

## 📁 Project Structure

```
backend/
├── controllers/
│   └── adminController.js      # All admin business logic
├── routes/
│   └── adminRoutes.js          # Admin API routes
├── middleware/
│   └── auth.js                 # JWT authentication middleware
└── config/
    └── database.js            # MySQL connection

frontend/
├── components/
│   ├── AdminLayout.jsx        # Sidebar navigation layout
│   └── ProtectedRoute.jsx     # Route protection component
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx # Dashboard page
│   │   ├── AdminOrders.jsx    # Orders management
│   │   ├── AdminProducts.jsx  # Products management
│   │   └── AdminPayments.jsx  # Payments view
│   └── AdminLogin.jsx         # Login page
└── services/
    └── api.js                 # API service with all endpoints
```

---

## 🗄️ Database Schema

### Required Tables

All tables are already created in `database/schema_mysql.sql`. The admin panel uses:

1. **admin_users** - Admin authentication
2. **orders** - Order records
3. **order_items** - Order line items
4. **menu_items** - Products/menu items
5. **tables** - Table information
6. **payments** (optional) - Detailed payment tracking

Run the schema update if needed:
```sql
-- Run database/admin_schema_update.sql
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/admin/login
Body: { username, password }
Response: { success, token, admin }
```

### Dashboard
```
GET /api/admin/dashboard-stats
Headers: Authorization: Bearer <token>
Response: { success, stats: { totalOrdersToday, totalRevenueToday, pendingCount, preparingCount, servedCount } }
```

### Orders
```
GET /api/admin/orders?status=pending&paymentStatus=paid&tableNumber=1&date=2024-01-01
Headers: Authorization: Bearer <token>
Response: { success, orders: [...] }

PATCH /api/admin/orders/:orderId/status
Headers: Authorization: Bearer <token>
Body: { orderStatus: 'pending' | 'preparing' | 'served' }
Response: { success, order: { id, orderStatus } }
```

### Products
```
GET /api/admin/products
Headers: Authorization: Bearer <token>
Response: { success, products: [...] }

POST /api/admin/products
Headers: Authorization: Bearer <token>
Body: { name, price, category, description, imageUrl, isAvailable }
Response: { success, product: {...} }

PUT /api/admin/products/:productId
Headers: Authorization: Bearer <token>
Body: { name?, price?, category?, description?, imageUrl? }
Response: { success, product: {...} }

PATCH /api/admin/products/:productId/availability
Headers: Authorization: Bearer <token>
Body: { isAvailable: boolean }
Response: { success, product: { id, name, isAvailable } }

DELETE /api/admin/products/:productId
Headers: Authorization: Bearer <token>
Response: { success, message }
```

### Payments
```
GET /api/admin/payments?status=paid&date=2024-01-01
Headers: Authorization: Bearer <token>
Response: { success, payments: [...] }
```

---

## 🔐 Authentication Flow

1. Admin logs in at `/admin/login`
2. Backend validates credentials
3. JWT token generated and returned
4. Token stored in `localStorage` as `adminToken`
5. All subsequent requests include token in `Authorization: Bearer <token>` header
6. Backend middleware validates token on protected routes
7. Frontend `ProtectedRoute` component checks token before rendering

---

## 🚦 How to Run

### 1. Database Setup

Ensure MySQL is running (XAMPP):
```bash
# Start XAMPP MySQL
# Run the schema if not already done
mysql -u root -p cafe_ordering < database/schema_mysql.sql
mysql -u root -p cafe_ordering < database/admin_schema_update.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
# Set up admin user (if not done)
node scripts/setupAdmin.js
# Start server
npm run dev
```

Default admin credentials (after setup):
- Username: `admin`
- Password: `admin123` (change this!)

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. You'll be redirected to the dashboard

---

## 🎨 UI Features

- **Sidebar Navigation**: Collapsible sidebar with menu items
- **Responsive Design**: Works on desktop and tablet
- **Status Badges**: Color-coded status indicators
- **Loading States**: Spinner animations during data fetch
- **Empty States**: Helpful messages when no data
- **Real-time Updates**: Auto-refresh for orders and dashboard
- **Modal Dialogs**: For adding/editing products
- **Toast Notifications**: Success/error feedback

---

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt for password storage
3. **Route Protection**: Both frontend and backend
4. **Input Validation**: All API endpoints validate input
5. **SQL Injection Protection**: Parameterized queries
6. **CORS Configuration**: Restricted origins

---

## 📊 Business Logic Rules

1. **Order Status**: Admin can change order status (pending → preparing → served)
2. **Payment Status**: Read-only (cannot be faked by admin)
3. **Product Availability**: Changes instantly affect customer menu
4. **Product Deletion**: Only allowed if product not used in any orders
5. **Order Visibility**: Orders visible only after payment attempt

---

## 🔄 Integration with Customer System

The admin panel is fully integrated with the existing customer ordering system:

- **Menu Items**: Changes in admin panel instantly reflect in customer menu
- **Order Status**: Customer orders appear in admin panel after payment
- **Payment Tracking**: All Razorpay payments are tracked
- **Table Management**: Orders are linked to table numbers

---

## 🐛 Troubleshooting

### Can't login?
- Check admin user exists: `SELECT * FROM admin_users;`
- Run setup script: `node backend/scripts/setupAdmin.js`
- Check JWT_SECRET in `.env`

### Orders not showing?
- Check database connection
- Verify orders table has data
- Check API endpoint in browser network tab

### Products not saving?
- Check validation errors in console
- Verify all required fields filled
- Check database connection

### 401 Unauthorized?
- Token expired (login again)
- Token not in localStorage
- Check Authorization header format

---

## 📝 Environment Variables

Required in `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cafe_ordering
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-secret-key-here
```

---

## ✅ Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Test all features thoroughly

---

## 🎯 Next Steps

1. **Analytics**: Add sales reports and charts
2. **Notifications**: Real-time order notifications
3. **Inventory**: Track ingredient stock
4. **Staff Management**: Multiple admin users with roles
5. **Print Receipts**: Kitchen order printing
6. **Mobile App**: React Native admin app

---

## 📞 Support

For issues or questions:
1. Check console logs (browser and server)
2. Verify database connection
3. Check API responses in network tab
4. Review error messages

---

**Built with ❤️ for Desert Villa Café**

