'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAllShades, ShadeInfo } from '@/lib/shades';
import { formatPlatinumName, formatPlatinumSlug } from '@/lib/platinum-format';
import ImageUpload from '@/components/admin/ImageUpload';

interface PriceMatrixEntry {
  id: string;
  category: 'nebarvene' | 'barvene';
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

const SHADES = getAllShades();

const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

const STRUCTURES = ['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'];

const CATEGORY_OPTIONS = [
  { value: 'nebarvene', label: 'Nebarvené panenské vlasy', apiValue: 'nebarvene_panenske' },
  { value: 'barvene', label: 'Barvené vlasy', apiValue: 'barvene_vlasy' },
];

const currencyLabel = (currency: 'CZK' | 'EUR') => (currency === 'CZK' ? 'Kč' : '€');

const DEFAULT_RATE = 1 / 25.5;

const getShadeRange = (category: 'nebarvene' | 'barvene', shade: number) => {
  if (category === 'barvene') {
    return { start: 5, end: 10 };
  }
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
};

const formatCurrency = (value: number, currency: 'CZK' | 'EUR') => {
  const formatter = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CZK' ? 0 : 2,
  });
  return formatter.format(value);
};

export default function PlatinumTab() {
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currency, setCurrency] = useState<'CZK' | 'EUR'>('CZK');
  const [createdSku, setCreatedSku] = useState<{
    skuId: string;
    skuCode: string;
    movementId?: string;
    weight: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    category: 'nebarvene' as 'nebarvene' | 'barvene',
    shade: SHADES[0]?.code ?? 1,
    shadeName: SHADES[0]?.name ?? '',
    shadeHex: SHADES[0]?.hex ?? '#000000',
    shadeAuto: true,
    structure: 'rovné',
    lengthCm: 60 as number | '',
    weightGrams: 150 as number | '',
    ceskeVlasy: false,
    priceMode: 'matrix' as 'matrix' | 'manual',
    manualPriceCzk: '',
    inStock: true,
    isListed: true,
    listingPriority: 10,
    imageUrl: '',
  });

  useEffect(() => {
    fetchMatrix();
    fetchExchangeRate();
  }, []);

  const fetchMatrix = async () => {
    try {
      const response = await fetch('/api/price-matrix');
      if (!response.ok) throw new Error('Failed to load matrix');
      const data: PriceMatrixEntry[] = await response.json();
      const normalized = data.map((entry) => ({
        ...entry,
        pricePerGramCzk: Number(entry.pricePerGramCzk),
        pricePerGramEur:
          entry.pricePerGramEur !== undefined && entry.pricePerGramEur !== null
            ? Number(entry.pricePerGramEur)
            : null,
      }));
      setPriceMatrix(normalized);
    } catch (err) {
      console.error('Price matrix error:', err);
      setError('Nepodařilo se načíst ceník');
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      if (!response.ok) {
        setExchangeRate(null);
        return;
      }
      const data: ExchangeRateInfo = await response.json();
      setExchangeRate(data);
    } catch (err) {
      console.error('Exchange rate error:', err);
      setExchangeRate(null);
    }
  };

  const rate = exchangeRate?.czkToEur ?? DEFAULT_RATE;

  const selectedShadeInfo = useMemo(() => {
    return SHADES.find((shade) => shade.code === formData.shade) ?? SHADES[0];
  }, [formData.shade]);

  useEffect(() => {
    if (formData.shadeAuto && selectedShadeInfo) {
      setFormData((prev) => ({
        ...prev,
        shadeName: selectedShadeInfo.name,
        shadeHex: selectedShadeInfo.hex,
      }));
    }
  }, [selectedShadeInfo, formData.shadeAuto]);

  const priceEntry = useMemo(() => {
    if (!formData.lengthCm || !formData.weightGrams) return null;
    const shadeRange = getShadeRange(formData.category, formData.shade);
    return priceMatrix.find(
      (entry) =>
        entry.category === formData.category &&
        entry.tier === 'platinum' &&
        entry.lengthCm === Number(formData.lengthCm) &&
        entry.shadeRangeStart === shadeRange.start &&
        entry.shadeRangeEnd === shadeRange.end
    ) || null;
  }, [priceMatrix, formData.category, formData.shade, formData.lengthCm, formData.weightGrams]);

  const pricePerGramCzk = useMemo(() => {
    if (formData.priceMode === 'manual') {
      if (!formData.manualPriceCzk || !formData.weightGrams) return null;
      const total = Number(formData.manualPriceCzk);
      if (!Number.isFinite(total) || total <= 0) return null;
      return total / Number(formData.weightGrams);
    }
    return priceEntry?.pricePerGramCzk ?? null;
  }, [formData.priceMode, formData.manualPriceCzk, formData.weightGrams, priceEntry]);

  const totalPriceCzk = useMemo(() => {
    if (!pricePerGramCzk || !formData.weightGrams) return null;
    return Number((pricePerGramCzk * Number(formData.weightGrams)).toFixed(2));
  }, [pricePerGramCzk, formData.weightGrams]);

  const displayedPrice = useMemo(() => {
    if (!totalPriceCzk) return '--';
    const value = currency === 'CZK' ? totalPriceCzk : totalPriceCzk * rate;
    return formatCurrency(value, currency);
  }, [totalPriceCzk, currency, rate]);

  const secondaryPrice = useMemo(() => {
    if (!totalPriceCzk) return '';
    if (currency === 'CZK') {
      return `${formatCurrency(totalPriceCzk * rate, 'EUR')} (${pricePerGramCzk ? `${(pricePerGramCzk * rate).toFixed(2)} €/g` : '--'})`;
    }
    return `${formatCurrency(totalPriceCzk, 'CZK')} (${pricePerGramCzk ? `${pricePerGramCzk.toFixed(2)} Kč/g` : '--'})`;
  }, [totalPriceCzk, currency, rate, pricePerGramCzk]);

  const generatedName = formatPlatinumName(formData.lengthCm, formData.shade, formData.weightGrams);
  const generatedSlug = formatPlatinumSlug(formData.lengthCm, formData.shade, formData.weightGrams);

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShadeChange = (code: number) => {
    handleFieldChange('shade', code);
    handleFieldChange('shadeAuto', true);
  };

  const handleManualShadeOverride = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      shadeAuto: false,
      shadeName: value,
    }));
  };

  const resetShadeAuto = () => {
    if (selectedShadeInfo) {
      setFormData((prev) => ({
        ...prev,
        shadeAuto: true,
        shadeName: selectedShadeInfo.name,
        shadeHex: selectedShadeInfo.hex,
      }));
    }
  };

  const isManualPriceInvalid =
    formData.priceMode === 'manual' && (!formData.manualPriceCzk || Number(formData.manualPriceCzk) <= 0);

  const canSubmit =
    !!formData.lengthCm &&
    !!formData.weightGrams &&
    !!pricePerGramCzk &&
    !!totalPriceCzk &&
    !isManualPriceInvalid;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Vyplň všechny povinné hodnoty a cenu.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        productType: 'vlasyy',
        category: CATEGORY_OPTIONS.find((opt) => opt.value === formData.category)?.apiValue || 'nebarvene_panenske',
        tier: 'Platinum edition',
        name: generatedName,
        imageUrl: formData.imageUrl || null,
        isListed: formData.isListed,
        shade: String(formData.shade),
        shadeName: formData.shadeName,
        shadeHex: formData.shadeHex,
        structure: formData.structure,
        lengthCm: Number(formData.lengthCm),
        weightGrams: Number(formData.weightGrams),
        priceCzk: totalPriceCzk,
        pricePerGramCzk: pricePerGramCzk,
        usePriceMatrix: formData.priceMode === 'matrix',
        ceskeVlasy: formData.ceskeVlasy,
        inStock: formData.inStock,
        listingPriority: formData.listingPriority,
        slug: generatedSlug,
      };

      const response = await fetch('/api/admin/skus/create-from-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Chyba při ukládání SKU');
      }

      setSuccess(result.message || 'SKU vytvořen');

      // Store created SKU for QR code display
      if (result.skuId) {
        setCreatedSku({
          skuId: result.skuId,
          skuCode: result.skuCode,
          movementId: result.movementId,
          weight: result.weight || Number(formData.weightGrams),
        });
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Chyba při ukládání SKU');
    } finally {
      setLoading(false);
    }
  };

  const closeQrModal = () => {
    setCreatedSku(null);
    setSuccess('');
    // Reset form for next product
    setFormData(prev => ({
      ...prev,
      weightGrams: 150,
      inStock: true,
    }));
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}
      {success && !createdSku && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
      )}

      {/* QR Code Modal */}
      {createdSku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">SKU vytvořen</h2>
                  <p className="text-green-100 mt-1">Platinum kus naskladněn</p>
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
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="font-bold text-lg text-gray-900">{createdSku.skuCode}</div>
                <div className="text-sm font-medium text-green-600 mt-1">{createdSku.weight}g</div>
              </div>

              {createdSku.movementId ? (
                <>
                  {/* QR Code Image */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center">
                    <img
                      src={`/api/admin/stock/qr-code/${createdSku.movementId}`}
                      alt={`QR kód pro ${createdSku.skuCode}`}
                      className="w-48 h-48"
                    />
                  </div>

                  {/* Download Button */}
                  <a
                    href={`/api/admin/stock/qr-code/${createdSku.movementId}`}
                    download={`QR-${createdSku.skuCode}.png`}
                    className="w-full px-4 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Stáhnout QR kód
                  </a>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-sm">Produkt není skladem - QR kód nevygenerován</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={closeQrModal}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Zavřít a přidat další
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">VlasyY (Platinum · kus)</h2>

        {/* Preview */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Náhled názvu produktu</label>
            <input
              type="text"
              value={generatedName || '—'}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Náhled slug</label>
            <input
              type="text"
              value={generatedSlug || '—'}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        {/* Kategorie & struktura */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value as 'nebarvene' | 'barvene')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Struktura</label>
            <select
              value={formData.structure}
              onChange={(e) => handleFieldChange('structure', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              {STRUCTURES.map((structure) => (
                <option key={structure} value={structure}>
                  {structure.charAt(0).toUpperCase() + structure.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shade block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Odstín (1–10)</label>
            <button
              type="button"
              onClick={resetShadeAuto}
              className="text-xs text-burgundy hover:underline"
              disabled={formData.shadeAuto}
            >
              ↺ Reset/Auto
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SHADES.map((shade) => (
              <button
                key={shade.code}
                type="button"
                onClick={() => handleShadeChange(shade.code)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  formData.shade === shade.code
                    ? 'border-burgundy bg-burgundy/10 text-burgundy'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                #{shade.code} · {shade.name}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Název odstínu</label>
            <input
              type="text"
              value={formData.shadeName}
              onChange={(e) => handleManualShadeOverride(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Délka & gramáž */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délka (cm)</label>
            <select
              value={formData.lengthCm}
              onChange={(e) => handleFieldChange('lengthCm', Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              {LENGTHS.map((len) => (
                <option key={len} value={len}>
                  {len} cm
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gramáž (g)</label>
            <input
              type="number"
              min={50}
              step={5}
              value={formData.weightGrams}
              onChange={(e) => handleFieldChange('weightGrams', Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Cena</label>
            <div className="flex gap-2">
              {(['CZK', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    currency === curr ? 'bg-burgundy text-white border-burgundy' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {currencyLabel(curr as 'CZK' | 'EUR')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className={`block p-4 border rounded-lg cursor-pointer ${
              formData.priceMode === 'matrix' ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                className="sr-only"
                checked={formData.priceMode === 'matrix'}
                onChange={() => handleFieldChange('priceMode', 'matrix')}
              />
              <div className="font-semibold text-gray-900">Z ceníku (auto)</div>
              <p className="text-sm text-gray-600">
                Použije cenu za 1 g z ceníkové matice podle kategorie, odstínu a délky.
              </p>
              <div className="mt-3 text-2xl font-bold text-burgundy">
                {displayedPrice}
              </div>
              <div className="text-xs text-gray-500">{secondaryPrice}</div>
            </label>

            <label className={`block p-4 border rounded-lg cursor-pointer ${
              formData.priceMode === 'manual' ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                className="sr-only"
                checked={formData.priceMode === 'manual'}
                onChange={() => handleFieldChange('priceMode', 'manual')}
              />
              <div className="font-semibold text-gray-900">Ruční cena (CZK)</div>
              <p className="text-sm text-gray-600">Zadej celkovou cenu za kus v Kč.</p>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={formData.manualPriceCzk}
                disabled={formData.priceMode !== 'manual'}
                onChange={(e) => handleFieldChange('manualPriceCzk', e.target.value)}
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy disabled:bg-gray-100"
              />
            </label>
          </div>

          {formData.priceMode === 'matrix' && !priceEntry && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              Pro tuto kombinaci chybí cena v ceníku. Zkontroluj, že odstín spadá do podporovaného rozsahu, nebo použij ruční cenu.
            </div>
          )}
        </div>

        {/* Volby */}
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.ceskeVlasy}
              onChange={(e) => handleFieldChange('ceskeVlasy', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">České vlasy (special)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => handleFieldChange('inStock', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Skladem</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isListed}
              onChange={(e) => handleFieldChange('isListed', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Publikovat v katalogu</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorita listing (1–10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.listingPriority}
              onChange={(e) => handleFieldChange('listingPriority', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotka produktu</label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => handleFieldChange('imageUrl', url)}
            folder="skus"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="px-6 py-3 bg-burgundy text-white rounded-lg font-semibold hover:bg-maroon disabled:bg-gray-400"
          >
            {loading ? 'Ukládám…' : 'Uložit SKU'}
          </button>
        </div>
      </div>
    </div>
  );
}
