import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

const FAVORITES_STORAGE_KEY = 'aura_luxe_favorite_services';

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse favorites', e);
    }
    return ['srv-1', 'srv-5', 'srv-8']; // Default favorites for initial delight
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (serviceId) => {
    setFavoriteIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isFavorite = (serviceId) => favoriteIds.includes(serviceId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
