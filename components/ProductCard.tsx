'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
}

/**
 * Generate listing title in format:
 * {{shade name}} #{{shade code}}
 *
 * Examples:
 * - "Černá #1"
 * - "Světlá hnědá #5"
 */
function getListingTitle(displayVariant: ProductVariant): string {
  const shadeName = HAIR_COLORS[displayVariant.shade]?.name || 'Neznámá';
  const shadeCode = displayVariant.shade;
  return `${shadeName} #${shadeCode}`;
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
  const displayVariant = variant || product.variants[0];
  const isPlatinum = product.tier === 'Platinum edition';
  const displayPrice = product.base_price_per_100g_45cm;
  const shadeColor = HAIR_COLORS[displayVariant?.shade] || HAIR_COLORS[1];
  const listingTitle = getListingTitle(displayVariant);
  const tierInfo = getTierExplanation(product.tier);

  const handleTierClick = (e: React.MouseEvent) => {
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

  return (
    <>
      <Link href={`/produkt/${product.slug}`} className="product-card group block">
        {/* Clickable Tier Badge with Info Icon */}
        <button
          onClick={handleTierClick}
          className="absolute top-3 left-3 z-10 tier-badge hover:opacity-80 transition cursor-pointer"
          aria-label={`Zobrazit informace o ${product.tier}`}
        >
          {product.tier}<sup className="text-[0.75em] ml-0.5">?</sup>
        </button>

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

    {/* Tier Information Modal */}
    {showTierModal && (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
