'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAllShades, ShadeInfo } from '@/lib/shades';
import { generateVlasyXName, generateVlasyXSlug } from '@/lib/vlasyx-format';

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
const TIER_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'luxe', label: 'LUXE' },
];

const DEFAULT_RATE = 1 / 25.5;

const getShadeRange = (category: 'nebarvene' | 'barvene', shade: number) => {
  if (category === 'barvene') {
    return { start: 5, end: 10 };
  }
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
};

const getAllowedShadeCodes = (category: 'nebarvene' | 'barvene', tier: 'standard' | 'luxe') => {
  if (category === 'barvene') {
    return SHADES.filter((shade) => shade.code >= 5 && shade.code <= 10);
  }
  if (tier === 'standard') {
    return SHADES.filter((shade) => shade.code >= 1 && shade.code <= 4);
  }
  return SHADES.filter((shade) => shade.code >= 1 && shade.code <= 7);
};

const formatCurrency = (value: number, currency: 'CZK' | 'EUR') => {
  const formatter = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CZK' ? 0 : 2,
  });
  return formatter.format(value);
};

export default function VlasyXTab() {
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateInfo | null>(null);
  const [currency, setCurrency] = useState<'CZK' | 'EUR'>('CZK');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    category: 'nebarvene' as 'nebarvene' | 'barvene',
    tier: 'standard' as 'standard' | 'luxe',
    shade: 1,
    shadeName: SHADES[0]?.name ?? '',
    shadeHex: SHADES[0]?.hex ?? '#000000',
    shadeAuto: true,
    structure: 'rovné',
    selectedLengths: [] as number[],
    stockByLength: {} as Record<number, number>,
    defaultLength: '' as number | '',
    minOrderG: 50,
    stepG: 10,
    defaultGrams: 100,
    priceMode: 'matrix' as 'matrix' | 'manual',
    manualPricePerGram: '',
    isListed: true,
    listingPriority: 8,
  });

  useEffect(() => {
    fetchMatrix();
    fetchExchangeRate();
    const allowed = getAllowedShadeCodes(formData.category, formData.tier);
    if (allowed.length > 0) {
      setFormData((prev) => ({
        ...prev,
        shade: allowed[0].code,
        shadeName: allowed[0].name,
        shadeHex: allowed[0].hex,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.error('Matrix error:', err);
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
      console.error('Rate error:', err);
      setExchangeRate(null);
    }
  };

  const rate = exchangeRate?.czkToEur ?? DEFAULT_RATE;

  const allowedShades = useMemo(
    () => getAllowedShadeCodes(formData.category, formData.tier),
    [formData.category, formData.tier]
  );

  useEffect(() => {
    if (!allowedShades.some((shade) => shade.code === formData.shade)) {
      const fallback = allowedShades[0];
      if (fallback) {
        setFormData((prev) => ({
          ...prev,
          shade: fallback.code,
          shadeName: fallback.name,
          shadeHex: fallback.hex,
          shadeAuto: true,
        }));
      }
    }
  }, [allowedShades, formData.shade]);

  const selectedShadeInfo = allowedShades.find((shade) => shade.code === formData.shade);

  useEffect(() => {
    if (formData.shadeAuto && selectedShadeInfo) {
      setFormData((prev) => ({
        ...prev,
        shadeName: selectedShadeInfo.name,
        shadeHex: selectedShadeInfo.hex,
      }));
    }
  }, [selectedShadeInfo, formData.shadeAuto]);

  const lengthPriceMap = useMemo(() => {
    const map: Record<number, number | null> = {};
    const shadeRange = getShadeRange(formData.category, formData.shade);
    LENGTHS.forEach((length) => {
      const entry = priceMatrix.find(
        (matrixEntry) =>
          matrixEntry.category === formData.category &&
          matrixEntry.tier === formData.tier &&
          matrixEntry.lengthCm === length &&
          matrixEntry.shadeRangeStart === shadeRange.start &&
          matrixEntry.shadeRangeEnd === shadeRange.end
      );
      map[length] = entry ? entry.pricePerGramCzk : null;
    });
    return map;
  }, [priceMatrix, formData.category, formData.tier, formData.shade]);

  const missingPriceLengths = useMemo(() => {
    if (formData.priceMode !== 'matrix') return [];
    return formData.selectedLengths.filter((len) => lengthPriceMap[len] === null);
  }, [formData.selectedLengths, lengthPriceMap, formData.priceMode]);

  const previewRows = formData.selectedLengths.map((length) => {
    const pricePerGram =
      formData.priceMode === 'manual'
        ? Number(formData.manualPricePerGram || 0) || null
        : lengthPriceMap[length];
    const pricePer100 = pricePerGram ? pricePerGram * 100 : null;
    return {
      length,
      pricePerGram,
      pricePer100,
      stock: formData.stockByLength[length] || 0,
    };
  });

  const canSubmit =
    formData.selectedLengths.length > 0 &&
    formData.defaultLength !== '' &&
    (formData.priceMode === 'manual'
      ? !!formData.manualPricePerGram && Number(formData.manualPricePerGram) > 0
      : missingPriceLengths.length === 0);

  const namePreview = useMemo(() => {
    const primaryLength = Number(formData.defaultLength || formData.selectedLengths[0] || 0);
    return generateVlasyXName(
      primaryLength,
      formData.category,
      formData.tier,
      formData.shade,
      formData.defaultGrams
    );
  }, [formData.category, formData.tier, formData.shade, formData.defaultGrams, formData.defaultLength, formData.selectedLengths]);

  const slugPreview = useMemo(() => {
    return generateVlasyXSlug(formData.category, formData.tier, formData.shade);
  }, [formData.category, formData.tier, formData.shade]);

  const handleFieldChange = (
    field: keyof typeof formData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShadeOverride = (field: 'shadeName' | 'shadeHex', value: string) => {
    setFormData((prev) => ({
      ...prev,
      shadeAuto: false,
      [field]: value,
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

  const toggleLength = (length: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedLengths.includes(length);
      const nextSelected = isSelected
        ? prev.selectedLengths.filter((len) => len !== length)
        : [...prev.selectedLengths, length].sort((a, b) => a - b);

      const nextStock = { ...prev.stockByLength };
      if (!isSelected) {
        nextStock[length] = nextStock[length] || 0;
      } else {
        delete nextStock[length];
      }

      const nextDefault =
        nextSelected.length === 0
          ? ''
          : prev.defaultLength && nextSelected.includes(Number(prev.defaultLength))
          ? prev.defaultLength
          : nextSelected[0];

      return {
        ...prev,
        selectedLengths: nextSelected,
        stockByLength: nextStock,
        defaultLength: nextDefault,
      };
    });
  };

  const handleStockChange = (length: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      stockByLength: {
        ...prev.stockByLength,
        [length]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Zkontroluj délky, ceny a povinná pole.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const primaryLength = Number(formData.defaultLength || formData.selectedLengths[0] || 0);
      const generatedName = generateVlasyXName(
        primaryLength,
        formData.category,
        formData.tier,
        formData.shade,
        formData.defaultGrams
      );

      const payload = {
        productType: 'vlasyx',
        category: CATEGORY_OPTIONS.find((opt) => opt.value === formData.category)?.apiValue || 'nebarvene_panenske',
        tier: formData.tier === 'standard' ? 'Standard' : 'LUXE',
        shade: String(formData.shade),
        shadeName: formData.shadeName,
        shadeHex: formData.shadeHex,
        structure: formData.structure,
        selectedLengths: formData.selectedLengths,
        stockByLength: formData.stockByLength,
        defaultLength: formData.defaultLength,
        minOrderG: formData.minOrderG,
        stepG: formData.stepG,
        defaultGrams: formData.defaultGrams,
        usePriceMatrix: formData.priceMode === 'matrix',
        pricePerGramCzk:
          formData.priceMode === 'manual' ? Number(formData.manualPricePerGram) : undefined,
        isListed: formData.isListed,
        listingPriority: formData.listingPriority,
        name: generateVlasyXName(
          Number(formData.defaultLength || formData.selectedLengths[0]),
          formData.category,
          formData.tier,
          formData.shade,
          formData.defaultGrams
        ),
      };

      const response = await fetch('/api/admin/skus/create-from-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Chyba při vytváření SKU');
      }

      setSuccess(result.message || `Vytvořeno ${formData.selectedLengths.length} SKU`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Chyba při vytváření SKU');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">{success}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">VlasyX (BULK · gramáž)</h2>

        {/* Category & Tier */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value as 'nebarvene' | 'barvene')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Linie</label>
            <select
              value={formData.tier}
              onChange={(e) => handleFieldChange('tier', e.target.value as 'standard' | 'luxe')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {TIER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Náhled názvu produktu</label>
            <input
              type="text"
              value={namePreview || '—'}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Náhled slug</label>
            <input
              type="text"
              value={slugPreview || '—'}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        {/* Shade */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Odstín</label>
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
            {allowedShades.map((shade) => (
              <button
                type="button"
                key={shade.code}
                onClick={() => handleFieldChange('shade', shade.code)}
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
              onChange={(e) => handleShadeOverride('shadeName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Structure & lengths */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Struktura</label>
            <select
              value={formData.structure}
              onChange={(e) => handleFieldChange('structure', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {STRUCTURES.map((structure) => (
                <option key={structure} value={structure}>
                  {structure.charAt(0).toUpperCase() + structure.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délky</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {LENGTHS.map((len) => {
                const selected = formData.selectedLengths.includes(len);
                return (
                  <button
                    key={len}
                    type="button"
                    onClick={() => toggleLength(len)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                      selected
                        ? 'bg-burgundy text-white border-burgundy'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {len} cm
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {formData.selectedLengths.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default délka pro kartu</label>
                <select
                  value={formData.defaultLength}
                  onChange={(e) =>
                    handleFieldChange(
                      'defaultLength',
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Vyber délku</option>
                  {formData.selectedLengths.map((len) => (
                    <option key={len} value={len}>
                      {len} cm
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min. objednávka (g)</label>
                <input
                  type="number"
                  min={10}
                  value={formData.minOrderG}
                  onChange={(e) => handleFieldChange('minOrderG', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Krok (g)</label>
                <input
                  type="number"
                  min={5}
                  value={formData.stepG}
                  onChange={(e) => handleFieldChange('stepG', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default gramáž konfigurátoru</label>
              <input
                type="number"
                min={50}
                step={10}
                value={formData.defaultGrams}
                onChange={(e) => handleFieldChange('defaultGrams', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Délka</th>
                    <th className="px-3 py-2 text-left">PPG (Kč)</th>
                    <th className="px-3 py-2 text-left">Cena /100g</th>
                    <th className="px-3 py-2 text-left">Skladem (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={row.length} className="border-t">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.length} cm</td>
                      <td className="px-3 py-2">
                        {row.pricePerGram ? `${row.pricePerGram.toFixed(2)} Kč/g` : '—'}
                      </td>
                      <td className="px-3 py-2">
                        {row.pricePer100
                          ? `${formatCurrency(
                              currency === 'CZK' ? row.pricePer100 : row.pricePer100 * rate,
                              currency
                            )}`
                          : '—'}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          value={row.stock}
                          onChange={(e) => handleStockChange(row.length, Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {missingPriceLengths.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                Chybí ceny pro délky: {missingPriceLengths.join(', ')} cm. Zkontroluj ceník nebo přepni na ruční cenu.
              </div>
            )}
          </div>
        )}

        {/* Price Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Ceny</label>
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
                  {curr}
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
              <p className="text-sm text-gray-600">Cena za 1g podle kategorizace a odstínu.</p>
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
              <div className="font-semibold text-gray-900">Ruční cena za 1g (Kč)</div>
              <input
                type="number"
                min={0}
                value={formData.manualPricePerGram}
                disabled={formData.priceMode !== 'manual'}
                onChange={(e) => handleFieldChange('manualPricePerGram', e.target.value)}
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </label>
          </div>
        </div>

        {/* Listing */}
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Priorita (1–10)</label>
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="px-6 py-3 bg-burgundy text-white rounded-lg font-semibold hover:bg-maroon disabled:bg-gray-400"
          >
            {loading ? 'Ukládám…' : 'Vytvořit SKU'}
          </button>
        </div>
      </div>
    </div>
  );
}
