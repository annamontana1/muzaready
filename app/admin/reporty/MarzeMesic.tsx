'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Radek {
  trzby: number;
  trzbySNakladem: number;
  naklady: number;
  marze: number;
  pocet: number;
  chybiNaklad: number;
}

interface MarzeData {
  month: string;
  objednavky: Radek;
  odberatele: Radek;
  celkem: Radek;
  platbyOdberatelu: number;
}

const kc = (n: number) => `${Math.round(n).toLocaleString('cs-CZ')} Kč`;
const pct = (r: Radek) => (r.trzbySNakladem > 0 ? `${Math.round((r.marze / r.trzbySNakladem) * 100)} %` : '–');
const thisMonth = () => new Date().toLocaleDateString('sv-SE').slice(0, 7);

/** Marže za měsíc: objednávky + odběratelé (várky). Interní přehled. */
export default function MarzeMesic() {
  const [month, setMonth] = useState(thisMonth);
  const [data, setData] = useState<MarzeData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!/^\d{4}-\d{2}$/.test(month)) return;
    let alive = true;
    setError('');
    fetch(`/api/admin/reports/marze?month=${month}`, { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Marži se nepodařilo načíst');
        if (alive) setData(json);
      })
      .catch((err) => alive && setError(err instanceof Error ? err.message : 'Marži se nepodařilo načíst'));
    return () => {
      alive = false;
    };
  }, [month]);

  const rows: Array<{ label: string; sub: string; r: Radek }> = data
    ? [
        { label: 'Objednávky', sub: 'e‑shop, showroom, Instagram · zaplacené v měsíci', r: data.objednavky },
        { label: 'Odběratelé', sub: 'várky předané v měsíci, bez vrácených culíků', r: data.odberatele },
      ]
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Marže za měsíc</h2>
          <p className="text-sm text-stone-500">Objednávky a odběratelé dohromady</p>
        </div>
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          Měsíc
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
          />
        </label>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {!data && !error && <div className="text-sm text-stone-500">Načítám…</div>}

      {data && (
        <>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {[
              { label: 'Tržby', value: kc(data.celkem.trzby), cls: 'text-stone-800' },
              { label: 'Náklady', value: kc(data.celkem.naklady), cls: 'text-stone-800' },
              { label: 'Marže', value: kc(data.celkem.marze), cls: 'text-[#722F37]' },
            ].map((t) => (
              <div key={t.label} className="bg-stone-50 rounded-xl p-3 sm:p-4 min-w-0">
                <div className="text-xs sm:text-sm text-stone-500">{t.label}</div>
                <div className={`text-base sm:text-xl font-bold mt-1 tabular-nums whitespace-nowrap ${t.cls}`}>{t.value}</div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm tabular-nums">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-stone-500">
                  <th className="text-left font-semibold px-2.5 py-2">Zdroj</th>
                  <th className="text-right font-semibold px-2.5 py-2">Tržby</th>
                  <th className="text-right font-semibold px-2.5 py-2">Náklady</th>
                  <th className="text-right font-semibold px-2.5 py-2">Marže</th>
                  <th className="text-right font-semibold px-2.5 py-2">Marže %</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ label, sub, r }) => (
                  <tr key={label} className="border-t border-stone-200">
                    <td className="px-2.5 py-3">
                      {label}
                      <span className="block text-xs text-stone-500">{sub}</span>
                    </td>
                    <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(r.trzby)}</td>
                    <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(r.naklady)}</td>
                    <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(r.marze)}</td>
                    <td className="px-2.5 py-3 text-right whitespace-nowrap">{pct(r)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#722F37] font-bold">
                  <td className="px-2.5 py-3">Celkem</td>
                  <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(data.celkem.trzby)}</td>
                  <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(data.celkem.naklady)}</td>
                  <td className="px-2.5 py-3 text-right whitespace-nowrap">{kc(data.celkem.marze)}</td>
                  <td className="px-2.5 py-3 text-right whitespace-nowrap">{pct(data.celkem)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {data.celkem.chybiNaklad > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 text-sm">
              Náklad chybí u {data.odberatele.chybiNaklad} culíků a {data.objednavky.chybiNaklad} objednávek. Do marže se nepočítají,
              dokud ho nedoplníte (u culíků přes „Zobrazit náklad Kč/g“ ve várce, u objednávek ve sloupci Náklad).{' '}
              <Link href="/admin/odberatele" className="font-semibold text-[#722F37] underline">Odběratelé</Link>
              {' · '}
              <Link href="/admin/objednavky" className="font-semibold text-[#722F37] underline">Objednávky</Link>
            </div>
          )}

          <p className="text-[13px] text-stone-500">
            Přijaté platby od odběratelů v měsíci: {kc(data.platbyOdberatelu)} (jen pro přehled hotovosti, do marže se nepočítají).
          </p>
        </>
      )}
    </div>
  );
}
