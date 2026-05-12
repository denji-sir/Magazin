import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

/**
 * CartProvider — manages shopping cart state with local persistence
 */
export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapServerItem = (item) => ({
    id: item.id,
    productId: item.product_id,
    name: item.name,
    price: Number(item.price),
    image: item.image,
    inStock: item.inStock,
    quantity: item.quantity,
  });

  const mapLocalItem = (item) => ({
    id: item.id,
    productId: item.productId || item.id,
    name: item.name,
    price: Number(item.price || 0),
    image: item.image || item.image_url || '',
    inStock: item.inStock ?? item.in_stock ?? true,
    quantity: Number(item.quantity || 1),
  });

  const loadLocalCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) {
      setItems([]);
      return;
    }
    try {
      const parsed = JSON.parse(savedCart);
      setItems(Array.isArray(parsed) ? parsed.map(mapLocalItem) : []);
    } catch {
      setItems([]);
    }
  };

  const loadServerCart = async () => {
    const response = await api.get('/cart/');
    const serverItems = response.data?.items || [];
    setItems(serverItems.map(mapServerItem));
  };

  useEffect(() => {
    const init = async () => {
      if (authLoading) return;
      setLoading(true);
      try {
        if (isAuthenticated) {
          await loadServerCart();
        } else {
          loadLocalCart();
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  /**
   * Add item to cart
   */
  const addItem = async (product, quantity = 1) => {
    if (isAuthenticated) {
      await api.post('/cart/items/', { product_id: product.id, quantity });
      await loadServerCart();
      return;
    }
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image || product.image_url || '',
          inStock: product.inStock ?? product.in_stock ?? true,
          quantity,
        },
      ];
    });
  };

  /**
   * Remove item from cart
   */
  const removeItem = async (itemId) => {
    if (isAuthenticated) {
      await api.delete(`/cart/items/${itemId}/`);
      await loadServerCart();
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  /**
   * Update quantity
   */
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    if (isAuthenticated) {
      await api.patch(`/cart/items/${itemId}/`, { quantity });
      await loadServerCart();
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
  };

  /**
   * Clear cart
   */
  const clearCart = async () => {
    if (isAuthenticated) {
      await api.delete('/cart/clear/');
      setItems([]);
      return;
    }
    setItems([]);
  };

  const itemCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = {
    items,
    loading,
    itemCount,
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
