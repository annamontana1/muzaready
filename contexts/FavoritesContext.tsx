'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'muza-favorites';

export type FavoriteItem = {
  id: string;
  name?: string;
  slug?: string;
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const prevRef = useRef<FavoriteItem[]>([]);

  // načíst z localStorage jen jednou
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.warn('favorites parse error', e);
      }
    }
    setHydrated(true);
  }, []);

  // uložit do localStorage, když se změní
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;

    const prev = prevRef.current;
    const same =
      prev.length === favorites.length &&
      prev.every((p, i) => p.id === favorites[i].id);
    if (same) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    prevRef.current = favorites;
  }, [favorites, hydrated]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    // Return default value instead of throwing, to handle SSR
    return {
      favorites: [],
      addFavorite: () => {},
      removeFavorite: () => {},
    };
  }
  return ctx;
}
