import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingCart, UtensilsCrossed, CreditCard, Banknote } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, getTotal, tableNumber, selectTable } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300" style={{ animation: 'slideInRight 0.4s ease-out' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold">Your Cart</h2>
              <p className="text-primary-100 text-sm mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-gray-500 text-lg font-semibold">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card-gradient p-5 border border-gray-100 hover:border-primary-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-200 to-amber-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-700">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-gray-800 mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {item.category}
                      </p>
                      <p className="text-lg font-bold gradient-text">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 bg-primary-100 hover:bg-primary-200 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-primary-700" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="text-lg font-bold gradient-text">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 space-y-4 shadow-lg">
            {/* Table Number Display - Read Only */}
            {tableNumber ? (
              <div className="bg-gradient-to-r from-primary-50 to-amber-50 rounded-xl p-4 border-2 border-primary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-semibold text-gray-700">Your Table</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    Table {tableNumber}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-200 p-2 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-800 mb-1">
                      Scan QR Code Required
                    </p>
                    <p className="text-xs text-yellow-700">
                      Please scan the QR code on your table to continue
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'ONLINE'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                      : 'border-gray-200 hover:border-primary-200 text-gray-600'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Online
                </button>
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'CASH'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                      : 'border-gray-200 hover:border-primary-200 text-gray-600'
                    }`}
                >
                  <Banknote className="w-4 h-4" />
                  Pay Cash
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 to-amber-50 rounded-xl border border-primary-100">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-3xl font-display font-bold gradient-text">
                ₹{getTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onCheckout(paymentMethod)}
              disabled={!tableNumber}
              className={`w-full py-4 text-lg font-display rounded-lg transition-all ${tableNumber
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {tableNumber
                ? (paymentMethod === 'ONLINE' ? 'Pay & Place Order' : 'Place Order (Pay at Counter)')
                : 'Scan QR Code to Continue'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

