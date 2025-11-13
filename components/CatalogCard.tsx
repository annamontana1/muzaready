'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HAIR_COLORS } from '@/types/product';
import FavoriteButton from './FavoriteButton';
import { priceCalculator } from '@/lib/price-calculator';

/**
 * Unified catalog card for both BULK (Product) and PIECE (SKU) items
 * BULK (configurable): "Vybrat parametry" → /produkt/[slug]
 * PIECE (fixed): "Do košíku" → direct add; or "Zadat poptávku" if out of stock
 */

interface CatalogCardProps {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string; // BULK products have slug; PIECE may not
  name: string;
  tier: string; // "Standard" | "LUXE" | "Platinum edition"
  shade?: number; // 1-10
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightG?: number; // For PIECE items
  pricePerGramCzk?: number; // BULK: price per gram
  priceCzk?: number; // PIECE: fixed price
  inStock: boolean;
  imageUrl?: string;
}

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

const getShadeColor = (shade?: number): { hex: string; name: string } => {
  if (!shade) return { hex: '#e8e1d7', name: 'ivory' };
  const color = HAIR_COLORS[shade];
  return color ? { hex: color.hex, name: color.name } : { hex: '#e8e1d7', name: 'ivory' };
};

export default function CatalogCard({ ...props }: CatalogCardProps) {
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const shadeColor = getShadeColor(props.shade);
  const tierLabel = getTierLabel(props.tier);
  const tierColorClass = getTierColor(props.tier);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.type !== 'PIECE') return;

    // TODO: Implement add to cart logic for PIECE items
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const isBulk = props.type === 'BULK';
  const isPlatinum = props.tier === 'Platinum edition';

  /**
   * CTA Logic for BULK items:
   * - If in stock and we have valid default combo → "Do košíku" (direct add with defaults)
   * - Otherwise → "Zadat poptávku" (request quote)
   * - Link to /produkt/[slug] only if user clicks to configure
   */
  const handleBulkCardClick = (e: React.MouseEvent) => {
    // Default behavior: navigate to product page
    // User can customize there if needed
  };

  // BULK: Self-contained card with CTA logic
  if (isBulk && props.slug) {
    const hasValidCombo = props.lengthCm && props.inStock;
    const bulkCta = hasValidCombo ? (
      <button
        className="mt-3 w-full py-2 px-4 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-maroon transition-all hover:shadow-md active:scale-95"
        onClick={(e) => {
          e.preventDefault();
          // TODO: Implement add to cart with default combo
        }}
      >
        🛒 Do košíku
      </button>
    ) : (
      <Link
        href={`/produkt/${props.slug}`}
        className="mt-3 w-full py-2 px-4 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all text-center block"
      >
        Zadat poptávku
      </Link>
    );

    return (
      <div className="product-card group h-full">
        <div className="flex flex-col h-full bg-white rounded-xl shadow-light hover:shadow-card-hover transition-shadow overflow-hidden border border-gray-200">
          {/* Image Section */}
          <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
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
              {/* Hair info overlay */}
              <div className="relative z-10 text-center">
                <div className="text-white/90 text-sm font-medium mb-1">
                  {props.structure || 'Vlasy'}
                </div>
                {props.lengthCm && (
                  <div className="text-white/70 text-xs">{props.lengthCm} cm</div>
                )}
              </div>
            </div>

            {/* Favorite Button */}
            <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton productId={props.id} size="md" variant="icon" />
            </div>

            {/* Tier Badge */}
            <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-gray-800 bg-gradient-to-r ${tierColorClass} shadow-light`}>
              {tierLabel}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col bg-ivory">
            {/* Name (2 lines max) */}
            <h3 className="text-sm font-medium text-burgundy line-clamp-2 mb-1">
              {props.name}
            </h3>

            {/* Specs */}
            <div className="text-xs text-gray-600 space-y-0.5 flex-1">
              {props.shadeName && <div>{props.shadeName}</div>}
              {props.structure && <div>{props.structure}</div>}
              {props.lengthCm && <div>{props.lengthCm} cm</div>}
            </div>

            {/* Price section */}
            <div className="pt-2 mt-2 border-t border-gray-200">
              {props.pricePerGramCzk ? (
                <p className="text-base font-semibold text-burgundy">
                  od {priceCalculator.formatPrice(props.pricePerGramCzk)}/g
                </p>
              ) : (
                <p className="text-sm text-gray-500">Cena na dotaz</p>
              )}
            </div>

            {/* CTA */}
            {bulkCta}
          </div>
        </div>
      </div>
    );
  }

  // PIECE: Self-contained card (not a link, but with CTA buttons)
  return (
    <div className="product-card group h-full">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-light hover:shadow-card-hover transition-shadow overflow-hidden border border-gray-200">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
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
            {/* Hair info overlay */}
            <div className="relative z-10 text-center">
              <div className="text-white/90 text-sm font-medium mb-1">
                {props.structure || 'Vlasy'}
              </div>
              {props.lengthCm && (
                <div className="text-white/70 text-xs">{props.lengthCm} cm</div>
              )}
              {props.weightG && (
                <div className="text-white/70 text-xs">{props.weightG} g</div>
              )}
            </div>
          </div>

          {/* Out of stock overlay */}
          {!props.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">Vyprodáno</span>
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton productId={props.id} size="md" variant="icon" />
          </div>

          {/* Tier Badge */}
          <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-gray-800 bg-gradient-to-r ${tierColorClass} shadow-light`}>
            {tierLabel}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col bg-ivory">
          {/* Name */}
          <h3 className="text-sm font-medium text-burgundy line-clamp-2 mb-1">
            {props.name}
          </h3>

          {/* Specs */}
          <div className="text-xs text-gray-600 space-y-0.5 flex-1">
            {props.shadeName && <div>{props.shadeName}</div>}
            {props.structure && <div>{props.structure}</div>}
            {props.lengthCm && <div>{props.lengthCm} cm</div>}
            {props.weightG && <div>Váha: {props.weightG} g</div>}
          </div>

          {/* Price section */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            {props.priceCzk ? (
              <p className="text-base font-semibold text-burgundy">
                {priceCalculator.formatPrice(props.priceCzk)}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Cena na dotaz</p>
            )}
          </div>

          {/* CTAs */}
          {props.inStock ? (
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full py-2 px-4 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-maroon transition-all hover:shadow-md active:scale-95"
            >
              {showAddedMessage ? '✓ Přidáno!' : '🛒 Do košíku'}
            </button>
          ) : (
            <Link
              href={`/custom?kind=HAIR&prefill=${encodeURIComponent(JSON.stringify({ shade: props.shade, lengthCm: props.lengthCm, structure: props.structure }))}`}
              className="mt-3 w-full py-2 px-4 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all text-center block"
            >
              Zadat poptávku
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
