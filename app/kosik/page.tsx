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

  const getEndingLabel = (ending: string) => {
    const key = `cart.endings.${ending}`;
    const translated = t(key);
    // If translation key not found, return a clean fallback
    if (translated === key || translated.includes('.')) {
      const fallbacks: Record<string, string> = {
        NONE: 'Bez zakončení',
        none: 'Bez zakončení',
        KERATIN: 'Keratin',
        keratin: 'Keratin',
        MICRO_KERATIN: 'Mikrokeratin',
        microkeratin: 'Mikrokeratin',
        NANO_TAPES: 'Nano tapes',
        nano_tapes: 'Nano tapes',
        TAPES: 'Pásky / Tape-in',
        WEFT: 'Vlasové tresy',
        vlasove_tresy: 'Vlasové tresy',
        PASKY_KERATINU: 'Pásky keratinu',
        STANDARD_KERATIN: 'Keratin standard',
      };
      return fallbacks[ending] || ending;
    }
    return translated;
  };

  const handleClearCart = () => {
    if (confirm(t('cart.clearCartConfirm'))) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const subtotal = getTotalPrice();

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="text-[11px] tracking-[0.15em] uppercase font-light mb-12" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
            <span className="mx-2">—</span>
            <span style={{ color: 'var(--text-mid)' }}>Košík</span>
          </nav>

          <div className="text-center py-20">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center justify-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              KOŠÍK
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            </div>
            <h1 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light leading-[1.1] mb-4" style={{ color: 'var(--text-dark)' }}>
              Váš košík je prázdný
            </h1>
            <p className="text-sm font-light mb-10" style={{ color: 'var(--text-soft)' }}>
              Prozkoumejte naši kolekci prémiových vlasů
            </p>
            <Link
              href="/vlasy-k-prodlouzeni"
              className="inline-block px-10 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'var(--burgundy)' }}
            >
              Prozkoumat kolekci
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Cart with items ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-[0.15em] uppercase font-light mb-12" style={{ color: 'var(--text-soft)' }}>
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          <span className="mx-2">—</span>
          <span style={{ color: 'var(--text-mid)' }}>Košík</span>
        </nav>

        {/* Page header */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b" style={{ borderColor: 'var(--warm-beige)' }}>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              OBJEDNÁVKA
            </div>
            <h1 className="font-cormorant text-[clamp(28px,3vw,42px)] font-light leading-[1.1]" style={{ color: 'var(--text-dark)' }}>
              Košík
              <span className="text-lg font-light ml-3" style={{ color: 'var(--text-soft)' }}>
                ({items.length} {items.length === 1 ? 'položka' : items.length < 5 ? 'položky' : 'položek'})
              </span>
            </h1>
          </div>
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-[11px] tracking-[0.1em] uppercase transition-all hover:underline disabled:opacity-40"
            style={{ color: 'var(--text-soft)' }}
          >
            Vyprázdnit košík
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-0">
            {items.map((item, index) => (
              <div
                key={item.skuId}
                className="py-8"
                style={{
                  borderBottom: index < items.length - 1 ? `1px solid var(--warm-beige)` : 'none'
                }}
              >
                <div className="flex gap-6">
                  <div className="flex-1 min-w-0">

                    {/* Product name */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <h3 className="font-cormorant text-xl font-light leading-tight" style={{ color: 'var(--text-dark)' }}>
                          {item.skuName}
                          {item.shade && (
                            <span className="text-sm ml-2" style={{ color: 'var(--text-soft)' }}>
                              · #{item.shade}
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-cormorant text-2xl font-light" style={{ color: 'var(--text-dark)' }}>
                          {formatPrice(item.lineGrandTotal)}
                        </div>
                        {item.saleMode === 'BULK_G' && (
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-soft)' }}>
                            {formatPrice(item.pricePerGram)}/g
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product details */}
                    <div className="space-y-1.5 mb-6">
                      <div className="flex gap-2 text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                        <span style={{ color: 'var(--text-soft)' }}>Zakončení:</span>
                        <span>{getEndingLabel(item.ending)}</span>
                      </div>
                      {item.saleMode === 'BULK_G' ? (
                        <div className="flex gap-2 text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                          <span style={{ color: 'var(--text-soft)' }}>Gramáž:</span>
                          <span>{item.grams}g @ {formatPrice(item.pricePerGram)}/g</span>
                        </div>
                      ) : (
                        <div className="flex gap-2 text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                          <span style={{ color: 'var(--text-soft)' }}>Počet:</span>
                          <span>{item.quantity} ks @ {formatPrice(item.lineTotal / item.quantity)}</span>
                        </div>
                      )}
                      {item.assemblyFeeTotal > 0 && (
                        <div className="flex gap-2 text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                          <span style={{ color: 'var(--text-soft)' }}>Servisní poplatek:</span>
                          <span>{formatPrice(item.assemblyFeeTotal)}</span>
                        </div>
                      )}
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* Gram / quantity selector */}
                      {item.saleMode === 'BULK_G' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>Gramáž</span>
                          <div className="flex items-center border" style={{ borderColor: 'var(--warm-beige)' }}>
                            <button
                              onClick={() => item.grams > 50 && updateGrams(item.skuId, item.grams - 50)}
                              disabled={item.grams <= 50}
                              className="px-4 py-2 text-sm transition-colors hover:bg-ivory disabled:opacity-30 disabled:cursor-not-allowed"
                              style={{ color: 'var(--text-dark)' }}
                            >
                              −50g
                            </button>
                            <span className="px-4 py-2 min-w-[4.5rem] text-center text-sm font-medium border-x" style={{ borderColor: 'var(--warm-beige)', color: 'var(--text-dark)' }}>
                              {item.grams}g
                            </span>
                            <button
                              onClick={() => updateGrams(item.skuId, item.grams + 50)}
                              className="px-4 py-2 text-sm transition-colors hover:bg-ivory"
                              style={{ color: 'var(--text-dark)' }}
                            >
                              +50g
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>Počet</span>
                          <div className="flex items-center border" style={{ borderColor: 'var(--warm-beige)' }}>
                            <button
                              onClick={() => item.quantity > 1 && updateQuantity(item.skuId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-4 py-2 text-sm transition-colors hover:bg-ivory disabled:opacity-30 disabled:cursor-not-allowed"
                              style={{ color: 'var(--text-dark)' }}
                            >
                              −
                            </button>
                            <span className="px-4 py-2 min-w-[3rem] text-center text-sm font-medium border-x" style={{ borderColor: 'var(--warm-beige)', color: 'var(--text-dark)' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.skuId, item.quantity + 1)}
                              className="px-4 py-2 text-sm transition-colors hover:bg-ivory"
                              style={{ color: 'var(--text-dark)' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => {
                          if (confirm(t('cart.removeConfirm'))) removeFromCart(item.skuId);
                        }}
                        className="text-[11px] tracking-[0.1em] uppercase transition-all hover:underline flex items-center gap-1.5"
                        style={{ color: 'var(--text-soft)' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Odebrat
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8" style={{ background: 'var(--white, #fff)', border: '1px solid var(--warm-beige)' }}>
              <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
                <span className="block w-6 h-px" style={{ background: 'var(--accent)' }} />
                SOUHRN
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                  <span>Mezisoučet</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                  <span>Doprava</span>
                  <span style={{ color: 'var(--text-soft)' }}>dle dopravce</span>
                </div>
              </div>

              <div className="pt-5 mb-8 border-t" style={{ borderColor: 'var(--warm-beige)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-cormorant text-xl font-light" style={{ color: 'var(--text-dark)' }}>Celkem</span>
                  <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--text-dark)' }}>{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-soft)' }}>Doprava bude vypočítána v pokladně</p>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <Link
                  href="/pokladna"
                  className="block w-full text-center py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--burgundy)' }}
                >
                  Pokračovat k pokladně
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni"
                  className="block w-full text-center py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-all hover:opacity-70 border"
                  style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
                >
                  Pokračovat v nákupu
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-8 pt-6 border-t space-y-2.5" style={{ borderColor: 'var(--warm-beige)' }}>
                {[
                  'Bezpečná platba',
                  'Dodání do 48 h',
                  'Prémiová kvalita vlasů',
                ].map((label) => (
                  <div key={label} className="flex items-center gap-2.5 text-[11px] font-light" style={{ color: 'var(--text-soft)' }}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
