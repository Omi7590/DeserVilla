import axios from 'axios';

// Use environment variable or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deservilla.onrender.com/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout for slower networks
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const menuAPI = {
  getMenu: () => api.get('/menu')
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/order', orderData),
  createPaymentOrder: (data) => api.post('/order/payment/create', data),
  verifyPayment: (data) => api.post('/order/payment/verify', data)
};

export const adminAPI = {
  // Auth
  login: (credentials) => api.post('/admin/login', credentials),
  changePassword: (data) => api.post('/admin/change-password', data),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  
  // Orders
  getOrders: (filters) => api.get('/admin/orders', { params: filters }),
  updateOrderStatus: (orderId, orderStatus) => 
    api.patch(`/admin/orders/${orderId}/status`, { orderStatus }),
  
  // Products
  getProducts: () => api.get('/admin/products'),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (productId, productData) => 
    api.put(`/admin/products/${productId}`, productData),
  updateProductAvailability: (productId, isAvailable) =>
    api.patch(`/admin/products/${productId}/availability`, { isAvailable }),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
  
  // Payments
  getPayments: (filters) => api.get('/admin/payments', { params: filters })
};

export const hallBookingAPI = {
  // Legacy APIs
  checkAvailability: (data) => api.post('/hall/check-availability', data),
  createBooking: (data) => api.post('/hall/book', data),
  // New hourly APIs
  checkHourlyAvailability: (data) => api.post('/hall/check-hourly-availability', data),
  createHourlyBooking: (data) => api.post('/hall/book-hourly', data),
  // Payment APIs
  createPaymentOrder: (data) => api.post('/hall/payment/create', data),
  verifyPayment: (data) => api.post('/hall/payment/verify', data),
  // Admin APIs
  getAllBookings: (status) => api.get('/hall/admin/hall-bookings', { params: { status } }),
  getBookingSlots: (bookingId) => api.get(`/hall/admin/hall-booking-slots/${bookingId}`),
  updateBookingStatus: (bookingId, bookingStatus) =>
    api.patch(`/hall/admin/hall-booking-status/${bookingId}`, { bookingStatus }),
  markRemainingPaymentPaid: (bookingId) =>
    api.patch(`/hall/admin/hall-booking-remaining-payment/${bookingId}`)
};

export default api;

