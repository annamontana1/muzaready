'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { items, updateQuantity, updateGrams, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const formatPrice = (price: number) => {
    const locale = language === 'cs' ? 'cs-CZ' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleClearCart = () => {
    if (confirm(t('cart.clearCartConfirm'))) {
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
                  {t('nav.home')}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600">{t('cart.title')}</li>
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
                {t('cart.empty')}
              </h1>
              <p className="text-gray-600 mb-8">
                {t('cart.emptyDescription')}
              </p>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="inline-block bg-burgundy text-white px-8 py-3 rounded-lg font-medium hover:bg-maroon transition shadow-medium"
              >
                {t('cart.startShopping')}
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
                {t('nav.home')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{t('cart.title')}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-burgundy">
            {t('cart.shoppingCart')}
            <span className="text-lg font-normal text-gray-600 ml-3">
              ({items.length} {items.length === 1 ? t('cart.item', { count: items.length }) : items.length < 5 ? t('cart.itemsPlural', { count: items.length }) : t('cart.items', { count: items.length })})
            </span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm text-gray-500 hover:text-burgundy transition disabled:opacity-50"
            >
              {t('cart.clearCart')}
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
                        <span className="font-medium">{t('cart.category')}:</span>{' '}
                        {item.shade && (item.shade === 'barvene_blond' || item.shade.includes('BLONDE') || item.shade.includes('barvene'))
                          ? t('cart.categoryDyed')
                          : t('cart.categoryUndyed')}
                      </div>
                      <div>
                        <span className="font-medium">{t('cart.ending')}:</span> {t(`cart.endings.${item.ending}`) || item.ending}
                      </div>

                      {/* Show grams for BULK items or quantity for PIECE items */}
                      {item.saleMode === 'BULK_G' ? (
                        <div>
                          <span className="font-medium">{t('cart.gramsLabel')}:</span> {t('cart.gramsAt', { grams: item.grams, price: formatPrice(item.pricePerGram) })}
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">{t('cart.quantityLabel')}:</span> {t('cart.quantityAt', { quantity: item.quantity, price: formatPrice(item.lineTotal / item.quantity) })}
                        </div>
                      )}

                      {/* Assembly Fee Info */}
                      {item.assemblyFeeTotal > 0 && (
                        <div>
                          <span className="font-medium">{t('cart.serviceCharge')}:</span>{' '}
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
                          <span className="text-sm text-gray-600">{t('cart.gramsLabel')}:</span>
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
                          <span className="text-sm text-gray-600">{t('cart.quantityLabel')}:</span>
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
                      if (confirm(t('cart.removeConfirm'))) {
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
                    {t('cart.removeFromCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-burgundy mb-6">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">{t('common.free').toUpperCase()}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {/* Free shipping progress */}
                {subtotal < shippingThreshold && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-2">
                      {t('cart.freeShippingRemaining')}{' '}
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
                    <span>{t('cart.total')}:</span>
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
                  {t('cart.checkout')}
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                  className="block w-full border-2 border-burgundy text-burgundy text-center px-6 py-3 rounded-lg font-semibold hover:bg-burgundy hover:text-white transition"
                >
                  {t('cart.continueShopping')}
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
                  <span>{t('cart.securePayment')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t('cart.deliveryTime')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t('cart.premiumHair')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
