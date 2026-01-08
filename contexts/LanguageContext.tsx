'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import csTranslations from '@/locales/cs.json';
import enTranslations from '@/locales/en.json';

export type Language = 'cs' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = {
  cs: csTranslations,
  en: enTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cs');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'cs' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, [mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  };

  // Translation function with nested key support (e.g., "nav.home")
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if translation not found
        console.warn(`Translation missing for key: ${key} (language: ${language})`);
        return key;
      }
    }

    // If no value found, return key
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // Replace parameters in the translation (e.g., {{count}} -> params.count)
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for just the t function
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
