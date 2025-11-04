'use client';

import Link from 'next/link';
import { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
}

/**
 * Generate listing title in format:
 * {{shade name}} #{{shade code}} {{hair type}} {{tier}}
 *
 * Examples:
 * - "Černá #1 panenské vlasy Standart"
 * - "Světlá hnědá #5 barvené vlasy LUXE"
 */
function getListingTitle(product: Product, displayVariant: ProductVariant): string {
  // Shade name and code
  const shadeName = HAIR_COLORS[displayVariant.shade]?.name || 'Neznámá';
  const shadeCode = displayVariant.shade;

  // Hair type based on category
  const hairType = product.category === 'nebarvene_panenske'
    ? 'panenské vlasy'
    : 'barvené vlasy';

  // Tier - convert "Standard" to "Standart" for display
  const tierDisplay = product.tier === 'Standard' ? 'Standart' : product.tier;

  return `${shadeName} #${shadeCode} ${hairType} ${tierDisplay}`;
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const displayVariant = variant || product.variants[0];
  const isPlatinum = product.tier === 'Platinum edition';
  const displayPrice = product.base_price_per_100g_45cm;
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];
  const listingTitle = getListingTitle(product, displayVariant);

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

      {/* Product Info - 4 řádky v přesném pořadí */}
      <div className="p-4 bg-ivory">
        {displayVariant && (
          <div className="space-y-1">
            {/* Řádek 1: Název */}
            <h3 className="text-sm font-medium text-burgundy line-clamp-2">
              {listingTitle}
            </h3>

            {/* Řádek 2: Struktura */}
            <p className="text-xs text-gray-600">
              {displayVariant.structure}
            </p>

            {/* Řádek 3: Gramáž (pouze pro Standard/LUXE) */}
            {!isPlatinum ? (
              <p className="text-xs text-gray-500">
                100 g
              </p>
            ) : (
              <div className="h-4" />
            )}

            {/* Řádek 4: Cena */}
            <div className="pt-2">
              {isPlatinum ? (
                <p className="text-sm font-semibold text-burgundy">
                  Individuální cena
                </p>
              ) : (
                <p className="text-base font-semibold text-burgundy">
                  {priceCalculator.formatPrice(displayPrice)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
