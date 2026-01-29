'use client';

import { useState, useEffect } from 'react';
import AdminShadePicker from './AdminShadePicker';

interface QuickAddSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type ProductType = 'bulk' | 'piece';

const LENGTHS = [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

const STRUCTURES = [
  { value: 'STRAIGHT', label: 'Rovne' },
  { value: 'WAVY', label: 'Vlnite' },
  { value: 'CURLY', label: 'Kudrnate' },
];

const TIERS_BULK = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'LUXE', label: 'LUXE' },
];

const TIERS_PIECE = [
  { value: 'PLATINUM_EDITION', label: 'Platinum Edition' },
];

const CATEGORIES = [
  { value: 'UNBARVENE', label: 'Nebarvene (panenske)' },
  { value: 'BARVENE', label: 'Barvene' },
];

export default function QuickAddSkuModal({ isOpen, onClose, onCreated }: QuickAddSkuModalProps) {
  const [productType, setProductType] = useState<ProductType>('bulk');
  const [category, setCategory] = useState('UNBARVENE');
  const [tier, setTier] = useState('STANDARD');
  const [shade, setShade] = useState('');
  const [shadeName, setShadeName] = useState('');
  const [shadeHex, setShadeHex] = useState('');
  const [structure, setStructure] = useState('STRAIGHT');
  const [lengthCm, setLengthCm] = useState('');
  const [initialGrams, setInitialGrams] = useState('');
  const [location, setLocation] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [costPerGramCzk, setCostPerGramCzk] = useState('');

  // Pricing
  const [priceMode, setPriceMode] = useState<'matrix' | 'manual'>('matrix');
  const [manualPrice, setManualPrice] = useState('');
  const [matrixPrice, setMatrixPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Platinum specific
  const [weightTotalG, setWeightTotalG] = useState('');
  const [czechHair, setCzechHair] = useState(false);

  // BULK specifics
  const [minOrderG, setMinOrderG] = useState('50');
  const [stepG, setStepG] = useState('10');

  // Listing
  const [isListed, setIsListed] = useState(true);
  const [createStockMovement, setCreateStockMovement] = useState(true);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewCode, setPreviewCode] = useState('');

  // When product type changes, reset tier
  useEffect(() => {
    if (productType === 'bulk') {
      setTier('STANDARD');
    } else {
      setTier('PLATINUM_EDITION');
    }
  }, [productType]);

  // Lookup price from matrix when relevant fields change
  useEffect(() => {
    if (priceMode !== 'matrix' || !shade || !lengthCm || !tier || !category) {
      setMatrixPrice(null);
      return;
    }

    const fetchPrice = async () => {
      setPriceLoading(true);
      try {
        const params = new URLSearchParams({
          lookup: 'price',
          category,
          tier,
          lengthCm,
          shade,
          ...(czechHair ? { czechHair: 'true' } : {}),
        });
        const res = await fetch(`/api/admin/skus/create?${params}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.found) {
          setMatrixPrice(data.pricePerGramCzk);
        } else {
          setMatrixPrice(null);
        }
      } catch {
        setMatrixPrice(null);
      } finally {
        setPriceLoading(false);
      }
    };

    const timeout = setTimeout(fetchPrice, 300);
    return () => clearTimeout(timeout);
  }, [shade, lengthCm, tier, category, priceMode, czechHair]);

  // Generate preview SKU code
  useEffect(() => {
    if (!shade || !structure) {
      setPreviewCode('');
      return;
    }

    const catCode = category === 'UNBARVENE' ? 'NB' : 'BR';
    const tierCode = tier === 'STANDARD' ? 'STD' : tier === 'LUXE' ? 'LUX' : 'PLAT';
    const shadeCode = shade.padStart(2, '0');
    const structCode = structure === 'STRAIGHT' ? 'R' : structure === 'WAVY' ? 'V' : 'K';

    if (productType === 'piece') {
      const w = weightTotalG || '?';
      const l = lengthCm || '?';
      setPreviewCode(`Y-${catCode}-PLAT-O${shadeCode}-S${structCode}-L${l}cm-W${w}g`);
    } else {
      const today = new Date();
      const d = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      setPreviewCode(`X-${catCode}-${tierCode}-O${shadeCode}-S${structCode}-${d}-01`);
    }
  }, [shade, structure, category, tier, productType, lengthCm, weightTotalG]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const resolvedPrice = priceMode === 'manual' ? Number(manualPrice) : undefined;

      const payload: any = {
        category,
        tier,
        shade: Number(shade),
        structure,
        lengthCm: Number(lengthCm),
        isListed,
        createStockMovement,
        ...(resolvedPrice ? { pricePerGramCzk: resolvedPrice } : {}),
        ...(location ? { location } : {}),
        ...(batchNumber ? { batchNumber } : {}),
        ...(costPerGramCzk ? { costPerGramCzk: Number(costPerGramCzk) } : {}),
      };

      if (productType === 'piece') {
        payload.saleMode = 'PIECE_BY_WEIGHT';
        payload.weightTotalG = Number(weightTotalG);
        payload.initialGrams = Number(weightTotalG); // the piece itself is the stock
        payload.czechHair = czechHair;
      } else {
        payload.saleMode = 'BULK_G';
        payload.initialGrams = Number(initialGrams) || 0;
        payload.minOrderG = Number(minOrderG) || 50;
        payload.stepG = Number(stepG) || 10;
      }

      const res = await fetch('/api/admin/skus/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Chyba pri vytvareni SKU');
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentPrice = priceMode === 'manual' ? Number(manualPrice) : matrixPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Quick Add SKU</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ produktu</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProductType('bulk')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition ${
                  productType === 'bulk'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                Standard / LUXE (gramy)
              </button>
              <button
                type="button"
                onClick={() => setProductType('piece')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition ${
                  productType === 'piece'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                Platinum (culik)
              </button>
            </div>
          </div>

          {/* Category & Tier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {(productType === 'bulk' ? TIERS_BULK : TIERS_PIECE).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Shade Picker */}
          <AdminShadePicker
            selectedShadeCode={shade}
            onSelect={(s) => {
              if (s) {
                setShade(s.code);
                setShadeName(s.name);
                setShadeHex(s.hex);
              } else {
                setShade('');
                setShadeName('');
                setShadeHex('');
              }
            }}
          />

          {/* Structure & Length */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Struktura</label>
              <div className="flex gap-2">
                {STRUCTURES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStructure(s.value)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                      structure === s.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delka</label>
              <select
                value={lengthCm}
                onChange={(e) => setLengthCm(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Vyber delku...</option>
                {LENGTHS.map((l) => (
                  <option key={l} value={l}>{l} cm</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Sklad</h3>
            {productType === 'piece' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Vaha kusu (g)</label>
                  <input
                    type="number"
                    value={weightTotalG}
                    onChange={(e) => setWeightTotalG(e.target.value)}
                    required
                    placeholder="napr. 150"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={czechHair}
                      onChange={(e) => setCzechHair(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Ceske vlasy
                  </label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Pocatecni gramy</label>
                  <input
                    type="number"
                    value={initialGrams}
                    onChange={(e) => setInitialGrams(e.target.value)}
                    placeholder="napr. 500"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min. objednavka (g)</label>
                  <input
                    type="number"
                    value={minOrderG}
                    onChange={(e) => setMinOrderG(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Krok (g)</label>
                  <input
                    type="number"
                    value={stepG}
                    onChange={(e) => setStepG(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lokace</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="napr. A1-3"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sarze</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="napr. 2025-01-A"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Naklady/g (Kc)</label>
                <input
                  type="number"
                  value={costPerGramCzk}
                  onChange={(e) => setCostPerGramCzk(e.target.value)}
                  placeholder="napr. 1.5"
                  step="0.01"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Cena</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPriceMode('matrix')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                  priceMode === 'matrix'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Z ceniku
                {priceLoading && ' ...'}
                {!priceLoading && matrixPrice !== null && ` (${matrixPrice} Kc/g)`}
                {!priceLoading && matrixPrice === null && shade && lengthCm && ' (nenalezeno)'}
              </button>
              <button
                type="button"
                onClick={() => setPriceMode('manual')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                  priceMode === 'manual'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Vlastni cena
              </button>
            </div>
            {priceMode === 'manual' && (
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="Cena za 1g (Kc)"
                step="0.01"
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            )}
            {priceMode === 'matrix' && matrixPrice === null && shade && lengthCm && !priceLoading && (
              <p className="text-xs text-orange-600">
                Pro tuto kombinaci neni cena v ceniku. Zadejte vlastni cenu nebo doplnte cenik.
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={createStockMovement}
                onChange={(e) => setCreateStockMovement(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Vytvorit stock movement
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isListed}
                onChange={(e) => setIsListed(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Publikovat na e-shopu
            </label>
          </div>

          {/* Preview */}
          {previewCode && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm">
              <span className="text-blue-600 font-medium">Preview: </span>
              <code className="font-mono text-blue-800">{previewCode}</code>
              {currentPrice && (
                <span className="ml-3 text-blue-600">
                  | {currentPrice} Kc/g
                  {productType === 'piece' && weightTotalG && (
                    <span> = {(currentPrice * Number(weightTotalG)).toLocaleString('cs-CZ')} Kc</span>
                  )}
                </span>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Zrusit
            </button>
            <button
              type="submit"
              disabled={submitting || !shade || !lengthCm || (priceMode === 'matrix' && matrixPrice === null) || (priceMode === 'manual' && !manualPrice)}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Vytvarim...' : 'Vytvorit SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
