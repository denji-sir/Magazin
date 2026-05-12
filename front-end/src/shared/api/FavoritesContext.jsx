import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const resp = await api.get('/catalog/favorites/');
    setItems(resp.data || []);
  };

  useEffect(() => {
    const init = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await loadFavorites();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isAuthenticated, authLoading]);

  const favoriteIds = useMemo(() => items.map((item) => item.product_id), [items]);

  const isFavorite = (productId) => favoriteIds.includes(Number(productId));

  const addFavorite = async (productId) => {
    const resp = await api.post('/catalog/favorites/', { product_id: productId });
    const favorite = resp.data.favorite;
    if (favorite && !items.find((item) => item.product_id === favorite.product_id)) {
      setItems((prev) => [favorite, ...prev]);
    }
    return { ok: true, isFavorite: true };
  };

  const removeFavorite = async (productId) => {
    await api.delete(`/catalog/favorites/${productId}/`);
    setItems((prev) => prev.filter((item) => item.product_id !== Number(productId)));
    return { ok: true, isFavorite: false };
  };

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      return { ok: false, unauthorized: true };
    }

    if (isFavorite(productId)) {
      return removeFavorite(productId);
    }
    return addFavorite(productId);
  };

  const value = {
    items,
    loading,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    reloadFavorites: loadFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
