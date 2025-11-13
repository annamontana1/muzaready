'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PriceMatrixEntry {
  id: string;
  category: string;
  tier: string;
  lengthCm: number;
  pricePerGramCzk: number;
}

const CATEGORIES = ['nebarvene', 'barvene'];
const TIERS = ['standard', 'luxe', 'platinum'];
const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

export default function PriceMatrixPage() {
  const [matrix, setMatrix] = useState<PriceMatrixEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load price matrix
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch('/api/price-matrix');
        if (!res.ok) throw new Error('Failed to load price matrix');
        const data = await res.json();
        setMatrix(data);
      } catch (err) {
        console.error('Error loading matrix:', err);
        setError('Nepodařilo se načíst ceník');
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, []);

  // Get or create entry for a specific combination
  const getEntry = (category: string, tier: string, lengthCm: number): PriceMatrixEntry | undefined => {
    return matrix.find((e) => e.category === category && e.tier === tier && e.lengthCm === lengthCm);
  };

  // Handle price update
  const handlePriceChange = async (category: string, tier: string, lengthCm: number, newPrice: string) => {
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue < 0) return;

    const key = `${category}-${tier}-${lengthCm}`;
    setSaving(key);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/price-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: [{ category, tier, lengthCm, pricePerGramCzk: priceValue }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save price');
      }

      const result = await response.json();

      // Update local state
      setMatrix((prev) => {
        const existing = prev.findIndex((e) => e.category === category && e.tier === tier && e.lengthCm === lengthCm);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], pricePerGramCzk: priceValue };
          return updated;
        } else {
          return [...prev, result.entries[0]];
        }
      });

      setSuccess(`Cena aktualizována`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error saving price:', err);
      setError('Chyba při ukládání ceny');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ceníková matice</h1>
        <p className="text-gray-600">Načítání...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ceníková matice – Cena za 1 g (Kč)</h1>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Zpět
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                Kategorie × Tier / Délka (cm)
              </th>
              {LENGTHS.map((len) => (
                <th
                  key={len}
                  className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]"
                >
                  {len} cm
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((category) =>
              TIERS.map((tier) => {
                const rowKey = `${category}-${tier}`;
                const categoryLabel = category === 'nebarvene' ? 'Nebarvené' : 'Barvené';
                const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

                return (
                  <tr key={rowKey} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300 bg-gray-50">
                      {categoryLabel} × {tierLabel}
                    </td>
                    {LENGTHS.map((lengthCm) => {
                      const entry = getEntry(category, tier, lengthCm);
                      const cellKey = `${rowKey}-${lengthCm}`;
                      const isSaving = saving === cellKey;

                      return (
                        <td key={cellKey} className="px-4 py-3 border-r border-gray-300 text-center">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={entry?.pricePerGramCzk ?? ''}
                            onChange={(e) => handlePriceChange(category, tier, lengthCm, e.target.value)}
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (val && val !== (entry?.pricePerGramCzk ?? '').toString()) {
                                handlePriceChange(category, tier, lengthCm, val);
                              }
                            }}
                            disabled={isSaving}
                            placeholder="–"
                            className="w-full px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
        <p className="font-semibold mb-2">Tipy:</p>
        <ul className="space-y-1 text-xs">
          <li>• Tato matice je zdrojem cen pro všechny SKU a konfigurátor</li>
          <li>• Změny se automaticky projeví v konfigurátoru a v košíku</li>
          <li>• Ceny jsou v Kč za 1 gram vlasů</li>
        </ul>
      </div>
    </div>
  );
}
