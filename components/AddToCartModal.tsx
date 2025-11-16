'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { SkuCartItem } from '@/types/cart';

interface AddToCartModalProps {
  isOpen: boolean;
  skuId: string;
  productName: string;
  price: number;
  weightGrams?: number;
  onClose: () => void;
  onAdded?: () => void;
}

export default function AddToCartModal({
  isOpen,
  skuId,
  productName,
  price,
  weightGrams = 0,
  onClose,
  onAdded,
}: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = price * quantity;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      setError(null);

      // Create cart item - for PIECE type items
      const cartItem: Omit<SkuCartItem, 'addedAt'> = {
        skuId,
        skuName: productName,
        customerCategory: null, // Will be determined from tier if needed
        shade: null,
        saleMode: 'PIECE_BY_WEIGHT',
        grams: weightGrams,
        pricePerGram: weightGrams > 0 ? price / weightGrams : price,
        lineTotal: totalPrice,
        ending: 'NONE',
        assemblyFeeType: 'FLAT',
        assemblyFeeCzk: 0,
        assemblyFeeTotal: 0,
        lineGrandTotal: totalPrice,
        quantity,
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
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">Přidat do košíku</h2>
        <p className="text-sm text-gray-600 mb-4">{productName}</p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Quantity selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Počet kusů
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isAdding}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, val));
              }}
              disabled={isAdding}
              className="w-16 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-burgundy disabled:opacity-50"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isAdding}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Price display */}
        <div className="mb-6 p-4 bg-ivory rounded-lg border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Cena za kus:</span>
            <span className="font-medium text-gray-900">{price.toFixed(0)} Kč</span>
          </div>
          {quantity > 1 && (
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Počet:</span>
              <span className="text-gray-600">× {quantity}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-900">Celkem:</span>
            <span className="text-lg font-bold text-burgundy">
              {totalPrice.toFixed(0)} Kč
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
