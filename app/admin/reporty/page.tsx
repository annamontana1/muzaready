'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ReportSummary {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  totalGrams: number;
}

interface MonthlyRow {
  month: string;
  orderCount: number;
  revenue: number;
  grams: number;
}

interface ChannelRow {
  channel: string;
  orderCount: number;
  revenue: number;
  grams: number;
}

interface ReportData {
  summary: ReportSummary;
  monthlyBreakdown: MonthlyRow[];
  channelBreakdown: ChannelRow[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatCZK(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value);
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const names = [
    'Leden', 'Unor', 'Brezen', 'Duben', 'Kveten', 'Cerven',
    'Cervenec', 'Srpen', 'Zari', 'Rijen', 'Listopad', 'Prosinec',
  ];
  return `${names[parseInt(month, 10) - 1]} ${year}`;
}

function channelLabel(ch: string): string {
  switch (ch) {
    case 'web': return 'E-shop';
    case 'pos': return 'Kamenna prodejna';
    case 'ig_dm': return 'Instagram';
    default: return ch;
  }
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Date preset helpers
function getPreset(preset: string): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  switch (preset) {
    case 'this_month': {
      const from = new Date(y, m, 1);
      return { from: toISODate(from), to: toISODate(now) };
    }
    case 'last_month': {
      const from = new Date(y, m - 1, 1);
      const to = new Date(y, m, 0);
      return { from: toISODate(from), to: toISODate(to) };
    }
    case 'this_year': {
      const from = new Date(y, 0, 1);
      return { from: toISODate(from), to: toISODate(now) };
    }
    case 'last_30': {
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      return { from: toISODate(from), to: toISODate(now) };
    }
    default:
      return { from: '', to: '' };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ReportyPage() {
  // Filters
  const [from, setFrom] = useState(() => {
    const d = new Date();
    return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
  });
  const [to, setTo] = useState(() => toISODate(new Date()));
  const [channel, setChannel] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Data
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sort state for monthly table
  const [sortKey, setSortKey] = useState<'month' | 'orderCount' | 'revenue' | 'grams'>('month');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (channel) params.set('channel', channel);
      if (paymentMethod) params.set('paymentMethod', paymentMethod);

      const res = await fetch(`/api/admin/reports?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Chyba pri nacitani dat');

      const json: ReportData = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Neznama chyba');
    } finally {
      setLoading(false);
    }
  }, [from, to, channel, paymentMethod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorted monthly data
  const sortedMonthly = useMemo(() => {
    if (!data) return [];
    const rows = [...data.monthlyBreakdown];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return rows;
  }, [data, sortKey, sortDir]);

  // Totals row
  const monthlyTotals = useMemo(() => {
    if (!data) return { orderCount: 0, revenue: 0, grams: 0 };
    return data.monthlyBreakdown.reduce(
      (acc, r) => ({
        orderCount: acc.orderCount + r.orderCount,
        revenue: acc.revenue + r.revenue,
        grams: acc.grams + r.grams,
      }),
      { orderCount: 0, revenue: 0, grams: 0 }
    );
  }, [data]);

  function handleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function applyPreset(preset: string) {
    const { from: f, to: t } = getPreset(preset);
    setFrom(f);
    setTo(t);
  }

  // CSV export
  function exportCSV() {
    if (!data) return;

    const lines: string[] = [];
    lines.push('Mesic;Pocet obj.;Trzby (CZK);Prumer (CZK);Gramy');

    for (const row of data.monthlyBreakdown) {
      const avg = row.orderCount > 0 ? Math.round(row.revenue / row.orderCount) : 0;
      lines.push(
        `${formatMonthLabel(row.month)};${row.orderCount};${Math.round(row.revenue)};${avg};${row.grams}`
      );
    }

    // Totals
    const totalAvg = monthlyTotals.orderCount > 0
      ? Math.round(monthlyTotals.revenue / monthlyTotals.orderCount)
      : 0;
    lines.push(
      `CELKEM;${monthlyTotals.orderCount};${Math.round(monthlyTotals.revenue)};${totalAvg};${monthlyTotals.grams}`
    );

    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporty-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Sort indicator
  function SortArrow({ column }: { column: typeof sortKey }) {
    if (sortKey !== column) return <span className="text-stone-300 ml-1">&uarr;&darr;</span>;
    return <span className="text-[#722F37] ml-1">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>;
  }

  return (
    <div className="space-y-6">
      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Date from */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Od</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Do</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
            />
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {[
              { key: 'this_month', label: 'Tento mesic' },
              { key: 'last_month', label: 'Minuly mesic' },
              { key: 'this_year', label: 'Tento rok' },
              { key: 'last_30', label: 'Poslednich 30 dni' },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className="px-3 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Channel filter */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Kanal</label>
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
            >
              <option value="">Vsechny kanaly</option>
              <option value="web">E-shop</option>
              <option value="pos">Kamenna prodejna</option>
              <option value="ig_dm">Instagram</option>
            </select>
          </div>

          {/* Payment method filter */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Platba</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
            >
              <option value="">Vsechny</option>
              <option value="cash">Hotovost</option>
              <option value="card">Karta</option>
              <option value="bank_transfer">Prevod</option>
              <option value="gopay">GoPay</option>
            </select>
          </div>

          {/* Export */}
          <button
            onClick={exportCSV}
            disabled={!data || data.monthlyBreakdown.length === 0}
            className="ml-auto px-4 py-2 text-sm font-medium text-white bg-[#722F37] hover:bg-[#5e262e] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Loading / Error ───────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#722F37] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* ── Summary Cards ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label="Celkove trzby"
              value={formatCZK(data.summary.totalRevenue)}
              accent
            />
            <SummaryCard
              label="Pocet objednavek"
              value={formatNumber(data.summary.orderCount)}
            />
            <SummaryCard
              label="Prumerna objednavka"
              value={formatCZK(data.summary.avgOrderValue)}
            />
            <SummaryCard
              label="Prodano gramu"
              value={`${formatNumber(data.summary.totalGrams)} g`}
            />
          </div>

          {/* ── Monthly Breakdown Table ──────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-stone-800">Mesicni prehled</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <ThSortable label="Mesic" column="month" current={sortKey} dir={sortDir} onSort={handleSort} />
                    <ThSortable label="Pocet obj." column="orderCount" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                    <ThSortable label="Trzby" column="revenue" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                    <th className="px-6 py-3 text-right font-medium text-stone-500">Prumer</th>
                    <ThSortable label="Gramy" column="grams" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                  </tr>
                </thead>
                <tbody>
                  {sortedMonthly.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-stone-400">
                        Zadna data pro zvolene obdobi
                      </td>
                    </tr>
                  )}
                  {sortedMonthly.map(row => {
                    const avg = row.orderCount > 0 ? row.revenue / row.orderCount : 0;
                    return (
                      <tr key={row.month} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-stone-700">{formatMonthLabel(row.month)}</td>
                        <td className="px-6 py-3 text-right text-stone-600">{formatNumber(row.orderCount)}</td>
                        <td className="px-6 py-3 text-right font-medium text-stone-700">{formatCZK(row.revenue)}</td>
                        <td className="px-6 py-3 text-right text-stone-600">{formatCZK(avg)}</td>
                        <td className="px-6 py-3 text-right text-stone-600">{formatNumber(row.grams)} g</td>
                      </tr>
                    );
                  })}
                  {sortedMonthly.length > 0 && (
                    <tr className="bg-stone-50 font-semibold border-t-2 border-stone-300">
                      <td className="px-6 py-3 text-stone-800">Celkem</td>
                      <td className="px-6 py-3 text-right text-stone-800">{formatNumber(monthlyTotals.orderCount)}</td>
                      <td className="px-6 py-3 text-right text-[#722F37]">{formatCZK(monthlyTotals.revenue)}</td>
                      <td className="px-6 py-3 text-right text-stone-800">
                        {formatCZK(monthlyTotals.orderCount > 0 ? monthlyTotals.revenue / monthlyTotals.orderCount : 0)}
                      </td>
                      <td className="px-6 py-3 text-right text-stone-800">{formatNumber(monthlyTotals.grams)} g</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Channel Breakdown ────────────────────────────────── */}
          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Rozdeleni dle kanalu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['web', 'pos', 'ig_dm'] as const).map(ch => {
                const row = data.channelBreakdown.find(r => r.channel === ch);
                const avg = row && row.orderCount > 0 ? row.revenue / row.orderCount : 0;
                return (
                  <div key={ch} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">
                        {ch === 'web' ? '🌐' : ch === 'pos' ? '🏪' : '📸'}
                      </span>
                      <h3 className="text-base font-semibold text-stone-800">{channelLabel(ch)}</h3>
                    </div>
                    {row ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-stone-500">Trzby</span>
                          <span className="text-sm font-semibold text-stone-800">{formatCZK(row.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-stone-500">Objednavky</span>
                          <span className="text-sm font-medium text-stone-700">{formatNumber(row.orderCount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-stone-500">Prumer</span>
                          <span className="text-sm font-medium text-stone-700">{formatCZK(avg)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-stone-500">Gramy</span>
                          <span className="text-sm font-medium text-stone-700">{formatNumber(row.grams)} g</span>
                        </div>
                        {/* Revenue share bar */}
                        {data.summary.totalRevenue > 0 && (
                          <div className="pt-2">
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#722F37] rounded-full transition-all"
                                style={{ width: `${Math.round((row.revenue / data.summary.totalRevenue) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-stone-400 mt-1 block">
                              {Math.round((row.revenue / data.summary.totalRevenue) * 100)} % celkovych trzeb
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-400">Zadne objednavky</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="text-sm text-stone-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${accent ? 'text-[#722F37]' : 'text-stone-800'}`}>
        {value}
      </div>
    </div>
  );
}

function ThSortable({
  label,
  column,
  current,
  dir,
  onSort,
  align,
}: {
  label: string;
  column: 'month' | 'orderCount' | 'revenue' | 'grams';
  current: string;
  dir: 'asc' | 'desc';
  onSort: (col: 'month' | 'orderCount' | 'revenue' | 'grams') => void;
  align?: 'right';
}) {
  const isActive = current === column;
  return (
    <th
      className={`px-6 py-3 font-medium text-stone-500 cursor-pointer select-none hover:text-stone-700 transition-colors ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => onSort(column)}
    >
      {label}
      {isActive ? (
        <span className="text-[#722F37] ml-1">{dir === 'asc' ? '\u2191' : '\u2193'}</span>
      ) : (
        <span className="text-stone-300 ml-1">&uarr;&darr;</span>
      )}
    </th>
  );
}
