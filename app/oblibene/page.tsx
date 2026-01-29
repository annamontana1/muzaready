'use client';

import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import { HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';

export default function OblibeneePage() {
  const { favorites, removeFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const favoriteCount = favorites.length;

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all products to match favorites
        const response = await fetch('/api/catalog');
        if (!response.ok) throw new Error('Failed to fetch products');
        const allProducts = await response.json();

        // Filter to only favorite products
        const favoriteProducts = allProducts.filter((product: Product) =>
          favorites.some(fav => fav.id === product.id)
        );

        setProducts(favoriteProducts);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [favorites]);

  const favoriteProducts = products;
  // Favorites that couldn't be matched to any catalog product
  const unmatchedFavorites = favorites.filter(
    fav => !products.some(p => p.id === fav.id)
  );

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Oblíbené produkty
          </h1>
          <p className="text-gray-600">
            {favoriteCount === 0
              ? 'Nemáte žádné oblíbené produkty'
              : `Máte ${favoriteCount} ${favoriteCount === 1 ? 'oblíbený produkt' : favoriteCount < 5 ? 'oblíbené produkty' : 'oblíbených produktů'}`
            }
          </p>
        </div>

        {/* Loading State */}
        {loading && favoriteCount > 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-medium">
            <div className="animate-spin w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Načítám oblíbené produkty...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && favoriteCount === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-medium">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">
              Zatím nemáte žádné oblíbené
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Začněte procházet naše produkty a přidávejte si je do oblíbených kliknutím na ikonu srdce.
            </p>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="btn-primary inline-block"
            >
              Prohlédnout vlasy →
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && favoriteCount > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {favoriteProducts.map((product) => {
                const variant = product.variants[0];
                const color = variant ? HAIR_COLORS[variant.shade] : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-300"
                  >
                    {/* Product Image */}
                    <Link href={`/produkt/${product.slug}`}>
                      <div className="aspect-square relative overflow-hidden">
                        {/* Actual image if available */}
                        {product.images?.main && (product.images.main.startsWith('http') || product.images.main.startsWith('/images/products/')) ? (
                          <img
                            src={product.images.main}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Gradient fallback */}
                        <div
                          className={`w-full h-full flex items-center justify-center ${product.images?.main && (product.images.main.startsWith('http') || product.images.main.startsWith('/images/products/')) ? 'hidden absolute inset-0' : ''}`}
                          style={{
                            background: color
                              ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}dd 50%, ${color.hex}bb 100%)`
                              : 'linear-gradient(135deg, #8B7355 0%, #8B7355dd 50%, #8B7355bb 100%)',
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                            }}
                          />
                          <div className="relative z-10 text-center text-white">
                            <div className="text-xl font-playfair mb-2">
                              {product.tier}
                            </div>
                            <div className="text-sm">{variant?.structure}</div>
                            <div className="text-xs mt-1">
                              {variant?.length_cm} cm
                            </div>
                          </div>
                        </div>

                        {/* Tier Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="tier-badge text-xs px-2 py-1">
                            {product.tier}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/produkt/${product.slug}`}>
                        <h3 className="text-lg font-playfair text-burgundy mb-2 hover:text-maroon transition">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-burgundy font-semibold">
                          Od {priceCalculator.formatPrice(product.base_price_per_100g_45cm)}
                        </span>
                        {variant && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color?.hex }}
                            />
                            <span>{variant.shade}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/produkt/${product.slug}`}
                          className="flex-1 btn-primary text-center text-sm py-2"
                        >
                          Do košíku
                        </Link>
                        <button
                          onClick={() => removeFavorite(product.id)}
                          className="px-4 py-2 border border-burgundy text-burgundy rounded-lg hover:bg-burgundy/5 transition-colors"
                          aria-label="Odebrat z vybraných"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unmatched favorites - product not in catalog */}
            {unmatchedFavorites.length > 0 && (
              <div className="mb-8">
                {unmatchedFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-white rounded-xl p-6 shadow-medium flex items-center justify-between mb-4"
                  >
                    <div>
                      <p className="text-gray-700 font-medium">
                        {fav.name || 'Oblíbený produkt'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tento produkt momentálně není k dispozici v katalogu.
                      </p>
                    </div>
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="px-4 py-2 border border-burgundy text-burgundy rounded-lg hover:bg-burgundy/5 transition-colors text-sm"
                    >
                      Odebrat
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Continue Shopping */}
            <div className="text-center">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="btn-secondary inline-block"
              >
                Pokračovat v nákupu →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
