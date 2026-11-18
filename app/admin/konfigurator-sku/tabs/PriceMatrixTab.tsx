'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Matice cen — jedna tabulka: řádky = linka × typ × odstíny, sloupce = délky.
 * Cena je za 1 g v Kč. Uložením se přepíše tabulka price_matrix, ze které
 * bere cenu katalog, košík i formulář Nový prodej.
 */

interface PriceMatrixEntry {
  id: string;
  category: 'nebarvene' | 'barvene';
  tier: 'standard' | 'luxe' | 'platinum' | 'baby_shades';
  shadeRangeStart: number | null;
  shadeRangeEnd: number | null;
  lengthCm: number;
  pricePerGramCzk: number;
}

interface ExchangeRateInfo {
  czkToEur: number;
  eurToCzk: number;
  description: string | null;
  lastUpdated: string;
  updatedBy: string | null;
}

const TIER_ORDER = ['standard', 'luxe', 'platinum', 'baby_shades'] as const;

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard',
  luxe: 'Luxe',
  platinum: 'Platinum Edition',
  baby_shades: 'Baby Shades',
};

/**
 * Odstíny, pro které řádek platí. Kde má linka jen jeden řádek na typ, platí
 * pro všechny odstíny toho typu — popisek říká, jak je dělí e-shop.
 * Platinum nebarvené má skutečná cenová pásma, tam se bere rozsah z ceníku.
 */
const SHADE_LABELS: Record<string, string> = {
  standard_nebarvene: '1–4',
  standard_barvene: '5–10',
  luxe_nebarvene: '1–5',
  luxe_barvene: '6–10',
  platinum_barvene: 'všechny',
  baby_shades_nebarvene: '7–10',
};

interface MatrixRow {
  key: string;
  tier: string;
  category: 'nebarvene' | 'barvene';
  shadeLabel: string;
  shadeStart: number;
  byLength: Map<number, PriceMatrixEntry>;
}

/** "67", "67,5", "" → číslo; prázdné = 0 (cena není). Neplatný text → null. */
function parsePrice(text: string): number | null {
  const t = text.trim().replace(',', '.');
  if (t === '' || t === '–' || t === '-') return 0;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 10) / 10;
}

function formatPrice(n: number): string {
  if (!n) return '';
  return String(n).replace('.', ',');
}

export default function PriceMatrixTab() {
  const [entries, setEntries] = useState<PriceMatrixEntry[]>([]);
  // Rozepsané hodnoty buněk (id → text), jen pro buňky, které se liší od uložené ceny
  const [drafts, setDrafts] = useState<Record<string, string>>({});
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
      const response = await fetch('/api/price-matrix', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load price matrix');
      const data: PriceMatrixEntry[] = await response.json();
      setEntries(data.map((entry) => ({ ...entry, pricePerGramCzk: Number(entry.pricePerGramCzk) })));
      setDrafts({});
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

  const lengths = useMemo(
    () => Array.from(new Set(entries.map((e) => e.lengthCm))).sort((a, b) => a - b),
    [entries]
  );

  // Řádky matice: linka → nebarvené před barvenými → pásma od nejtmavších
  const rows = useMemo(() => {
    const map = new Map<string, MatrixRow>();
    const perGroup = new Map<string, Set<string>>();
    for (const e of entries) {
      const group = `${e.tier}_${e.category}`;
      const range = `${e.shadeRangeStart ?? ''}-${e.shadeRangeEnd ?? ''}`;
      if (!perGroup.has(group)) perGroup.set(group, new Set());
      perGroup.get(group)!.add(range);
    }
    for (const e of entries) {
      const group = `${e.tier}_${e.category}`;
      const key = `${group}_${e.shadeRangeStart ?? ''}-${e.shadeRangeEnd ?? ''}`;
      let row = map.get(key);
      if (!row) {
        const banded = (perGroup.get(group)?.size ?? 1) > 1;
        const rangeLabel =
          e.shadeRangeStart != null && e.shadeRangeEnd != null
            ? `${e.shadeRangeStart}–${e.shadeRangeEnd}`
            : 'všechny';
        row = {
          key,
          tier: e.tier,
          category: e.category,
          shadeLabel: banded ? rangeLabel : SHADE_LABELS[group] ?? rangeLabel,
          shadeStart: e.shadeRangeStart ?? 0,
          byLength: new Map(),
        };
        map.set(key, row);
      }
      row.byLength.set(e.lengthCm, e);
    }
    return Array.from(map.values()).sort((a, b) => {
      const tierDiff =
        TIER_ORDER.indexOf(a.tier as (typeof TIER_ORDER)[number]) -
        TIER_ORDER.indexOf(b.tier as (typeof TIER_ORDER)[number]);
      if (tierDiff !== 0) return tierDiff;
      if (a.category !== b.category) return a.category === 'nebarvene' ? -1 : 1;
      return a.shadeStart - b.shadeStart;
    });
  }, [entries]);

  // Změněné buňky s platnou cenou
  const changes = useMemo(() => {
    const out: Array<{ id: string; pricePerGramCzk: number }> = [];
    for (const e of entries) {
      const text = drafts[e.id];
      if (text === undefined) continue;
      const parsed = parsePrice(text);
      if (parsed !== null && parsed !== e.pricePerGramCzk) out.push({ id: e.id, pricePerGramCzk: parsed });
    }
    return out;
  }, [entries, drafts]);

  const invalidCount = useMemo(
    () => Object.values(drafts).filter((text) => parsePrice(text) === null).length,
    [drafts]
  );

  // Neuložené změny: varovat při zavření / obnovení stránky
  useEffect(() => {
    if (changes.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [changes.length]);

  const handleCellChange = (entry: PriceMatrixEntry, text: string) => {
    setSuccess('');
    setDrafts((prev) => {
      const next = { ...prev };
      const parsed = parsePrice(text);
      // Stejná hodnota jako uložená → buňka není změněná
      if (parsed !== null && parsed === entry.pricePerGramCzk) delete next[entry.id];
      else next[entry.id] = text;
      return next;
    });
  };

  const handleSave = async () => {
    if (changes.length === 0 || invalidCount > 0) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/price-matrix', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: changes }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Failed to save price matrix');
      }

      const saved = new Map(changes.map((c) => [c.id, c.pricePerGramCzk]));
      setEntries((prev) =>
        prev.map((e) => (saved.has(e.id) ? { ...e, pricePerGramCzk: saved.get(e.id)! } : e))
      );
      setDrafts({});
      setSuccess(
        `Uloženo — ${saved.size} ${saved.size === 1 ? 'cena' : saved.size < 5 ? 'ceny' : 'cen'}. Na webu se projeví do pár minut.`
      );
    } catch (err) {
      console.error('Error saving price matrix:', err);
      setError('Ceník se nepodařilo uložit. Změny zůstaly rozepsané — zkuste to znovu.');
    } finally {
      setSaving(false);
    }
  };

  const handleRateSave = async () => {
    const parsed = parseFloat(rateInput.replace(',', '.'));
    if (Number.isNaN(parsed) || parsed <= 0) {
      setRateError('Zadejte platný kurz ve formátu 1 EUR = X Kč');
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
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Failed to update exchange rate');
      }

      const data: ExchangeRateInfo = await response.json();
      setExchangeRate(data);
      setRateModalOpen(false);
      setRateInput(data.eurToCzk.toFixed(2));
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setRateError('Nepodařilo se uložit kurz');
    } finally {
      setRateSaving(false);
    }
  };

  const currentRateText = exchangeRate
    ? `1 EUR = ${exchangeRate.eurToCzk.toFixed(2)} Kč`
    : 'nenastaven (počítá se 1 EUR = 25,50 Kč)';

  let previousTier = '';

  return (
    <div className="space-y-6">
      {(error || rateError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error || rateError}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700" role="status">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900">Cena za 1 g v Kč</h2>
            <p className="text-sm text-gray-600 mt-1">
              Klikněte do buňky a přepište cenu. Prázdná buňka znamená, že délka cenu v ceníku nemá —
              kus pak bere vlastní cenu ze skladu. Změny platí po uložení pro katalog, košík i Nový prodej.
            </p>
          </div>
          <div className="text-sm text-gray-700">
            Kurz: {rateLoading ? 'načítám…' : currentRateText}{' '}
            <button
              type="button"
              onClick={() => {
                setRateModalOpen(true);
                setRateInput(exchangeRate ? exchangeRate.eurToCzk.toFixed(2) : rateInput || '25.50');
              }}
              className="underline text-burgundy hover:text-maroon disabled:opacity-50"
              disabled={rateLoading}
            >
              změnit
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Načítám ceník…</div>
        ) : rows.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Ceník je prázdný.</div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full border-collapse text-sm tabular-nums">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-gray-100 px-3 py-2 text-left font-semibold text-gray-900 whitespace-nowrap"
                  >
                    Linka · typ · odstíny
                  </th>
                  {lengths.map((len) => (
                    <th key={len} scope="col" className="px-1 py-2 text-center font-semibold text-gray-900 whitespace-nowrap">
                      {len} <span className="font-normal text-gray-500">cm</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const tierStart = row.tier !== previousTier;
                  previousTier = row.tier;
                  const rowLabel = `${TIER_LABELS[row.tier] ?? row.tier}, ${
                    row.category === 'nebarvene' ? 'nebarvené' : 'barvené'
                  }, odstíny ${row.shadeLabel}`;
                  return (
                    <tr key={row.key} className={tierStart ? 'border-t-2 border-gray-300' : 'border-t border-gray-200'}>
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-normal whitespace-nowrap"
                      >
                        <span className="font-semibold text-gray-900">{TIER_LABELS[row.tier] ?? row.tier}</span>{' '}
                        <span className={row.category === 'nebarvene' ? 'text-green-700' : 'text-burgundy'}>
                          {row.category === 'nebarvene' ? 'nebarvené' : 'barvené'}
                        </span>{' '}
                        <span className="text-gray-500">{row.shadeLabel}</span>
                      </th>
                      {lengths.map((len) => {
                        const entry = row.byLength.get(len);
                        if (!entry) {
                          return (
                            <td key={len} className="px-1 py-1 text-center text-gray-300">
                              –
                            </td>
                          );
                        }
                        const draft = drafts[entry.id];
                        const changed = draft !== undefined;
                        const invalid = changed && parsePrice(draft) === null;
                        return (
                          <td key={len} className="px-1 py-1">
                            <input
                              type="text"
                              inputMode="decimal"
                              aria-label={`${rowLabel}, ${len} cm`}
                              aria-invalid={invalid || undefined}
                              value={changed ? draft : formatPrice(entry.pricePerGramCzk)}
                              placeholder="–"
                              onChange={(e) => handleCellChange(entry, e.target.value)}
                              onFocus={(e) => e.currentTarget.select()}
                              className={`w-16 px-1.5 py-1.5 text-center rounded border focus:outline-none focus:ring-2 focus:ring-burgundy ${
                                invalid
                                  ? 'border-red-500 bg-red-50 text-red-700'
                                  : changed
                                  ? 'border-amber-400 bg-amber-50 text-gray-900 font-semibold'
                                  : 'border-transparent hover:border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Platinum nebarvené má tři cenová pásma podle odstínu kusu (odstíny 9–10 berou pásmo 7–8).
          U ostatních řádků platí jedna cena pro celý typ.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={changes.length === 0 || invalidCount > 0 || saving}
          className="bg-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Ukládám…' : changes.length > 0 ? `Uložit změny (${changes.length})` : 'Uložit změny'}
        </button>
        <button
          onClick={() => {
            setDrafts({});
            setSuccess('');
          }}
          disabled={Object.keys(drafts).length === 0 || saving}
          className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zrušit změny
        </button>
        {invalidCount > 0 ? (
          <span className="text-sm text-red-700">
            {invalidCount === 1 ? 'Jedna buňka' : `${invalidCount} buňky`} není číslo — opravte ji před uložením.
          </span>
        ) : changes.length > 0 ? (
          <span className="text-sm text-amber-700">Neuložené změny jsou zvýrazněné.</span>
        ) : null}
      </div>

      {rateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Kurz eura</h3>
            <p className="text-sm text-gray-600">
              Kolik Kč odpovídá 1 EUR. Ceny v eurech se z něj přepočítávají automaticky.
            </p>
            <input
              type="text"
              inputMode="decimal"
              aria-label="Kurz: kolik Kč je 1 EUR"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
              placeholder="25,50"
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
