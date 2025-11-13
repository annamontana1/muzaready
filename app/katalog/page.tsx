'use client';

import { useState, useEffect } from 'react';
import CatalogCard from '@/components/CatalogCard';
import { Product, ProductVariant } from '@/types/product';

/**
 * Hybridní katalog (PLP) zobrazující:
 * - BULK produkty (Standard/LUXE) → "Vybrat parametry" → /produkt/[slug]
 * - PIECE SKU (Platinum/unikátní) → "Do košíku" / "Zadat poptávku"
 *
 * Datová struktura se fetchuje z `/api/katalog/unified`
 */

interface CatalogItem {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string; // BULK
  name: string;
  tier: string;
  shade?: number;
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightG?: number; // PIECE
  pricePerGramCzk?: number; // BULK
  priceCzk?: number; // PIECE
  inStock: boolean;
  priority: number;
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'ALL' | 'BULK' | 'PIECE'>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/katalog/unified');
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const data: CatalogItem[] = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching catalog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort items
  const sortItems = (itemsToSort: CatalogItem[]): CatalogItem[] => {
    const sorted = [...itemsToSort];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.pricePerGramCzk || a.priceCzk || Infinity;
          const priceB = b.pricePerGramCzk || b.priceCzk || Infinity;
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.pricePerGramCzk || a.priceCzk || 0;
          const priceB = b.pricePerGramCzk || b.priceCzk || 0;
          return priceB - priceA;
        });
      case 'recommended':
      default:
        return sorted.sort((a, b) => a.priority - b.priority);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    return true;
  });

  const sortedItems = sortItems(filteredItems);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Načítám katalog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-h2 md:text-h1 font-playfair text-burgundy mb-3">
            Katalog vlasů
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vyberte si z naší prémiové kolekce vlasů pro prodloužení. Čistě přírodní vlasy v různých kvalitách a stylech.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between">
          {/* Type Filter */}
          <div className="flex gap-3">
            {['ALL', 'BULK', 'PIECE'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as 'ALL' | 'BULK' | 'PIECE')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedType === type
                    ? 'bg-burgundy text-white shadow-medium'
                    : 'bg-white text-burgundy border border-burgundy hover:bg-ivory'
                }`}
              >
                {type === 'ALL' ? 'Všechny' : type === 'BULK' ? 'Na gramy' : 'Jednotlivé'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recommended' | 'price-asc' | 'price-desc')}
            className="px-4 py-2 rounded-lg border border-burgundy text-burgundy font-medium focus:outline-none focus:ring-2 focus:ring-burgundy"
          >
            <option value="recommended">Doporučené</option>
            <option value="price-asc">Cena: od nejnižší</option>
            <option value="price-desc">Cena: od nejvyšší</option>
          </select>
        </div>

        {/* Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Není dostupný žádný produkt v této kategorii.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <CatalogCard
                key={`${item.type}-${item.id}`}
                type={item.type}
                id={item.id}
                slug={item.slug}
                name={item.name}
                tier={item.tier}
                shade={item.shade}
                shadeName={item.shadeName}
                structure={item.structure}
                lengthCm={item.lengthCm}
                weightG={item.weightG}
                pricePerGramCzk={item.pricePerGramCzk}
                priceCzk={item.priceCzk}
                inStock={item.inStock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
