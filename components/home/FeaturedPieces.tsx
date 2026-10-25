'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Culíky skladem na hlavní stránce: čtyři kusy z /api/katalog/unified (typ PIECE)
type Piece = {
  id: string;
  name: string;
  imageUrl?: string;
  shade?: number;
  shadeName?: string;
  lengthCm?: number;
  weightGrams?: number;
  priceCzk?: number;
  priority: number;
};

// Kusové culíky zatím nemají vlastní fotku, proto se zobrazí vzorek daného odstínu
const SHADE_IMG: Record<number, string> = {
  1: '01-cerna', 2: '03-tmava-hneda', 3: '03-tmava-hneda', 4: '04-hneda', 5: '05-svetla-hneda',
  6: '06-tmava-blond', 7: '07-blond', 8: '08-svetla-blond', 9: '09-velmi-svetla-blond', 10: '10-platinova-blond',
};

const fmt = (n: number) => n.toLocaleString('cs-CZ', { maximumFractionDigits: 0 }) + ' Kč';

export default function FeaturedPieces() {
  const [items, setItems] = useState<Piece[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch('/api/katalog/unified')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (!alive) return;
        const list: (Piece & { type: string })[] = Array.isArray(data) ? data : data.items || [];
        const pieces = list.filter((x) => x.type === 'PIECE').sort((a, b) => a.priority - b.priority);
        setTotal(pieces.length);
        setItems(pieces.slice(0, 4));
      })
      .catch(() => alive && setItems([]));
    return () => { alive = false; };
  }, []);

  if (items && items.length === 0) return null;

  return (
    <section aria-labelledby="h-culiky" className="bg-muza-cream">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-14 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-ink mb-3">Skladem</div>
        <h2 id="h-culiky" className="font-cormorant font-light text-muza-ink text-[36px] leading-[1.04] lg:text-[52px]">
          Culíky <em className="italic">připravené k odeslání.</em>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text-mid max-w-[480px]">
          Každý culík je originál: jedna dárkyně, jedna délka, jeden odstín.
        </p>

        <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-6">
          {(items ?? Array.from({ length: 4 }, () => null)).map((p, i) => (
            <li key={p ? p.id : i}>
              {p ? (
                <Link href={`/sku-detail/${p.id}`} className="block group">
                  <div className="aspect-[3/4] rounded-t-full rounded-b-2xl border border-muza-ink p-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl || `/images/shades/${SHADE_IMG[p.shade ?? 5] ?? '05-svetla-hneda'}.jpg`} alt="" loading="lazy" decoding="async"
                      className="w-full h-full object-cover object-[center_25%] rounded-t-full rounded-b-xl transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-2.5 text-[14px] leading-snug text-text-dark">{p.name}</div>
                  <div className="mt-0.5 text-[12px] text-muza-soft">
                    {[p.shade && `odstín ${p.shade}`, p.lengthCm && `${p.lengthCm} cm`, p.weightGrams && `${p.weightGrams} g`].filter(Boolean).join(' · ')}
                  </div>
                  {p.priceCzk ? <div className="mt-1 font-cormorant text-[20px] leading-none text-muza-ink">{fmt(p.priceCzk)}</div> : null}
                </Link>
              ) : (
                <div aria-hidden="true" className="aspect-[3/4] rounded-t-full rounded-b-2xl bg-muza-mocha/60 animate-pulse" />
              )}
            </li>
          ))}
        </ul>

        <Link href="/katalog?typ=PIECE"
          className="mt-8 h-13 min-h-[52px] flex items-center justify-center rounded-full border border-muza-ink text-muza-ink text-[15px] hover:bg-muza-ink hover:text-muza-onink transition-colors lg:max-w-[360px]">
          Zobrazit {total ? `všech ${total}` : 'všechny'} culíky
        </Link>
      </div>
    </section>
  );
}
