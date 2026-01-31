import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const MenuItem = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!item.is_available) {
      toast.error('This item is currently unavailable');
      return;
    }
    addToCart(item);
    toast.success('Added to cart');
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className={`bg-white rounded-lg p-3 ${!item.is_available ? 'opacity-60' : ''}`}>
      {/* Product Image */}
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl">🍰</span>
          </div>
        )}
        
        {/* Availability indicator - small dot */}
        {!item.is_available && (
          <div className="absolute top-2 right-2">
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
          {item.name}
        </h3>
        
        {item.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary-600">
            ₹{parseFloat(item.price).toFixed(0)}
          </span>
        </div>

        {/* Add to Cart / Quantity Controls */}
        {item.is_available && (
          <div className="w-full">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-primary-50 rounded-lg px-2 py-1.5">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-primary-600 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-primary-600 px-3">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center text-white hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            )}
          </div>
        )}
        
        {!item.is_available && (
          <button
            disabled
            className="w-full py-2.5 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;

