'use client';

import { useState, useEffect } from 'react';

interface FormData {
  category: string;
  tier: string;
  shade: string;
  shadeName: string;
  structure: string;
  selectedLengths: number[];
  minOrderG: number;
  stepG: number;
  availableGrams: number;
  overridePricePerGram: string;
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

export default function VlasyXTab() {
  const [formData, setFormData] = useState<FormData>({
    category: 'nebarvene',
    tier: 'standard',
    shade: '1',
    shadeName: 'Černá',
    structure: 'RO',
    selectedLengths: [],
    minOrderG: 50,
    stepG: 10,
    availableGrams: 500,
    overridePricePerGram: '',
    isListed: false,
    priority: 5,
  });

  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<any[]>([]);

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

  // Generate preview
  const generatePreview = () => {
    if (formData.selectedLengths.length === 0) {
      setPreview([]);
      return;
    }

    const previewItems = formData.selectedLengths.map((length) => {
      const priceEntry = priceMatrix.find(
        (p) => p.category === formData.category && p.tier === formData.tier && p.lengthCm === length
      );

      const ppg = formData.overridePricePerGram
        ? parseFloat(formData.overridePricePerGram)
        : priceEntry?.pricePerGramCzk
        ? parseFloat(priceEntry.pricePerGramCzk.toString())
        : null;

      const skuCode = `BLK-${formData.tier.toUpperCase().slice(0, 3)}-${formData.category.slice(0, 2).toUpperCase()}-${formData.shade}-${formData.structure}-${length}`;
      const slug = `${formData.category}-${formData.tier}-odstin-${formData.shade}-${formData.structure.toLowerCase()}-${length}cm`;

      return {
        length,
        ppg,
        skuCode,
        slug,
      };
    });

    setPreview(previewItems);
  };

  useEffect(() => {
    generatePreview();
  }, [formData, priceMatrix]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleLengthToggle = (length: number) => {
    setFormData({
      ...formData,
      selectedLengths: formData.selectedLengths.includes(length)
        ? formData.selectedLengths.filter((l) => l !== length)
        : [...formData.selectedLengths, length].sort((a, b) => a - b),
    });
  };

  const handleCreateSKUs = async () => {
    if (formData.selectedLengths.length === 0) {
      setError('Vyberte alespoň jednu délku');
      return;
    }

    // Validate all have prices
    const missingPrices = preview.filter((p) => p.ppg === null);
    if (missingPrices.length > 0) {
      setError(`Chybí ceny v matici pro délky: ${missingPrices.map((p) => p.length).join(', ')} cm`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create all SKUs in parallel
      const skuPromises = preview.map((item) =>
        fetch('/api/sku', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skuCode: item.skuCode,
            name: `${formData.category === 'nebarvene' ? 'Nebarvené' : 'Barvené'} ${formData.tier} ${item.length}cm`,
            category: formData.category,
            tier: formData.tier,
            shade: formData.shade,
            shadeName: formData.shadeName,
            structure: formData.structure,
            lengthCm: item.length,
            saleMode: 'BULK_G',
            pricePerGramCzk: item.ppg,
            availableGrams: formData.availableGrams,
            minOrderG: formData.minOrderG,
            stepG: formData.stepG,
            isListed: formData.isListed,
            listingPriority: formData.priority,
          }),
        })
      );

      const responses = await Promise.all(skuPromises);
      const failedCreations = responses.filter((r) => !r.ok);

      if (failedCreations.length > 0) {
        setError(`Chyba při vytváření ${failedCreations.length} SKU`);
        setLoading(false);
        return;
      }

      setSuccess(`✅ Vytvořeno ${formData.selectedLengths.length} SKU`);
      setTimeout(() => {
        setSuccess('');
        // Reset form
        setFormData({
          category: 'nebarvene',
          tier: 'standard',
          shade: '1',
          shadeName: 'Černá',
          structure: 'RO',
          selectedLengths: [],
          minOrderG: 50,
          stepG: 10,
          availableGrams: 500,
          overridePricePerGram: '',
          isListed: false,
          priority: 5,
        });
      }, 2000);
    } catch (err) {
      console.error('Error creating SKUs:', err);
      setError('Chyba při vytváření SKU');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Nový SKU – VlasyX (BULK)</h2>

        {/* Category & Tier */}
        <div className="grid grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              <option value="standard">Standard</option>
              <option value="luxe">LUXE</option>
            </select>
          </div>
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

        {/* Lengths multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Délky (vyberte jednu nebo více)</label>
          <div className="grid grid-cols-5 gap-2">
            {LENGTHS.map((len) => (
              <button
                key={len}
                onClick={() => handleLengthToggle(len)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  formData.selectedLengths.includes(len)
                    ? 'bg-burgundy text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {len} cm
              </button>
            ))}
          </div>
        </div>

        {/* Min order & step */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min. objednávka (g)</label>
            <input
              type="number"
              name="minOrderG"
              value={formData.minOrderG}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Krok (g)</label>
            <input
              type="number"
              name="stepG"
              value={formData.stepG}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            />
          </div>
        </div>

        {/* Available grams */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dostupné gramy (sklad)</label>
          <input
            type="number"
            name="availableGrams"
            value={formData.availableGrams}
            onChange={handleInputChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          />
        </div>

        {/* Override price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Přepsat cenu za 1g (Kč) – volitelné</label>
          <input
            type="number"
            name="overridePricePerGram"
            value={formData.overridePricePerGram}
            onChange={handleInputChange}
            step="0.1"
            placeholder="Nechte prázdné pro použití ceny z matice"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
          />
          <p className="text-xs text-gray-500 mt-1">Jestliže je vyplněno, přepíše cenu z ceníkové matice</p>
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
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Náhled – {preview.length} SKU</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {preview.map((item) => (
              <div key={item.length} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Délka:</span> <strong>{item.length} cm</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Cena/g:</span> <strong>{item.ppg ? `${item.ppg} Kč` : '❌ Chybí'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">SKU kód:</span> <strong className="font-mono text-xs">{item.skuCode}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Slug:</span> <strong className="font-mono text-xs">{item.slug}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleCreateSKUs}
          disabled={loading || preview.length === 0}
          className="flex-1 bg-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Vytváření...' : `Vytvořit ${preview.length} SKU`}
        </button>
      </div>
    </div>
  );
}
