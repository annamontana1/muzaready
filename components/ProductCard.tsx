'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Použij první variantu pokud není zadána
  const displayVariant = variant || product.variants[0];

  // Zobrazujeme "Cena za 100g / 45cm"
  const displayPrice = product.base_price_per_100g_45cm;

  // Získání barvy odstínu
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];

  return (
    <div
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tier Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="tier-badge">{product.tier}</span>
      </div>

      {/* Ribbon Bow (dekorace) */}
      {displayVariant && (
        <div
          className="absolute top-3 right-3 z-10 w-12 h-12 rounded-full"
          style={{ backgroundColor: shadeColor.hex }}
          title={`Odstín ${displayVariant.shade}`}
        />
      )}

      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-ivory to-warm-beige flex items-center justify-center">
          {/* Placeholder pro obrázek */}
          <span className="text-6xl">💇‍♀️</span>
        </div>

        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-burgundy/10 transition-opacity duration-300" />
        )}

        {/* Out of stock overlay */}
        {displayVariant && !displayVariant.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Dočasně vyprodáno</span>
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className="absolute top-14 left-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-burgundy hover:text-white transition z-10"
        aria-label="Přidat do oblíbených"
      >
        ❤️
      </button>

      {/* Quick View Button */}
      <button
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        } bg-white px-6 py-2 rounded-full shadow-md hover:bg-burgundy hover:text-white z-10`}
      >
        Rychlý náhled
      </button>

      {/* Product Info */}
      <div className="p-4 bg-ivory">
        {/* Color Swatch Mini */}
        {displayVariant && (
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: shadeColor.hex }}
              title={shadeColor.name}
            />
            <span className="text-xs text-gray-600">
              Odstín {displayVariant.shade}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="font-playfair text-base text-burgundy mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        {displayVariant && (
          <p className="text-xs text-gray-600">
            {displayVariant.structure}
          </p>
        )}

        {/* Price display */}
        <div className="mt-2">
          <p className="text-xs text-gray-500">Cena za 100 g / 45 cm</p>
          <p className="text-lg font-semibold text-burgundy">
            {priceCalculator.formatPrice(displayPrice)}
          </p>
        </div>

        {/* CTA */}
        <Link
          href={`/produkt/${product.slug}`}
          className="w-full mt-3 block text-center px-4 py-2 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-maroon transition-colors"
        >
          Zobrazit detail
        </Link>
      </div>
    </div>
  );
}
