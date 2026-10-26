'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '@/components/ProductReviews';
import LengthSheet, { hairZone } from '@/components/product/LengthSheet';
import PieceAbout from '@/components/product/PieceAbout';
import AddedSheet from '@/components/product/AddedSheet';
import SimilarPieces from '@/components/product/SimilarPieces';
import { useSkuCart } from '@/contexts/SkuCartContext';
import { GRAM_STEP, PIECE_DEFAULT_GRAMS, PIECE_DEFAULT_LENGTH, PIECE_LENGTHS, PIECE_MAX_GRAMS, PIECE_MIN_GRAMS, pieceGramOptions, pieceGramsLeft, soldByGrams } from '@/lib/sale-rule';

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
  isDyed?: boolean; // barvené = středoevropské, nebarvené = panenské
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
    case 'STANDARD':
      return { label: 'Standard', bg: 'rgba(30,80,140,0.08)', color: '#1e508c' };
    default:
      return { label: '', bg: 'transparent', color: 'inherit' }; // kus bez kategorie
  }
}

export default function SkuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.id as string;
  const { addToCart, getTotalPrice } = useSkuCart();

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
  const [addedOpen, setAddedOpen] = useState(false);

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
      if (found.saleMode === 'PIECE_BY_WEIGHT' && soldByGrams(found)) {
        // kus po gramech: délku vybírá zákaznice (30–90 cm), výchozí délka kusu nebo 50 cm
        setSelectedLength(found.lengthCm && PIECE_LENGTHS.includes(found.lengthCm) ? found.lengthCm : PIECE_DEFAULT_LENGTH);
      } else if (found.lengthCm) {
        setSelectedLength(found.saleMode === 'BULK_G' && found.lengthCm <= 50 ? 50 : found.lengthCm);
      }
      const bulkMin = found.minOrderG ?? 50;
      const bulkStep = found.stepG ?? 10;
      const bulkDefault = Math.max(bulkMin, Math.min(100, found.availableGrams ?? 100));
      const initialGrams = found.saleMode === 'BULK_G'
        ? bulkMin + Math.floor((bulkDefault - bulkMin) / bulkStep) * bulkStep
        : (soldByGrams(found) ? PIECE_DEFAULT_GRAMS : pieceGramsLeft(found));
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
          // culík mimo Baby Shades se prodává po gramech (lib/sale-rule.ts)
          wantedGrams: soldByGrams(sku) ? selectedGrams : undefined,
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
        selectedLength: sku.saleMode === 'BULK_G' || soldByGrams(sku) ? selectedLength : undefined,
        imageUrl: sku.imageUrl || sku.images?.[0] || undefined,
      });
    }
    // Místo přechodu do košíku vyjede okno „Přidáno do košíku“ (návrh B3)
    setAddedOpen(true);
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
  // Kus: po gramech (délka 30–90 cm, 50–300 g po 10 g), nebo Baby Shades vždy celý culík
  const pieceByGrams = !isBulk && soldByGrams(sku);
  const pieceLeft = pieceGramsLeft(sku);
  const pieceSteps = pieceGramOptions();
  const pieceIdx = Math.max(0, pieceSteps.indexOf(selectedGrams || PIECE_DEFAULT_GRAMS));
  const available = sku.inStock && !sku.soldOut;
  const activeIndex = Math.max(0, currentImage ? allImages.indexOf(currentImage) : 0);
  const lengthCm = isBulk ? bulkLengthValue : pieceByGrams ? selectedLength : sku.lengthCm;
  const endingLabel = ENDING_OPTIONS.find((o) => o.id === selectedEnding)?.label ?? '';
  // Cena za gram vlasů (bez zakončení) vedle tlačítka Do košíku, dobře čitelná
  const perGramText = quote && quote.grams > 0 ? `${formatPrice(quote.pricePerGram)} / g` : '';
  const totalText = quote ? formatPrice(quote.lineGrandTotal) : quoteLoading ? '…' : '—';
  const summaryLine = [lengthCm ? `${lengthCm} cm` : null, `${isBulk ? bulkGramsValue : pieceByGrams ? selectedGrams : sku.weightTotalG ?? ''} g`, endingLabel.toLowerCase()]
    .filter(Boolean)
    .join(' · ');
  const waMessage = `Dobrý den, mám zájem o ${sku.name || sku.sku}${sku.shadeName ? ` (${sku.shadeName})` : ''}: ${summaryLine}. Můžete mi ho připravit?`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  // Název jen číslo culíku („Culík C04“), podrobnosti jsou v tabulce pod ním
  const title = (sku.name || 'Bez názvu').split(' · ')[0];
  const druh = typeof sku.isDyed === 'boolean' ? (sku.isDyed ? 'Středoevropské' : 'Panenské') : null;
  const categoryText = [druh, catInfo.label].filter(Boolean).join(' · ');
  const lengthVal = isBulk ? bulkLengthValue : selectedLength;
  const gramsValue = isBulk ? bulkGramsValue : pieceSteps[pieceIdx];
  const gramStep = isBulk ? bulkStepGrams : GRAM_STEP;
  const gramRange = isBulk ? `${bulkMinGrams}–${Math.max(bulkMaxGrams, bulkMinGrams)} g` : `${PIECE_MIN_GRAMS}–${PIECE_MAX_GRAMS} g`;
  const canDec = isBulk ? bulkGramsValue > bulkMinGrams : pieceIdx > 0;
  const canInc = isBulk ? bulkGramsValue < bulkMaxGrams : pieceIdx < pieceSteps.length - 1;
  const decGrams = () => setSelectedGrams(isBulk ? Math.max(bulkMinGrams, bulkGramsValue - bulkStepGrams) : pieceSteps[Math.max(0, pieceIdx - 1)]);
  const incGrams = () => setSelectedGrams(isBulk ? Math.min(Math.max(bulkMaxGrams, bulkMinGrams), bulkGramsValue + bulkStepGrams) : pieceSteps[Math.min(pieceSteps.length - 1, pieceIdx + 1)]);

  const showImage = (i: number) => {
    setSelectedImage(allImages[i]);
  };

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

          {/* ── Galerie: tenký burgundy rámeček; jedna pevná fotka (žádné tažení prstem,
               které při posouvání stránky hýbalo fotkou), přepíná se miniaturami pod ní ── */}
          <div className="px-4 pt-4 lg:px-0 lg:pt-0 min-w-0">
            <div className="rounded-t-[186px] rounded-b-[20px] border border-muza-ink p-[5px] max-w-[520px] mx-auto">
              {hasImages ? (
                <button type="button" onClick={openLightbox}
                  aria-label={`Zvětšit fotku ${activeIndex + 1} z ${allImages.length}`}
                  className="relative block w-full overflow-hidden rounded-t-[180px] rounded-b-[14px] aspect-[4/5] bg-[#FCF8F4] cursor-zoom-in">
                  <img src={currentImage || allImages[0]} alt={sku.name || 'Produkt'} draggable={false}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
                </button>
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
              <h1 className="font-cormorant font-normal [font-variant-numeric:lining-nums] text-[40px] lg:text-[48px] leading-[1.02] text-muza-ink">{title}</h1>
              {/* Údaje jako tabulka (návrh B): kategorie, odstín, struktura */}
              <dl className="mt-3.5">
                {[
                  categoryText ? { k: 'Kategorie', v: <>{categoryText}</> } : null,
                  sku.shade || sku.shadeName ? { k: 'Odstín', v: <>{sku.shade ? <b className="font-semibold">{sku.shade}</b> : null}{sku.shade && sku.shadeName ? ' · ' : ''}{sku.shadeName}</> } : null,
                  sku.structure ? { k: 'Struktura', v: <>{sku.structure}</> } : null,
                ].filter((r): r is { k: string; v: JSX.Element } => r !== null).map((r) => (
                  <div key={r.k} className="flex items-center justify-between gap-3 py-3 border-t border-muza-line last:border-b">
                    <dt className="text-sm font-normal text-[#45302F]">{r.k}</dt>
                    <dd className="text-[15px] font-normal text-text-dark text-right">{r.v}</dd>
                  </div>
                ))}
              </dl>
              <p className={`mt-3 flex items-center gap-2 text-sm ${available ? 'text-[#2F5E3D]' : 'text-text-mid'}`}>
                <span className={`w-2 h-2 rounded-full ${available ? 'bg-[#2F5E3D]' : 'bg-warning'}`} />
                {available ? 'Skladem, odešleme hned' : 'Momentálně není skladem, připravíme na objednávku'}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-6">
              {/* Délka a gramáž vedle sebe (návrh B3); postava se ukáže až po klepnutí na Změnit */}
              {isBulk || pieceByGrams ? (
                <div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button type="button" onClick={() => setLengthOpen(true)} aria-label={`Délka ${lengthVal} cm, ${hairZone(lengthVal)}. Změnit`}
                      className="rounded-2xl border border-muza-ink p-3.5 flex flex-col text-left hover:bg-white/40 transition-colors">
                      <span className="text-sm font-normal text-[#45302F]">Délka</span>
                      <span className="mt-2.5 leading-none whitespace-nowrap">
                          <span className="font-jost font-semibold text-[32px] text-muza-ink tabular-nums">{lengthVal}</span>
                          <span className="text-[15px] text-muza-ink"> cm</span>
                      </span>
                      <span className="mt-1 text-xs text-[#45302F]">{hairZone(lengthVal)}</span>
                      <span className="mt-auto pt-2 text-xs text-muza-ink underline underline-offset-2">změnit</span>
                    </button>
                    <div className="rounded-2xl border border-muza-ink p-3.5 flex flex-col">
                      <span className="flex items-baseline justify-between gap-1">
                        <span className="text-sm font-normal text-[#45302F]">Gramáž</span>
                        <span className="text-[11px] text-text-mid whitespace-nowrap">{gramRange}</span>
                      </span>
                      <span className="mt-2.5 leading-none whitespace-nowrap" aria-live="polite">
                        <span className="font-jost font-semibold text-[32px] text-muza-ink tabular-nums">{gramsValue}</span>
                        <span className="text-[15px] text-muza-ink"> g</span>
                      </span>
                      <span className="mt-auto pt-3 flex gap-2">
                        <button type="button" aria-label={`Ubrat ${gramStep} gramů`} disabled={!canDec} onClick={decGrams}
                          className="w-9 h-9 rounded-full border border-muza-ink text-lg leading-none text-muza-ink disabled:opacity-30">−</button>
                        <button type="button" aria-label={`Přidat ${gramStep} gramů`} disabled={!canInc} onClick={incGrams}
                          className="w-9 h-9 rounded-full border border-muza-ink text-lg leading-none text-muza-ink disabled:opacity-30">+</button>
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[13px] text-text-mid">Na plné prodloužení obvykle stačí 100–150 g.</p>
                </div>
              ) : (
                sku.lengthCm ? (
                  // Baby Shades: celý culík s pevnou délkou; silueta ukáže, kam sahá
                  <button type="button" onClick={() => setLengthOpen(true)}
                    className="w-full min-h-[64px] px-4 py-3 rounded-2xl bg-muza-mocha flex items-center justify-between text-left hover:bg-[#D3C6B9] transition-colors">
                    <span>
                      <span className="block font-cormorant text-[22px] leading-tight">Culík</span>
                      <span className="block text-[15px] text-text-mid mt-0.5">
                        {sku.lengthCm} cm · {hairZone(sku.lengthCm)}{pieceLeft ? ` · ${pieceLeft} g` : ''} · celý culík
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] text-muza-ink whitespace-nowrap">
                      Kam sahá
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6" /></svg>
                    </span>
                  </button>
                ) : (
                  <div className="px-4 py-3 rounded-2xl bg-muza-mocha">
                    <span className="block font-cormorant text-[22px] leading-tight">Culík</span>
                    <span className="block text-[15px] text-text-mid mt-0.5">
                      {pieceLeft ? `${pieceLeft} g · ` : ''}celý culík
                    </span>
                  </div>
                )
              )}

              {/* Zakončení jako seznam s kolečky (návrh B3) */}
              <fieldset>
                <legend className="mb-1.5 font-cormorant text-[24px] leading-tight text-muza-ink">Zakončení</legend>
                <div role="radiogroup" aria-label="Zakončení" className="border-t border-muza-line">
                  {ENDING_OPTIONS.map((o) => {
                    const on = selectedEnding === o.id;
                    return (
                      <button key={o.id} type="button" role="radio" aria-checked={on} onClick={() => setSelectedEnding(o.id)}
                        className="w-full flex items-center justify-between gap-3 py-3.5 px-0.5 border-b border-muza-line text-left">
                        <span className="flex items-center gap-3">
                          <span aria-hidden="true" className={`w-5 h-5 flex-none rounded-full transition-[border-width] duration-150 ${on ? 'border-[6px] border-muza-ink' : 'border-[1.5px] border-[#8C7A74]'}`} />
                          <span className="text-[15px] font-normal text-text-dark">{o.label}</span>
                        </span>
                        <span className="text-[13px] text-[#45302F]">{o.price}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Rozpis ceny: jen tichý přehled, hlavní součet je dole u tlačítka Do košíku */}
              <div className="-mt-2 flex flex-col gap-1.5 text-[13px] text-text-mid" aria-live="polite">
                {quote ? (
                  <>
                    <div className="flex justify-between gap-3">
                      <span>Vlasy · {quote.grams} g × {formatPrice(quote.pricePerGram)}</span>
                      <span className="tabular-nums">{formatPrice(quote.lineTotal)}</span>
                    </div>
                    {quote.assemblyFeeTotal > 0 && (
                      <div className="flex justify-between gap-3">
                        <span>{endingLabel} · {quote.grams} g × {formatPrice(quote.assemblyFeeCzk)}</span>
                        <span className="tabular-nums">{formatPrice(quote.assemblyFeeTotal)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div>{!available ? 'Cenu vám potvrdíme ve WhatsAppu.' : quoteError ? quoteError : 'Počítám cenu…'}</div>
                )}
              </div>

              {!available && (
                <p className="text-sm leading-relaxed text-text-mid">
                  Tento odstín vám rádi připravíme. Napište nám přes WhatsApp, ozveme se co nejdřív.
                </p>
              )}

              <PieceAbout lengthCm={lengthCm} grams={isBulk ? bulkGramsValue : pieceByGrams ? selectedGrams : sku.weightTotalG}
                endingId={selectedEnding} endingLabel={endingLabel} isDyed={sku.isDyed} tierLabel={catInfo.label}
                shade={sku.shade} shadeName={sku.shadeName} structure={sku.structure} />

              {/* Desktop: hlavní součet u tlačítka */}
              <div className="hidden lg:flex flex-col gap-3 rounded-2xl border border-muza-ink p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-text-mid">{summaryLine}{perGramText && <span className="block mt-1 text-[16px] font-normal text-muza-ink">{perGramText}</span>}</span>
                  <span className="font-jost font-semibold text-[30px] leading-none text-muza-ink whitespace-nowrap tabular-nums">{totalText}</span>
                </div>
                {cta}
              </div>

              {!isBulk && <SimilarPieces id={sku.id} shade={sku.shade} isDyed={sku.isDyed} tierLabel={catInfo.label} />}
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
          <div className="text-[11px] text-text-mid truncate">{summaryLine}</div>
          {perGramText && <div className="text-[15px] font-normal text-muza-ink whitespace-nowrap">{perGramText}</div>}
          <div className="font-jost font-semibold text-[26px] leading-none mt-1 text-muza-ink whitespace-nowrap tabular-nums">{totalText}</div>
        </div>
        {cta}
      </div>

      {isBulk && (
        <LengthSheet open={lengthOpen} lengths={lengthOptions} value={bulkLengthValue}
          onChange={setSelectedLength} onClose={() => setLengthOpen(false)} />
      )}
      {pieceByGrams && (
        <LengthSheet open={lengthOpen} lengths={PIECE_LENGTHS} value={selectedLength}
          onChange={setSelectedLength} onClose={() => setLengthOpen(false)} />
      )}
      {!isBulk && !pieceByGrams && sku.lengthCm ? (
        // Baby Shades: jediná délka, silueta jen ukazuje, kam vlasy sahají
        <LengthSheet open={lengthOpen} lengths={[sku.lengthCm]} value={sku.lengthCm}
          onChange={() => {}} onClose={() => setLengthOpen(false)} />
      ) : null}

      <AddedSheet open={addedOpen} onClose={() => setAddedOpen(false)} onGoCart={() => router.push('/kosik')}
        imageUrl={allImages[0]} title={title} shade={sku.shade} shadeName={sku.shadeName}
        rows={[
          ...(lengthCm ? [{ k: 'Délka', v: <><b className="font-semibold">{lengthCm}</b> cm · {hairZone(lengthCm)}</> }] : []),
          { k: 'Gramáž', v: <><b className="font-semibold">{quote?.grams ?? ''}</b> g{!isBulk && !pieceByGrams ? ' · celý culík' : ''}</> },
          { k: 'Zakončení', v: <>{endingLabel}</> },
        ]}
        cartTotal={formatPrice(getTotalPrice())} />

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
