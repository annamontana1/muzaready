'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Podobné culíky až úplně dole na detailu, ve třech řadách:
// stejný odstín a kategorie → stejný odstín v jiné kategorii → o odstín světlejší / tmavší.
interface Piece { id: string; name: string; type: string; shade?: number; tier?: string; isDyed?: boolean; imageUrl?: string; structure?: string }

interface Props {
  id: string;
  shade?: string | number | null;
  isDyed?: boolean;
  tierLabel?: string;
}

const kind = (p: { isDyed?: boolean; tier?: string }) =>
  [typeof p.isDyed === 'boolean' ? (p.isDyed ? 'Středoevropské' : 'Panenské') : null, p.tier || null].filter(Boolean).join(' · ');

export default function SimilarPieces({ id, shade, isDyed, tierLabel }: Props) {
  const [list, setList] = useState<Piece[]>([]);
  const s = Number(shade);

  useEffect(() => {
    if (!s) return;
    let alive = true;
    fetch('/api/katalog/unified')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Piece[]) => {
        if (alive && Array.isArray(data)) setList(data.filter((x) => x.type === 'PIECE' && x.id !== id && x.imageUrl && x.shade));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [id, s]);

  if (!s || !list.length) return null;
  const mine = kind({ isDyed, tier: tierLabel });
  const sameShade = list.filter((x) => x.shade === s);
  const rows = [
    { title: `Odstín ${s}${mine ? ` · ${mine}` : ''}`, items: sameShade.filter((x) => kind(x) === mine) },
    { title: `Odstín ${s} v jiné kategorii`, items: sameShade.filter((x) => kind(x) !== mine) },
    { title: `O odstín světlejší (${s + 1})`, items: list.filter((x) => x.shade === s + 1) },
    { title: `O odstín tmavší (${s - 1})`, items: list.filter((x) => x.shade === s - 1) },
  ].filter((r) => r.items.length);
  if (!rows.length) return null;

  return (
    <section aria-labelledby="h-podobne" className="border-t border-muza-line pt-6 flex flex-col gap-7">
      <h2 id="h-podobne" className="font-cormorant text-[24px] leading-tight text-muza-ink">Podobné culíky</h2>
      {rows.map((r) => (
        <div key={r.title}>
          <h3 className="mb-3 text-sm font-normal text-[#45302F]">{r.title}</h3>
          <ul className="-mx-4 px-4 lg:mx-0 lg:px-0 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {r.items.slice(0, 10).map((x) => (
              <li key={x.id} className="flex-none w-[104px]">
                <Link href={`/sku-detail/${x.id}`} className="block group">
                  <span className="block h-[132px] rounded-t-full rounded-b-[10px] border border-muza-ink p-[3px]">
                    <span className="block w-full h-full rounded-t-full rounded-b-lg overflow-hidden bg-muza-mocha">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={x.imageUrl} alt={x.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm font-normal text-text-dark">{x.name.split(' · ')[0]}</span>
                  <span className="block text-xs text-[#45302F]">{[x.tier, x.structure].filter(Boolean).join(' · ') || `odstín ${x.shade}`}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
