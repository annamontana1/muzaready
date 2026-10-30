'use client';

import { useState, useCallback } from 'react';
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
  
  // Standard/LUXE: {lineLabel} – {shadeName} · #číslo
  const tierLabel = productTier === 'LUXE' ? 'LUXE' : 'Standard';
  return `${tierLabel} – ${shadeName} · #${shadeCode}`;
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

function getTierBadgeStyle(tier: string): { bg: string; color: string } {
  switch (tier) {
    case 'Platinum edition':
      return { bg: 'rgba(180,140,30,0.1)', color: '#7a5c00' };
    case 'LUXE':
      return { bg: 'rgba(74,21,32,0.08)', color: 'var(--burgundy)' };
    default:
      return { bg: 'rgba(30,80,140,0.08)', color: '#1e508c' };
  }
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const [showTierModal, setShowTierModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const displayVariant = variant || product.variants[0];
  const isPlatinum = product.tier === 'Platinum edition';
  const displayPrice = product.base_price_per_100g_45cm;
  const isB2B = user?.isWholesale ?? false;
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];
  const baseName = product.name?.trim().length ? product.name : getListingTitle(displayVariant, product.tier);
  const listingTitle = (!isPlatinum && displayVariant?.shade)
    ? `${baseName} · #${displayVariant.shade}`
    : baseName;
  const tierInfo = getTierExplanation(product.tier);
  const badgeStyle = getTierBadgeStyle(product.tier);

  const shownPrice = isPlatinum && displayVariant?.price_czk ? displayVariant.price_czk : displayPrice;
  const shownDiscounted = priceCalculator.applyB2BDiscount(shownPrice, isB2B);

  const handleTierClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTierModal(true);
  };

  const closeTierModal = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setShowTierModal(false);
  };

  // Build all images array
  const allImages: string[] = [];
  if (product.images?.main && (product.images.main.startsWith('http') || product.images.main.startsWith('/images/'))) {
    allImages.push(product.images.main);
  }
  if (product.images?.gallery && Array.isArray(product.images.gallery)) {
    allImages.push(...product.images.gallery.filter((img: string) => img && (img.startsWith('http') || img.startsWith('/'))));
  }

  return (
    <>
      <div
        className="product-card group block relative rounded-t-2xl overflow-hidden border"
        style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}
      >
        <Link href={`/sku-detail/${product.id}`} className="block">

          {/* Tier badge */}
          <div
            onClick={handleTierClick}
            className="absolute top-3 left-3 z-10 cursor-pointer hover:opacity-80 transition"
            role="button"
            tabIndex={0}
            aria-label={`Zobrazit informace o ${product.tier}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTierClick(e); }}
          >
            <span
              className="text-[9px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-sm font-normal"
              style={{ background: badgeStyle.bg, color: badgeStyle.color }}
            >
              {product.tier}
            </span>
          </div>

          {/* Favorite */}
          <div className="absolute top-3 right-3 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <FavoriteButton productId={product.id} size="md" variant="icon" />
          </div>

          {/* Image */}
          <div className="aspect-[3/4] overflow-hidden relative">
            {allImages.length > 0 && !imageError ? (
              <>
                <img
                  src={allImages[currentImageIndex] || allImages[0]}
                  alt={listingTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
                      aria-label="Předchozí foto"
                    >
                      <span className="text-xs font-bold" style={{ color: 'var(--text-mid)' }}>&larr;</span>
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex((p) => (p + 1) % allImages.length); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
                      aria-label="Další foto"
                    >
                      <span className="text-xs font-bold" style={{ color: 'var(--text-mid)' }}>&rarr;</span>
                    </button>
                    {allImages.length <= 5 ? (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        {allImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(idx); }}
                            className={`w-1.5 h-1.5 rounded-full transition ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/40 rounded-sm text-white text-[10px] tracking-[0.05em] pointer-events-none">
                        {currentImageIndex + 1}/{allImages.length}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${shadeColor.hex}55, ${shadeColor.hex}99)` }}
              >
                <span className="text-[10px] tracking-[0.1em] uppercase font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {displayVariant?.structure || 'Vlasy'}
                </span>
              </div>
            )}

            {/* Out of stock overlay */}
            {displayVariant && !displayVariant.in_stock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[10px] tracking-[0.14em] uppercase text-white font-light">Vyprodáno</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4" style={{ borderTop: '1px solid var(--beige)' }}>
            <h3
              className="font-cormorant font-light text-[17px] leading-snug line-clamp-2 mb-3"
              style={{ color: 'var(--text-dark)' }}
            >
              {listingTitle}
            </h3>

            {isB2B ? (
              <div>
                <span className="text-[11px] font-light line-through mr-2" style={{ color: 'var(--text-soft)' }}>
                  {priceCalculator.formatPrice(shownPrice)}
                </span>
                <span className="font-cormorant font-light text-[22px]" style={{ color: 'var(--burgundy)' }}>
                  {priceCalculator.formatPrice(shownDiscounted)}
                </span>
                <p className="text-[10px] font-light mt-0.5" style={{ color: '#22783c' }}>Velkoobchodní cena</p>
              </div>
            ) : (
              <span className="font-cormorant font-light text-[22px]" style={{ color: 'var(--burgundy)' }}>
                {priceCalculator.formatPrice(shownPrice)}
              </span>
            )}
          </div>
        </Link>

        {/* CTA */}
        <div className="px-4 pb-4">
          {displayVariant?.in_stock ? (
            <Link
              href={`/sku-detail/${product.id}`}
              className="w-full py-2.5 text-[11px] tracking-[0.12em] uppercase font-normal transition-all hover:-translate-y-px block text-center rounded-sm"
              style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
            >
              Nakonfigurovat
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-2.5 text-[11px] tracking-[0.12em] uppercase font-normal rounded-sm cursor-not-allowed opacity-40"
              style={{ border: '1px solid var(--beige-mid)', color: 'var(--text-soft)' }}
            >
              Vyprodáno
            </button>
          )}
        </div>
      </div>

      {/* Tier modal */}
      {showTierModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={closeTierModal}
        >
          <div
            className="max-w-md w-full p-6 relative rounded-sm"
            style={{ background: 'var(--white)', border: '1px solid var(--beige)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeTierModal}
              className="absolute top-4 right-4 transition-opacity hover:opacity-60"
              aria-label="Zavřít"
              style={{ color: 'var(--text-soft)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pr-8">
              <h3 className="font-cormorant font-light text-[24px] mb-5" style={{ color: 'var(--text-dark)' }}>
                {tierInfo.title}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase mb-1.5 font-normal" style={{ color: 'var(--text-soft)' }}>Co to je?</p>
                  <p className="text-[13px] font-light leading-relaxed" style={{ color: 'var(--text-mid)' }}>{tierInfo.description}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase mb-1.5 font-normal" style={{ color: 'var(--text-soft)' }}>Pro koho?</p>
                  <p className="text-[13px] font-light leading-relaxed" style={{ color: 'var(--text-mid)' }}>{tierInfo.forWho}</p>
                </div>
              </div>
              <button
                onClick={closeTierModal}
                className="mt-6 w-full py-3 text-[11px] tracking-[0.12em] uppercase font-normal rounded-sm transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
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
