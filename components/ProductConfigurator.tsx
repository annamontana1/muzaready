'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface FinishingAddon {
  code: string;
  label: string;
  price_add: number;
}

interface ProductConfiguratorProps {
  product: Product;
  finishing_addons: FinishingAddon[];
}

export default function ProductConfigurator({ product, finishing_addons }: ProductConfiguratorProps) {
  const isPlatinum = product.tier === 'Platinum edition';

  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [selectedFinishing, setSelectedFinishing] = useState<string>('raw');

  const availableLengths = useMemo(() => {
    const lengths = Array.from(new Set(product.variants.map(v => v.length_cm)));
    return lengths.sort((a, b) => a - b);
  }, [product.variants]);

  const availableWeights = useMemo(() => {
    if (!selectedLength) return [];
    const weights = product.variants
      .filter(v => v.length_cm === selectedLength)
      .map(v => v.weight_g);
    return Array.from(new Set(weights)).sort((a, b) => a - b);
  }, [product.variants, selectedLength]);

  const selectedVariant = useMemo(() => {
    if (!selectedLength || !selectedWeight) return null;
    return product.variants.find(
      v => v.length_cm === selectedLength && v.weight_g === selectedWeight
    );
  }, [product.variants, selectedLength, selectedWeight]);

  const finalPrice = useMemo(() => {
    if (isPlatinum) {
      const finishingAddon = finishing_addons.find(f => f.code === selectedFinishing);
      const addonPrice = finishingAddon?.price_add || 0;
      if (product.base_price_per_100g_45cm > 0) {
        return product.base_price_per_100g_45cm + addonPrice;
      }
      return null;
    }

    if (!selectedLength || !selectedWeight) return null;

    const priceFor100g = priceCalculator.getPricePerWeight(
      product.tier,
      selectedLength,
      product.category
    );

    const basePrice = (priceFor100g * selectedWeight) / 100;
    const finishingAddon = finishing_addons.find(f => f.code === selectedFinishing);
    const addonPrice = finishingAddon?.price_add || 0;

    return basePrice + addonPrice;
  }, [product, selectedLength, selectedWeight, selectedFinishing, finishing_addons, isPlatinum]);

  const isConfigComplete = isPlatinum ? true : selectedLength !== null && selectedWeight !== null;

  const handleLengthChange = (length: number) => {
    setSelectedLength(length);
    setSelectedWeight(null);
  };

  return (
    <div className="space-y-6">
      {isPlatinum ? (
        <>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Platinum Edition</strong> - Culík na míru s individuální cenou.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-burgundy mb-3">Zakončení</label>
            <div className="space-y-2">
              {finishing_addons.map((addon) => (
                <label
                  key={addon.code}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedFinishing === addon.code
                      ? 'border-burgundy bg-burgundy/5'
                      : 'border-gray-200 hover:border-burgundy/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="finishing"
                      value={addon.code}
                      checked={selectedFinishing === addon.code}
                      onChange={(e) => setSelectedFinishing(e.target.value)}
                      className="w-4 h-4 text-burgundy"
                    />
                    <span className="font-medium">{addon.label}</span>
                  </div>
                  {addon.price_add > 0 && (
                    <span className="text-sm text-burgundy font-medium">
                      +{priceCalculator.formatPrice(addon.price_add)}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Zakončení připravíme na míru vybranému culíku.
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-burgundy mb-3">Délka (cm)</label>
            <div className="flex flex-wrap gap-2">
              {availableLengths.map((length) => (
                <button
                  key={length}
                  onClick={() => handleLengthChange(length)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedLength === length
                      ? 'bg-burgundy text-white'
                      : 'bg-white text-burgundy border border-burgundy/30 hover:border-burgundy hover:bg-burgundy/5'
                  }`}
                >
                  {length} cm
                </button>
              ))}
            </div>
          </div>

          {selectedLength && (
            <div>
              <label className="block text-sm font-medium text-burgundy mb-3">Gramáž (g)</label>
              <div className="flex flex-wrap gap-2">
                {availableWeights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedWeight === weight
                        ? 'bg-burgundy text-white'
                        : 'bg-white text-burgundy border border-burgundy/30 hover:border-burgundy hover:bg-burgundy/5'
                    }`}
                  >
                    {weight} g
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-burgundy mb-3">Zakončení</label>
            <div className="space-y-2">
              {finishing_addons.map((addon) => (
                <label
                  key={addon.code}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedFinishing === addon.code
                      ? 'border-burgundy bg-burgundy/5'
                      : 'border-gray-200 hover:border-burgundy/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="finishing"
                      value={addon.code}
                      checked={selectedFinishing === addon.code}
                      onChange={(e) => setSelectedFinishing(e.target.value)}
                      className="w-4 h-4 text-burgundy"
                    />
                    <span className="font-medium">{addon.label}</span>
                  </div>
                  {addon.price_add > 0 && (
                    <span className="text-sm text-burgundy font-medium">
                      +{priceCalculator.formatPrice(addon.price_add)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="border-t pt-6">
        {isPlatinum ? (
          <div className="mb-4">
            {finalPrice !== null && finalPrice > 0 ? (
              <>
                <p className="text-3xl font-semibold text-burgundy">
                  {priceCalculator.formatPrice(finalPrice)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Finální cena včetně zvoleného zakončení
                </p>
              </>
            ) : (
              <p className="text-2xl font-semibold text-burgundy">Cena individuální</p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            {finalPrice !== null ? (
              <>
                <p className="text-3xl font-semibold text-burgundy">
                  {priceCalculator.formatPrice(finalPrice)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cena je za tento culík ({selectedWeight} g / {selectedLength} cm)
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-500">Vyberte délku a gramáž pro zobrazení ceny</p>
            )}
          </div>
        )}

        {!isPlatinum && selectedVariant && (
          <div className="mb-4">
            {selectedVariant.in_stock ? (
              <p className="text-sm text-green-600 font-medium">
                ✓ Skladem ({selectedVariant.stock_quantity} ks)
              </p>
            ) : (
              <p className="text-sm text-orange-600 font-medium">
                Nedostupné – zvol jinou kombinaci
              </p>
            )}
          </div>
        )}

        <button
          disabled={!isConfigComplete || (!isPlatinum && !selectedVariant?.in_stock)}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
            !isConfigComplete || (!isPlatinum && !selectedVariant?.in_stock)
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-burgundy hover:bg-maroon'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {isPlatinum && (finalPrice === null || finalPrice === 0) ? 'Rezervovat culík' : 'Do košíku'}
        </button>

        {!isPlatinum && !isConfigComplete && (
          <p className="mt-3 text-xs text-center text-gray-500">
            Vyberte délku a gramáž pro aktivaci tlačítka
          </p>
        )}
      </div>
    </div>
  );
}
