'use client';

import { useState, useEffect } from 'react';

interface FormData {
  category: string;
  shade: string;
  shadeName: string;
  structure: string;
  lengthCm: number;
  weightG: number;
  priceMode: 'matrix' | 'fixed';
  fixedPrice: string;
  isListed: boolean;
  priority: number;
}

interface PriceMatrixEntry {
  id: string;
  category: string;
  tier: string;
  lengthCm: number;
  pricePerGramCzk: number;
}

const SHADES = [
  { id: '1', name: 'Černá' },
  { id: '2', name: 'Tmavě hnědá' },
  { id: '3', name: 'Hnědá' },
  { id: '4', name: 'Světle hnědá' },
  { id: '5', name: 'Tmavě blond' },
  { id: '6', name: 'Blond' },
  { id: '7', name: 'Světle blond' },
  { id: '8', name: 'Velmi světle blond' },
];

const STRUCTURES = [
  { code: 'RO', label: 'Rovné' },
  { code: 'MV', label: 'Mírně vlnité' },
  { code: 'VL', label: 'Vlnité' },
  { code: 'KU', label: 'Kudrnaté' },
];

const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

export default function PlatinumTab() {
  const [formData, setFormData] = useState<FormData>({
    category: 'nebarvene',
    shade: '1',
    shadeName: 'Černá',
    structure: 'RO',
    lengthCm: 45,
    weightG: 100,
    priceMode: 'matrix',
    fixedPrice: '',
    isListed: false,
    priority: 5,
  });

  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // Load price matrix
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch('/api/price-matrix');
        if (!res.ok) throw new Error('Failed to load matrix');
        const data = await res.json();
        setPriceMatrix(data);
      } catch (err) {
        console.error('Error loading matrix:', err);
        setError('Nepodařilo se načíst ceník');
      }
    };

    fetchMatrix();
  }, []);

  // Calculate price when mode or inputs change
  useEffect(() => {
    if (formData.priceMode === 'matrix') {
      const entry = priceMatrix.find(
        (p) => p.category === formData.category && p.tier === 'platinum' && p.lengthCm === formData.lengthCm
      );

      if (entry) {
        const ppg = parseFloat(entry.pricePerGramCzk.toString());
        const totalPrice = Math.round(ppg * formData.weightG);
        setCalculatedPrice(totalPrice);
        setError('');
      } else {
        setCalculatedPrice(null);
        setError(`Chybí cena v matici pro ${formData.category} × platinum × ${formData.lengthCm} cm`);
      }
    } else {
      const price = parseFloat(formData.fixedPrice);
      setCalculatedPrice(isNaN(price) ? null : price);
    }
  }, [formData.priceMode, formData.category, formData.lengthCm, formData.weightG, formData.fixedPrice, priceMatrix]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCreateSKU = async () => {
    if (calculatedPrice === null) {
      setError('Nelze vytvořit SKU – chybí cena');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const skuCode = `PCS-PL-${formData.category.slice(0, 2).toUpperCase()}-${formData.shade}-${formData.structure}-${formData.lengthCm}-${formData.weightG}`;

      const response = await fetch('/api/sku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skuCode,
          name: `Platinum ${formData.category === 'nebarvene' ? 'nebarvené' : 'barvené'} ${formData.shadeName} ${formData.lengthCm}cm ${formData.weightG}g`,
          category: formData.category,
          tier: 'platinum',
          shade: formData.shade,
          shadeName: formData.shadeName,
          structure: formData.structure,
          lengthCm: formData.lengthCm,
          saleMode: 'PIECE_BY_WEIGHT',
          pricePerGramCzk: formData.priceMode === 'matrix'
            ? priceMatrix.find((p) => p.category === formData.category && p.tier === 'platinum' && p.lengthCm === formData.lengthCm)?.pricePerGramCzk || 0
            : 0,
          weightTotalG: formData.weightG,
          isListed: formData.isListed,
          listingPriority: formData.priority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create SKU');
      }

      setSuccess(`✅ SKU vytvořen: ${skuCode}`);
      setTimeout(() => {
        setSuccess('');
        // Pre-fill for next entry with incremented weight
        setFormData((prev) => ({
          ...prev,
          weightG: prev.weightG + 10,
        }));
      }, 2000);
    } catch (err) {
      console.error('Error creating SKU:', err);
      setError('Chyba při vytváření SKU');
    } finally {
      setLoading(false);
    }
  };

  const skuCodePreview = `PCS-PL-${formData.category.slice(0, 2).toUpperCase()}-${formData.shade}-${formData.structure}-${formData.lengthCm}-${formData.weightG}`;
  const slugPreview = `platinum-odstin-${formData.shade}-${formData.structure.toLowerCase()}-${formData.lengthCm}cm-${formData.weightG}g`;

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Nový SKU – Platinum (PIECE)</h2>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          >
            <option value="nebarvene">Nebarvené panenské</option>
            <option value="barvene">Barvené blond</option>
          </select>
        </div>

        {/* Shade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Odstín</label>
          <select
            name="shade"
            value={formData.shade}
            onChange={(e) => {
              const selected = SHADES.find((s) => s.id === e.target.value);
              setFormData({
                ...formData,
                shade: e.target.value,
                shadeName: selected?.name || '',
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          >
            {SHADES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} – {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Structure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Struktura</label>
          <select
            name="structure"
            value={formData.structure}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          >
            {STRUCTURES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Délka (cm)</label>
          <select
            name="lengthCm"
            value={formData.lengthCm}
            onChange={(e) => setFormData({ ...formData, lengthCm: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          >
            {LENGTHS.map((len) => (
              <option key={len} value={len}>
                {len} cm
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Váha (g)</label>
          <input
            type="number"
            name="weightG"
            value={formData.weightG}
            onChange={handleInputChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          />
        </div>

        {/* Price Mode */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Cena</label>

          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="priceMode"
              value="matrix"
              checked={formData.priceMode === 'matrix'}
              onChange={(e) => setFormData({ ...formData, priceMode: e.target.value as 'matrix' | 'fixed' })}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium text-gray-900">Z matice (cena za 1 g)</div>
              <div className="text-xs text-gray-600">Vezmi PPG z ceníku a vynásob vahou</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="priceMode"
              value="fixed"
              checked={formData.priceMode === 'fixed'}
              onChange={(e) => setFormData({ ...formData, priceMode: e.target.value as 'matrix' | 'fixed' })}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium text-gray-900">Pevná cena</div>
              <div className="text-xs text-gray-600">Ruční zadání celkové ceny za kus</div>
            </div>
          </label>

          {formData.priceMode === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cena za kus (Kč)</label>
              <input
                type="number"
                name="fixedPrice"
                value={formData.fixedPrice}
                onChange={handleInputChange}
                step="10"
                min="0"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
              />
            </div>
          )}
        </div>

        {/* Listing options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isListed"
              checked={formData.isListed}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Zobrazit v katalogu</span>
          </label>

          {formData.isListed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorita (1–10)</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Náhled SKU</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Délka × Váha</div>
            <div className="text-lg font-semibold text-gray-900">
              {formData.lengthCm} cm × {formData.weightG} g
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Cena za kus</div>
            <div className={`text-lg font-semibold ${calculatedPrice === null ? 'text-red-600' : 'text-green-600'}`}>
              {calculatedPrice === null ? '❌ Chybí' : `${calculatedPrice} Kč`}
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg col-span-2">
            <div className="text-xs text-gray-600 mb-1">SKU kód</div>
            <div className="font-mono text-sm text-gray-900 break-all">{skuCodePreview}</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg col-span-2">
            <div className="text-xs text-gray-600 mb-1">Slug</div>
            <div className="font-mono text-sm text-gray-900 break-all">{slugPreview}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleCreateSKU}
          disabled={loading || calculatedPrice === null}
          className="flex-1 bg-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Vytváření...' : 'Vytvořit SKU'}
        </button>

        {formData.priceMode === 'matrix' && calculatedPrice !== null && (
          <button
            onClick={() => {
              // Create and then auto-increment weight for next entry
              handleCreateSKU();
            }}
            disabled={loading || calculatedPrice === null}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Vytváření...' : 'Vytvořit a další'}
          </button>
        )}
      </div>
    </div>
  );
}
