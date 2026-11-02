'use client';

import { useState } from 'react';

// Ceník v záložkách (návrh C): vždy jen jedna malá tabulka. Všechny tabulky jsou v HTML,
// takže je vyhledávače přečtou i ty schované.
export interface PriceMethod {
  id: string;
  name: string;
  sub: string;
  rows: [string, string][];
  more?: { href: string; label: string };
}

export default function PriceTabs({ methods }: { methods: PriceMethod[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Metody prodloužení" className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {methods.map((m, i) => (
          <button key={m.id} type="button" role="tab" id={`tab-${m.id}`} aria-selected={i === active} aria-controls={`panel-${m.id}`}
            onClick={() => setActive(i)}
            className={`flex-none h-11 px-4 rounded-full text-sm transition-colors ${i === active ? 'bg-muza-ink text-muza-onink' : 'bg-muza-mocha text-text-dark hover:bg-[#D3C6B9]'}`}>
            {m.name}
          </button>
        ))}
      </div>
      {methods.map((m, i) => (
        <section key={m.id} role="tabpanel" id={`panel-${m.id}`} aria-labelledby={`tab-${m.id}`} hidden={i !== active}
          className="mt-3 rounded-2xl border border-muza-ink bg-[#F7F3EE] p-4 lg:p-5">
          <h2 className="font-cormorant text-[28px] leading-tight text-muza-ink">{m.name}: cena aplikace</h2>
          <p className="mt-1 text-sm text-[#45302F]">{m.sub}</p>
          <table className="mt-3 w-full">
            <tbody>
              {m.rows.map(([k, v]) => (
                <tr key={k} className="border-t border-muza-line">
                  <th scope="row" className="py-3 text-left text-sm font-normal text-[#45302F]">{k}</th>
                  <td className="py-3 text-right font-jost font-semibold text-[18px] text-muza-ink tabular-nums">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {m.more && (
            <a href={m.more.href} className="mt-3 inline-block text-[15px] text-muza-ink underline underline-offset-[3px]">{m.more.label} ›</a>
          )}
        </section>
      ))}
    </div>
  );
}
