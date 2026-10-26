'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';

// Karta jednoho culíku ve tvaru z hlavní stránky: fotka v oblouku s tenkým rámečkem,
// pod ní dvě miniatury (z dálky / zblízka) a klepnutím na miniaturu se velká fotka přepne
type Props = {
  id: string;
  name: string;
  photos: string[]; // [z dálky, zblízka]
  meta?: string;
  price?: string;
  soldOut?: boolean;
  action?: ReactNode; // např. tlačítko Do košíku v katalogu
};

export default function PieceCard({ id, name, photos, meta, price, soldOut, action }: Props) {
  const [active, setActive] = useState(0);
  const src = photos[active] ?? photos[0];

  return (
    <div className="group">
      <Link href={`/sku-detail/${id}`} className="block">
        <div className="relative aspect-[3/4] rounded-t-full rounded-b-2xl border border-muza-ink p-1 overflow-hidden">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={name} loading="lazy" decoding="async"
              className="w-full h-full object-cover object-[center_25%] rounded-t-full rounded-b-xl transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="w-full h-full rounded-t-full rounded-b-xl bg-muza-mocha" />
          )}
          {soldOut && (
            <div className="absolute inset-1 rounded-t-full rounded-b-xl bg-black/45 flex items-center justify-center">
              <span className="text-white text-sm">Vyprodáno</span>
            </div>
          )}
        </div>
      </Link>

      {photos.length > 1 && (
        <div className="mt-2 flex gap-1.5">
          {photos.slice(0, 2).map((p, i) => (
            <button key={p} type="button" onClick={() => setActive(i)}
              aria-label={i === 0 ? 'Fotka z dálky' : 'Fotka zblízka'} aria-pressed={i === active}
              className={`w-10 h-[52px] lg:w-12 lg:h-16 rounded-md overflow-hidden border transition-[border-color,opacity] ${i === active ? 'border-muza-ink' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Link href={`/sku-detail/${id}`} className="block">
        <div className="mt-2.5 text-[14px] leading-snug text-text-dark">{name}</div>
        {meta ? <div className="mt-0.5 text-[12px] text-muza-soft">{meta}</div> : null}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          {price ? <span className="font-cormorant text-[20px] leading-none text-muza-ink">{price}</span> : <span />}
          {/* Dostupnost: každý kus v nabídce je skladem, prodaný se ukáže jako vyprodaný */}
          <span className={`inline-flex items-center gap-1.5 text-[12px] ${soldOut ? 'text-muza-soft' : 'text-[#2F6B45]'}`}>
            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${soldOut ? 'bg-muza-soft' : 'bg-[#2F6B45]'}`} />
            {soldOut ? 'Vyprodáno' : 'Skladem'}
          </span>
        </div>
      </Link>
      {action}
    </div>
  );
}
