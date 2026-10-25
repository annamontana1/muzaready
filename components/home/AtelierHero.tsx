'use client';

import Link from 'next/link';
import { useState } from 'react';

// Úvod: hned pod hlavičkou plyne souvislý pás černobílých fotek z ateliéru, pod ním výběr kolekce
const COLLECTIONS = [
  { name: 'Standard', note: 'Skvělá každodenní volba', price: 'od 6 900 Kč', href: '/vlasy-k-prodlouzeni/standard' },
  { name: 'LUXE', note: 'Od jedné dárkyně, jednotná struktura', price: 'od 8 900 Kč', href: '/vlasy-k-prodlouzeni/luxe' },
  { name: 'Platinum edition', note: 'Ručně tříděno, výkup ČR a SR', price: 'od 10 900 Kč', href: '/vlasy-k-prodlouzeni/platinum-edition' },
];

// Fotky jdou bez mezer těsně za sebou; pás je zdvojený, aby se smyčka (posun o −50 %) nikdy nepřetrhla
const PHOTOS = [
  { id: '10', alt: 'Výroba paruky: háčkování vlasů do krajky na hlavě figuríny' },
  { id: '07', alt: 'Ateliér Múza Hair v Praze: tým u pracovních stolů šije tresy a tresuje vlasy' },
  { id: '12', alt: 'Tým ateliéru Múza Hair' },
  { id: '08', alt: 'Šití vlasové tresy na průmyslovém stroji' },
  { id: '15', alt: 'Balení objednávky: vlasy v hedvábném papíru v krabici' },
  { id: '09', alt: 'Ruční šití tresy zahnutou jehlou' },
  { id: '11', alt: 'Tresování vlasů na kovovém rámu' },
  { id: '17', alt: 'Detail háčku a krajky při výrobě paruky' },
  { id: '16', alt: 'Detail rukou u šicího stroje s tresou' },
];

export default function AtelierHero() {
  const [active, setActive] = useState(1);
  const c = COLLECTIONS[active];

  return (
    <section className="bg-muza-ivory">
      {/* Pás fotek: pohyb jen přes transform, lineárně; při omezeném pohybu stojí a dá se posouvat prstem */}
      <div className="overflow-hidden bg-muza-ink motion-reduce:overflow-x-auto">
        <ul aria-label="Fotky z ateliéru" className="flex w-max animate-marquee motion-reduce:animate-none will-change-transform">
          {[...PHOTOS, ...PHOTOS].map((p, i) => (
            <li key={i} aria-hidden={i >= PHOTOS.length ? true : undefined} className="shrink-0 h-[58vw] max-h-[340px] lg:h-[520px] lg:max-h-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/atelier/atelier-${p.id}.webp`}
                alt={i >= PHOTOS.length ? '' : p.alt}
                width={1600} height={1073}
                loading={i < 3 ? undefined : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
                draggable={false}
                className="block h-full w-auto object-cover" />
            </li>
          ))}
        </ul>
      </div>

      {/* Ateliér */}
      <div className="px-5 pt-9 pb-14 lg:px-16 lg:py-16 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:items-start max-w-7xl mx-auto">
        <div>
          <h1 className="font-cormorant font-light text-muza-ink text-[44px] leading-[1.02] lg:text-[64px] tracking-[-0.01em]">
            Každý pramen prošel <em className="italic">našima rukama.</em>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-text-mid max-w-[420px]">
            Pravé vlasy z vlastní barvírny v Praze. Vyberte kolekci, délku a odstín si složíte na míru.
          </p>
        </div>

        <div className="mt-8 lg:mt-2 max-w-[480px]">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-ink mb-3">Kolekce</div>
          <div role="radiogroup" aria-label="Kolekce" className="grid grid-cols-3 gap-2">
            {COLLECTIONS.map((col, i) => {
              const on = i === active;
              return (
                <button key={col.name} type="button" role="radio" aria-checked={on} onClick={() => setActive(i)}
                  className={`min-h-[52px] px-2 rounded-2xl text-sm leading-tight transition-colors duration-150 ${on ? 'bg-muza-ink text-muza-onink' : 'bg-muza-mocha text-text-dark hover:bg-[#D3C6B9]'}`}>
                  {col.name}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-muza-ink pt-5">
            <div aria-live="polite">
              <div className="font-cormorant text-[30px] leading-none text-muza-ink">{c.price}</div>
              <div className="mt-1.5 text-[13px] text-text-mid">{c.note}</div>
            </div>
          </div>
          <Link href={c.href}
            className="mt-6 h-14 flex items-center justify-center gap-2.5 rounded-full bg-muza-ink text-muza-onink text-[15px] hover:opacity-90 transition-opacity">
            Vybrat délku a odstín
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
