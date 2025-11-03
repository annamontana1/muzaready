'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchProducts, SearchResult, getFallbackCTA } from '@/lib/product-search';
import { mockProducts } from '@/lib/mock-products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rychlé návrhy
  const quickSuggestions = [
    'Standard',
    'Luxe',
    'Platinum',
    'Standard 50 cm',
    'Luxe rovné',
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
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);

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

    // Perform search
    const results = searchProducts(mockProducts, query, { limit: 10 });
    setSearchResults(results);
    setIsSearching(false);
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
        {searchQuery && searchResults && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {searchResults.totalCount > 0 ? (
                <>Nalezeno <strong>{searchResults.totalCount}</strong> {searchResults.totalCount === 1 ? 'produkt' : searchResults.totalCount < 5 ? 'produkty' : 'produktů'} pro: <strong>{searchQuery}</strong></>
              ) : (
                <>Žádné výsledky pro: <strong>{searchQuery}</strong></>
              )}
            </p>

            {/* Products */}
            {searchResults.products.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-700">Produkty</h3>
                {searchResults.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produkt/${product.slug}`}
                    onClick={onClose}
                    className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-burgundy hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-burgundy truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-semibold text-burgundy">
                            od {Math.round(product.base_price_per_100g_45cm).toLocaleString('cs-CZ')} Kč
                          </span>
                          {product.in_stock && (
                            <span className="text-xs text-green-600">Skladem</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No results - fallback CTA */}
            {searchResults.totalCount === 0 && (
              <div className="bg-ivory rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Nenašli jsme žádné produkty odpovídající vašemu dotazu.</p>

                {/* Fallback CTA */}
                {(() => {
                  const fallback = getFallbackCTA(searchResults.query);
                  return (
                    <Link
                      href={fallback.url}
                      onClick={onClose}
                      className="btn-primary inline-block mb-4"
                    >
                      {fallback.text}
                    </Link>
                  );
                })()}

                {/* Suggested queries */}
                {searchResults.suggestedQueries && searchResults.suggestedQueries.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Zkuste hledat:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {searchResults.suggestedQueries.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickSearch(suggestion)}
                          className="px-3 py-1.5 bg-white border border-burgundy/20 text-burgundy text-sm rounded-full hover:bg-burgundy hover:text-white transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {searchQuery && isSearching && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 mt-3">Hledám...</p>
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
