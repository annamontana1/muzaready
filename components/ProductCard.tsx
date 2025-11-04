'use client';

import Link from 'next/link';
import { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  // Použij první variantu pokud není zadána
  const displayVariant = variant || product.variants[0];

  // Cena: Standard a LUXE zobrazují cenu, Platinum Edition "Na dotaz"
  const isPlatinum = product.tier === 'Platinum edition';
  const displayPrice = product.base_price_per_100g_45cm;

  // Získání barvy odstínu
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];

  return (
    <Link href={`/produkt/${product.slug}`} className="product-card group block">
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
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${shadeColor.hex} 0%, ${shadeColor.hex}dd 50%, ${shadeColor.hex}bb 100%)`
          }}
        >
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }} />

          {/* Hair icon/text overlay */}
          <div className="relative z-10 text-center">
            <div className="text-white/90 text-sm font-medium mb-1">
              {displayVariant?.structure || 'Vlasy'}
            </div>
            {/* Show length only for Platinum Edition */}
            {isPlatinum && displayVariant?.length_cm && (
              <div className="text-white/70 text-xs">
                {displayVariant.length_cm} cm
              </div>
            )}
          </div>
        </div>

        {/* Out of stock overlay */}
        {displayVariant && !displayVariant.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Dočasně vyprodáno</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-ivory">
        {/* Color Swatch Mini */}
        {displayVariant && (
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: shadeColor.hex }}
              title={shadeColor.name}
            />
            <span className="text-xs text-gray-700 font-medium">
              #{displayVariant.shade} - {shadeColor.name}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="font-playfair text-base text-burgundy mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        {displayVariant && (
          <div>
            <p className="text-xs text-gray-600">
              {displayVariant.structure}
            </p>
            {/* Show "100 g" for Standard and LUXE only */}
            {!isPlatinum && (
              <p className="text-xs text-gray-500 mt-1">
                100 g
              </p>
            )}
          </div>
        )}

        {/* Price display */}
        <div className="mt-3">
          {isPlatinum ? (
            <p className="text-base font-semibold text-burgundy">
              Individuální cena
            </p>
          ) : (
            <p className="text-lg font-semibold text-burgundy">
              {priceCalculator.formatPrice(displayPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
