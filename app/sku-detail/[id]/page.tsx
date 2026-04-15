'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '@/components/ProductReviews';
import { useSkuCart } from '@/contexts/SkuCartContext';

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
  { id: 'TAPES', label: 'Tapes', price: '40 Kč/g' },
];

function getCategoryInfo(category: Sku['customerCategory']) {
  switch (category) {
    case 'PLATINUM_EDITION':
      return { label: 'Platinum Edition', bg: 'rgba(180,140,30,0.1)', color: '#7a5c00' };
    case 'LUXE':
      return { label: 'Luxe', bg: 'rgba(74,21,32,0.08)', color: 'var(--burgundy)' };
    case 'BABY_SHADES':
      return { label: 'Baby Shades', bg: 'rgba(100,60,130,0.08)', color: '#6b3d8a' };
    default:
      return { label: 'Standard', bg: 'rgba(30,80,140,0.08)', color: '#1e508c' };
  }
}

export default function SkuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;
  const { addToCart } = useSkuCart();

  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPos, setLightboxPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const openLightbox = () => { setLightboxOpen(true); setLightboxZoom(1); setLightboxPos({ x: 0, y: 0 }); };
  const closeLightbox = () => { setLightboxOpen(false); setLightboxZoom(1); setLightboxPos({ x: 0, y: 0 }); };

  const handleLightboxWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setLightboxZoom(z => Math.min(5, Math.max(1, z - e.deltaY * 0.005)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lightboxZoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: lightboxPos.x, py: lightboxPos.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    setLightboxPos({ x: dragStart.current.px + e.clientX - dragStart.current.x, y: dragStart.current.py + e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => { setIsDragging(false); dragStart.current = null; };

  // Touch pinch-to-zoom
  const lastDist = useRef<number | null>(null);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (lastDist.current !== null) {
        setLightboxZoom(z => Math.min(5, Math.max(1, z * (d / lastDist.current!))));
      }
      lastDist.current = d;
    }
  }, []);
  const handleTouchEnd = () => { lastDist.current = null; };

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
        setSelectedLength(found.lengthCm); // start at the SKU's actual base length
      }
      const initialGrams = found.saleMode === 'BULK_G'
        ? (found.minOrderG ?? 50)
        : (found.weightTotalG ?? found.availableGrams ?? 0);
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

  const handleAddToCart = () => {
    if (!quote || !sku) {
      alert('Nejdřív klikni "Spočítat cenu"');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        skuId: sku.id,
        skuName: sku.name || sku.sku,
        customerCategory: sku.customerCategory,
        saleMode: sku.saleMode,
        shade: sku.shade || undefined,
        grams: quote.grams,
        pricePerGram: quote.pricePerGram,
        lineTotal: quote.lineTotal,
        ending: selectedEnding,
        assemblyFeeType: quote.assemblyFeeType,
        assemblyFeeCzk: quote.assemblyFeeCzk,
        assemblyFeeTotal: quote.assemblyFeeTotal,
        lineGrandTotal: quote.lineGrandTotal,
        quantity: 1,
      });
    }
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
      <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
          <div className="flex items-center justify-center py-40">
            <div className="flex flex-col items-center gap-5">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--burgundy)', borderRightColor: 'transparent' }}
              />
              <p
                className="text-[12px] tracking-[0.1em] uppercase font-light"
                style={{ color: 'var(--text-soft)' }}
              >
                Načítám produkt…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
          <div
            className="rounded-sm border p-10 text-center max-w-lg mx-auto mt-20"
            style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}
          >
            <p
              className="font-cormorant font-light text-[22px] mb-4"
              style={{ color: 'var(--text-dark)' }}
            >
              {error || 'SKU nenalezeno'}
            </p>
            <Link
              href="/katalog"
              className="text-[11px] tracking-[0.12em] uppercase font-light inline-flex items-center gap-2 transition-colors"
              style={{ color: 'var(--text-soft)' }}
            >
              ← Zpět na katalog
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

  // Min length = SKU base length (e.g. 45cm), max = 80cm, step = 5cm
  const BULK_MIN_LENGTH = sku.lengthCm ?? 45;
  const BULK_MAX_LENGTH = 80;
  const bulkMinGrams = sku.saleMode === 'BULK_G' ? (sku.minOrderG ?? 50) : 0;
  const bulkMaxGrams = sku.saleMode === 'BULK_G' ? (sku.availableGrams ?? Math.max(bulkMinGrams, 0)) : 0;
  const bulkStepGrams = sku.saleMode === 'BULK_G' ? (sku.stepG ?? 10) : 1;
  const bulkLengthValue = Math.min(Math.max(selectedLength, BULK_MIN_LENGTH), BULK_MAX_LENGTH);
  const bulkGramsValue = sku.saleMode === 'BULK_G'
    ? Math.min(Math.max(selectedGrams || bulkMinGrams, bulkMinGrams), Math.max(bulkMaxGrams, bulkMinGrams))
    : selectedGrams;

  const catInfo = getCategoryInfo(sku.customerCategory);

  // Build gram options for BULK_G scroll
  const gramOptions: number[] = [];
  if (sku.saleMode === 'BULK_G') {
    for (let g = bulkMinGrams; g <= Math.max(bulkMaxGrams, bulkMinGrams); g += bulkStepGrams) {
      gramOptions.push(g);
    }
  }
  const displayedGramOptions = gramOptions;

  // Length options: from SKU base length (e.g. 45) up to 80cm in 5cm steps
  const lengthOptions: number[] = [];
  for (let l = BULK_MIN_LENGTH; l <= BULK_MAX_LENGTH; l += 5) {
    lengthOptions.push(l);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4 md:py-8">

        {/* ── Breadcrumb ── */}
        <nav className="mb-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-light transition-colors"
            style={{ color: 'var(--text-soft)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Zpět
          </button>
        </nav>

        {/* ── Mobile: image + quick info side by side ── */}
        {/* ── Desktop: two-column full layout ── */}
        <div className="grid lg:grid-cols-[1fr_480px] gap-8 md:gap-12 lg:gap-16 min-w-0">

          {/* ═════════════════════════════════════════
              LEFT COLUMN: Image Gallery
          ═════════════════════════════════════════ */}
          <div className="space-y-3 min-w-0">

            {/* Main image */}
            <div
              className="relative w-full rounded-sm overflow-hidden border h-[100vw] max-h-[85vh] md:h-auto md:max-h-none md:aspect-[3/4] group"
              style={{ background: 'var(--white)', borderColor: 'var(--beige)', cursor: currentImage ? 'zoom-in' : 'default' }}
              onClick={() => currentImage && openLightbox()}
            >
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={sku.name || 'Produkt'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: 'rgba(0,0,0,0.15)' }}>
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l2 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 8v6M8 11h6" />
                    </svg>
                  </div>
                </>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{
                    background: sku.shadeHex
                      ? `linear-gradient(135deg, ${sku.shadeHex}33, ${sku.shadeHex}66, ${sku.shadeHex}99)`
                      : 'linear-gradient(135deg, #f5f0eb, #e8ddd4, #d4c5b9)',
                  }}
                >
                  <svg
                    className="w-12 h-12 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-[11px] tracking-[0.1em] uppercase font-light"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    Foto není k dispozici
                  </span>
                </div>
              )}

              {/* Stock badge overlay */}
              {sku.inStock && !sku.soldOut && (
                <div
                  className="absolute top-4 left-4 text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-sm font-normal"
                  style={{ background: 'rgba(34,120,60,0.9)', color: '#fff' }}
                >
                  Skladem
                </div>
              )}
              {sku.soldOut && (
                <div
                  className="absolute top-4 left-4 text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-sm font-normal"
                  style={{ background: 'rgba(100,100,100,0.85)', color: '#fff' }}
                >
                  Vyprodáno
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className="relative w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden transition-all"
                    style={
                      currentImage === img
                        ? { outline: '2px solid var(--burgundy)', outlineOffset: '2px' }
                        : { border: '1px solid var(--beige-mid)' }
                    }
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

          {/* ═════════════════════════════════════════
              RIGHT COLUMN: Product Info + Config
          ═════════════════════════════════════════ */}
          <div className="space-y-6 min-w-0">

            {/* ── Product info ── */}
            <div>
              {/* Category badge */}
              <div className="mb-4">
                <span
                  className="inline-block text-[10px] tracking-[0.18em] uppercase font-normal px-3 py-1.5 rounded-sm"
                  style={{ background: catInfo.bg, color: catInfo.color }}
                >
                  {catInfo.label}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-cormorant font-light leading-[1.1] mb-2"
                style={{ fontSize: 'clamp(26px,4vw,44px)', color: 'var(--text-dark)' }}
              >
                {sku.name || 'Bez názvu'}
              </h1>

              {/* SKU number */}
              <p
                className="text-[10px] tracking-[0.15em] uppercase mb-6"
                style={{ color: 'var(--text-soft)' }}
              >
                SKU: {sku.sku}
              </p>

              {/* Key details card */}
              <div
                className="rounded-sm border"
                style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}
              >
                {sku.shadeName && (
                  <div className="flex justify-between items-center py-3 px-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                    <span
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      Odstín
                    </span>
                    <span
                      className="text-[14px] font-normal flex items-center gap-2"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {sku.shadeHex && (
                        <span
                          className="inline-block w-4 h-4 rounded-full border"
                          style={{ backgroundColor: sku.shadeHex, borderColor: 'var(--beige-mid)' }}
                        />
                      )}
                      {sku.shadeName}{sku.shade ? ` · #${sku.shade}` : ''}
                    </span>
                  </div>
                )}
                {sku.lengthCm && (
                  <div className="flex justify-between items-center py-3 px-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                    <span
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      Délka
                    </span>
                    <span className="text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>
                      {sku.lengthCm} cm
                    </span>
                  </div>
                )}
                {sku.structure && (
                  <div className="flex justify-between items-center py-3 px-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                    <span
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      Struktura
                    </span>
                    <span className="text-[14px] font-normal capitalize" style={{ color: 'var(--text-dark)' }}>
                      {sku.structure}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 px-5">
                  <span
                    className="text-[11px] tracking-[0.1em] uppercase"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    Cena za gram
                  </span>
                  <span
                    className="font-cormorant font-light text-[22px]"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    {formatPrice(sku.pricePerGramCzk)}/g
                  </span>
                </div>
              </div>

              {/* Stock status */}
              {sku.inStock && !sku.soldOut && (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: '#22783c' }}
                  />
                  <span className="text-[12px] font-light" style={{ color: '#22783c' }}>
                    {sku.saleMode === 'PIECE_BY_WEIGHT'
                      ? `Skladem (${sku.weightTotalG}g)`
                      : `Skladem (${sku.availableGrams}g)`}
                  </span>
                </div>
              )}
            </div>

            {/* ── Configuration card ── */}
            <div
              className="rounded-sm border p-6 min-w-0"
              style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}
            >
              {/* Section label + heading */}
              <div className="mb-6">
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mb-2 font-normal"
                  style={{ color: 'var(--accent)' }}
                >
                  Konfigurace
                </div>
                <h2
                  className="font-cormorant font-light text-[24px] leading-none"
                  style={{ color: 'var(--text-dark)' }}
                >
                  Přizpůsobte si produkt
                </h2>
              </div>

              {/* ── Ending selection ── */}
              <div className="mb-7">
                <div
                  className="text-[10px] tracking-[0.18em] uppercase mb-3 font-normal flex items-center justify-between"
                  style={{ color: 'var(--text-soft)' }}
                >
                  <span>Zakončení</span>
                  <span className="text-[12px] tracking-[0.05em] normal-case font-light" style={{ color: 'var(--burgundy)' }}>
                    {ENDING_OPTIONS.find(o => o.id === selectedEnding)?.label}
                  </span>
                </div>
                <div className="overflow-x-auto pb-2 max-w-full">
                  <div className="flex gap-2 w-max">
                    {ENDING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedEnding(option.id)}
                        className="flex-shrink-0 px-4 py-2.5 rounded-sm transition-all text-left"
                        style={
                          selectedEnding === option.id
                            ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                            : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                        }
                        onMouseEnter={e => { if (selectedEnding !== option.id) e.currentTarget.style.borderColor = 'var(--burgundy)'; }}
                        onMouseLeave={e => { if (selectedEnding !== option.id) e.currentTarget.style.borderColor = 'var(--beige-mid)'; }}
                      >
                        <span className="block text-[11px] tracking-[0.08em] uppercase font-normal whitespace-nowrap">{option.label}</span>
                        <span className="block text-[10px] mt-0.5 font-light whitespace-nowrap" style={{ opacity: 0.7 }}>{option.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── BULK_G selectors ── */}
              {sku.saleMode === 'BULK_G' && (
                <div className="mb-7 space-y-6">

                  {/* Length selector */}
                  <div>
                    <div
                      className="text-[10px] tracking-[0.18em] uppercase mb-3 font-normal flex items-center justify-between"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      <span>Délka</span>
                      <span
                        className="text-[12px] tracking-[0.05em] normal-case font-light"
                        style={{ color: 'var(--burgundy)' }}
                      >
                        {bulkLengthValue} cm
                      </span>
                    </div>
                    <div className="overflow-x-auto pb-2">
                      <div className="flex gap-2 w-max">
                        {lengthOptions.map((len) => (
                          <button
                            key={len}
                            onClick={() => setSelectedLength(len)}
                            className="text-[11px] tracking-[0.08em] px-4 py-2.5 rounded-sm font-light transition-all flex-shrink-0"
                            style={
                              bulkLengthValue === len
                                ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                                : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                            }
                            onMouseEnter={e => {
                              if (bulkLengthValue !== len) e.currentTarget.style.borderColor = 'var(--burgundy)';
                            }}
                            onMouseLeave={e => {
                              if (bulkLengthValue !== len) e.currentTarget.style.borderColor = 'var(--beige-mid)';
                            }}
                          >
                            {len} cm
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grams selector */}
                  <div>
                    <div
                      className="text-[10px] tracking-[0.18em] uppercase mb-3 font-normal flex items-center justify-between"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      <span>Gramáž</span>
                      <span
                        className="text-[12px] tracking-[0.05em] normal-case font-light"
                        style={{ color: 'var(--burgundy)' }}
                      >
                        {bulkGramsValue} g
                      </span>
                    </div>
                    {displayedGramOptions.length > 0 ? (
                      <div className="overflow-x-auto pb-2">
                        <div className="flex gap-2 w-max">
                          {displayedGramOptions.map((g) => (
                            <button
                              key={g}
                              onClick={() => setSelectedGrams(g)}
                              className="text-[11px] tracking-[0.08em] px-4 py-2.5 rounded-sm font-light transition-all flex-shrink-0"
                              style={
                                bulkGramsValue === g
                                  ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                                  : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                              }
                              onMouseEnter={e => {
                                if (bulkGramsValue !== g) e.currentTarget.style.borderColor = 'var(--burgundy)';
                              }}
                              onMouseLeave={e => {
                                if (bulkGramsValue !== g) e.currentTarget.style.borderColor = 'var(--beige-mid)';
                              }}
                            >
                              {g} g
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p
                        className="text-[12px] font-light"
                        style={{ color: 'var(--text-soft)' }}
                      >
                        Dostupnost: {bulkMinGrams}–{Math.max(bulkMaxGrams, bulkMinGrams)} g (krok {bulkStepGrams} g)
                      </p>
                    )}
                    <p
                      className="text-[10px] tracking-[0.05em] font-light mt-2"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      Min. objednávka {bulkMinGrams} g · krok {bulkStepGrams} g{!sku.minOrderG && ' (výchozí nastavení)'}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Calculate button ── */}
              <button
                onClick={calculateQuote}
                disabled={
                  quoteLoading ||
                  (sku.saleMode === 'BULK_G' && (!selectedGrams || selectedGrams < (sku.minOrderG || 50)))
                }
                className="w-full py-4 rounded-sm text-[12px] tracking-[0.14em] uppercase font-normal transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                {quoteLoading ? 'Počítám…' : 'Spočítat cenu'}
              </button>
            </div>

            {/* ── Price quote card ── */}
            {quote && (
              <div
                className="rounded-sm p-6 space-y-5"
                style={{ background: 'var(--white)', border: '2px solid var(--burgundy)' }}
              >
                {/* Heading */}
                <div>
                  <div
                    className="text-[10px] tracking-[0.2em] uppercase mb-1.5 font-normal"
                    style={{ color: 'var(--accent)' }}
                  >
                    Cenový rozpis
                  </div>
                  <h3
                    className="font-cormorant font-light text-[22px] leading-none"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Kalkulace ceny
                  </h3>
                </div>

                {/* Line items */}
                <div className="space-y-0">
                  <div
                    className="flex justify-between items-center py-3 border-b"
                    style={{ borderColor: 'var(--beige)' }}
                  >
                    <span
                      className="text-[11px] tracking-[0.05em] font-light"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      Vlasy — {quote.grams}g × {formatPrice(quote.pricePerGram)}/g
                    </span>
                    <span className="text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>
                      {formatPrice(quote.lineTotal)}
                    </span>
                  </div>

                  {quote.assemblyFeeTotal > 0 && (
                    <div
                      className="flex justify-between items-center py-3 border-b"
                      style={{ borderColor: 'var(--beige)' }}
                    >
                      <span
                        className="text-[11px] tracking-[0.05em] font-light"
                        style={{ color: 'var(--text-soft)' }}
                      >
                        Zakončení — {quote.assemblyFeeType}
                      </span>
                      <span className="text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>
                        {formatPrice(quote.assemblyFeeTotal)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-4">
                    <span
                      className="text-[11px] tracking-[0.08em] uppercase font-normal"
                      style={{ color: 'var(--text-mid)' }}
                    >
                      Celkem za 1 ks
                    </span>
                    <span
                      className="font-cormorant font-light text-[32px] leading-none"
                      style={{ color: 'var(--burgundy)' }}
                    >
                      {formatPrice(quote.lineGrandTotal)}
                    </span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--beige)' }}>
                  <div
                    className="text-[10px] tracking-[0.18em] uppercase mb-3 font-normal"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    Počet kusů
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-sm flex items-center justify-center text-[16px] font-light transition-all"
                      style={{ border: '1px solid var(--beige-mid)', color: 'var(--text-mid)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--burgundy)';
                        e.currentTarget.style.color = 'var(--burgundy)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--beige-mid)';
                        e.currentTarget.style.color = 'var(--text-mid)';
                      }}
                    >
                      −
                    </button>
                    <span
                      className="font-cormorant font-light text-[24px] min-w-[2.5rem] text-center"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-sm flex items-center justify-center text-[16px] font-light transition-all"
                      style={{ border: '1px solid var(--beige-mid)', color: 'var(--text-mid)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--burgundy)';
                        e.currentTarget.style.color = 'var(--burgundy)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--beige-mid)';
                        e.currentTarget.style.color = 'var(--text-mid)';
                      }}
                    >
                      +
                    </button>
                  </div>

                  {quantity > 1 && (
                    <div className="mt-4 flex justify-between items-end">
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase font-light"
                        style={{ color: 'var(--text-soft)' }}
                      >
                        Celkem za {quantity} ks
                      </span>
                      <span
                        className="font-cormorant font-light text-[28px] leading-none"
                        style={{ color: 'var(--burgundy)' }}
                      >
                        {formatPrice(quote.lineGrandTotal * quantity)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-sm text-[12px] tracking-[0.14em] uppercase font-normal transition-all hover:-translate-y-px mt-1"
                  style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                >
                  Přidat do košíku{quantity > 1 ? ` (${quantity} ks)` : ''}
                </button>
              </div>
            )}

            {/* ── How it works ── */}
            <div
              className="rounded-sm p-6"
              style={{ background: 'var(--beige)', border: '1px solid var(--beige-mid)' }}
            >
              <div
                className="text-[10px] tracking-[0.2em] uppercase mb-2 font-normal"
                style={{ color: 'var(--accent)' }}
              >
                Průvodce nákupem
              </div>
              <h4
                className="font-cormorant font-light text-[20px] mb-4 leading-none"
                style={{ color: 'var(--text-dark)' }}
              >
                Jak to funguje
              </h4>
              <ul className="space-y-2.5">
                {[
                  'Vyber typ zakončení',
                  ...(sku.saleMode === 'BULK_G' ? ['Nastav požadovanou délku a počet gramů'] : []),
                  'Klikni „Spočítat cenu" pro přesný cenový rozpis',
                  'Vyber počet kusů a přidej do košíku',
                  'Jdi do košíku a dokonči nákup',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="font-cormorant text-[16px] font-light flex-shrink-0 mt-px"
                      style={{ color: 'var(--burgundy)' }}
                    >
                      ✦
                    </span>
                    <span
                      className="text-[13px] font-light leading-[1.5]"
                      style={{ color: 'var(--text-mid)' }}
                    >
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Reviews section ── */}
        <div className="mt-20">
          <ProductReviews skuId={skuId} />
        </div>

      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            aria-label="Zavřít"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            <button
              onClick={() => setLightboxZoom(z => Math.max(1, z - 0.5))}
              className="w-9 h-9 flex items-center justify-center rounded-sm text-white text-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >−</button>
            <span className="text-white text-[12px] tracking-[0.1em] font-light min-w-[3rem] text-center">
              {Math.round(lightboxZoom * 100)}%
            </span>
            <button
              onClick={() => setLightboxZoom(z => Math.min(5, z + 0.5))}
              className="w-9 h-9 flex items-center justify-center rounded-sm text-white text-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >+</button>
            <button
              onClick={() => { setLightboxZoom(1); setLightboxPos({ x: 0, y: 0 }); }}
              className="ml-2 px-3 h-9 flex items-center justify-center rounded-sm text-[11px] tracking-[0.1em] uppercase font-light transition-all"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >Reset</button>
          </div>

          {/* Hint */}
          {lightboxZoom === 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.1em] font-light pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Scrolluj nebo pinch pro přiblížení
            </div>
          )}

          {/* Image */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleLightboxWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: lightboxZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <img
              src={currentImage}
              alt={sku.name || 'Produkt'}
              draggable={false}
              style={{
                transform: `scale(${lightboxZoom}) translate(${lightboxPos.x / lightboxZoom}px, ${lightboxPos.y / lightboxZoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease',
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />
          </div>

          {/* Thumbnail strip if multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedImage(img); setLightboxZoom(1); setLightboxPos({ x: 0, y: 0 }); }}
                  className="w-12 h-14 flex-shrink-0 rounded-sm overflow-hidden transition-all"
                  style={currentImage === img
                    ? { outline: '2px solid var(--ivory)', outlineOffset: '2px' }
                    : { opacity: 0.5 }
                  }
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
