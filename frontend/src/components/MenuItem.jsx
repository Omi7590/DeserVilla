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
    <div className={`bg-white rounded-lg p-2.5 ${!item.is_available ? 'opacity-60' : ''}`}>
      {/* Product Image */}
      <div className="relative aspect-square mb-2 rounded-lg overflow-hidden bg-gray-50">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-3xl">🍰</span>
          </div>
        )}
        
        {/* Availability indicator - small dot */}
        {!item.is_available && (
          <div className="absolute top-1.5 right-1.5">
            <span className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">
          {item.name}
        </h3>
        
        {item.description && (
          <p className="text-[10px] text-gray-500 mb-1.5 line-clamp-1">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-600">
            ₹{parseFloat(item.price).toFixed(0)}
          </span>
        </div>

        {/* Add to Cart / Quantity Controls */}
        {item.is_available && (
          <div className="w-full">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-primary-50 rounded-lg px-1.5 py-1">
                <button
                  onClick={handleDecrement}
                  className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-primary-600 hover:bg-gray-50"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-primary-600 px-2 text-sm">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center text-white hover:bg-primary-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            )}
          </div>
        )}
        
        {!item.is_available && (
          <button
            disabled
            className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;

