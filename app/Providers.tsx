'use client';

import { SkuCartProvider } from '@/contexts/SkuCartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { PreferencesProvider } from '@/lib/preferences-context';
import { AuthProvider } from '@/components/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PreferencesProvider>
          <FavoritesProvider>
            <SkuCartProvider>{children}</SkuCartProvider>
          </FavoritesProvider>
        </PreferencesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
