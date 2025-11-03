'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rychlé návrhy
  const quickSuggestions = [
    'Nebarvené vlasy',
    'Vlasové tresy',
    'Nano tapes',
    'Keratin',
    'Barvené blond',
  ];

  // Auto focus při otevření
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Načíst historii z localStorage
      const history = localStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, [isOpen]);

  // Zavření na Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Blokovat scroll při otevřeném overlay
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Uložit do historie
    const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Analytika
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', 'search', {
        search_term: query
      });
    }

    // TODO: Implementovat skutečné vyhledávání
    console.log('Searching for:', query);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-white z-[100] overflow-y-auto lg:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Header s inputem */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
              placeholder="Hledat vlasy, metody, příčesky…"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-burgundy"
              aria-label="Vyhledávací pole"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Zavřít vyhledávání"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Obsah */}
      <div className="p-4">
        {/* Historie hledání */}
        {searchHistory.length > 0 && !searchQuery && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Poslední hledání</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(query)}
                  className="px-3 py-1.5 bg-ivory text-burgundy text-sm rounded-full hover:bg-burgundy hover:text-white transition"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rychlé návrhy */}
        {!searchQuery && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Oblíbené kategorie</h3>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="px-3 py-1.5 bg-white border border-burgundy/20 text-burgundy text-sm rounded-full hover:bg-burgundy hover:text-white transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Výsledky vyhledávání */}
        {searchQuery && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Vyhledávání pro: <strong>{searchQuery}</strong>
            </p>
            {/* TODO: Zde zobrazit skutečné výsledky */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Produkty</h3>
                <p className="text-sm text-gray-500">Funkce vyhledávání bude brzy k dispozici...</p>
              </div>
            </div>
          </div>
        )}

        {/* Prázdný stav */}
        {!searchQuery && searchHistory.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-sm">Začněte psát pro vyhledávání</p>
          </div>
        )}
      </div>
    </div>
  );
}
