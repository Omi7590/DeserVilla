import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { menuAPI, orderAPI } from '../services/api';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Loader2, ChevronRight, Home, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MenuPageMobile = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, tableNumber, selectTable, clearCart, getTotal } = useCart();
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadRazorpayScript();
    fetchMenu();
    
    // Get table number from URL parameter
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const tableNum = parseInt(tableParam);
      if (tableNum >= 1 && tableNum <= 10) {
        selectTable(tableNum);
      }
    }
  }, [searchParams]);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getMenu();
      if (response.data && response.data.menu) {
        setMenu(response.data.menu);
        // Set first category as selected
        const categories = Object.keys(response.data.menu);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
      }
    } catch (error) {
      console.error('Menu fetch error:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!tableNumber) {
      toast.error('Please scan the QR code on your table');
      return;
    }

    setIsProcessing(true);
    setIsCartOpen(false);

    try {
      const orderData = {
        tableNumber: tableNumber,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal()
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const orderId = orderResponse.data.order.id;

      const paymentResponse = await orderAPI.createPaymentOrder({
        orderId,
        amount: getTotal()
      });

      const { razorpayOrderId, amount, currency, key } = paymentResponse.data;

      const paymentResult = await openRazorpayCheckout({
        key,
        amount,
        currency,
        razorpayOrderId,
        orderId
      });

      const verifyResponse = await orderAPI.verifyPayment({
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        orderId
      });

      if (verifyResponse.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const categories = Object.keys(menu);
  const allItems = categories.flatMap(cat => menu[cat] || []);
  const displayItems = selectedCategory === 'all' ? allItems : (menu[selectedCategory] || []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">Desert Villa</h1>
              <p className="text-primary-100 text-sm">Order delicious food</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Table Display - Read Only */}
          {tableNumber ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-100">Your Table</p>
                <p className="text-2xl font-bold">Table {tableNumber}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <QrCode className="w-5 h-5" />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-500/50">
              <div className="flex items-start gap-3">
                <QrCode className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-yellow-100 mb-1">Scan QR Code Required</p>
                  <p className="text-xs text-yellow-200">
                    Please scan the QR code on your table to start ordering
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 px-4 pb-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-3">
        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items available</p>
          </div>
        ) : (
          displayItems.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                  )}
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold text-xl">₹{item.price}</span>
                      
                      {/* Add/Remove Buttons */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.isAvailable}
                          className="bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {item.isAvailable ? 'Add' : 'Unavailable'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-primary-50 rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold hover:bg-primary-100 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-primary-600">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex items-center justify-between max-w-[430px] mx-auto">
          <button
            onClick={() => navigate('/hall-booking')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Book Hall</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 text-primary-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs font-medium">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-primary-600 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{getTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!tableNumber}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {tableNumber ? 'Proceed to Payment' : 'Scan QR Code First'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MenuPageMobile;
