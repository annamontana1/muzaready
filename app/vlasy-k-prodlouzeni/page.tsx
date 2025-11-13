'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { mockProducts } from '@/lib/mock-products';
import CatalogCard from '@/components/CatalogCard';
import { pickDefaultBulkCombo } from '@/lib/bulk-pick';

/**
 * Hair Extensions Catalog Page
 * Primary entry point for browsing BULK products
 * Tabs: Nebarvené (uncolored) | Barvené (colored)
 * Grid: Same as /katalog using CatalogCard components
 *
 * NEW: Line filter (Standard/Luxe/Platinum) with conditional length filter
 * - Length filter only visible when exactly Platinum is selected
 */

type ShadeGroup = 'nebarvene' | 'barvene';
type LineType = 'standard' | 'luxe' | 'platinum';

// Helper: normalize tier name to line type
const normalizeTierToLine = (tier: string): LineType => {
  if (tier === 'Standard') return 'standard';
  if (tier === 'LUXE') return 'luxe';
  if (tier === 'Platinum edition') return 'platinum';
  return 'standard';
};

export default function VlasyKProdlouzenPage() {
  const [selectedTab, setSelectedTab] = useState<ShadeGroup>('nebarvene');
  const [lineFilter, setLineFilter] = useState<LineType[]>([]);
  const [lengthFilter, setLengthFilter] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Compute if length filter should be shown
  const showLengthFilter = lineFilter.length === 1 && lineFilter[0] === 'platinum';

  // Get all unfiltered products for this tab
  const allProducts = useMemo(() => {
    return mockProducts.filter(p => {
      // Include both BULK (Standard/Luxe) and PIECE (Platinum)
      const isUncolored = p.category === 'nebarvene_panenske';
      if (selectedTab === 'nebarvene') return isUncolored;
      if (selectedTab === 'barvene') return !isUncolored;
      return true;
    });
  }, [selectedTab]);

  // Apply filters
  useEffect(() => {
    const filtered = allProducts.filter(p => {
      // Line filter (tier)
      if (lineFilter.length > 0) {
        const productLine = normalizeTierToLine(p.tier);
        if (!lineFilter.includes(productLine)) return false;
      }

      // Length filter (only applies when showLengthFilter is true)
      if (showLengthFilter && lengthFilter.length > 0) {
        // For Platinum items, check if any variant matches the length
        const hasMatchingLength = p.variants?.some(v => lengthFilter.includes(v.length_cm));
        if (!hasMatchingLength) return false;
      }

      return true;
    });

    setProducts(filtered);
    setLoading(false);
  }, [selectedTab, allProducts, lineFilter, lengthFilter, showLengthFilter]);

  // Reset pagination when filters change
  const resetLength = () => {
    setLengthFilter([]);
  };

  const toggleLine = (line: LineType) => {
    setLineFilter(prev =>
      prev.includes(line)
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  };

  const toggleLength = (cm: number) => {
    setLengthFilter(prev =>
      prev.includes(cm)
        ? prev.filter(l => l !== cm)
        : [...prev, cm]
    );
  };

  return (
    <div className="min-h-screen bg-soft-cream py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-burgundy transition">
                Domů
              </Link>
            </li>
            <li>/</li>
            <li className="text-burgundy font-medium">Vlasy k prodloužení</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-h2 md:text-h1 font-playfair text-burgundy mb-3">
            Vlasy k prodloužení
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Vyberte si z naší prémiové kolekce panenských vlasů pro prodloužení. Čistě přírodní vlasy v různých kvalitách a stylech.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex justify-center gap-3">
          {(['nebarvene', 'barvene'] as ShadeGroup[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                selectedTab === tab
                  ? 'bg-burgundy text-white shadow-medium'
                  : 'bg-white text-burgundy border-2 border-burgundy hover:bg-ivory'
              }`}
            >
              {tab === 'nebarvene' ? 'Nebarvené' : 'Barvené'}
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="mb-10 bg-white rounded-xl shadow-light p-6 border border-gray-200">
          {/* Line Filter Chips */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Linie</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'standard' as LineType, label: 'Standard' },
                { value: 'luxe' as LineType, label: 'LUXE' },
                { value: 'platinum' as LineType, label: 'Platinum Edition' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleLine(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    lineFilter.includes(value)
                      ? 'bg-burgundy text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Length Filter (Conditional - only for Platinum) */}
          {showLengthFilter && (
            <div className="mb-0 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Délka (cm)</p>
              <div className="flex flex-wrap gap-2">
                {[35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90].map((cm) => (
                  <button
                    key={cm}
                    onClick={() => toggleLength(cm)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      lengthFilter.includes(cm)
                        ? 'bg-burgundy text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {cm}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Délka je filtrovací parametr jen pro Platinum Edition.
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Načítám katalog...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">V této kategorii nejsou dostupné žádné produkty.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {products.map((product) => {
                    const combo = pickDefaultBulkCombo(product);

                    return (
                      <div key={product.id} className="h-full">
                        <CatalogCard
                          type="BULK"
                          id={product.id}
                          slug={product.slug}
                          name={product.name}
                          tier={product.tier}
                          shade={combo?.variant?.shade}
                          shadeName={combo?.variant?.shade_name}
                          structure={combo?.variant?.structure}
                          lengthCm={combo?.lengthCm}
                          pricePerGramCzk={product.base_price_per_100g_45cm}
                          inStock={product.in_stock}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Info Section */}
                <div className="bg-white rounded-xl shadow-light p-8 text-center border border-gray-200">
                  <h2 className="text-lg font-semibold text-burgundy mb-3">
                    Hledáte jedinečný kousek?
                  </h2>
                  <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                    Prohlédněte si naši kolekci jednotlivých, unikátních culíků s pevnými parametry v sekci Jednotlivé SKU.
                  </p>
                  <Link
                    href="/katalog?typ=piece"
                    className="inline-block px-6 py-2 bg-burgundy text-white rounded-lg font-medium hover:bg-maroon transition"
                  >
                    Zobrazit unikáty
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
