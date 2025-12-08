'use client';

import { SkuCartProvider } from '@/contexts/SkuCartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { PreferencesProvider } from '@/lib/preferences-context';
import { AuthProvider } from '@/components/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <SkuCartProvider>{children}</SkuCartProvider>
        </FavoritesProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}
