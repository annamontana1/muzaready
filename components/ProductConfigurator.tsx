'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';
import { useAuth } from '@/components/AuthProvider';
import { CONFIGURATOR_RANGES } from '@/lib/config';
import ScrollPicker from './ScrollPicker';

interface PriceMatrixEntry {
  id: string;
  category: string;
  tier: string;
  lengthCm: number;
  pricePerGramCzk: number;
}

interface FinishingAddon {
  code: string;
  label: string;
  price_add: number;
}

interface ProductConfiguratorProps {
  product: Product;
  finishing_addons: FinishingAddon[];
  initialLength?: number | null;
  initialWeight?: number | null;
}

export default function ProductConfigurator({
  product,
  finishing_addons,
  initialLength = null,
  initialWeight = null
}: ProductConfiguratorProps) {
  const { user } = useAuth();
  const isPlatinum = product.tier === 'Platinum edition';
  const isB2B = user?.isWholesale ?? false;

  // Default values: 40cm, 100g for Standard/LUXE; 'raw' (surový cop) for all
  const [selectedLength, setSelectedLength] = useState<number | null>(
    isPlatinum ? null : (initialLength ?? 40)
  );
  const [selectedWeight, setSelectedWeight] = useState<number | null>(
    isPlatinum ? null : (initialWeight ?? 100)
  );
  // Platinum: Default to 'raw', Standard/LUXE: also default to 'raw'
  const [selectedFinishing, setSelectedFinishing] = useState<string | null>('raw');

  // Load price matrix
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [loadingMatrix, setLoadingMatrix] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch('/api/price-matrix');
        if (!res.ok) throw new Error('Failed to load price matrix');
        const data = await res.json();
        setPriceMatrix(data);
      } catch (err) {
        console.error('Error loading price matrix:', err);
        // Fall back to static calculator if matrix fails
      } finally {
        setLoadingMatrix(false);
      }
    };

    fetchMatrix();
  }, []);

  // Generate length options (35-90 cm, step 5)
  // SKLAD_REZIM = OFF: všechny kombinace jsou vždy vybratelné (on-demand výroba)
  const lengthOptions = useMemo(() => {
    const options = [];
    for (let length = CONFIGURATOR_RANGES.LENGTH_MIN; length <= CONFIGURATOR_RANGES.LENGTH_MAX; length += CONFIGURATOR_RANGES.LENGTH_STEP) {
      options.push({
        value: length,
        label: length.toString(),
        disabled: false, // Všechny délky jsou vybratelné
      });
    }
    return options;
  }, []);

  // Generate weight options (50-300 g, step 10)
  // SKLAD_REZIM = OFF: všechny kombinace jsou vždy vybratelné (on-demand výroba)
  const weightOptions = useMemo(() => {
    const options = [];
    for (let weight = CONFIGURATOR_RANGES.WEIGHT_MIN; weight <= CONFIGURATOR_RANGES.WEIGHT_MAX; weight += CONFIGURATOR_RANGES.WEIGHT_STEP) {
      options.push({
        value: weight,
        label: weight.toString(),
        disabled: false, // Všechny gramáže jsou vybratelné
      });
    }
    return options;
  }, []);

  // Generate finishing options
  const finishingOptions = useMemo(() => {
    return finishing_addons.map(addon => ({
      value: addon.code,
      label: addon.label + (addon.price_add > 0 ? ` (+${priceCalculator.formatPrice(addon.price_add)})` : ''),
      disabled: false
    }));
  }, [finishing_addons]);

  const finalPrice = useMemo(() => {
    if (isPlatinum) {
      // Platinum Edition má individuální cenu (řeší se ručně)
      return null;
    }

    if (!selectedLength || !selectedWeight) return null;

    // Map product tier to ceníkový tier
    let matrixTier = product.tier?.toLowerCase() || 'standard';
    if (matrixTier === 'luxe edition') matrixTier = 'luxe';
    if (matrixTier === 'standard edition') matrixTier = 'standard';

    // Map product category to matrix category
    const matrixCategory = product.category === 'barvene_blond' ? 'barvene' : 'nebarvene';

    // Look up price from matrix
    const matrixEntry = priceMatrix.find(
      (entry) =>
        entry.tier === matrixTier &&
        entry.category === matrixCategory &&
        entry.lengthCm === selectedLength
    );

    // Use matrix price if available, fall back to static calculator
    let priceFor100g: number;
    if (matrixEntry) {
      // Convert per-gram price back to per-100g for calculation
      priceFor100g = matrixEntry.pricePerGramCzk * 100;
    } else {
      // Fallback to static calculator
      priceFor100g = priceCalculator.getPricePerWeight(
        product.tier,
        selectedLength,
        product.category
      );
    }

    const basePrice = (priceFor100g * selectedWeight) / 100;
    const finishingAddon = finishing_addons.find(f => f.code === selectedFinishing);
    const addonPrice = finishingAddon?.price_add || 0;
    const subtotal = basePrice + addonPrice;

    // Apply B2B discount if applicable
    return priceCalculator.applyB2BDiscount(subtotal, isB2B);
  }, [product, selectedLength, selectedWeight, selectedFinishing, finishing_addons, isPlatinum, priceMatrix, isB2B]);

  // Platinum: jen zakončení je povinné
  // Standard/LUXE: délka, gramáž a zakončení jsou povinné
  const isConfigComplete = isPlatinum
    ? selectedFinishing !== null
    : selectedLength !== null && selectedWeight !== null && selectedFinishing !== null;

  const handleLengthChange = (value: number | string) => {
    setSelectedLength(value as number);
    // Nechat gramáž jak je - všechny kombinace jsou dostupné
  };

  const handleWeightChange = (value: number | string) => {
    setSelectedWeight(value as number);
  };

  const handleFinishingChange = (value: number | string) => {
    setSelectedFinishing(value as string);
  };

  return (
    <div className="space-y-6">
      {/* Struktura - zobrazení (ne výběr) pro Standard/LUXE */}
      {!isPlatinum && product.variants[0]?.structure && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Struktura:</span> {product.variants[0].structure}
          </p>
        </div>
      )}

      {/* Délka a Gramáž - POUZE pro Standard/LUXE */}
      {!isPlatinum && (
        <>
          {/* Délka Picker */}
          <ScrollPicker
            label="Délka"
            options={lengthOptions}
            value={selectedLength}
            onChange={handleLengthChange}
            placeholder="Vyberte délku"
            unit="cm"
          />

          {/* Gramáž Picker - shown only after length selected */}
          {selectedLength && (
            <ScrollPicker
              label="Gramáž"
              options={weightOptions}
              value={selectedWeight}
              onChange={handleWeightChange}
              placeholder="Vyberte gramáž"
              unit="g"
            />
          )}
        </>
      )}

      {/* Zakončení - ScrollPicker for all tiers */}
      <ScrollPicker
        label="Zakončení"
        options={finishingOptions}
        value={selectedFinishing}
        onChange={handleFinishingChange}
        placeholder="Vyberte zakončení"
      />

      {/* Price and CTA */}
      <div className="border-t pt-6">
        {isPlatinum ? (
          // Platinum: Bez zobrazení ceny, jen "Surový cop" info
          <div className="mb-4">
            <p className="text-base text-gray-600">
              Platinum culík - cena se určí po konzultaci
            </p>
          </div>
        ) : (
          // Standard/LUXE: Zobrazit vypočítanou cenu
          <div className="mb-4">
            {finalPrice !== null ? (
              <>
                {isB2B && (
                  <>
                    <p className="text-sm text-green-600 font-medium mb-2">
                      ✓ Máte B2B slevu -10%
                    </p>
                    <p className="text-sm line-through text-gray-400 mb-1">
                      Původní cena: {priceCalculator.formatPrice(finalPrice / (1 - priceCalculator.getB2BDiscountPercent() / 100))}
                    </p>
                  </>
                )}
                <p className="text-3xl font-semibold text-burgundy">
                  {priceCalculator.formatPrice(finalPrice)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cena je za tento culík ({selectedWeight} g / {selectedLength} cm)
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-500">Vyberte všechny možnosti pro zobrazení ceny</p>
            )}
          </div>
        )}

        <button
          disabled={!isConfigComplete}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
            !isConfigComplete
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
          Do košíku
        </button>

        {!isConfigComplete && (
          <p className="mt-3 text-xs text-center text-gray-500">
            {isPlatinum
              ? 'Vyberte zakončení pro aktivaci tlačítka'
              : 'Vyberte délku, gramáž a zakončení pro aktivaci tlačítka'}
          </p>
        )}
      </div>
    </div>
  );
}
