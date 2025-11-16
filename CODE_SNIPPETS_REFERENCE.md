# Klíčové Code Snippets - Muza Ready

## 1. CatalogCard - Tier Badge Styling

```typescript
const getTierLabel = (tier: string) => {
  switch (tier) {
    case 'Platinum edition':
      return '✨ Platinum Edition';
    case 'LUXE':
      return '💎 Luxe';
    case 'Standard':
      return '⭐ Standard';
    default:
      return tier;
  }
};

const getTierColor = (tier: string): string => {
  switch (tier) {
    case 'Platinum edition':
      return 'from-yellow-100 to-yellow-200';
    case 'LUXE':
      return 'from-pink-100 to-pink-200';
    case 'Standard':
      return 'from-blue-100 to-blue-200';
    default:
      return 'from-gray-100 to-gray-200';
  }
};

// V JSX:
<div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-gray-800 bg-gradient-to-r ${tierColorClass} shadow-light`}>
  {tierLabel}
</div>
```

## 2. CatalogCard - Hair Color Gradient

```typescript
const getShadeColor = (shade?: number): { hex: string; name: string } => {
  if (!shade) return { hex: '#e8e1d7', name: 'ivory' };
  const color = HAIR_COLORS[shade];
  return color ? { hex: color.hex, name: color.name } : { hex: '#e8e1d7', name: 'ivory' };
};

// Použití v renderování:
<div
  className="w-full h-full flex items-center justify-center relative"
  style={{
    background: `linear-gradient(135deg, ${shadeColor.hex} 0%, ${shadeColor.hex}dd 50%, ${shadeColor.hex}bb 100%)`,
  }}
>
  {/* Texture overlay */}
  <div
    className="absolute inset-0 opacity-20"
    style={{
      backgroundImage:
        'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
    }}
  />
</div>
```

## 3. Currency Formatting

```typescript
const DEFAULT_RATE = 1 / 25.5;

const formatCurrencyValue = (value: number, currency: 'CZK' | 'EUR') => {
  return new Intl.NumberFormat(currency === 'CZK' ? 'cs-CZ' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'CZK' ? 1 : 2,
    maximumFractionDigits: currency === 'CZK' ? 1 : 2,
  }).format(value);
};

// V CatalogCard:
const { currency, exchangeRate } = usePreferences();
const rate = exchangeRate || DEFAULT_RATE;

// Zobrazení ceny:
<p className="text-base font-semibold text-burgundy">
  {formatCurrencyValue(currency === 'CZK' ? props.pricePerGramCzk : props.pricePerGramCzk * rate, currency)}/g
</p>
<p className="text-xs text-gray-500">
  {currency === 'CZK'
    ? `${formatCurrencyValue(props.pricePerGramCzk * rate, 'EUR')}/g`
    : `${formatCurrencyValue(props.pricePerGramCzk, 'CZK')}/g`}
</p>
```

## 4. SkuCartContext - Add to Cart Logic

```typescript
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
```

## 5. SkuCartContext - Update Grams (Pro BULK_G)

```typescript
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
```

## 6. SkuCartContext - localStorage Integration

```typescript
const CART_STORAGE_KEY = 'sku-cart';
const CART_VERSION = 2;

// Load na mount:
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

// Save když se změní:
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
```

## 7. ScrollPicker - Mobile Bottom Sheet

```tsx
{isMobile && isOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={handleCancel}
    />

    {/* Bottom Sheet */}
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Zrušit
        </button>
        <h3 className="text-lg font-semibold text-burgundy">{label}</h3>
        <button
          onClick={handleConfirm}
          className="text-burgundy font-semibold hover:text-maroon"
        >
          Hotovo
        </button>
      </div>

      {/* Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value, option.disabled)}
              disabled={option.disabled}
              className={`w-full p-4 rounded-lg text-left transition ${
                option.disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : tempValue === option.value
                  ? 'bg-burgundy text-white'
                  : 'bg-gray-50 text-gray-900 hover:bg-burgundy/10'
              }`}
            >
              <span className="font-medium">{option.label} {unit}</span>
              {option.disabled && (
                <span className="block text-xs mt-1 opacity-70">
                  {option.tooltip || 'Není skladem'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
)}
```

## 8. WholesaleRegistrationModal - Complete Pattern

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface WholesaleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesaleRegistrationModal({
  isOpen,
  onClose,
}: WholesaleRegistrationModalProps) {
  const { registerWholesale, loading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    // ... more fields
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Vyplňte všechna povinná pole');
      return;
    }

    try {
      await registerWholesale(formData);
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registrace selhala');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-burgundy">Registrace na velkoobchod</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(error || localError) && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || localError}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jméno *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            {/* More fields... */}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-burgundy text-white py-2 rounded-md font-medium hover:bg-maroon disabled:bg-gray-400 transition"
            >
              {loading ? 'Registruji...' : 'Registrovat se'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 disabled:bg-gray-100 transition"
            >
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## 9. PreferencesContext - Celý pattern

```typescript
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
```

## 10. HAIR_COLORS Database - Struktura

```typescript
export interface HairColor {
  code: number; // 1-10
  name: string;
  hex: string;
  ribbonColor: string;
  synonyms: string[];
}

export const HAIR_COLORS: Record<number, HairColor> = {
  1: {
    code: 1,
    name: "Černá",
    hex: "#1A1A1A",
    ribbonColor: "#1A1A1A",
    synonyms: ["uhlová", "ebenová", "jet black", "black", "cerna"],
  },
  2: {
    code: 2,
    name: "Velmi tmavá hnědá",
    hex: "#2C2416",
    ribbonColor: "#2C2416",
    synonyms: ["espresso", "moka", "téměř černá", "temer cerna"],
  },
  // ... až do 10
  10: {
    code: 10,
    name: "Platinová blond",
    hex: "#E5D5B7",
    ribbonColor: "#E5D5B7",
    synonyms: ["platinová", "platinum", "nordic blond", "platinova"],
  },
};

// COLOR_FAMILIES pro vyhledávání
export const COLOR_FAMILIES: Record<string, number[]> = {
  "hneda": [2, 3, 4, 5],
  "blond": [6, 7, 8, 9, 10],
  "platinova": [10],
  "platinová": [10],
};
```

