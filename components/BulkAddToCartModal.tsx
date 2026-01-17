'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { SkuCartItem } from '@/types/cart';

interface BulkAddToCartModalProps {
  isOpen: boolean;
  skuId: string;
  productName: string;
  pricePerGramCzk: number;
  lengthCm: number;
  shade: number;
  shadeName: string;
  structure: string;
  tier: string;
  onClose: () => void;
  onAdded?: () => void;
}

export default function BulkAddToCartModal({
  isOpen,
  skuId,
  productName,
  pricePerGramCzk,
  lengthCm,
  shade,
  shadeName,
  structure,
  tier,
  onClose,
  onAdded,
}: BulkAddToCartModalProps) {
  const { addToCart } = useCart();
  const [grams, setGrams] = useState(100);
  const [ending, setEnding] = useState<'NONE' | 'KERATIN'>('NONE');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Assembly fees - matches ASSEMBLY_FEE_CONFIG from lib/stock.ts
  const assemblyFees: Record<typeof ending, { fee: number; type: 'FLAT' | 'PER_GRAM' }> = {
    NONE: { fee: 0, type: 'FLAT' },
    KERATIN: { fee: 5, type: 'PER_GRAM' }, // 5 Kč per gram (matches lib/stock.ts config)
  };

  const { fee: assemblyFeeCzk, type: assemblyFeeType } = assemblyFees[ending];
  const assemblyFeeTotal = assemblyFeeType === 'PER_GRAM' ? assemblyFeeCzk * grams : assemblyFeeCzk;
  const lineTotal = pricePerGramCzk * grams;
  const lineGrandTotal = lineTotal + assemblyFeeTotal;

  // Map tier to customer category
  const customerCategory =
    tier === 'Platinum edition' ? 'PLATINUM_EDITION' as const :
    tier === 'LUXE' ? 'LUXE' as const :
    'STANDARD' as const;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      setError(null);

      // Create BULK cart item
      const cartItem: Omit<SkuCartItem, 'addedAt'> = {
        skuId,
        skuName: productName,
        customerCategory,
        shade: shade.toString(),
        saleMode: 'BULK_G',
        grams,
        pricePerGram: pricePerGramCzk,
        lineTotal,
        ending,
        assemblyFeeType,
        assemblyFeeCzk,
        assemblyFeeTotal,
        lineGrandTotal,
        quantity: 1, // Always 1 for BULK
      };

      addToCart(cartItem);

      // Close modal and trigger callback
      setTimeout(() => {
        onClose();
        onAdded?.();
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při přidání do košíku');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">Přidat do košíku</h2>
        <p className="text-sm text-gray-600 mb-1">{productName}</p>
        <p className="text-xs text-gray-500 mb-4">
          {lengthCm} cm · {shadeName} (#{shade}) · {structure}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Grams selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gramáž
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGrams(Math.max(50, grams - 10))}
              disabled={grams <= 50 || isAdding}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              −
            </button>
            <input
              type="number"
              value={grams}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 50;
                setGrams(Math.max(50, Math.min(300, val)));
              }}
              disabled={isAdding}
              className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-burgundy disabled:opacity-50"
              min="50"
              max="300"
              step="10"
            />
            <span className="text-sm text-gray-600">g</span>
            <button
              onClick={() => setGrams(Math.min(300, grams + 10))}
              disabled={grams >= 300 || isAdding}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Rozsah: 50-300 g (kroky po 10 g)</p>
        </div>

        {/* Ending selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zakončení
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-ivory transition">
              <input
                type="radio"
                name="ending"
                value="NONE"
                checked={ending === 'NONE'}
                onChange={() => setEnding('NONE')}
                disabled={isAdding}
                className="text-burgundy focus:ring-burgundy"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Surový cop</div>
                <div className="text-xs text-gray-500">Bez zpracování</div>
              </div>
              <div className="text-sm font-semibold text-gray-700">+0 Kč</div>
            </label>

            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-ivory transition">
              <input
                type="radio"
                name="ending"
                value="KERATIN"
                checked={ending === 'KERATIN'}
                onChange={() => setEnding('KERATIN')}
                disabled={isAdding}
                className="text-burgundy focus:ring-burgundy"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Keratinové kapky</div>
                <div className="text-xs text-gray-500">5 Kč/gram</div>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                +{(assemblyFees.KERATIN.fee * grams).toFixed(0)} Kč
              </div>
            </label>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="mb-6 p-4 bg-ivory rounded-lg border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Vlasy:</span>
            <span className="font-medium text-gray-900">
              {grams} g × {pricePerGramCzk}/g = {lineTotal.toFixed(0)} Kč
            </span>
          </div>
          {assemblyFeeTotal > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Montáž:</span>
              <span className="font-medium text-gray-900">
                +{assemblyFeeTotal.toFixed(0)} Kč
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-900">Celkem:</span>
            <span className="text-lg font-bold text-burgundy">
              {lineGrandTotal.toFixed(0)} Kč
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isAdding}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Zrušit
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 px-4 py-3 bg-burgundy text-white rounded-lg font-medium hover:bg-maroon disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <span className="animate-spin">⟳</span>
                Přidávám...
              </>
            ) : (
              <>
                <span>🛒</span>
                Přidat do košíku
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
