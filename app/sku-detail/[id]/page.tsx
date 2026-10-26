'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '@/components/ProductReviews';
import LengthSheet, { hairZone } from '@/components/product/LengthSheet';
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

// Ceny zakončení musí odpovídat ASSEMBLY_FEE_CONFIG v lib/stock.ts
const ENDING_OPTIONS = [
  { id: 'NONE', label: 'Bez zakončení', price: 'cop' },
  { id: 'STANDARD_KERATIN', label: 'Keratin', price: '+15 Kč/g' },
  { id: 'MICRO_KERATIN', label: 'Mikrokeratin', price: '+15 Kč/g' },
  { id: 'PASKY_KERATINU', label: 'Keratinové pásky', price: '+15 Kč/g' },
  { id: 'WEFT', label: 'Weft', price: '+60 Kč/g' },
];

const WHATSAPP_NUMBER = '420728722880';

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
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [lengthOpen, setLengthOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

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
      // Výchozí konfigurace: 50 cm, 100 g, bez zakončení (pokud to SKU dovolí)
      if (found.lengthCm) {
        setSelectedLength(found.saleMode === 'BULK_G' && found.lengthCm <= 50 ? 50 : found.lengthCm);
      }
      const bulkMin = found.minOrderG ?? 50;
      const bulkStep = found.stepG ?? 10;
      const bulkDefault = Math.max(bulkMin, Math.min(100, found.availableGrams ?? 100));
      const initialGrams = found.saleMode === 'BULK_G'
        ? bulkMin + Math.floor((bulkDefault - bulkMin) / bulkStep) * bulkStep
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

  // Cena se přepočítá sama při každé změně konfigurace
  const calculateQuote = async () => {
    if (!sku) return;

    setQuoteLoading(true);
    setQuoteError(null);
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
      setQuote(null);
      setQuoteError(err.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (!sku || sku.soldOut || !sku.inStock) return;
    if (sku.saleMode === 'BULK_G' && !selectedGrams) return;
    const t = setTimeout(calculateQuote, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku, selectedEnding, selectedLength, selectedGrams]);

  const handleAddToCart = () => {
    if (!quote || !sku) return;

    {
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
        selectedLength: sku.saleMode === 'BULK_G' ? selectedLength : undefined,
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


  // Length options: from SKU base length (e.g. 45) up to 80cm in 5cm steps
  const lengthOptions: number[] = [];
  for (let l = BULK_MIN_LENGTH; l <= BULK_MAX_LENGTH; l += 5) {
    lengthOptions.push(l);
  }

  const isBulk = sku.saleMode === 'BULK_G';
  const available = sku.inStock && !sku.soldOut;
  const activeIndex = Math.max(0, currentImage ? allImages.indexOf(currentImage) : 0);
  const lengthCm = isBulk ? bulkLengthValue : sku.lengthCm;
  const endingLabel = ENDING_OPTIONS.find((o) => o.id === selectedEnding)?.label ?? '';
  const totalText = quote ? formatPrice(quote.lineGrandTotal) : quoteLoading ? '…' : '—';
  const summaryLine = [lengthCm ? `${lengthCm} cm` : null, `${isBulk ? bulkGramsValue : sku.weightTotalG ?? ''} g`, endingLabel.toLowerCase()]
    .filter(Boolean)
    .join(' · ');
  const waMessage = `Dobrý den, mám zájem o ${sku.name || sku.sku}${sku.shadeName ? ` (${sku.shadeName})` : ''}: ${summaryLine}. Můžete mi ho připravit?`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  const onGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (allImages[i] && allImages[i] !== currentImage) setSelectedImage(allImages[i]);
  };
  const showImage = (i: number) => {
    setSelectedImage(allImages[i]);
    galleryRef.current?.scrollTo({ left: i * galleryRef.current.clientWidth, behavior: 'smooth' });
  };

  const chip = (on: boolean) =>
    `rounded-2xl transition-colors duration-150 ${on ? 'bg-muza-ink text-muza-onink' : 'bg-muza-mocha text-text-dark hover:bg-[#D3C6B9]'}`;

  const cta = available ? (
    <button type="button" onClick={handleAddToCart} disabled={!quote || quoteLoading}
      className="h-[52px] px-6 rounded-full bg-muza-ink text-muza-onink text-sm font-medium whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-50">
      Přidat do košíku
    </button>
  ) : (
    <a href={waLink} target="_blank" rel="noopener"
      className="h-[52px] px-6 rounded-full bg-muza-ink text-muza-onink text-sm font-medium whitespace-nowrap flex items-center justify-center gap-2 hover:opacity-90">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z" /></svg>
      Objednat přes WhatsApp
    </a>
  );

  return (
    <div className="min-h-screen bg-muza-ivory text-text-dark font-light pb-28 lg:pb-0">
      <div className="max-w-6xl mx-auto lg:px-12 lg:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 min-w-0">

          {/* ── Galerie: tenký burgundy rámeček, fotky se dají posouvat prstem ── */}
          <div className="px-4 pt-4 lg:px-0 lg:pt-0 min-w-0">
            <div className="rounded-t-[186px] rounded-b-[20px] border border-muza-ink p-[5px] max-w-[520px] mx-auto">
              {hasImages ? (
                <div ref={galleryRef} onScroll={onGalleryScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-t-[180px] rounded-b-[14px] aspect-[4/5] bg-[#FCF8F4]">
                  {allImages.map((img, idx) => (
                    <button key={img} type="button" onClick={() => { setSelectedImage(img); openLightbox(); }}
                      aria-label={`Zvětšit fotku ${idx + 1} z ${allImages.length}`}
                      className="relative flex-none w-full h-full snap-center cursor-zoom-in">
                      <img src={img} alt={idx === 0 ? (sku.name || 'Produkt') : ''} className="absolute inset-0 w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-t-[180px] rounded-b-[14px] aspect-[4/5] flex items-center justify-center text-[11px] tracking-[0.1em] uppercase text-white/60"
                  style={{ background: sku.shadeHex ? `linear-gradient(135deg, ${sku.shadeHex}55, ${sku.shadeHex}aa)` : 'linear-gradient(135deg, #f5f0eb, #d4c5b9)' }}>
                  Foto připravujeme
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              // miniatury: na mobilu i na webu je vidět, že je tu i fotka zblízka
              <div className="mt-3 flex justify-center gap-2.5">
                {allImages.map((img, idx) => (
                  <button key={img} type="button" onClick={() => showImage(idx)}
                    aria-label={idx === 0 ? 'Fotka z dálky' : idx === 1 ? 'Fotka zblízka' : `Fotka ${idx + 1}`}
                    aria-current={idx === activeIndex ? 'true' : undefined}
                    className={`w-14 h-[72px] lg:w-16 lg:h-20 rounded-lg overflow-hidden border-2 transition-[border-color,opacity] ${idx === activeIndex ? 'border-muza-ink' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Informace a konfigurace ── */}
          <div className="px-4 lg:px-0 min-w-0">
            <div className="mt-5 lg:mt-0">
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-ink">{catInfo.label}</span>
              <h1 className="mt-1.5 font-cormorant font-light text-[40px] lg:text-[48px] leading-[1.02] text-muza-ink">{sku.name || 'Bez názvu'}</h1>
              {sku.shadeName && (
                <p className="mt-2 flex items-center gap-2 text-sm text-text-mid">
                  {sku.shadeHex && <span className="inline-block w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: sku.shadeHex }} />}
                  {sku.shadeName}{sku.structure ? ` · ${sku.structure}` : ''}
                </p>
              )}
              <p className={`mt-3 flex items-center gap-2 text-sm ${available ? 'text-[#2F5E3D]' : 'text-text-mid'}`}>
                <span className={`w-2 h-2 rounded-full ${available ? 'bg-[#2F5E3D]' : 'bg-warning'}`} />
                {available ? 'Skladem, odešleme hned' : 'Momentálně není skladem, připravíme na objednávku'}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-6">
              {/* Délka */}
              {isBulk ? (
                <button type="button" onClick={() => setLengthOpen(true)}
                  className="w-full min-h-[64px] px-4 py-3 rounded-2xl bg-muza-mocha flex items-center justify-between text-left hover:bg-[#D3C6B9] transition-colors">
                  <span>
                    <span className="block font-cormorant text-[22px] leading-tight">Délka</span>
                    <span className="block text-[15px] text-text-mid mt-0.5">{bulkLengthValue} cm · {hairZone(bulkLengthValue)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-muza-ink">
                    Upravit
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6" /></svg>
                  </span>
                </button>
              ) : (
                <div className="px-4 py-3 rounded-2xl bg-muza-mocha">
                  <span className="block font-cormorant text-[22px] leading-tight">Culík</span>
                  <span className="block text-[15px] text-text-mid mt-0.5">
                    {[sku.lengthCm ? `${sku.lengthCm} cm` : null, sku.weightTotalG ? `${sku.weightTotalG} g` : null].filter(Boolean).join(' · ')} · jediný kus
                  </span>
                </div>
              )}

              {/* Zakončení */}
              <fieldset>
                <legend className="mb-2.5 font-cormorant text-[22px] leading-tight">Zakončení</legend>
                <div className="grid grid-cols-2 gap-2">
                  {ENDING_OPTIONS.map((o) => {
                    const on = selectedEnding === o.id;
                    return (
                      <button key={o.id} type="button" aria-pressed={on} onClick={() => setSelectedEnding(o.id)}
                        className={`min-h-[60px] px-2 py-2.5 text-center ${chip(on)}`}>
                        <span className="block text-sm">{o.label}</span>
                        <span className="block text-xs mt-0.5 opacity-80">{o.price}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Gramáž */}
              {isBulk && (
                <fieldset>
                  <legend className="mb-2.5 font-cormorant text-[22px] leading-tight">
                    Gramáž <span className="font-jost text-[13px] text-text-mid">· {bulkMinGrams}–{Math.max(bulkMaxGrams, bulkMinGrams)} g</span>
                  </legend>
                  <div className="h-14 rounded-full bg-muza-mocha flex items-center justify-between">
                    <button type="button" aria-label={`Ubrat ${bulkStepGrams} gramů`} disabled={bulkGramsValue <= bulkMinGrams}
                      onClick={() => setSelectedGrams(Math.max(bulkMinGrams, bulkGramsValue - bulkStepGrams))}
                      className="w-16 h-full text-[22px] text-muza-ink disabled:opacity-30">−</button>
                    <span className="font-cormorant text-[26px]" aria-live="polite">{bulkGramsValue} g</span>
                    <button type="button" aria-label={`Přidat ${bulkStepGrams} gramů`} disabled={bulkGramsValue >= bulkMaxGrams}
                      onClick={() => setSelectedGrams(Math.min(Math.max(bulkMaxGrams, bulkMinGrams), bulkGramsValue + bulkStepGrams))}
                      className="w-16 h-full text-[22px] text-muza-ink disabled:opacity-30">+</button>
                  </div>
                  <p className="mt-2.5 text-[13px] text-text-mid">Na plné prodloužení obvykle stačí 100–150 g.</p>
                </fieldset>
              )}

              {/* Souhrn ceny */}
              <div className="rounded-2xl bg-muza-ink text-muza-onink p-[18px] flex flex-col gap-2 text-sm" aria-live="polite">
                {quote ? (
                  <>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#D8C3BA]">Vlasy · {quote.grams} g × {formatPrice(quote.pricePerGram)}</span>
                      <span>{formatPrice(quote.lineTotal)}</span>
                    </div>
                    {quote.assemblyFeeTotal > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-[#D8C3BA]">{endingLabel} · {quote.grams} g × {formatPrice(quote.assemblyFeeCzk)}</span>
                        <span>{formatPrice(quote.assemblyFeeTotal)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[#D8C3BA]">
                    {!available ? 'Cenu vám potvrdíme ve WhatsAppu.' : quoteError ? quoteError : 'Počítám cenu…'}
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2.5 mt-0.5 border-t border-[rgba(234,220,200,0.3)]">
                  <span className="font-cormorant text-[22px]">Celkem</span>
                  <span className="font-cormorant text-[28px] text-muza-sand">{totalText}</span>
                </div>
              </div>

              {!available && (
                <p className="text-sm leading-relaxed text-text-mid">
                  Tento odstín vám rádi připravíme. Napište nám přes WhatsApp, ozveme se co nejdřív.
                </p>
              )}

              {/* Desktop tlačítko */}
              <div className="hidden lg:flex flex-col">{cta}</div>
            </div>
          </div>
        </div>

        {/* ── Recenze ── */}
        <div className="mt-16 px-4 lg:px-0">
          <ProductReviews skuId={skuId} />
        </div>
      </div>

      {/* ── Mobil: spodní lišta s cenou ── */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-muza-line px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text-mid truncate">{summaryLine}</div>
          <div className="font-cormorant text-[22px] whitespace-nowrap">{totalText}</div>
        </div>
        {cta}
      </div>

      {isBulk && (
        <LengthSheet open={lengthOpen} lengths={lengthOptions} value={bulkLengthValue}
          onChange={setSelectedLength} onClose={() => setLengthOpen(false)} />
      )}

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
