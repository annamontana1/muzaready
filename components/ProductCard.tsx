'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';
import { useSkuCart, useCart } from '@/contexts/SkuCartContext';
import { useAuth } from '@/components/AuthProvider';
import FavoriteButton from './FavoriteButton';
import type { SkuCartItem } from '@/types/cart';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
}

/**
 * Generate listing title in format:
 * - Standard/LUXE: {lineLabel} – {shadeName}
 * - Platinum: {lengthCm} cm · Platinum · odstín #{shadeNumber} · {weightG} g
 */
function getListingTitle(displayVariant: ProductVariant, productTier?: string): string {
  const shadeName = HAIR_COLORS[displayVariant.shade]?.name || 'Neznámá';
  const shadeCode = displayVariant.shade;
  const isPlatinum = productTier === 'Platinum edition';
  
  if (isPlatinum && displayVariant.length_cm && displayVariant.weight_g) {
    return `${displayVariant.length_cm} cm · Platinum · odstín #${shadeCode} · ${displayVariant.weight_g} g`;
  }
  
  // Standard/LUXE: {lineLabel} – {shadeName}
  const tierLabel = productTier === 'LUXE' ? 'LUXE' : 'Standard';
  return `${tierLabel} – ${shadeName}`;
}

/**
 * Get tier explanation text
 */
function getTierExplanation(tier: string): { title: string; description: string; forWho: string } {
  switch (tier) {
    case 'Standard':
      return {
        title: 'Standard vlasy',
        description: 'Základní kvalita panenských vlasů s přirozeným zakončením. Ideální pro každodenní nošení s výborným poměrem ceny a kvality.',
        forWho: 'Pro běžné nošení, začátečníky a ty, kteří hledají spolehlivou kvalitu za dostupnou cenu.'
      };
    case 'LUXE':
      return {
        title: 'LUXE vlasy',
        description: 'Prémiová kvalita s hustšími konci a vyšší hustotou. Luxusní vzhled a delší životnost díky pečlivému výběru vlasů.',
        forWho: 'Pro náročné zákaznice, které chtějí luxusní vzhled a jsou ochotny investovat do kvality.'
      };
    case 'Platinum edition':
      return {
        title: 'Platinum Edition',
        description: 'Nejkvalitnější panenské vlasy na míru. Maximální hustota, perfektní zakončení a individuální péče při výrobě.',
        forWho: 'Pro VIP klientky, které požadují absolutně nejlepší kvalitu a jsou ochotny investovat do prémiových vlasů.'
      };
    default:
      return {
        title: tier,
        description: 'Kvalitní panenské vlasy',
        forWho: 'Pro všechny typy zákaznic'
      };
  }
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const [showTierModal, setShowTierModal] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const displayVariant = variant || product.variants[0];
  const isPlatinum = product.tier === 'Platinum edition';
  const displayPrice = product.base_price_per_100g_45cm;
  const isB2B = user?.isWholesale ?? false;
  const discountedPrice = priceCalculator.applyB2BDiscount(displayPrice, isB2B);
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];
  const listingTitle = product.name?.trim().length ? product.name : getListingTitle(displayVariant, product.tier);
  const tierInfo = getTierExplanation(product.tier);

  const handleTierClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTierModal(true);
  };

  const closeTierModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowTierModal(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!displayVariant) return;

    // Transform Product+Variant to SkuCartItem format
    const grams = 100; // Standard 100g pieces
    const pricePerGram = displayPrice / 100;
    const lineTotal = pricePerGram * grams;

    // Map tier to customer category
    const customerCategory =
      product.tier === 'Platinum edition' ? 'PLATINUM_EDITION' as const :
      product.tier === 'LUXE' ? 'LUXE' as const :
      'STANDARD' as const;

    // Create SkuCartItem object
    const cartItem: Omit<SkuCartItem, 'addedAt'> = {
      skuId: displayVariant.id || `${product.id}-${displayVariant.shade}`,
      skuName: listingTitle,
      customerCategory,
      shade: displayVariant.shade.toString(),
      saleMode: 'PIECE_BY_WEIGHT',
      grams,
      pricePerGram,
      lineTotal,
      ending: 'NONE',
      assemblyFeeType: 'FLAT',
      assemblyFeeCzk: 0,
      assemblyFeeTotal: 0,
      lineGrandTotal: lineTotal,
      quantity: 1,
    };

    addToCart(cartItem);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <>
      <div className="product-card group block relative">
        <Link href={`/sku-detail/${product.id}`} className="block">
          {/* Clickable Tier Badge with Info Icon */}
          <div
            onClick={handleTierClick}
            className="absolute top-3 left-3 z-10 tier-badge hover:opacity-80 transition cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Zobrazit informace o ${product.tier}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTierClick(e);
              }
            }}
          >
            {product.tier}<sup className="text-[0.75em] ml-0.5">?</sup>
          </div>

          {/* Favorite Button */}
          <div
            className="absolute top-3 right-3 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FavoriteButton
              productId={product.id}
              size="md"
              variant="icon"
            />
          </div>

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

        {/* Struktura label pod fotkou */}
        {displayVariant?.structure && (
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <span className="px-2 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded">
              Struktura: {displayVariant.structure}
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {displayVariant && !displayVariant.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Dočasně vyprodáno</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-ivory">
        {displayVariant && (
          <div className="space-y-1">
            {/* Řádek 1: Název (použije product.name, který už je správně formátovaný) */}
            <h3 className="text-sm font-medium text-burgundy line-clamp-2">
              {listingTitle}
            </h3>

            {/* Řádek 2: Gramáž (pouze pro Standard/LUXE) */}
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
                <>
                  {isB2B ? (
                    <div className="space-y-1">
                      <p className="text-xs line-through text-gray-400">
                        {priceCalculator.formatPrice(displayPrice)}
                      </p>
                      <p className="text-base font-semibold text-burgundy">
                        {priceCalculator.formatPrice(discountedPrice)}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        -10% B2B sleva
                      </p>
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-burgundy">
                      {priceCalculator.formatPrice(displayPrice)}
                    </p>
                  )}
                </>
              )}
            </div>

          </div>
        )}
      </div>
        </Link>

        {/* CTA Buttons - outside Link to avoid hydration issues */}
        <div className="p-4 bg-ivory pt-0">
          {!isPlatinum && displayVariant?.in_stock && (
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full py-2 px-4 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-maroon transition-all hover:shadow-md active:scale-95"
            >
              {showAddedMessage ? '✓ Přidáno!' : 'Do košíku'}
            </button>
          )}

          {/* Vyprodáno tlačítko */}
          {!isPlatinum && displayVariant && !displayVariant.in_stock && (
            <button
              disabled
              className="mt-3 w-full py-2 px-4 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Vyprodáno
            </button>
          )}

          {/* Platinum - kontaktovat */}
          {isPlatinum && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '/kontakt';
              }}
              className="mt-3 w-full py-2 px-4 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-maroon transition-all hover:shadow-md"
            >
              Kontaktovat
            </button>
          )}
        </div>
      </div>

    {/* Tier Information Modal */}
    {showTierModal && (
      <div
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        onClick={closeTierModal}
      >
        <div
          className="bg-white rounded-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeTierModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Zavřít"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="pr-8">
            <h3 className="text-xl font-playfair text-burgundy mb-4">{tierInfo.title}</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Co to je?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{tierInfo.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Pro koho?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{tierInfo.forWho}</p>
              </div>
            </div>

            <button
              onClick={closeTierModal}
              className="mt-6 w-full py-2 px-4 bg-burgundy text-white rounded-lg hover:bg-maroon transition"
            >
              Rozumím
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
