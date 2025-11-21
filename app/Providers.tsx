'use client';

import { SkuCartProvider } from '@/contexts/SkuCartContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { PreferencesProvider } from '@/lib/preferences-context';
import { AuthProvider } from '@/components/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <CartProvider>
            <SkuCartProvider>{children}</SkuCartProvider>
          </CartProvider>
        </FavoritesProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}
