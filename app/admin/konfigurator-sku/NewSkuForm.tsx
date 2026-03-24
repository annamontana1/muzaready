'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAllShades, ShadeInfo } from '@/lib/shades';
import { generateVlasyXName, generateVlasyXSlug } from '@/lib/vlasyx-format';
import { formatPlatinumName, formatPlatinumSlug } from '@/lib/platinum-format';
import ImageUpload from '@/components/admin/ImageUpload';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PriceMatrixEntry {
  id: string;
  category: 'nebarvene' | 'barvene' | 'baby_shades';
  tier: 'standard' | 'luxe' | 'platinum';
  shadeRangeStart: number | null;
  shadeRangeEnd: number | null;
  lengthCm: number;
  pricePerGramCzk: number;
  pricePerGramEur?: number | null;
}

interface ExchangeRateInfo {
  czkToEur: number;
  eurToCzk: number;
  description: string | null;
  lastUpdated: string;
  updatedBy: string | null;
}

type Tier = 'standard' | 'luxe' | 'platinum_edition' | 'baby_shades';
type Category = 'nebarvene' | 'barvene' | 'baby_shades';
type SaleMode = 'BULK_G' | 'PIECE_BY_WEIGHT';
type PriceMode = 'matrix' | 'manual';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHADES = getAllShades();
const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const STRUCTURES = ['rovne', 'mirne_vlnite', 'vlnite', 'kudrnate'] as const;
const STRUCTURE_LABELS: Record<string, string> = {
  rovne: 'Rovne',
  mirne_vlnite: 'Mirne vlnite',
  vlnite: 'Vlnite',
  kudrnate: 'Kudrnate',
};

const CATEGORY_OPTIONS = [
  { value: 'nebarvene' as const, apiValue: 'nebarvene_panenske' },
  { value: 'barvene' as const, apiValue: 'barvene_vlasy' },
  { value: 'baby_shades' as const, apiValue: 'baby_shades' },
];

const TIER_MAP: Record<Tier, string> = {
  standard: 'Standard',
  luxe: 'LUXE',
  platinum_edition: 'PLATINUM_EDITION',
  baby_shades: 'BABY_SHADES',
};

const TIER_BUTTONS: { value: Tier; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'luxe', label: 'Luxe' },
  { value: 'platinum_edition', label: 'Platinum' },
  { value: 'baby_shades', label: 'Baby Shades' },
];

const DEFAULT_RATE = 1 / 25.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getAllowedShadeCodes = (category: Category, tier: Tier): ShadeInfo[] => {
  if (category === 'baby_shades') {
    return SHADES.filter((s) => s.code >= 6 && s.code <= 10);
  }
  if (category === 'barvene') {
    return SHADES.filter((s) => s.code >= 5 && s.code <= 10);
  }
  if (tier === 'standard') {
    return SHADES.filter((s) => s.code >= 1 && s.code <= 4);
  }
  return SHADES.filter((s) => s.code >= 1 && s.code <= 7);
};

const getShadeRange = (category: Category, shade: number) => {
  if (category === 'barvene') return { start: 5, end: 10 };
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
};

const formatCurrency = (value: number, currency: 'CZK' | 'EUR') => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CZK' ? 0 : 2,
  }).format(value);
};

// ---------------------------------------------------------------------------
// Section wrapper with numbered badge
// ---------------------------------------------------------------------------

function Section({
  number,
  title,
  children,
  hidden = false,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold flex items-center justify-center">
          {number}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NewSkuForm() {
  // ---- remote data ----
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateInfo | null>(null);

  // ---- UI state ----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ---- QR modal state (BULK_G creates multiple SKUs, PIECE_BY_WEIGHT creates one) ----
  const [createdSkus, setCreatedSkus] = useState<
    Array<{
      id: string;
      sku: string;
      shortCode: string;
      length: number;
      movementId?: string;
      stock: number;
      skuCode?: string;
      weight?: number;
    }>
  >([]);

  // ---- form fields ----
  const [tier, setTier] = useState<Tier>('standard');
  const [category, setCategory] = useState<Category>('nebarvene');
  const [shade, setShade] = useState(SHADES[0]?.code ?? 1);
  const [shadeName, setShadeName] = useState(SHADES[0]?.name ?? '');
  const [shadeHex, setShadeHex] = useState(SHADES[0]?.hex ?? '#000000');
  const [shadeAuto, setShadeAuto] = useState(true);
  const [structure, setStructure] = useState<string>('rovne');
  const [selectedLengths, setSelectedLengths] = useState<number[]>([]);
  const [stockByLength, setStockByLength] = useState<Record<number, number>>({});
  const [saleMode, setSaleMode] = useState<SaleMode>('BULK_G');
  const [weightTotalG, setWeightTotalG] = useState<number | ''>('');
  const [priceMode, setPriceMode] = useState<PriceMode>('matrix');
  const [manualPricePerGram, setManualPricePerGram] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isListed, setIsListed] = useState(true);

  // ---- derived: is Baby Shades? ----
  const isBabyShades = tier === 'baby_shades';

  // ---- fetch on mount ----
  useEffect(() => {
    fetchMatrix();
    fetchExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMatrix = async () => {
    try {
      const res = await fetch('/api/price-matrix');
      if (!res.ok) throw new Error('Failed');
      const data: PriceMatrixEntry[] = await res.json();
      setPriceMatrix(
        data.map((e) => ({
          ...e,
          pricePerGramCzk: Number(e.pricePerGramCzk),
          pricePerGramEur:
            e.pricePerGramEur != null ? Number(e.pricePerGramEur) : null,
        }))
      );
    } catch {
      setError('Nepodarilo se nacist cenik');
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch('/api/exchange-rate');
      if (!res.ok) { setExchangeRate(null); return; }
      setExchangeRate(await res.json());
    } catch {
      setExchangeRate(null);
    }
  };

  const rate = exchangeRate?.czkToEur ?? DEFAULT_RATE;

  // ---- auto-sync category when tier changes ----
  useEffect(() => {
    if (isBabyShades) {
      setCategory('baby_shades');
    } else if (category === 'baby_shades') {
      setCategory('nebarvene');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  // ---- allowed shades ----
  const allowedShades = useMemo(
    () => getAllowedShadeCodes(category, tier),
    [category, tier]
  );

  // ---- auto-select first shade when allowed shades change ----
  useEffect(() => {
    if (!allowedShades.some((s) => s.code === shade)) {
      const fallback = allowedShades[0];
      if (fallback) {
        setShade(fallback.code);
        setShadeName(fallback.name);
        setShadeHex(fallback.hex);
        setShadeAuto(true);
      }
    }
  }, [allowedShades, shade]);

  // ---- auto-set shade name/hex when shade changes and auto is on ----
  const selectedShadeInfo = allowedShades.find((s) => s.code === shade);

  useEffect(() => {
    if (shadeAuto && selectedShadeInfo) {
      setShadeName(selectedShadeInfo.name);
      setShadeHex(selectedShadeInfo.hex);
    }
  }, [selectedShadeInfo, shadeAuto]);

  // ---- price matrix lookup per length ----
  const lengthPriceMap = useMemo(() => {
    const map: Record<number, number | null> = {};
    const shadeRange = getShadeRange(category, shade);
    // Map tier to matrix tier key
    const matrixTier =
      tier === 'platinum_edition'
        ? 'platinum'
        : tier === 'baby_shades'
        ? 'standard'
        : tier;
    LENGTHS.forEach((len) => {
      const entry = priceMatrix.find(
        (e) =>
          e.category === (category === 'baby_shades' ? 'nebarvene' : category) &&
          e.tier === matrixTier &&
          e.lengthCm === len &&
          e.shadeRangeStart === shadeRange.start &&
          e.shadeRangeEnd === shadeRange.end
      );
      map[len] = entry ? entry.pricePerGramCzk : null;
    });
    return map;
  }, [priceMatrix, category, tier, shade]);

  // ---- lengths missing price ----
  const missingPriceLengths = useMemo(() => {
    if (priceMode !== 'matrix') return [];
    return selectedLengths.filter((len) => lengthPriceMap[len] === null);
  }, [selectedLengths, lengthPriceMap, priceMode]);

  // ---- computed matrix price for single length (PIECE_BY_WEIGHT) ----
  const singleLengthMatrixPrice = useMemo(() => {
    if (selectedLengths.length === 0) return null;
    return lengthPriceMap[selectedLengths[0]] ?? null;
  }, [selectedLengths, lengthPriceMap]);

  // ---- computed price display for matrix mode ----
  const displayMatrixPricePerGram = useMemo(() => {
    if (priceMode !== 'matrix') return null;
    if (saleMode === 'PIECE_BY_WEIGHT') return singleLengthMatrixPrice;
    // For BULK_G show range or single
    const prices = selectedLengths
      .map((len) => lengthPriceMap[len])
      .filter((p): p is number => p !== null);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return min;
    return min; // show lowest
  }, [priceMode, saleMode, selectedLengths, lengthPriceMap, singleLengthMatrixPrice]);

  // ---- total price for PIECE_BY_WEIGHT ----
  const piecePrice = useMemo(() => {
    if (saleMode !== 'PIECE_BY_WEIGHT' || !weightTotalG || selectedLengths.length === 0) return null;
    const ppg =
      priceMode === 'manual'
        ? Number(manualPricePerGram) || null
        : singleLengthMatrixPrice;
    if (!ppg) return null;
    return Number((ppg * Number(weightTotalG)).toFixed(2));
  }, [saleMode, weightTotalG, priceMode, manualPricePerGram, singleLengthMatrixPrice, selectedLengths]);

  // ---- name / slug generation ----
  const generatedName = useMemo(() => {
    if (saleMode === 'PIECE_BY_WEIGHT') {
      return formatPlatinumName(selectedLengths[0], shade, weightTotalG);
    }
    return generateVlasyXName(
      selectedLengths[0] || 0,
      category === 'baby_shades' ? 'nebarvene' : category === 'barvene' ? 'barvene' : 'nebarvene',
      tier === 'standard' || tier === 'luxe' ? tier : 'standard',
      shade,
      100
    );
  }, [saleMode, selectedLengths, shade, weightTotalG, category, tier]);

  const generatedSlug = useMemo(() => {
    if (saleMode === 'PIECE_BY_WEIGHT') {
      return formatPlatinumSlug(selectedLengths[0], shade, weightTotalG);
    }
    return generateVlasyXSlug(
      category === 'baby_shades' ? 'nebarvene' : category === 'barvene' ? 'barvene' : 'nebarvene',
      tier === 'standard' || tier === 'luxe' ? tier : 'standard',
      shade
    );
  }, [saleMode, selectedLengths, shade, weightTotalG, category, tier]);

  // ---- can submit? ----
  const canSubmit = useMemo(() => {
    if (selectedLengths.length === 0) return false;
    if (priceMode === 'manual' && (!manualPricePerGram || Number(manualPricePerGram) <= 0)) return false;
    if (priceMode === 'matrix' && missingPriceLengths.length > 0) return false;
    if (saleMode === 'PIECE_BY_WEIGHT' && (!weightTotalG || Number(weightTotalG) <= 0)) return false;
    return true;
  }, [selectedLengths, priceMode, manualPricePerGram, missingPriceLengths, saleMode, weightTotalG]);

  // ---- toggle length ----
  const toggleLength = (len: number) => {
    setSelectedLengths((prev) => {
      if (prev.includes(len)) return prev.filter((l) => l !== len);
      return [...prev, len].sort((a, b) => a - b);
    });
    setStockByLength((prev) => {
      const next = { ...prev };
      if (next[len] !== undefined) {
        delete next[len];
      } else {
        next[len] = 0;
      }
      return next;
    });
  };

  const handleStockChange = (len: number, val: number) => {
    setStockByLength((prev) => ({ ...prev, [len]: val }));
  };

  // ---- submit ----
  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Zkontroluj vsechna povinna pole.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const categoryApiValue =
        CATEGORY_OPTIONS.find((o) => o.value === category)?.apiValue ?? 'nebarvene_panenske';

      let payload: Record<string, unknown>;

      if (saleMode === 'PIECE_BY_WEIGHT') {
        const ppg =
          priceMode === 'manual'
            ? Number(manualPricePerGram)
            : singleLengthMatrixPrice;

        payload = {
          productType: 'vlasyy',
          category: categoryApiValue,
          tier: TIER_MAP[tier],
          shade: String(shade),
          shadeName,
          shadeHex,
          structure,
          lengthCm: selectedLengths[0],
          weightGrams: Number(weightTotalG),
          priceCzk: piecePrice,
          pricePerGramCzk: ppg,
          usePriceMatrix: priceMode === 'matrix',
          inStock: true,
          isListed,
          listingPriority: 8,
          imageUrl: imageUrl || undefined,
          name: generatedName,
          slug: generatedSlug,
        };
      } else {
        payload = {
          productType: 'vlasyx',
          saleMode: 'BULK_G',
          category: categoryApiValue,
          tier: TIER_MAP[tier],
          shade: String(shade),
          shadeName,
          shadeHex,
          structure,
          selectedLengths,
          stockByLength,
          defaultLength: selectedLengths[0],
          minOrderG: 50,
          stepG: 10,
          defaultGrams: 100,
          usePriceMatrix: priceMode === 'matrix',
          pricePerGramCzk:
            priceMode === 'manual' ? Number(manualPricePerGram) : undefined,
          isListed,
          listingPriority: 8,
          imageUrl: imageUrl || undefined,
          name: generatedName,
        };
      }

      const res = await fetch('/api/admin/skus/create-from-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error(`Chyba serveru (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(result.error || result.details || `Chyba ${res.status}`);
      }

      setSuccess(result.message || 'SKU vytvoreno');

      // Normalize created SKU(s) for QR modal
      if (result.skus && result.skus.length > 0) {
        setCreatedSkus(result.skus);
      } else if (result.skuId) {
        setCreatedSkus([
          {
            id: result.skuId,
            sku: result.skuCode || '',
            shortCode: result.skuCode || '',
            length: selectedLengths[0] || 0,
            movementId: result.movementId,
            stock: Number(weightTotalG) || 0,
            skuCode: result.skuCode,
            weight: result.weight || Number(weightTotalG) || 0,
          },
        ]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Neznama chyba';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ---- close QR modal & reset for next product ----
  const closeQrModal = () => {
    setCreatedSkus([]);
    setSuccess('');
    setSelectedLengths([]);
    setStockByLength({});
    setWeightTotalG('');
  };

  // ---- preview rows for stock table (BULK_G) ----
  const previewRows = selectedLengths.map((len) => {
    const ppg =
      priceMode === 'manual'
        ? Number(manualPricePerGram || 0) || null
        : lengthPriceMap[len];
    return {
      length: len,
      pricePerGram: ppg,
      pricePer100: ppg ? ppg * 100 : null,
      stock: stockByLength[len] || 0,
    };
  });

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Error / Success banners */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && createdSkus.length === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* ================================================================= */}
      {/* QR Code Modal                                                     */}
      {/* ================================================================= */}
      {createdSkus.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    SKU vytvor{createdSkus.length > 1 ? 'eny' : 'eno'}
                  </h2>
                  <p className="text-green-100 mt-1">
                    Stahnete QR kody pro naskladnene polozky
                  </p>
                </div>
                <button
                  onClick={closeQrModal}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdSkus.map((sku) => (
                  <div key={sku.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-center mb-4">
                      <div className="inline-block px-4 py-2 bg-burgundy text-white rounded-lg font-bold text-xl mb-2">
                        {sku.shortCode || sku.skuCode}
                      </div>
                      <div className="font-bold text-lg text-gray-900">{sku.length} cm</div>
                      <div className="text-xs text-gray-400 font-mono">{sku.sku}</div>
                      {(sku.stock > 0 || (sku.weight && sku.weight > 0)) && (
                        <div className="text-sm font-medium text-green-600 mt-1">
                          {sku.stock || sku.weight}g skladem
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    {sku.movementId ? (
                      <>
                        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                          <img
                            src={`/api/admin/stock/qr-code/${sku.movementId}`}
                            alt={`QR kod pro ${sku.shortCode || sku.skuCode}`}
                            className="w-40 h-40"
                          />
                        </div>
                        <a
                          href={`/api/admin/stock/qr-code/${sku.movementId}`}
                          download={`QR-${sku.shortCode || sku.skuCode}.png`}
                          className="w-full px-4 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium inline-flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Stahnout QR
                        </a>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                        <img
                          src={`/api/admin/stock/qr-code/sku/${sku.id}`}
                          alt={`QR kod pro ${sku.shortCode || sku.skuCode}`}
                          className="w-40 h-40"
                        />
                      </div>
                    )}
                    {!sku.movementId && (
                      <a
                        href={`/api/admin/stock/qr-code/sku/${sku.id}`}
                        download={`QR-${sku.shortCode || sku.skuCode}.png`}
                        className="w-full px-4 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium inline-flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Stahnout QR
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Vytvoreno {createdSkus.length} SKU
              </p>
              <button
                onClick={closeQrModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Zavrit a pridat dalsi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* FORM CARD                                                         */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl shadow p-6 space-y-8">
        <h2 className="text-xl font-bold text-gray-900">Novy SKU</h2>

        {/* -------------------------------------------------------------- */}
        {/* 1. Kvalita (linie)                                              */}
        {/* -------------------------------------------------------------- */}
        <Section number={1} title="Kvalita (linie)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIER_BUTTONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTier(t.value)}
                className={`px-4 py-4 rounded-xl border-2 text-sm font-bold transition ${
                  tier === t.value
                    ? 'border-burgundy bg-burgundy/10 text-burgundy'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 2. Typ (hidden for Baby Shades)                                 */}
        {/* -------------------------------------------------------------- */}
        <Section number={2} title="Typ" hidden={isBabyShades}>
          <div className="flex gap-3">
            {(['nebarvene', 'barvene'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold transition ${
                  category === cat
                    ? 'border-burgundy bg-burgundy/10 text-burgundy'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {cat === 'nebarvene' ? 'Nebarvene' : 'Barvene'}
              </button>
            ))}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 3. Odstin                                                       */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 2 : 3} title="Odstin">
          <div className="flex flex-wrap gap-2">
            {allowedShades.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  setShade(s.code);
                  setShadeAuto(true);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  shade === s.code
                    ? 'border-burgundy bg-burgundy/10 text-burgundy'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: s.hex }}
                />
                #{s.code} {s.name}
              </button>
            ))}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 4. Struktura                                                    */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 3 : 4} title="Struktura">
          <select
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
          >
            {STRUCTURES.map((s) => (
              <option key={s} value={s}>
                {STRUCTURE_LABELS[s]}
              </option>
            ))}
          </select>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 5. Delka                                                        */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 4 : 5} title="Delka">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {LENGTHS.map((len) => {
              const selected = selectedLengths.includes(len);
              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => toggleLength(len)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    selected
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {len} cm
                </button>
              );
            })}
          </div>
          {selectedLengths.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Vybrano: {selectedLengths.map((l) => `${l} cm`).join(', ')}
            </p>
          )}
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 6. Zpusob prodeje                                               */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 5 : 6} title="Zpusob prodeje">
          <div className="flex gap-3">
            {([
              { value: 'BULK_G' as const, label: 'Na gramy' },
              { value: 'PIECE_BY_WEIGHT' as const, label: 'Cely culik' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSaleMode(opt.value)}
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold transition ${
                  saleMode === opt.value
                    ? 'border-burgundy bg-burgundy/10 text-burgundy'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 7. Gramaz skladem                                               */}
        {/* -------------------------------------------------------------- */}
        {selectedLengths.length > 0 && (
          <Section number={isBabyShades ? 6 : 7} title="Gramaz skladem">
            {saleMode === 'PIECE_BY_WEIGHT' ? (
              <div>
                <label className="block text-sm text-gray-700 mb-1">Vaha culiku (g)</label>
                <input
                  type="number"
                  min={0}
                  value={weightTotalG}
                  onChange={(e) =>
                    setWeightTotalG(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="Zadejte vahu celeho culiku v gramech"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                />
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Delka</th>
                      <th className="px-4 py-2 text-left font-medium">Skladem (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row.length} className="border-t">
                        <td className="px-4 py-2 font-medium text-gray-900">{row.length} cm</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            value={row.stock}
                            onChange={(e) => handleStockChange(row.length, Number(e.target.value))}
                            className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {/* -------------------------------------------------------------- */}
        {/* 8. Cena                                                         */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 7 : 8} title="Cena">
          <div className="space-y-3">
            {/* Option A: Z ceniku */}
            <label
              className={`block p-4 border-2 rounded-xl cursor-pointer transition ${
                priceMode === 'matrix'
                  ? 'border-burgundy bg-burgundy/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={priceMode === 'matrix'}
                onChange={() => setPriceMode('matrix')}
              />
              <div className="font-semibold text-gray-900">Z ceniku (auto)</div>
              <p className="text-sm text-gray-500 mt-0.5">
                Pouzije cenu za 1g z cenikove matice.
              </p>
              {displayMatrixPricePerGram !== null && (
                <div className="mt-2 text-lg font-bold text-burgundy">
                  {formatCurrency(displayMatrixPricePerGram * 100, 'CZK')} / 100g
                </div>
              )}
              {saleMode === 'PIECE_BY_WEIGHT' && piecePrice !== null && priceMode === 'matrix' && (
                <div className="text-sm text-gray-600 mt-1">
                  Celkem za kus: {formatCurrency(piecePrice, 'CZK')}
                  {' '}({formatCurrency(piecePrice * rate, 'EUR')})
                </div>
              )}
            </label>

            {/* Option B: Vlastni cena */}
            <label
              className={`block p-4 border-2 rounded-xl cursor-pointer transition ${
                priceMode === 'manual'
                  ? 'border-burgundy bg-burgundy/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={priceMode === 'manual'}
                onChange={() => setPriceMode('manual')}
              />
              <div className="font-semibold text-gray-900">Vlastni cena</div>
              <p className="text-sm text-gray-500 mt-0.5">
                Zadej cenu za 1 gram v Kc.
              </p>
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="Kc/g"
                value={manualPricePerGram}
                disabled={priceMode !== 'manual'}
                onChange={(e) => setManualPricePerGram(e.target.value)}
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {priceMode === 'manual' && manualPricePerGram && Number(manualPricePerGram) > 0 && (
                <div className="mt-2 text-lg font-bold text-burgundy">
                  {formatCurrency(Number(manualPricePerGram) * 100, 'CZK')} / 100g
                </div>
              )}
            </label>
          </div>

          {priceMode === 'matrix' && missingPriceLengths.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mt-2">
              Chybi ceny v ceniku pro delky: {missingPriceLengths.join(', ')} cm.
              Pouzij vlastni cenu nebo doplnte cenik.
            </div>
          )}
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 9. Obrazek                                                      */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 8 : 9} title="Obrazek (volitelne)">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            folder="skus"
          />
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* 10. Publikovat v katalogu                                       */}
        {/* -------------------------------------------------------------- */}
        <Section number={isBabyShades ? 9 : 10} title="Publikovat v katalogu">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isListed}
              onChange={(e) => setIsListed(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-burgundy focus:ring-burgundy"
            />
            <span className="text-sm text-gray-700">
              Zobrazit produkt v katalogu
            </span>
          </label>
        </Section>

        {/* -------------------------------------------------------------- */}
        {/* Submit                                                          */}
        {/* -------------------------------------------------------------- */}
        <div className="pt-4 border-t border-gray-100">
          {/* Preview name */}
          {generatedName && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Nahled nazvu</div>
              <div className="text-sm font-medium text-gray-800">{generatedName}</div>
            </div>
          )}

          {!canSubmit && selectedLengths.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              Pred vytvorenim SKU dokoncete vsechna povinna pole.
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full px-6 py-4 bg-burgundy text-white rounded-xl font-bold text-base hover:bg-maroon disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Ukladam...' : 'Vytvorit SKU'}
          </button>
        </div>
      </div>
    </div>
  );
}
