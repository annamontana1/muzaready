'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

// ─── Types ──────────────────────────────────────────────────────

interface SkuResult {
  id: string;
  sku: string;
  name: string | null;
  shade: string | null;
  shadeName: string | null;
  structure: string | null;
  customerCategory: string | null;
  lengthCm: number | null;
  availableGrams: number | null;
  weightTotalG: number | null;
  pricePerGramCzk: number | null;
  priceCzkTotal: number | null;
  saleMode: 'BULK_G' | 'PIECE_BY_WEIGHT';
  inStock: boolean;
  soldOut: boolean;
}

interface CartItem {
  skuId: string;
  sku: SkuResult;
  saleMode: 'BULK_G' | 'PIECE_BY_WEIGHT';
  grams: number;
  pricePerGram: number;
  lineTotal: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  ico: string;
}

type CustomerType = 'anonymous' | 'b2b';
type PaymentMethod = 'hotovost' | 'karta' | 'prevod';
type Step = 1 | 2 | 3;

// ─── Category / Structure labels ────────────────────────────────

const categoryLabels: Record<string, string> = {
  STANDARD: 'Standard',
  LUXE: 'Luxe',
  PLATINUM_EDITION: 'Platinum Edition',
  BABY_SHADES: 'Baby Shades',
};

const paymentLabels: Record<PaymentMethod, string> = {
  hotovost: 'Hotovost',
  karta: 'Karta',
  prevod: 'Bankovní převod',
};

// ─── Helpers ────────────────────────────────────────────────────

function formatPrice(czk: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(czk);
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ─── Component ──────────────────────────────────────────────────

export default function PosNewSalePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Multi-step state
  const [step, setStep] = useState<Step>(1);

  // Step 1: Customer
  const [customerType, setCustomerType] = useState<CustomerType>('anonymous');
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    ico: '',
  });

  // Step 2: Products
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SkuResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSku, setSelectedSku] = useState<SkuResult | null>(null);
  const [gramsInput, setGramsInput] = useState<number>(100);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('hotovost');
  const [note, setNote] = useState('');

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── SKU Search ────────────────────────────────────────────

  const searchSkus = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/pos/skus?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.skus || []);
        }
      } catch (err) {
        console.error('SKU search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchSkus(searchQuery);
  }, [searchQuery, searchSkus]);

  // ─── Cart operations ───────────────────────────────────────

  function addToCart(sku: SkuResult, grams: number) {
    const pricePerGram = sku.pricePerGramCzk || 0;
    let lineTotal: number;

    if (sku.saleMode === 'BULK_G') {
      lineTotal = Math.round(pricePerGram * grams);
    } else {
      lineTotal = Math.round(sku.priceCzkTotal || 0);
      grams = sku.weightTotalG || 0;
    }

    setCart((prev) => [
      ...prev,
      {
        skuId: sku.id,
        sku,
        saleMode: sku.saleMode,
        grams,
        pricePerGram: Math.round(pricePerGram),
        lineTotal,
      },
    ]);

    // Reset
    setSelectedSku(null);
    setGramsInput(100);
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  // ─── Submit order ──────────────────────────────────────────

  async function handleSubmit() {
    if (cart.length === 0) {
      showToast('Nejdříve přidejte položky do košíku', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerType,
          customer: {
            firstName: customer.firstName || undefined,
            lastName: customer.lastName || undefined,
            email: customer.email || undefined,
            phone: customer.phone || undefined,
            companyName: customer.companyName || undefined,
            ico: customer.ico || undefined,
          },
          items: cart.map((item) => ({
            skuId: item.skuId,
            saleMode: item.saleMode,
            grams: item.grams,
            ending: 'NONE',
          })),
          paymentMethod,
          note: note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Chyba při vytváření prodeje', 'error');
        return;
      }

      showToast(
        `Prodej vytvořen! Celkem: ${formatPrice(data.order.total)}`,
        'success'
      );

      // For cash payments, redirect to receipt; otherwise to orders
      if (paymentMethod === 'hotovost') {
        router.push(`/admin/prodeje/doklad?id=${data.order.id}`);
      } else {
        router.push('/admin/objednavky');
      }
    } catch (err: any) {
      showToast('Chyba: ' + (err.message || 'Neznámá chyba'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Navigation between steps ──────────────────────────────

  function canProceedToStep2() {
    return true; // Customer info is optional for anonymous
  }

  function canProceedToStep3() {
    return cart.length > 0;
  }

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Nový prodej — Prodejna</h1>
          <p className="text-sm text-stone-500 mt-1">
            Prodej na prodejně (POS)
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Zákazník' },
            { num: 2, label: 'Produkty' },
            { num: 3, label: 'Platba' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (s.num === 1) setStep(1);
                  else if (s.num === 2 && canProceedToStep2()) setStep(2);
                  else if (s.num === 3 && canProceedToStep3()) setStep(3);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? 'bg-[#722F37] text-white'
                    : step > s.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.num
                      ? 'bg-white/20'
                      : step > s.num
                      ? 'bg-green-200'
                      : 'bg-stone-200'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline text-sm font-medium">
                  {s.label}
                </span>
              </button>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step > s.num ? 'bg-green-300' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 1: Customer */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-stone-800">Zákazník</h2>

          {/* Toggle */}
          <div className="flex gap-2">
            {(['anonymous', 'b2b'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCustomerType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customerType === type
                    ? 'bg-[#722F37] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type === 'anonymous' ? 'Anonymní (B2C)' : 'Firma (B2B)'}
              </button>
            ))}
          </div>

          {customerType === 'anonymous' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Jméno <span className="text-stone-400">(volitelné)</span>
                </label>
                <input
                  type="text"
                  value={customer.firstName}
                  onChange={(e) =>
                    setCustomer({ ...customer, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="Jan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Příjmení <span className="text-stone-400">(volitelné)</span>
                </label>
                <input
                  type="text"
                  value={customer.lastName}
                  onChange={(e) =>
                    setCustomer({ ...customer, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="Novák"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Email <span className="text-stone-400">(volitelné)</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="jan@example.com"
                />
              </div>
            </div>
          )}

          {customerType === 'b2b' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Jméno firmy
                </label>
                <input
                  type="text"
                  value={customer.companyName}
                  onChange={(e) =>
                    setCustomer({ ...customer, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="Salon Krása s.r.o."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  IČO
                </label>
                <input
                  type="text"
                  value={customer.ico}
                  onChange={(e) =>
                    setCustomer({ ...customer, ico: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="12345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Jméno kontaktu
                </label>
                <input
                  type="text"
                  value={customer.firstName}
                  onChange={(e) =>
                    setCustomer({ ...customer, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="Jana Nováková"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="salon@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  placeholder="+420 123 456 789"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors"
            >
              Pokračovat k produktům
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 2: Products */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-6">
          {/* SKU Search */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">
              Vyhledat produkt
            </h2>

            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none text-base"
                placeholder="Hledat podle názvu, odstínu, struktury, SKU..."
                autoFocus
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {isSearching && (
                <div className="absolute right-3 top-3.5">
                  <div className="w-5 h-5 border-2 border-[#722F37] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Search results */}
            {searchResults.length > 0 && !selectedSku && (
              <div className="border border-stone-200 rounded-lg max-h-72 overflow-y-auto divide-y divide-stone-100">
                {searchResults.map((sku) => {
                  const isOutOfStock =
                    sku.soldOut ||
                    !sku.inStock ||
                    (sku.saleMode === 'BULK_G' &&
                      (sku.availableGrams || 0) === 0);

                  return (
                    <button
                      key={sku.id}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSku(sku);
                        if (sku.saleMode === 'PIECE_BY_WEIGHT') {
                          addToCart(sku, sku.weightTotalG || 0);
                        } else {
                          const maxG = sku.availableGrams || 0;
                          setGramsInput(Math.min(100, maxG));
                        }
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        isOutOfStock
                          ? 'opacity-40 cursor-not-allowed bg-stone-50'
                          : 'hover:bg-[#722F37]/5 cursor-pointer'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-800 truncate">
                          {sku.shadeName || sku.shade || sku.name || sku.sku}
                        </div>
                        <div className="text-xs text-stone-500 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {sku.structure && <span>{sku.structure}</span>}
                          {sku.lengthCm && <span>{sku.lengthCm} cm</span>}
                          {sku.customerCategory && (
                            <span>
                              {categoryLabels[sku.customerCategory] ||
                                sku.customerCategory}
                            </span>
                          )}
                          <span className="font-mono text-stone-400">
                            {sku.sku}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-stone-700">
                          {sku.saleMode === 'BULK_G'
                            ? `${sku.pricePerGramCzk?.toFixed(0) || '?'} Kč/g`
                            : formatPrice(sku.priceCzkTotal || 0)}
                        </div>
                        <div
                          className={`text-xs ${
                            isOutOfStock ? 'text-red-500' : 'text-green-600'
                          }`}
                        >
                          {sku.saleMode === 'BULK_G'
                            ? `${sku.availableGrams || 0}g sklad`
                            : isOutOfStock
                            ? 'Vyprodáno'
                            : 'Skladem'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {searchQuery.trim() &&
              !isSearching &&
              searchResults.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-4">
                  Nic nenalezeno pro &quot;{searchQuery}&quot;
                </p>
              )}

            {/* Grams selector for BULK_G */}
            {selectedSku && selectedSku.saleMode === 'BULK_G' && (
              <div className="border border-[#722F37]/20 bg-[#722F37]/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-800">
                      {selectedSku.shadeName || selectedSku.sku}
                    </div>
                    <div className="text-xs text-stone-500">
                      {selectedSku.structure} &middot;{' '}
                      {selectedSku.lengthCm} cm &middot;{' '}
                      {selectedSku.pricePerGramCzk?.toFixed(0)} Kč/g
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSku(null)}
                    className="p-1 text-stone-400 hover:text-stone-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Gramáž:{' '}
                    <span className="text-[#722F37] font-bold">
                      {gramsInput}g
                    </span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={selectedSku.availableGrams || 500}
                    step={10}
                    value={gramsInput}
                    onChange={(e) => setGramsInput(Number(e.target.value))}
                    className="w-full accent-[#722F37]"
                  />
                  <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>50g</span>
                    <span>{selectedSku.availableGrams || 0}g max</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={50}
                    max={selectedSku.availableGrams || 500}
                    step={10}
                    value={gramsInput}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 50 && v <= (selectedSku.availableGrams || 500)) {
                        setGramsInput(v);
                      }
                    }}
                    className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-center focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none"
                  />
                  <span className="text-sm text-stone-500">gramů</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-stone-800">
                    {formatPrice(
                      Math.round(
                        (selectedSku.pricePerGramCzk || 0) * gramsInput
                      )
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(selectedSku, gramsInput)}
                    className="px-5 py-2.5 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Přidat do košíku
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              Košík{' '}
              {cart.length > 0 && (
                <span className="text-sm font-normal text-stone-500">
                  ({cart.length}{' '}
                  {cart.length === 1
                    ? 'položka'
                    : cart.length < 5
                    ? 'položky'
                    : 'položek'}
                  )
                </span>
              )}
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                <p className="text-sm">
                  Zatím nic. Vyhledejte produkt a přidejte ho.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.skuId}-${idx}`}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-stone-800 truncate">
                        {item.sku.shadeName || item.sku.sku}
                      </div>
                      <div className="text-xs text-stone-500">
                        {item.sku.structure} &middot;{' '}
                        {item.sku.lengthCm} cm &middot;{' '}
                        {item.saleMode === 'BULK_G'
                          ? `${item.grams}g`
                          : '1 kus'}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-stone-700 shrink-0">
                      {formatPrice(item.lineTotal)}
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Odebrat"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                  <span className="text-base font-semibold text-stone-700">
                    Celkem
                  </span>
                  <span className="text-xl font-bold text-[#722F37]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              Zpět
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={cart.length === 0}
              className="px-6 py-2.5 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Pokračovat k platbě
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 3: Payment */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Payment method */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">
              Způsob platby
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { value: 'hotovost', icon: '💵', label: 'Hotovost' },
                  { value: 'karta', icon: '💳', label: 'Karta' },
                  { value: 'prevod', icon: '🏦', label: 'Převod' },
                ] as const
              ).map((pm) => (
                <button
                  key={pm.value}
                  onClick={() => setPaymentMethod(pm.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    paymentMethod === pm.value
                      ? 'border-[#722F37] bg-[#722F37]/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-2xl">{pm.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      paymentMethod === pm.value
                        ? 'text-[#722F37]'
                        : 'text-stone-600'
                    }`}
                  >
                    {pm.label}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Poznámka{' '}
                <span className="text-stone-400">(volitelné)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none resize-none"
                placeholder="Interní poznámka k prodeji..."
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">
              Shrnutí objednávky
            </h2>

            {/* Customer info */}
            <div className="text-sm text-stone-600 space-y-1">
              <div className="font-medium text-stone-800">Zákazník:</div>
              {customerType === 'anonymous' ? (
                <div>
                  {customer.firstName || customer.lastName
                    ? `${customer.firstName} ${customer.lastName}`.trim()
                    : 'Anonymní zákazník'}
                  {customer.email && (
                    <span className="text-stone-400 ml-2">
                      ({customer.email})
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {customer.companyName && (
                    <div>{customer.companyName}</div>
                  )}
                  {customer.ico && (
                    <div className="text-stone-400">IČO: {customer.ico}</div>
                  )}
                  {customer.firstName && <div>{customer.firstName}</div>}
                  {customer.email && <div>{customer.email}</div>}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-t border-stone-200 pt-3 space-y-2">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span className="text-stone-600">
                    {item.sku.shadeName || item.sku.sku}{' '}
                    <span className="text-stone-400">
                      ({item.saleMode === 'BULK_G'
                        ? `${item.grams}g`
                        : '1 ks'})
                    </span>
                  </span>
                  <span className="font-medium text-stone-800">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-stone-700">
                  Celkem
                </span>
                <span className="text-2xl font-bold text-[#722F37]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="text-xs text-stone-400 text-right mt-1">
                Platba: {paymentLabels[paymentMethod]}
                {paymentMethod !== 'hotovost' &&
                  ' (bude vystavena faktura)'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              Zpět
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className="px-8 py-3 bg-[#722F37] text-white rounded-lg font-bold text-base hover:bg-[#5a252c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Zpracovávám...
                </>
              ) : (
                <>
                  Dokončit prodej{' '}
                  <span className="opacity-80">
                    ({formatPrice(cartTotal)})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
