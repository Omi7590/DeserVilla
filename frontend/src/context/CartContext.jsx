import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    // Get table number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('table');
    if (table) {
      setTableNumber(parseInt(table));
    } else {
      // Check if table number is stored in localStorage
      const savedTable = localStorage.getItem('selectedTable');
      if (savedTable) {
        setTableNumber(parseInt(savedTable));
      }
    }
  }, []);

  const selectTable = (table) => {
    setTableNumber(table);
    localStorage.setItem('selectedTable', table.toString());
    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('table', table.toString());
    window.history.pushState({}, '', url);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        tableNumber,
        selectTable,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

