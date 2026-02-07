import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import hallBookingRoutes from './routes/hallBookingRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkTables } from './scripts/checkTables.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5176',
  'http://192.168.156.86:5173', // Allow access from network IP
  'http://192.168.203.86:5173', // Current network IP
  'https://deser-villa.vercel.app', // Vercel deployment
  'https://desertvilla.in', // Custom domain
  'https://www.desertvilla.in' // Custom domain with www
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow any localhost, 127.0.0.1, local network IPs, and vercel.app domains
      if (origin.includes('localhost') || 
          origin.includes('127.0.0.1') || 
          origin.includes('192.168.') ||
          origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hall', hallBookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Check database tables on startup (non-blocking)
checkTables().catch(err => {
  console.error('Error during table check:', err);
});

// Get local network IP
import os from 'os';
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const networkIP = getLocalIP();
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://${networkIP}:${PORT}`);
});

