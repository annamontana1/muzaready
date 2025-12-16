'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '@/components/ProductReviews';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  shade: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  structure: string | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  pricePerGramCzk: number;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  inStock: boolean;
  soldOut: boolean;
}

interface QuoteItem {
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  assemblyFeeType: string;
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;
}

const ENDING_OPTIONS = [
  { id: 'NONE', label: 'Bez zakončení', emoji: '-' },
  { id: 'KERATIN', label: 'Keratin (5 Kč/g)', emoji: '✨' },
  { id: 'PASKY', label: 'Pásky (200 Kč)', emoji: '🎀' },
  { id: 'TRESSY', label: 'Tressy (150 Kč)', emoji: '💎' },
];

export default function SkuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;

  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration state
  const [selectedEnding, setSelectedEnding] = useState('NONE');
  const [selectedLength, setSelectedLength] = useState<number>(45);
  const [selectedGrams, setSelectedGrams] = useState<number>(0);
  const [quote, setQuote] = useState<QuoteItem | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchSku();
  }, [skuId]);

  const fetchSku = async () => {
    try {
      const res = await fetch(`/api/sku/public/${skuId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('SKU nenalezeno');
        throw new Error('Failed to fetch SKU');
      }
      const found: Sku = await res.json();
      setSku(found);
      if (found.lengthCm) {
        setSelectedLength(Math.min(Math.max(found.lengthCm, 40), 80));
      }
      const initialGrams = found.saleMode === 'BULK_G'
        ? found.minOrderG ?? found.availableGrams ?? 0
        : found.weightTotalG ?? found.availableGrams ?? 0;
      if (initialGrams) {
        setSelectedGrams(initialGrams);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateQuote = async () => {
    if (!sku) return;

    setQuoteLoading(true);
    try {
      const lines = [
        {
          skuId: sku.id,
          wantedGrams: sku.saleMode === 'BULK_G' ? selectedGrams : undefined,
          ending: selectedEnding,
          selectedLength,
        },
      ];

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Chyba při kalkulaci ceny');
      }

      const data = await res.json();
      setQuote(data.items[0]);
    } catch (err: any) {
      alert(`Chyba: ${err.message}`);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!quote) {
      alert('Nejdřív klikni "Spočítat cenu"');
      return;
    }

    // Store in localStorage with timestamp to detect stale prices
    const cart = JSON.parse(localStorage.getItem('sku-cart') || '[]');
    const timestamp = new Date().getTime();
    for (let i = 0; i < quantity; i++) {
      cart.push({
        skuId: sku!.id,
        skuName: sku!.name,
        customerCategory: sku!.customerCategory,
        saleMode: sku!.saleMode,
        grams: quote.grams,
        pricePerGram: quote.pricePerGram,
        lineTotal: quote.lineTotal,
        ending: selectedEnding,
        assemblyFeeType: quote.assemblyFeeType,
        assemblyFeeCzk: quote.assemblyFeeCzk,
        assemblyFeeTotal: quote.assemblyFeeTotal,
        lineGrandTotal: quote.lineGrandTotal,
        addedAt: timestamp, // Store when item was added
      });
    }
    localStorage.setItem('sku-cart', JSON.stringify(cart));
    router.push('/sku-kosik');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-gray-600">Načítám...</p>
        </div>
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium">{error || 'SKU nenalezeno'}</p>
            <Link href="/katalog" className="mt-4 inline-block text-burgundy hover:text-maroon">
              ← Zpět na katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const BULK_MIN_LENGTH = 40;
  const BULK_MAX_LENGTH = 80;
  const bulkMinGrams = sku.saleMode === 'BULK_G' ? (sku.minOrderG ?? 0) : 0;
  const bulkMaxGrams = sku.saleMode === 'BULK_G' ? (sku.availableGrams ?? Math.max(bulkMinGrams, 0)) : 0;
  const bulkStepGrams = sku.saleMode === 'BULK_G' ? (sku.stepG ?? 5) : 1;
  const bulkLengthValue = Math.min(Math.max(selectedLength, BULK_MIN_LENGTH), BULK_MAX_LENGTH);
  const bulkGramsValue = sku.saleMode === 'BULK_G'
    ? Math.min(Math.max(selectedGrams || bulkMinGrams, bulkMinGrams), Math.max(bulkMaxGrams, bulkMinGrams))
    : selectedGrams;


  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/katalog" className="text-burgundy hover:text-maroon flex items-center gap-1">
            ← Zpět na katalog
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-burgundy mb-2">{sku.name || 'Bez názvu'}</h1>
              <p className="text-sm text-gray-500 mb-4">SKU: {sku.sku}</p>

              {/* Category Badge */}
              <div className="mb-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    sku.customerCategory === 'PLATINUM_EDITION'
                      ? 'bg-yellow-100 text-yellow-800'
                      : sku.customerCategory === 'LUXE'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {sku.customerCategory === 'PLATINUM_EDITION'
                    ? '✨ Platinum Edition'
                    : sku.customerCategory === 'LUXE'
                    ? '💎 Luxe'
                    : '⭐ Standard'}
                </span>
              </div>

              {/* Product Details */}
              <div className="space-y-3 text-gray-700">
                {sku.shadeName && (
                  <div className="flex justify-between">
                    <span className="font-medium">Odstín:</span>
                    <span>{sku.shadeName}</span>
                  </div>
                )}
                {sku.lengthCm && (
                  <div className="flex justify-between">
                    <span className="font-medium">Délka:</span>
                    <span>{sku.lengthCm} cm</span>
                  </div>
                )}
                {sku.structure && (
                  <div className="flex justify-between">
                    <span className="font-medium">Struktura:</span>
                    <span className="capitalize">{sku.structure}</span>
                  </div>
                )}
                {/* Struktura label - zobrazit také jako badge */}
                {sku.structure && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                      Struktura: {sku.structure}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Typ prodeje:</span>
                  <span>{sku.saleMode === 'PIECE_BY_WEIGHT' ? 'Culík' : 'Gramy'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cena za 1g:</span>
                  <span className="text-lg font-bold text-burgundy">{formatPrice(sku.pricePerGramCzk)}</span>
                </div>
              </div>

              {/* Stock Info */}
              {sku.saleMode === 'PIECE_BY_WEIGHT' ? (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-bold">Váha kusu:</span> {sku.weightTotalG}g
                  </p>
                  <p className="text-xs text-green-700 mt-2">✓ Na skladě - připraveno k odeslání</p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-bold">Na skladě:</span> {sku.availableGrams}g
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Minimální objednávka: {sku.minOrderG}g, krok: {sku.stepG}g
                  </p>
                  <p className="text-xs text-green-700 mt-2">✓ Připraveno k odeslání</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Configuration & Quote */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-burgundy mb-6">Konfigurace</h2>

              {/* Ending Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Zakončení vlasů
                </label>
                <div className="space-y-2">
                  {ENDING_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedEnding(option.id)}
                      className={`w-full p-3 rounded-lg text-left transition border-2 ${
                        selectedEnding === option.id
                          ? 'bg-burgundy text-white border-burgundy'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-burgundy'
                      }`}
                    >
                      <span className="text-lg mr-2">{option.emoji}</span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grams Selection (for BULK_G only) */}
              {sku.saleMode === 'BULK_G' && (
                <div className="mb-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Délka (cm)</label>
                    <input
                      type="range"
                      min={BULK_MIN_LENGTH}
                      max={BULK_MAX_LENGTH}
                      step={1}
                      value={bulkLengthValue}
                      onChange={(e) => setSelectedLength(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-burgundy"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{BULK_MIN_LENGTH} cm</span>
                      <span>{BULK_MAX_LENGTH} cm</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-right font-medium">Délka: {bulkLengthValue} cm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Kolik gramů?</label>
                    <input
                      type="range"
                      min={bulkMinGrams}
                      max={Math.max(bulkMaxGrams, bulkMinGrams || bulkStepGrams)}
                      step={bulkStepGrams}
                      value={bulkGramsValue}
                      onChange={(e) => setSelectedGrams(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-burgundy disabled:opacity-50"
                      disabled={!bulkMaxGrams}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{bulkMinGrams} g</span>
                      <span>{Math.max(bulkMaxGrams, bulkMinGrams || bulkStepGrams)} g</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-right font-medium">Gramáž: {bulkGramsValue} g</p>
                    <p className="text-xs text-gray-500 mt-1">Rozsah {bulkMinGrams}–{Math.max(bulkMaxGrams, bulkMinGrams || bulkStepGrams)} g · krok {bulkStepGrams} g</p>
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={calculateQuote}
                disabled={
                  quoteLoading ||
                  (sku.saleMode === 'BULK_G' && (!selectedGrams || selectedGrams < (sku.minOrderG || 0)))
                }
                className="w-full bg-burgundy text-white py-3 rounded-lg font-semibold hover:bg-maroon transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {quoteLoading ? '⏳ Počítám...' : '💰 Spočítat cenu'}
              </button>

              {/* Quote Display */}
              {quote && (
                <div className="bg-gradient-to-r from-burgundy/10 to-maroon/10 border-2 border-burgundy rounded-lg p-4 space-y-3">
                  <h3 className="font-bold text-burgundy">Cenový rozpis:</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Vlasy ({quote.grams}g × {formatPrice(quote.pricePerGram)}):</span>
                      <span className="font-medium">{formatPrice(quote.lineTotal)}</span>
                    </div>

                    {quote.assemblyFeeTotal > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Zakončení ({quote.assemblyFeeType}):</span>
                        <span className="font-medium">{formatPrice(quote.assemblyFeeTotal)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t-2 border-burgundy flex justify-between">
                      <span className="font-bold">Celkem za 1 ks:</span>
                      <span className="text-2xl font-bold text-burgundy">{formatPrice(quote.lineGrandTotal)}</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="pt-3 border-t border-burgundy/30">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Počet kusů:</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 border border-burgundy rounded text-burgundy hover:bg-burgundy/10"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 border border-burgundy rounded text-burgundy hover:bg-burgundy/10"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-3 text-right">
                      <p className="text-sm text-gray-600">Celkem:</p>
                      <p className="text-3xl font-bold text-burgundy">
                        {formatPrice(quote.lineGrandTotal * quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 bg-burgundy text-white py-3 rounded-lg font-semibold hover:bg-maroon transition shadow-lg"
                  >
                    🛒 Přidat do košíku ({quantity} ks)
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">ℹ️ Jak to funguje:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Vyber typ zakončení (KERATIN, PÁSKY, TRESSY)</li>
                {sku.saleMode === 'BULK_G' && <li>Zadej počet gramů</li>}
                <li>Klikni "Spočítat cenu" pro přesný cenový rozpis</li>
                <li>Vyber počet kusů a přidej do košíku</li>
                <li>Jdi do košíku a dokončи nákup</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <ProductReviews skuId={skuId} />
        </div>
      </div>
    </div>
  );
}
