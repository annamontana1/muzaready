'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HAIR_COLORS } from '@/types/product';
import FavoriteButton from './FavoriteButton';
import AddToCartModal from './AddToCartModal';
import { usePreferences } from '@/lib/preferences-context';

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
  weightGrams?: number; // For PIECE items
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

const DEFAULT_RATE = 1 / 25.5;

const formatCurrencyValue = (value: number, currency: 'CZK' | 'EUR') => {
  return new Intl.NumberFormat(currency === 'CZK' ? 'cs-CZ' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'CZK' ? 1 : 2,
    maximumFractionDigits: currency === 'CZK' ? 1 : 2,
  }).format(value);
};

export default function CatalogCard({ ...props }: CatalogCardProps) {
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const { currency, exchangeRate } = usePreferences();
  const rate = exchangeRate || DEFAULT_RATE;
  const shadeColor = getShadeColor(props.shade);
  const tierLabel = getTierLabel(props.tier);
  const tierColorClass = getTierColor(props.tier);
  const inquirySlug = props.slug || props.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.type !== 'PIECE') return;

    // Open modal for adding to cart
    setShowAddToCartModal(true);
  };

  const handleAddedToCart = () => {
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const isBulk = props.type === 'BULK';

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
                <>
                  <p className="text-base font-semibold text-burgundy">
                    od {formatCurrencyValue(currency === 'CZK' ? props.pricePerGramCzk : props.pricePerGramCzk * rate, currency)}/g
                  </p>
                  <p className="text-xs text-gray-500">
                    {currency === 'CZK'
                      ? `${formatCurrencyValue(props.pricePerGramCzk * rate, 'EUR')}/g`
                      : `${formatCurrencyValue(props.pricePerGramCzk, 'CZK')}/g`}
                  </p>
                </>
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

  // PIECE: Self-contained card with modal add-to-cart
  return (
    <>
      <AddToCartModal
        isOpen={showAddToCartModal}
        skuId={props.id}
        productName={props.name}
        price={props.priceCzk || 0}
        weightGrams={props.weightGrams}
        onClose={() => setShowAddToCartModal(false)}
        onAdded={handleAddedToCart}
      />

      <Link href={`/sku-detail/${props.id}`} className="product-card group h-full block">
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
              {props.weightGrams && (
                <div className="text-white/70 text-xs">{props.weightGrams} g</div>
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
            {props.weightGrams && <div>Váha: {props.weightGrams} g</div>}
          </div>

          {/* Price section */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            {props.priceCzk ? (
              <>
                <p className="text-base font-semibold text-burgundy">
                  {formatCurrencyValue(currency === 'CZK' ? props.priceCzk : props.priceCzk * rate, currency)}
                </p>
                <p className="text-xs text-gray-500">
                  {currency === 'CZK'
                    ? formatCurrencyValue(props.priceCzk * rate, 'EUR')
                    : formatCurrencyValue(props.priceCzk, 'CZK')}
                </p>
              </>
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
    </Link>
    </>
  );
}
