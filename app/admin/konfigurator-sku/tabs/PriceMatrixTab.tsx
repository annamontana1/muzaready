'use client';

import { useEffect, useMemo, useState } from 'react';

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

const CATEGORIES: Array<{ value: 'nebarvene' | 'barvene'; label: string }> = [
  { value: 'nebarvene', label: 'Nebarvené panenské' },
  { value: 'barvene', label: 'Barvené vlasy' },
];

const TIERS: Array<{ value: 'standard' | 'luxe' | 'platinum'; label: string }> = [
  { value: 'standard', label: 'Standard' },
  { value: 'luxe', label: 'LUXE' },
  { value: 'platinum', label: 'Platinum' },
];

const SHADE_RANGES = [
  { label: '1-4', start: 1, end: 4 },
  { label: '5-7', start: 5, end: 7 },
  { label: '8-10', start: 8, end: 10 },
  { label: '5-10', start: 5, end: 10 },
];

const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

const CATEGORY_LABELS: Record<string, string> = {
  nebarvene: 'Nebarvené',
  barvene: 'Barvené',
};

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard',
  luxe: 'LUXE',
  platinum: 'Platinum',
};

const formatShadeRange = (start?: number | null, end?: number | null) => {
  if (!start || !end) return '--';
  return `${start}-${end}`;
};

export default function PriceMatrixTab() {
  const [entries, setEntries] = useState<PriceMatrixEntry[]>([]);
  const [originalEntries, setOriginalEntries] = useState<PriceMatrixEntry[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    tier: '',
    shadeRange: '',
    lengthCm: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateInfo | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState('');
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [rateSaving, setRateSaving] = useState(false);

  useEffect(() => {
    fetchPriceMatrix();
    fetchExchangeRate();
  }, []);

  const fetchPriceMatrix = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/price-matrix');
      if (!response.ok) throw new Error('Failed to load price matrix');
      const data: PriceMatrixEntry[] = await response.json();
      const normalized = data.map((entry) => ({
        ...entry,
        pricePerGramCzk: Number(entry.pricePerGramCzk),
        pricePerGramEur:
          entry.pricePerGramEur !== undefined && entry.pricePerGramEur !== null
            ? Number(entry.pricePerGramEur)
            : null,
      }));
      setEntries(normalized);
      setOriginalEntries(JSON.parse(JSON.stringify(normalized)));
    } catch (err) {
      console.error('Error loading price matrix:', err);
      setError('Nepodařilo se načíst matici cen');
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      setRateLoading(true);
      setRateError('');
      const response = await fetch('/api/exchange-rate');
      if (response.status === 404) {
        setExchangeRate(null);
        setRateInput('25.50');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch rate');
      const data: ExchangeRateInfo = await response.json();
      setExchangeRate(data);
      setRateInput(data.eurToCzk.toFixed(2));
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setRateError('Nepodařilo se načíst kurz');
    } finally {
      setRateLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Aplikuj filtry postupně
    if (filters.category) {
      filtered = filtered.filter((entry) => entry.category === filters.category);
    }

    if (filters.tier) {
      filtered = filtered.filter((entry) => entry.tier === filters.tier);
    }

    if (filters.shadeRange) {
      const selected = SHADE_RANGES.find((range) => range.label === filters.shadeRange);
      if (selected) {
        filtered = filtered.filter(
          (entry) =>
            entry.shadeRangeStart === selected.start && entry.shadeRangeEnd === selected.end
        );
      }
    }

    if (filters.lengthCm) {
      filtered = filtered.filter((entry) => entry.lengthCm === parseInt(filters.lengthCm, 10));
    }

    // Seřaď podle délky a pak odstínu
    filtered.sort((a, b) => {
      if (a.lengthCm !== b.lengthCm) return a.lengthCm - b.lengthCm;
      const shadeStartA = a.shadeRangeStart ?? 0;
      const shadeStartB = b.shadeRangeStart ?? 0;
      if (shadeStartA !== shadeStartB) return shadeStartA - shadeStartB;
      return 0;
    });

    return filtered;
  }, [entries, filters]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(entries) !== JSON.stringify(originalEntries);
  }, [entries, originalEntries]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (entryId: string, newPrice: string) => {
    const parsed = parseFloat(newPrice);
    if (Number.isNaN(parsed)) return;

    const czkToEur = exchangeRate?.czkToEur ?? 1 / 25.5;

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              pricePerGramCzk: parsed,
              pricePerGramEur: Number((parsed * czkToEur).toFixed(3)),
            }
          : entry
      )
    );
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/price-matrix', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: entries.map((entry) => ({
            id: entry.id,
            pricePerGramCzk: entry.pricePerGramCzk,
          })),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save price matrix');
      }

      setSuccess('✅ Ceník uložen');
      setOriginalEntries(JSON.parse(JSON.stringify(entries)));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving price matrix:', err);
      setError('Chyba při ukládání ceníku');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setEntries(JSON.parse(JSON.stringify(originalEntries)));
  };

  const openRateModal = () => {
    setRateModalOpen(true);
    setRateInput(exchangeRate ? exchangeRate.eurToCzk.toFixed(2) : rateInput || '25.50');
  };

  const handleRateSave = async () => {
    const parsed = parseFloat(rateInput);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setRateError('Zadej platný kurz ve formátu 1 EUR = X CZK');
      return;
    }

    setRateSaving(true);
    setRateError('');

    try {
      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eurToCzk: parsed }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update exchange rate');
      }

      const data: ExchangeRateInfo = await response.json();
      setExchangeRate(data);
      setRateModalOpen(false);
      setRateInput(data.eurToCzk.toFixed(2));

      // Refresh EUR values locally
      setEntries((prev) =>
        prev.map((entry) => ({
          ...entry,
          pricePerGramEur: Number((entry.pricePerGramCzk * data.czkToEur).toFixed(3)),
        }))
      );
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setRateError('Nepodařilo se uložit kurz');
    } finally {
      setRateSaving(false);
    }
  };

  const currentRateText = exchangeRate
    ? `1 EUR = ${exchangeRate.eurToCzk.toFixed(2)} Kč`
    : 'Nenastaveno (výchozí 1 EUR = 25.50 Kč)';

  return (
    <div className="space-y-8">
      {(error || rateError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || rateError}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Matice cen (Cena za 1g)</h2>
            <p className="text-sm text-gray-600">Spravuj 81 kombinací kategorií × linek × délek.</p>
          </div>
          <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 min-w-[240px]">
            <div className="font-semibold text-gray-900">Aktuální kurz</div>
            {rateLoading ? (
              <div className="text-gray-500">Načítám…</div>
            ) : (
              <>
                <div>{currentRateText}</div>
                {exchangeRate?.updatedBy && (
                  <div className="text-xs text-gray-500">
                    Aktualizoval: {exchangeRate.updatedBy} ·{' '}
                    {new Date(exchangeRate.lastUpdated).toLocaleString('cs-CZ')}
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={openRateModal}
              className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-burgundy rounded-md hover:bg-maroon disabled:opacity-50"
              disabled={rateLoading}
            >
              Změnit kurz
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Všechny</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Linka</label>
            <select
              value={filters.tier}
              onChange={(e) => handleFilterChange('tier', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Všechny</option>
              {TIERS.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Odstín (range)</label>
            <select
              value={filters.shadeRange}
              onChange={(e) => handleFilterChange('shadeRange', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Všechny</option>
              {SHADE_RANGES.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délka (cm)</label>
            <select
              value={filters.lengthCm}
              onChange={(e) => handleFilterChange('lengthCm', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Všechny</option>
              {LENGTHS.map((len) => (
                <option key={len} value={len.toString()}>
                  {len} cm
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-500">Načítám ceník…</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center text-gray-500">Žádné položky pro zvolené filtry.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kategorie</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Linka</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Odstín</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Délka</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cena za 1g (Kč)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cena za 1g (€)</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{CATEGORY_LABELS[entry.category]}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{TIER_LABELS[entry.tier]}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatShadeRange(entry.shadeRangeStart, entry.shadeRangeEnd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.lengthCm} cm</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={entry.pricePerGramCzk}
                        onChange={(e) => handlePriceChange(entry.id, e.target.value)}
                        step="0.1"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {entry.pricePerGramEur
                        ? `${entry.pricePerGramEur.toFixed(1)} €`
                        : exchangeRate
                        ? `${(entry.pricePerGramCzk * exchangeRate.czkToEur).toFixed(1)} €`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex-1 bg-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Ukládám…' : '💾 Uložit změny'}
        </button>
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ↶ Zrušit změny
        </button>
      </div>

      {hasChanges && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          ⚠️ Máš neuložené změny.
        </div>
      )}

      {rateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Aktualizovat kurz</h3>
            <p className="text-sm text-gray-600">
              Zadej, kolik Kč odpovídá 1 EUR. Všechny ceny v EUR se přepočítají automaticky.
            </p>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
              placeholder="25.50"
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setRateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={rateSaving}
              >
                Zrušit
              </button>
              <button
                type="button"
                onClick={handleRateSave}
                disabled={rateSaving}
                className="px-4 py-2 rounded-lg bg-burgundy text-white hover:bg-maroon disabled:opacity-60"
              >
                {rateSaving ? 'Ukládám…' : 'Uložit kurz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
