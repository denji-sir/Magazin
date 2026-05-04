import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

/**
 * CartProvider — manages shopping cart state with local persistence
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from LocalStorage');
      }
    }
  }, []);

  // Sync cart to LocalStorage and update total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [items]);

  /**
   * Add item to cart
   */
  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  /**
   * Remove item from cart
   */
  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  /**
   * Update quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => 
      prev.map((item) => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear cart
   */
  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
