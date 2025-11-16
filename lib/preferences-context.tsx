'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'cs' | 'en';
type Currency = 'CZK' | 'EUR';

interface PreferencesContextValue {
  language: Language;
  currency: Currency;
  exchangeRate: number;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  refreshExchangeRate: () => Promise<void> | void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const DEFAULT_RATE = 1 / 25.5;

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cs');
  const [currency, setCurrencyState] = useState<Currency>('CZK');
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_RATE);

  const refreshExchangeRate = async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      if (!response.ok) return;
      const data = await response.json();
      if (data?.czkToEur) {
        setExchangeRate(Number(data.czkToEur));
      }
    } catch (error) {
      console.warn('Exchange rate fetch failed', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLang = window.localStorage.getItem('preferredLanguage') as Language | null;
    const storedCurrency = window.localStorage.getItem('preferredCurrency') as Currency | null;

    if (storedLang) {
      setLanguageState(storedLang);
    } else if (navigator.language.startsWith('en')) {
      setLanguageState('en');
    }

    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }

    refreshExchangeRate();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLanguage', lang);
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredCurrency', curr);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{ language, currency, exchangeRate, setLanguage, setCurrency, refreshExchangeRate }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
