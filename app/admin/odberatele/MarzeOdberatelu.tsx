'use client';

import { Fragment, useEffect, useState } from 'react';
import { formatKc } from '@/lib/odberatele';
import { api } from './ui';

interface Radek {
  trzby: number;
  trzbySNakladem: number;
  naklady: number;
  marze: number;
  pocet: number;
  chybiNaklad: number;
}

interface Mesic {
  mesic: string;
  celkem: Radek;
  odberatele: Array<{ id: string; name: string; marze: Radek }>;
}

const MESICE = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const nazevMesice = (m: string) => `${MESICE[Number(m.slice(5, 7)) - 1] || m} ${m.slice(0, 4)}`;
const pct = (r: Radek) => (r.trzbySNakladem > 0 ? `${Math.round((r.marze / r.trzbySNakladem) * 100)} %` : '–');
const bez = (r: Radek) => (r.chybiNaklad > 0 ? `${r.chybiNaklad} z ${r.pocet}` : '–');

/** Čistá marže odběratelů po měsících (interní přehled, podle data várky). */
export default function MarzeOdberatelu() {
  const [mesice, setMesice] = useState<Mesic[] | null>(null);
  const [vynechani, setVynechani] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    let alive = true;
    api<{ mesice: Mesic[]; vObjednavkach?: string[] }>('/api/admin/odberatele/marze')
      .then((d) => {
        if (!alive) return;
        setMesice(d.mesice);
        setVynechani(d.vObjednavkach || []);
      })
      .catch((err) => alive && setError(err instanceof Error ? err.message : 'Marži se nepodařilo načíst'));
    return () => {
      alive = false;
    };
  }, []);

  const rows = mesice ? (all ? mesice : mesice.slice(0, 6)) : [];
  const chybi = (mesice || []).reduce((a, m) => a + m.celkem.chybiNaklad, 0);
  const cell = 'px-2.5 py-2.5 text-right whitespace-nowrap';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-stone-800">Čistá marže po měsících</h3>
        <p className="text-[13px] text-stone-500">
          Prodejní cena culíků minus náklad, podle data várky a bez vrácených culíků. Interní přehled, v PDF pro odběratele není.
        </p>
      </div>

      {vynechani.length > 0 && (
        <p className="text-[13px] text-stone-500">
          Nepočítá se sem: {vynechani.join(', ')}. Prodeje má v Objednávkách, tady se u ní vede jen dluh a splátky.
        </p>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">{error}</div>}
      {!mesice && !error && <div className="text-sm text-stone-500">Načítám…</div>}
      {mesice && mesice.length === 0 && <div className="text-sm text-stone-500">Zatím žádné várky.</div>}

      {mesice && mesice.length > 0 && (
        <>
          {chybi > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 text-sm">
              U {chybi} culíků chybí náklad. Do marže se nepočítají, dokud ho nedoplníte ve várce v poli „Náklad Kč/g“.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm tabular-nums">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-stone-500">
                  <th className="text-left font-semibold px-2.5 py-2">Měsíc</th>
                  <th className="text-right font-semibold px-2.5 py-2">Tržby</th>
                  <th className="text-right font-semibold px-2.5 py-2">Náklady</th>
                  <th className="text-right font-semibold px-2.5 py-2">Čistá marže</th>
                  <th className="text-right font-semibold px-2.5 py-2">Marže %</th>
                  <th className="text-right font-semibold px-2.5 py-2">Bez nákladu</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <Fragment key={m.mesic}>
                    <tr
                      className="border-t border-stone-200 cursor-pointer hover:bg-stone-50"
                      onClick={() => setOpen(open === m.mesic ? null : m.mesic)}
                    >
                      <td className="px-2.5 py-2.5 font-semibold text-stone-800 whitespace-nowrap">
                        <span className="inline-block w-4 text-stone-400">{open === m.mesic ? '▾' : '▸'}</span>
                        {nazevMesice(m.mesic)}
                      </td>
                      <td className={cell}>{formatKc(m.celkem.trzby)}</td>
                      <td className={cell}>{formatKc(m.celkem.naklady)}</td>
                      <td className={`${cell} font-bold text-[#722F37]`}>{formatKc(m.celkem.marze)}</td>
                      <td className={cell}>{pct(m.celkem)}</td>
                      <td className={`${cell} ${m.celkem.chybiNaklad > 0 ? 'text-amber-700' : 'text-stone-400'}`}>{bez(m.celkem)}</td>
                    </tr>
                    {open === m.mesic &&
                      m.odberatele.map((o) => (
                        <tr key={o.id} className="bg-stone-50 text-stone-600">
                          <td className="pl-9 pr-2.5 py-2 whitespace-nowrap">{o.name}</td>
                          <td className={cell}>{formatKc(o.marze.trzby)}</td>
                          <td className={cell}>{formatKc(o.marze.naklady)}</td>
                          <td className={cell}>{formatKc(o.marze.marze)}</td>
                          <td className={cell}>{pct(o.marze)}</td>
                          <td className={cell}>{bez(o.marze)}</td>
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {mesice.length > 6 && (
            <button type="button" onClick={() => setAll((v) => !v)} className="text-sm font-medium text-[#722F37]">
              {all ? 'Zobrazit jen posledních 6 měsíců' : `Zobrazit všech ${mesice.length} měsíců`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
