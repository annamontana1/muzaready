'use client';

import { useState, useEffect } from 'react';
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
 */

type ShadeGroup = 'nebarvene' | 'barvene';

export default function VlasyKProdlouzenPage() {
  const [selectedTab, setSelectedTab] = useState<ShadeGroup>('nebarvene');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and filter BULK products
    const filtered = mockProducts.filter(p => {
      // Skip Platinum edition (those are PIECE items)
      if (p.tier === 'Platinum edition') return false;

      // Filter by shade group
      const isUncolored = p.category === 'nebarvene_panenske';
      if (selectedTab === 'nebarvene') return isUncolored;
      if (selectedTab === 'barvene') return !isUncolored;

      return true;
    });

    setProducts(filtered);
    setLoading(false);
  }, [selectedTab]);

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
