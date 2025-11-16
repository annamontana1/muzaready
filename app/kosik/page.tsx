'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState } from 'react';

const ENDING_LABELS: Record<string, string> = {
  keratin: 'Keratin',
  microkeratin: 'Mikrokeratin',
  nano_tapes: 'Nano tapes',
  vlasove_tresy: 'Vlasové tresy',
};

export default function CartPage() {
  const { items, updateQuantity, updateGrams, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleClearCart = () => {
    if (confirm('Opravdu chcete vyprázdnit košík?')) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const subtotal = getTotalPrice();
  const shippingThreshold = 3000;
  const shipping = subtotal >= shippingThreshold ? 0 : 150;
  const total = subtotal + shipping;

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-beige py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-8">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-burgundy hover:text-maroon transition">
                  Domů
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600">Košík</li>
            </ol>
          </nav>

          {/* Empty state */}
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h1 className="text-2xl font-semibold text-burgundy mb-3">
                Váš košík je prázdný
              </h1>
              <p className="text-gray-600 mb-8">
                Zatím jste do košíku nepřidali žádné produkty. Začněte nakupovat a objevte naši nabídku prémiových vlasů!
              </p>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="inline-block bg-burgundy text-white px-8 py-3 rounded-lg font-medium hover:bg-maroon transition shadow-medium"
              >
                Začít nakupovat
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-burgundy hover:text-maroon transition">
                Domů
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">Košík</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-burgundy">
            Nákupní košík
            <span className="text-lg font-normal text-gray-600 ml-3">
              ({items.length} {items.length === 1 ? 'položka' : items.length < 5 ? 'položky' : 'položek'})
            </span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm text-gray-500 hover:text-burgundy transition disabled:opacity-50"
            >
              Vyprázdnit košík
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.skuId}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition"
              >
                <div className="flex gap-6">
                  {/* SKU Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-burgundy hover:text-maroon transition mb-2">
                      {item.skuName}
                    </h3>

                    {/* Product Details */}
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Kategorie:</span>{' '}
                        {item.shade && (item.shade === 'barvene_blond' || item.shade.includes('BLONDE') || item.shade.includes('barvene'))
                          ? 'Barvené vlasy'
                          : 'Nebarvené panenské'}
                      </div>
                      <div>
                        <span className="font-medium">Zakončení:</span> {ENDING_LABELS[item.ending] || item.ending}
                      </div>

                      {/* Show grams for BULK items or quantity for PIECE items */}
                      {item.saleMode === 'BULK_G' ? (
                        <div>
                          <span className="font-medium">Gramáž:</span> {item.grams}g @ {formatPrice(item.pricePerGram)}/g
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Množství:</span> {item.quantity} ks @{' '}
                          {formatPrice(item.lineTotal / item.quantity)}/ks
                        </div>
                      )}

                      {/* Assembly Fee Info */}
                      {item.assemblyFeeTotal > 0 && (
                        <div>
                          <span className="font-medium">Servisní poplatek:</span>{' '}
                          {item.assemblyFeeType === 'PER_GRAM'
                            ? `${formatPrice(item.assemblyFeeCzk)}/g = ${formatPrice(item.assemblyFeeTotal)}`
                            : formatPrice(item.assemblyFeeTotal)}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price Controls */}
                    <div className="flex items-center justify-between">
                      {/* Quantity/Grams Selector */}
                      {item.saleMode === 'BULK_G' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Gramáž:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                item.grams > 50 && updateGrams(item.skuId, item.grams - 50)
                              }
                              disabled={item.grams <= 50}
                              className="px-3 py-1 text-burgundy hover:bg-ivory transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              −50g
                            </button>
                            <span className="px-4 py-1 min-w-[4rem] text-center font-medium">
                              {item.grams}g
                            </span>
                            <button
                              onClick={() => updateGrams(item.skuId, item.grams + 50)}
                              className="px-3 py-1 text-burgundy hover:bg-ivory transition"
                            >
                              +50g
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Ks:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                item.quantity > 1 && updateQuantity(item.skuId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-burgundy hover:bg-ivory transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.skuId, item.quantity + 1)}
                              className="px-3 py-1 text-burgundy hover:bg-ivory transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {item.saleMode === 'BULK_G'
                            ? `${formatPrice(item.pricePerGram)}/g`
                            : `${formatPrice(item.lineTotal / item.quantity)}/ks`}
                        </div>
                        <div className="text-xl font-bold text-burgundy">
                          {formatPrice(item.lineGrandTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (confirm('Opravdu chcete odstranit tuto položku z košíku?')) {
                        removeFromCart(item.skuId);
                      }
                    }}
                    className="text-sm text-gray-500 hover:text-red-600 transition flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Odstranit z košíku
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-burgundy mb-6">Shrnutí objednávky</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Mezisoučet:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doprava:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">ZDARMA</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {/* Free shipping progress */}
                {subtotal < shippingThreshold && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-2">
                      Do dopravy zdarma zbývá:{' '}
                      <span className="font-semibold text-burgundy">
                        {formatPrice(shippingThreshold - subtotal)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-burgundy h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-burgundy">
                    <span>Celkem:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/pokladna"
                  className="block w-full bg-burgundy text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-maroon transition shadow-medium"
                >
                  Pokračovat k pokladně
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                  className="block w-full border-2 border-burgundy text-burgundy text-center px-6 py-3 rounded-lg font-semibold hover:bg-burgundy hover:text-white transition"
                >
                  Pokračovat v nákupu
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bezpečná platba</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Doprava do 2-3 dnů</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>100% prémiové vlasy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
