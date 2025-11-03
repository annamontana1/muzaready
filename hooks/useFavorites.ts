'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseFavoritesReturn {
  favorites: string[];
  favoriteCount: number;
  isFavorite: (productId: string) => boolean;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
}

const STORAGE_KEY = 'favorites';

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Načíst z localStorage po mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
      setIsHydrated(true);
    }
  }, []);

  // Uložit do localStorage při změně
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

        // Analytika
        if ('gtag' in window) {
          const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
          gtag('event', 'favorites_updated', {
            count: favorites.length
          });
        }
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isHydrated]);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev;
      }

      const newFavorites = [...prev, productId];

      // Analytika
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', 'favorite_add', {
          product_id: productId
        });
      }

      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== productId);

      // Analytika
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', 'favorite_remove', {
          product_id: productId
        });
      }

      return newFavorites;
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);

      if (isFav) {
        // Remove
        const newFavorites = prev.filter((id) => id !== productId);
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
          gtag('event', 'favorite_remove', {
            product_id: productId
          });
        }
        return newFavorites;
      } else {
        // Add
        const newFavorites = [...prev, productId];
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
          gtag('event', 'favorite_add', {
            product_id: productId
          });
        }
        return newFavorites;
      }
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  return {
    favorites,
    favoriteCount: favorites.length,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
}
