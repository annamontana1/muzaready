'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HAIR_COLORS } from '@/types/product';
import FavoriteButton from './FavoriteButton';
import AddToCartModal from './AddToCartModal';
import BulkAddToCartModal from './BulkAddToCartModal';
import PieceCard from './PieceCard';
import { GRAM_STEP, PIECE_MAX_GRAMS, PIECE_MIN_GRAMS } from '@/lib/sale-rule';
import { usePreferences } from '@/lib/preferences-context';
import { useCart } from '@/hooks/useCart';
import { soldByGrams } from '@/lib/sale-rule';

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
  imageUrl2?: string; // druhá fotka (zblízka), ukáže se jako miniatura pod fotkou
  // PIECE: celý culík rovnou do košíku (PIECE_BY_WEIGHT), nebo výběr gramáže (BULK_G)
  saleMode?: 'PIECE_BY_WEIGHT' | 'BULK_G';
  availableGrams?: number;
  minOrderG?: number;
  stepG?: number;
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
  const [showBulkAddToCartModal, setShowBulkAddToCartModal] = useState(false);
  const { currency, exchangeRate } = usePreferences();
  const { addToCart } = useCart();
  const rate = exchangeRate || DEFAULT_RATE;
  const shadeColor = getShadeColor(props.shade);
  const tierLabel = getTierLabel(props.tier);
  const tierColorClass = getTierColor(props.tier);
  const inquirySlug = props.slug || props.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.type !== 'PIECE') return;

    // Po gramech: výběr gramáže; celý culík: rovnou do košíku
    if (byGrams) setShowBulkAddToCartModal(true);
    else addWholePiece();
  };

  // pravidlo prodeje (lib/sale-rule.ts): Baby Shades celý culík, ostatní po gramech
  const byGrams = props.type === 'PIECE' && soldByGrams({ saleMode: props.saleMode || 'PIECE_BY_WEIGHT', customerCategory: props.tier === 'Baby Shades' ? 'BABY_SHADES' : null });
  const hasPrice = byGrams ? Boolean(props.pricePerGramCzk) : Boolean(props.priceCzk);

  const addWholePiece = () => {
    const grams = props.weightGrams || 0;
    const price = props.priceCzk || 0;
    addToCart({
      skuId: props.id,
      skuName: props.name,
      customerCategory: null,
      shade: props.shade ? String(props.shade) : null,
      saleMode: 'PIECE_BY_WEIGHT',
      grams,
      pricePerGram: grams > 0 ? price / grams : price,
      lineTotal: price,
      ending: 'NONE',
      assemblyFeeType: 'FLAT',
      assemblyFeeCzk: 0,
      assemblyFeeTotal: 0,
      lineGrandTotal: price,
      quantity: 1,
      imageUrl: props.imageUrl,
    });
    handleAddedToCart();
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
          setShowBulkAddToCartModal(true);
        }}
      >
        🛒 Do košíku
      </button>
    ) : (
      <Link
        href={`/produkt/${props.slug}`}
        className="mt-3 w-full py-2 px-4 bg-gray-200 text-text-mid text-sm font-medium rounded-lg hover:bg-gray-300 transition-all text-center block"
      >
        Zadat poptávku
      </Link>
    );

    return (
      <div className="product-card group h-full">
        <div className="flex flex-col h-full bg-white rounded-xl shadow-light hover:shadow-card-hover transition-shadow overflow-hidden border border-warm-beige">
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

          {/* Struktura label pod fotkou */}
          {props.structure && (
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="px-2 py-1 bg-white/90 text-text-dark text-xs font-medium rounded">
                Struktura: {props.structure}
              </span>
            </div>
          )}

            {/* Favorite Button */}
            <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton productId={props.id} size="md" variant="icon" />
            </div>

            {/* Tier Badge */}
            <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-text-dark bg-gradient-to-r ${tierColorClass} shadow-light`}>
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
            <div className="text-xs text-text-mid space-y-0.5 flex-1">
              {props.shadeName && <div>{props.shadeName}</div>}
              {/* Struktura se zobrazuje pod fotkou, ne zde */}
              {props.lengthCm && <div>{props.lengthCm} cm</div>}
            </div>

            {/* Price section */}
            <div className="pt-2 mt-2 border-t border-warm-beige">
              {props.pricePerGramCzk ? (
                <>
                  <p className="text-base font-semibold text-burgundy">
                    od {formatCurrencyValue(currency === 'CZK' ? props.pricePerGramCzk : props.pricePerGramCzk * rate, currency)}/g
                  </p>
                  <p className="text-xs text-text-soft">
                    {currency === 'CZK'
                      ? `${formatCurrencyValue(props.pricePerGramCzk * rate, 'EUR')}/g`
                      : `${formatCurrencyValue(props.pricePerGramCzk, 'CZK')}/g`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-text-soft">Cena na dotaz</p>
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

      <PieceCard id={props.id} name={props.name}
        photos={[props.imageUrl, props.imageUrl2].filter((u): u is string => Boolean(u))}
        meta={[props.shade && `odstín ${props.shade}`, props.lengthCm && `${props.lengthCm} cm`, props.weightGrams && `${props.weightGrams} g`].filter(Boolean).join(' · ')}
        price={props.priceCzk ? formatCurrencyValue(currency === 'CZK' ? props.priceCzk : props.priceCzk * rate, currency) : undefined}
        soldOut={!props.inStock}
        action={!props.inStock ? null : byGrams ? (
          // Po gramech se nejdřív vybírá délka a gramáž na detailu (návrh 19)
          <Link href={`/sku-detail/${props.id}`}
            className="mt-3 w-full h-11 rounded-full border border-muza-ink text-muza-ink text-[14px] flex items-center justify-center hover:bg-muza-ink hover:text-muza-onink transition-colors">
            Vybrat délku a gramáž
          </Link>
        ) : (
          <button type="button" onClick={handleAddToCart} disabled={!hasPrice}
            className="mt-3 w-full h-11 rounded-full border border-muza-ink text-muza-ink text-[14px] hover:bg-muza-ink hover:text-muza-onink transition-colors disabled:opacity-40 disabled:pointer-events-none">
            {!hasPrice ? 'Cenu doplňujeme' : showAddedMessage ? 'Přidáno' : 'Do košíku'}
          </button>
        )} />

    {/* Bulk Add To Cart Modal */}
    {showBulkAddToCartModal && (
      <BulkAddToCartModal
        isOpen={showBulkAddToCartModal}
        skuId={props.id}
        productName={props.name}
        pricePerGramCzk={props.pricePerGramCzk || 0}
        lengthCm={props.lengthCm || 45}
        shade={props.shade || 1}
        shadeName={props.shadeName || ''}
        structure={props.structure || ''}
        tier={props.tier}
        imageUrl={props.imageUrl}
        {...(byGrams ? {
          minGrams: props.saleMode === 'BULK_G' ? (props.minOrderG || props.stepG || GRAM_STEP) : PIECE_MIN_GRAMS,
          maxGrams: props.saleMode === 'BULK_G' ? (props.availableGrams || 300) : Math.min(PIECE_MAX_GRAMS, props.availableGrams || props.weightGrams || PIECE_MAX_GRAMS),
          stepGrams: props.saleMode === 'BULK_G' ? (props.stepG || GRAM_STEP) : GRAM_STEP,
          cartSaleMode: props.saleMode === 'BULK_G' ? 'BULK_G' as const : 'PIECE_BY_WEIGHT' as const,
        } : {})}
        onClose={() => setShowBulkAddToCartModal(false)}
        onAdded={handleAddedToCart}
      />
    )}
    </>
  );
}
