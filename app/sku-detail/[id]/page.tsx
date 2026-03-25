'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '@/components/ProductReviews';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | 'BABY_SHADES' | null;
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
  imageUrl: string | null;
  images: string[];
  shadeHex: string | null;
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
  { id: 'NONE', label: 'Bez zakončení', price: '0 Kč' },
  { id: 'MICRO_KERATIN', label: 'Mikrokeratin', price: '10 Kč/g' },
  { id: 'STANDARD_KERATIN', label: 'Standart keratin', price: '10 Kč/g' },
  { id: 'PASKY_KERATINU', label: 'Pásky keratinu', price: '10 Kč/g' },
  { id: 'WEFT', label: 'Weft', price: '50 Kč/g' },
  { id: 'TAPES', label: 'Tapes', price: '50 Kč/g' },
];

function getCategoryBadge(category: Sku['customerCategory']) {
  switch (category) {
    case 'PLATINUM_EDITION':
      return { label: 'Platinum Edition', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'LUXE':
      return { label: 'Luxe', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    case 'BABY_SHADES':
      return { label: 'Baby Shades', bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-200' };
    default:
      return { label: 'Standard', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' };
  }
}

export default function SkuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;

  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      // Set initial selected image
      if (found.imageUrl) {
        setSelectedImage(found.imageUrl);
      } else if (found.images && found.images.length > 0) {
        setSelectedImage(found.images[0]);
      }
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
        throw new Error(err.error || 'Chyba pri kalkulaci ceny');
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
    // SkuCartContext stores { version, items, savedAt }, not a plain array
    const raw = JSON.parse(localStorage.getItem('sku-cart') || '{"version":2,"items":[]}');
    const cartItems: any[] = Array.isArray(raw) ? raw : (raw.items || []);
    const timestamp = new Date().getTime();
    for (let i = 0; i < quantity; i++) {
      cartItems.push({
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
        quantity: 1,
        addedAt: timestamp,
      });
    }
    localStorage.setItem('sku-cart', JSON.stringify({
      version: 2,
      items: cartItems,
      savedAt: new Date().toISOString(),
    }));
    router.push('/kosik');
  };

  const formatPrice = (price: number, forceDecimals = false) => {
    // Show decimals if price has them (e.g. 89.9) or if forced
    const hasDecimals = price % 1 !== 0;
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: hasDecimals || forceDecimals ? 1 : 0,
      maximumFractionDigits: hasDecimals || forceDecimals ? 1 : 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center py-32">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-burgundy/30 border-t-burgundy animate-spin" />
              <p className="text-gray-500 font-playfair">Nacitam produkt...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
            <p className="text-red-800 font-medium text-lg mb-4">{error || 'SKU nenalezeno'}</p>
            <Link href="/katalog" className="inline-flex items-center gap-2 text-burgundy hover:text-maroon font-medium transition">
              <span>&larr;</span> Zpět na katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Build the image list: main image first, then additional images
  const allImages: string[] = [];
  if (sku.imageUrl) allImages.push(sku.imageUrl);
  if (sku.images && sku.images.length > 0) {
    sku.images.forEach((img) => {
      if (img !== sku.imageUrl) allImages.push(img);
    });
  }
  const hasImages = allImages.length > 0;
  const currentImage = selectedImage || (hasImages ? allImages[0] : null);

  const BULK_MIN_LENGTH = 40;
  const BULK_MAX_LENGTH = 80;
  const bulkMinGrams = sku.saleMode === 'BULK_G' ? (sku.minOrderG ?? 0) : 0;
  const bulkMaxGrams = sku.saleMode === 'BULK_G' ? (sku.availableGrams ?? Math.max(bulkMinGrams, 0)) : 0;
  const bulkStepGrams = sku.saleMode === 'BULK_G' ? (sku.stepG ?? 5) : 1;
  const bulkLengthValue = Math.min(Math.max(selectedLength, BULK_MIN_LENGTH), BULK_MAX_LENGTH);
  const bulkGramsValue = sku.saleMode === 'BULK_G'
    ? Math.min(Math.max(selectedGrams || bulkMinGrams, bulkMinGrams), Math.max(bulkMaxGrams, bulkMinGrams))
    : selectedGrams;

  const badge = getCategoryBadge(sku.customerCategory);

  return (
    <div className="min-h-screen bg-soft-cream">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-burgundy hover:text-maroon transition font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zpět na katalog
          </Link>
        </nav>

        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10">

          {/* ===== LEFT COLUMN: Image Gallery ===== */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-warm-beige shadow-sm">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={sku.name || 'Produkt'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{
                    background: sku.shadeHex
                      ? `linear-gradient(135deg, ${sku.shadeHex}33, ${sku.shadeHex}66, ${sku.shadeHex}99)`
                      : 'linear-gradient(135deg, #f5f0eb, #e8ddd4, #d4c5b9)',
                  }}
                >
                  <svg className="w-16 h-16 text-white/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/50 text-sm font-medium">Foto není k dispozici</span>
                </div>
              )}

              {/* Stock badge overlay */}
              {sku.inStock && !sku.soldOut && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Skladem
                </div>
              )}
              {sku.soldOut && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Vyprodáno
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === img
                        ? 'border-burgundy shadow-md ring-2 ring-burgundy/20'
                        : 'border-warm-beige hover:border-burgundy/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${sku.name || 'Produkt'} - foto ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN: Product Info + Configuration ===== */}
          <div className="space-y-6">

            {/* Product info card */}
            <div>
              {/* Category badge */}
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                  {badge.label}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-burgundy mb-2">
                {sku.name || 'Bez nazvu'}
              </h1>
              <p className="text-sm text-gray-400 mb-6">SKU: {sku.sku}</p>

              {/* Key details */}
              <div className="bg-white rounded-xl border border-warm-beige p-5 space-y-4">
                {sku.shadeName && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Odstín</span>
                    <span className="flex items-center gap-2 font-medium text-gray-800">
                      {sku.shadeHex && (
                        <span
                          className="inline-block w-5 h-5 rounded-full border border-gray-200 shadow-inner"
                          style={{ backgroundColor: sku.shadeHex }}
                        />
                      )}
                      {sku.shadeName}
                    </span>
                  </div>
                )}
                {sku.lengthCm && (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-gray-500 text-sm">Délka</span>
                    <span className="font-medium text-gray-800">{sku.lengthCm} cm</span>
                  </div>
                )}
                {sku.structure && (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-gray-500 text-sm">Struktura</span>
                    <span className="font-medium text-gray-800 capitalize">{sku.structure}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-gray-500 text-sm">Cena za gram</span>
                  <span className="text-lg font-bold text-burgundy">{formatPrice(sku.pricePerGramCzk)}/g</span>
                </div>
              </div>

              {/* Stock status */}
              {sku.inStock && !sku.soldOut && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700 font-medium">
                    {sku.saleMode === 'PIECE_BY_WEIGHT'
                      ? `Skladem (${sku.weightTotalG}g)`
                      : `Skladem (${sku.availableGrams}g)`}
                  </span>
                </div>
              )}
            </div>

            {/* Configuration section */}
            <div className="bg-white rounded-xl border border-warm-beige p-6">
              <h2 className="font-playfair text-xl font-bold text-burgundy mb-5">Konfigurace</h2>

              {/* Ending Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Zakončení
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {ENDING_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedEnding(option.id)}
                      className={`p-3 rounded-xl text-left transition-all border-2 ${
                        selectedEnding === option.id
                          ? 'bg-burgundy text-white border-burgundy shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-burgundy/50'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className={`block text-xs mt-0.5 ${selectedEnding === option.id ? 'text-white/70' : 'text-gray-400'}`}>{option.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* BULK_G sliders */}
              {sku.saleMode === 'BULK_G' && (
                <div className="mb-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Délka: <span className="text-burgundy">{bulkLengthValue} cm</span>
                    </label>
                    <input
                      type="range"
                      min={BULK_MIN_LENGTH}
                      max={BULK_MAX_LENGTH}
                      step={1}
                      value={bulkLengthValue}
                      onChange={(e) => setSelectedLength(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-burgundy"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{BULK_MIN_LENGTH} cm</span>
                      <span>{BULK_MAX_LENGTH} cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gramaz: <span className="text-burgundy">{bulkGramsValue} g</span>
                    </label>
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
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{bulkMinGrams} g</span>
                      <span>{Math.max(bulkMaxGrams, bulkMinGrams || bulkStepGrams)} g</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Min. objednavka {bulkMinGrams} g, krok {bulkStepGrams} g
                    </p>
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
                className="w-full bg-burgundy text-white py-3.5 rounded-xl font-semibold hover:bg-maroon transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quoteLoading ? 'Počítám...' : 'Spočítat cenu'}
              </button>
            </div>

            {/* Price Quote */}
            {quote && (
              <div className="bg-white rounded-xl border-2 border-burgundy p-6 space-y-4">
                <h3 className="font-playfair text-lg font-bold text-burgundy">Cenový rozpis</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vlasy ({quote.grams}g x {formatPrice(quote.pricePerGram)}/g)</span>
                    <span className="font-medium">{formatPrice(quote.lineTotal)}</span>
                  </div>

                  {quote.assemblyFeeTotal > 0 && (
                    <div className="flex justify-between items-center text-amber-700">
                      <span>Zakončení ({quote.assemblyFeeType})</span>
                      <span className="font-medium">{formatPrice(quote.assemblyFeeTotal)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t-2 border-burgundy/20 flex justify-between items-end">
                    <span className="font-semibold text-gray-800">Celkem za 1 ks</span>
                    <span className="text-2xl font-bold text-burgundy">{formatPrice(quote.lineGrandTotal)}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-sm font-medium text-gray-600 block mb-3">Pocet kusu</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center border-2 border-burgundy rounded-lg text-burgundy hover:bg-burgundy/5 transition font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border-2 border-burgundy rounded-lg text-burgundy hover:bg-burgundy/5 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  {quantity > 1 && (
                    <div className="mt-3 text-right">
                      <p className="text-xs text-gray-400">Celkem za {quantity} ks</p>
                      <p className="text-3xl font-bold text-burgundy">
                        {formatPrice(quote.lineGrandTotal * quantity)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full mt-2 bg-burgundy text-white py-4 rounded-xl font-bold text-lg hover:bg-maroon transition shadow-lg hover:shadow-xl"
                >
                  Přidat do košíku {quantity > 1 ? `(${quantity} ks)` : ''}
                </button>
              </div>
            )}

            {/* How it works */}
            <div className="bg-burgundy/5 rounded-xl p-5 text-sm text-gray-600">
              <p className="font-semibold text-burgundy mb-2">Jak to funguje</p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs leading-relaxed">
                <li>Vyber typ zakončení</li>
                {sku.saleMode === 'BULK_G' && <li>Nastav požadovanou délku a počet gramů</li>}
                <li>Klikni &quot;Spočítat cenu&quot; pro přesný cenový rozpis</li>
                <li>Vyber počet kusů a přidej do košíku</li>
                <li>Jdi do košíku a dokonči nákup</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <ProductReviews skuId={skuId} />
        </div>
      </div>
    </div>
  );
}
