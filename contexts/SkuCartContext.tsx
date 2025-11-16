'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { SkuCartItem, CartContextType } from '@/types/cart';

export { type SkuCartItem, type CartContextType } from '@/types/cart';

export const SkuCartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sku-cart';
const CART_VERSION = 2; // Increment when changing storage structure

export function SkuCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SkuCartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Version check for migration
        if (parsed.version === CART_VERSION && Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          version: CART_VERSION,
          items,
          savedAt: new Date().toISOString(),
        })
      );
    }
  }, [items, mounted]);

  const addToCart = (newItem: Omit<SkuCartItem, 'addedAt'>) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.skuId === newItem.skuId);

      if (existingIndex > -1) {
        // Item already exists - update quantity and grams
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 1) + (newItem.quantity || 1),
          // For BULK items, recalculate totals
          ...(newItem.saleMode === 'BULK_G' && {
            grams: (existing.grams || 0) + newItem.grams,
            assemblyFeeTotal: (existing.assemblyFeeTotal || 0) + newItem.assemblyFeeTotal,
            lineTotal: (existing.lineTotal || 0) + newItem.lineTotal,
            lineGrandTotal: (existing.lineGrandTotal || 0) + newItem.lineGrandTotal,
          }),
        };
        return updated;
      }

      // Add new item with timestamp
      return [
        ...prevItems,
        {
          ...newItem,
          addedAt: Date.now(),
        },
      ];
    });
  };

  const removeFromCart = (skuId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.skuId !== skuId));
  };

  const updateQuantity = (skuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(skuId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.skuId === skuId
          ? {
              ...item,
              quantity,
              // For BULK items, grams might change - this is handled by updateGrams
            }
          : item
      )
    );
  };

  const updateGrams = (skuId: string, grams: number) => {
    if (grams <= 0) {
      removeFromCart(skuId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.skuId !== skuId || item.saleMode !== 'BULK_G') {
          return item;
        }

        // For BULK items, recalculate assembly fee and totals based on new grams
        let newAssemblyFeeTotal = 0;
        if (item.assemblyFeeType === 'PER_GRAM') {
          newAssemblyFeeTotal = item.assemblyFeeCzk * grams;
        } else {
          newAssemblyFeeTotal = item.assemblyFeeCzk;
        }

        const newLineTotal = item.pricePerGram * grams;
        const newLineGrandTotal = newLineTotal + newAssemblyFeeTotal;

        return {
          ...item,
          grams,
          assemblyFeeTotal: newAssemblyFeeTotal,
          lineTotal: newLineTotal,
          lineGrandTotal: newLineGrandTotal,
        };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.lineGrandTotal, 0);
  };

  const getTotalWithShipping = (shippingCost: number) => {
    return getTotalPrice() + shippingCost;
  };

  const value: CartContextType = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateGrams,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getTotalWithShipping,
    }),
    [items]
  );

  return (
    <SkuCartContext.Provider value={value}>{children}</SkuCartContext.Provider>
  );
}

export function useSkuCart() {
  const context = useContext(SkuCartContext);
  if (context === undefined) {
    throw new Error('useSkuCart must be used within a SkuCartProvider');
  }
  return context;
}

// Legacy hook name for backward compatibility during migration
export function useCart() {
  return useSkuCart();
}
