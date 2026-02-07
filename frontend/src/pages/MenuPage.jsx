import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { menuAPI, orderAPI } from '../services/api';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';
import MenuItem from '../components/MenuItem';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import { ShoppingCart, Loader2, Calendar, UtensilsCrossed, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const MenuPage = () => {
  const { cart, tableNumber, selectTable, clearCart, getTotal } = useCart();
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRazorpayScript();
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getMenu();
      console.log('Menu API Response:', response);
      
      if (response.data && response.data.menu) {
        setMenu(response.data.menu);
      } else if (response.data && response.data.success && response.data.menu) {
        setMenu(response.data.menu);
      } else {
        console.error('Unexpected response format:', response);
        toast.error('Invalid menu data format');
      }
    } catch (error) {
      console.error('Menu fetch error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.error || 'Database connection error';
        toast.error(`Database error: ${errorMsg}. Please check MySQL is running in XAMPP.`, {
          duration: 6000
        });
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000.', {
          duration: 6000
        });
      } else {
        toast.error(`Failed to load menu: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Removed auto-show table selector - will only show when user tries to checkout

  const handleTableSelect = (table) => {
    selectTable(table);
    setShowTableSelector(false);
    toast.success(`Table ${table} selected!`);
    
    // If cart has items, automatically proceed to checkout after table selection
    if (cart.length > 0) {
      // Small delay to let the toast show and modal close
      setTimeout(() => {
        handleCheckout();
      }, 500);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check for table number - table selector is now in cart drawer
    if (!tableNumber) {
      toast.error('Please select your table number to continue');
      return;
    }

    // Proceed with payment if table is selected
    setIsProcessing(true);
    setIsCartOpen(false);

    try {
      // Create order
      const orderData = {
        tableNumber: tableNumber,
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity
        })),
        totalAmount: getTotal()
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const orderId = orderResponse.data.order.id;

      // Create Razorpay payment order
      const paymentResponse = await orderAPI.createPaymentOrder({
        orderId,
        amount: getTotal()
      });

      const { razorpayOrderId, amount, currency, key } = paymentResponse.data;

      // Open Razorpay checkout
      const paymentResult = await openRazorpayCheckout({
        key,
        amount,
        currency,
        razorpayOrderId,
        orderId
      });

      // Verify payment
      const verifyResponse = await orderAPI.verifyPayment({
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        orderId
      });

      if (verifyResponse.data.success) {
        clearCart();
        navigate(`/payment-success?orderId=${orderId}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error.message !== 'Payment cancelled') {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-500 sticky top-0 z-30 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <h1 className="text-white text-xl font-bold">Desert Villa</h1>
              <p className="text-white/80 text-xs">Order delicious food</p>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/hall-booking"
                className="flex items-center gap-1 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Book Hall</span>
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Table Selector */}
          {tableNumber ? (
            <div className="mt-3 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-sm font-medium">Table {tableNumber}</span>
              </div>
              <button
                onClick={() => setShowTableSelector(true)}
                className="text-xs text-white/80 hover:text-white underline"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowTableSelector(true)}
              className="mt-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/20 transition-all"
            >
              Select Table Number
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-amber-500/10 to-orange-500/10 animate-pulse-slow"></div>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/30 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 relative z-10" style={{fontFamily: 'Poppins, sans-serif'}}>
              <span className="inline-block hero-word" style={{animationDelay: '0s'}}>
                {'Welcome'.split('').map((char, i) => (
                  <span
                    key={i}
                    className="inline-block text-gray-800 hero-letter"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      transform: 'translateY(100px) rotateX(90deg)',
                      opacity: 0
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span className="inline-block mx-2"></span>
              <span className="inline-block hero-word" style={{animationDelay: '0.3s'}}>
                {'to'.split('').map((char, i) => (
                  <span
                    key={i}
                    className="inline-block text-gray-800 hero-letter"
                    style={{
                      animationDelay: `${(i + 7) * 0.05}s`,
                      transform: 'translateY(100px) rotateX(90deg)',
                      opacity: 0
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
               <span className="inline-block mx-3"></span>
               <span className="inline-block hero-word relative group cursor-pointer px-2 py-1" style={{animationDelay: '0.6s'}}>
                 {/* White background with orange border */}
                 <span className="absolute -inset-0.5 bg-white rounded-md z-0 border-2 border-orange-500 shadow-sm group-hover:shadow-md transition-all duration-300"></span>
                 {/* Glow effects */}
                 <span className="absolute -inset-2 bg-gradient-to-r from-primary-400/20 via-primary-500/30 to-primary-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-lg"></span>
                 {'Desert'.split('').map((char, i) => (
                   <span
                     key={i}
                     className="inline-block hero-letter relative z-10"
                     style={{
                       animationDelay: `${(i + 10) * 0.05}s`,
                       transform: 'translateY(100px) rotateX(90deg) scale(0.5)',
                       opacity: 0,
                       color: 'rgba(234, 88, 12, 1)',
                       textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                       fontWeight: '700'
                     }}
                   >
                     {char === ' ' ? '\u00A0' : char}
                   </span>
                 ))}
               </span>
               <span className="inline-block mx-2"></span>
               <span className="inline-block hero-word relative group cursor-pointer px-2 py-1" style={{animationDelay: '0.9s'}}>
                 {/* White background with orange border */}
                 <span className="absolute -inset-0.5 bg-white rounded-md z-0 border-2 border-orange-500 shadow-sm group-hover:shadow-md transition-all duration-300"></span>
                 {/* Glow effects */}
                 <span className="absolute -inset-2 bg-gradient-to-r from-primary-400/20 via-primary-500/30 to-primary-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-lg"></span>
                 {'Villa'.split('').map((char, i) => (
                   <span
                     key={i}
                     className="inline-block hero-letter relative z-10"
                     style={{
                       animationDelay: `${(i + 16) * 0.05}s`,
                       transform: 'translateY(100px) rotateX(90deg) scale(0.5)',
                       opacity: 0,
                       color: 'rgba(234, 88, 12, 1)',
                       textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                       fontWeight: '700'
                     }}
                   >
                     {char === ' ' ? '\u00A0' : char}
                   </span>
                 ))}
               </span>
            </h2>
            {/* Decorative underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent hero-underline"></div>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '1.5s'}}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto relative">
              <span className="inline-block hero-subtitle" style={{animationDelay: '1.6s'}}>
                Handcrafted delicacies and beverages made with love
              </span>
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-2 animate-float">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {Object.keys(menu).length === 0 ? (
          <div className="text-center py-20">
            <div className="card-gradient max-w-md mx-auto">
              <p className="text-gray-500 text-lg font-semibold">No menu items available</p>
            </div>
          </div>
        ) : (
          Object.entries(menu).map(([category, items], index) => (
            <div key={category} className="mb-16" style={{ animation: `slideUp 0.6s ease-out ${index * 0.15}s both` }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-transparent rounded-full animate-slide-up"></div>
                <h2 className="section-title capitalize">{category}</h2>
                <div className="h-1 flex-1 bg-gradient-to-l from-primary-500 to-transparent rounded-full animate-slide-up"></div>
              </div>
      <div className="grid grid-cols-3 gap-3">
                {items.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      animation: `scaleIn 0.4s ease-out ${(index * 0.15) + (itemIndex * 0.08)}s both` 
                    }}
                  >
                    <MenuItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Table Selector Modal */}
      {showTableSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="card-gradient max-w-md w-full animate-scale-in border-2 border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold gradient-text">Select Your Table</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {cart.length > 0 
                    ? 'Choose your table number to proceed with payment'
                    : 'Choose your table number to continue'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTableSelector(false);
                  if (cart.length > 0) {
                    setIsCartOpen(true); // Reopen cart if they cancel
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6].map((table) => (
                <button
                  key={table}
                  onClick={() => handleTableSelect(table)}
                  className={`p-6 rounded-xl font-display font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                    tableNumber === table
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-300 shadow-md'
                  }`}
                >
                  {table}
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Or scan the QR code on your table
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="card-gradient max-w-sm mx-4 text-center p-10 border-2 border-primary-200">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your order...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;

