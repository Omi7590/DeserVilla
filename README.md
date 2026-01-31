# QR-Based Café Ordering System

A complete, production-ready QR-based ordering system for a dessert bar with 7 tables. Built with React, Node.js, Express, PostgreSQL, and Razorpay integration.

## 🚀 Features

- **QR-Based Ordering**: Each table has a unique QR code that opens the menu with table number auto-detected
- **Customer Flow**: Browse menu, add items to cart, adjust quantities, and place orders
- **Payment Integration**: Razorpay payment gateway with secure payment verification
- **Admin Panel**: Real-time order management, status updates, and menu availability control
- **Hall Booking Module**: Book café hall from home for events (birthdays, parties, meetings)
- **Modern UI**: Mobile-first, responsive design with Tailwind CSS

## 📋 Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Payments**: Razorpay
- **Hosting**: Frontend → Vercel, Backend → Render

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Razorpay account with API keys

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cafe_ordering
DB_USER=postgres
DB_PASSWORD=your_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

5. Create PostgreSQL database:
```bash
createdb cafe_ordering
```

6. Run database schema:
```bash
psql -d cafe_ordering -f ../database/schema.sql
```

7. Set up admin password:
```bash
# Quick setup with default password (admin/admin123)
node scripts/initAdmin.js

# OR set custom password
node scripts/setupAdmin.js
```

8. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

## 📱 QR Code Generation

Each table needs a QR code that points to your menu URL with the table number as a query parameter.

### QR Code Format

```
https://your-frontend-url.vercel.app/menu?table=TABLE_NUMBER
```

Example for Table 1:
```
https://your-frontend-url.vercel.app/menu?table=1
```

### Generating QR Codes

You can use any QR code generator. Here are some options:

1. **Online QR Generators**:
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QRCode Monkey](https://www.qrcode-monkey.com/)

2. **Node.js Library** (for programmatic generation):
```bash
npm install qrcode
```

```javascript
const QRCode = require('qrcode');
const frontendUrl = 'https://your-frontend-url.vercel.app';

for (let i = 1; i <= 7; i++) {
  const url = `${frontendUrl}/menu?table=${i}`;
  QRCode.toFile(`table-${i}.png`, url, (err) => {
    if (err) throw err;
    console.log(`QR code for Table ${i} generated!`);
  });
}
```

3. **Python Script**:
```python
import qrcode

frontend_url = 'https://your-frontend-url.vercel.app'

for i in range(1, 8):
    url = f'{frontend_url}/menu?table={i}'
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(f'table-{i}.png')
    print(f'QR code for Table {i} generated!')
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `DB_HOST`: Your PostgreSQL host
   - `DB_PORT`: 5432
   - `DB_NAME`: cafe_ordering
   - `DB_USER`: Your database user
   - `DB_PASSWORD`: Your database password
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
   - `RAZORPAY_WEBHOOK_SECRET`: Your webhook secret
   - `JWT_SECRET`: A strong random string
   - `FRONTEND_URL`: Your Vercel frontend URL

6. Create PostgreSQL database on Render and update DB connection variables

## 🔐 Admin Access

- **Default Username**: `admin`
- **Default Password**: `admin123`

**⚠️ IMPORTANT**: Change the default admin password in production!

To change admin password, run:
```bash
cd backend
node scripts/setupAdmin.js
```

## 📊 Database Schema

The system uses the following tables:

- `tables`: Table information (7 tables by default)
- `menu_items`: Menu items with categories and availability
- `orders`: Order records with payment and status
- `order_items`: Individual items in each order
- `admin_users`: Admin authentication

See `database/schema.sql` for complete schema.

## 🔄 API Endpoints

### Customer APIs

**Menu & Orders:**
- `GET /api/menu` - Get menu items grouped by category
- `POST /api/order` - Create a new order
- `POST /api/order/payment/create` - Create Razorpay payment order
- `POST /api/order/payment/verify` - Verify payment

**Hall Booking:**
- `POST /api/hall/check-availability` - Check slot availability
- `POST /api/hall/book` - Create hall booking
- `POST /api/hall/payment/create` - Create Razorpay payment for booking
- `POST /api/hall/payment/verify` - Verify booking payment

### Admin APIs

- `POST /api/admin/login` - Admin login
- `GET /api/admin/orders` - Get all orders (with optional status filter)
- `PATCH /api/admin/order-status/:orderId` - Update order status
- `PATCH /api/admin/menu-availability/:menuItemId` - Toggle menu item availability
- `GET /api/hall/admin/hall-bookings` - Get all hall bookings (with optional status filter)
- `PATCH /api/hall/admin/hall-booking-status/:bookingId` - Update hall booking status

## 🎨 Customization

### Menu Items

Edit the `INSERT` statements in `database/schema.sql` to customize menu items.

### Styling

Modify `frontend/tailwind.config.js` and `frontend/src/index.css` to customize the design.

## 📝 License

This project is open source and available for commercial use.

## 🆘 Support

For issues or questions, please check the code comments or create an issue in the repository.

