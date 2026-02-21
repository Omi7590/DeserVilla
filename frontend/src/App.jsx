import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import MenuPage from './pages/MenuPage';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPayments from './pages/admin/AdminPayments';
import AdminHallBookings from './pages/admin/AdminHallBookings';
import AdminChangePassword from './pages/admin/AdminChangePassword';
import HallBookingPage from './pages/HallBookingPage';
import HallBookingCheckout from './pages/HallBookingCheckout';
import HallBookingSuccess from './pages/HallBookingSuccess';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import QRCodeGenerator from './pages/QRCodeGenerator';

function App() {
  // Start backend keep-alive on mount
  useEffect(() => {
    startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  return (
    <CartProvider>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/hall-booking" element={<HallBookingPage />} />
        <Route path="/hall-booking/checkout" element={<HallBookingCheckout />} />
        <Route path="/hall-booking/success" element={<HallBookingSuccess />} />
        
        {/* Legal Pages */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/qr-codes" element={<QRCodeGenerator />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="hall-bookings" element={<AdminHallBookings />} />
          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </CartProvider>
  );
}

export default App;

