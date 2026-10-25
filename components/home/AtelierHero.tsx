'use client';

import Link from 'next/link';
import { useState } from 'react';

// Úvod ve stylu „Ateliér na míru“: fotka v rámečku a malý výběr kolekce
const COLLECTIONS = [
  { name: 'Standard', note: 'Skvělá každodenní volba', price: 'od 6 900 Kč', href: '/vlasy-k-prodlouzeni/standard' },
  { name: 'LUXE', note: 'Od jedné dárkyně, jednotná struktura', price: 'od 8 900 Kč', href: '/vlasy-k-prodlouzeni/luxe' },
  { name: 'Platinum edition', note: 'Ručně tříděno, výkup ČR a SR', price: 'od 10 900 Kč', href: '/vlasy-k-prodlouzeni/platinum-edition' },
];

export default function AtelierHero() {
  const [active, setActive] = useState(1);
  const c = COLLECTIONS[active];

  return (
    <section className="bg-muza-ivory lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:min-h-[calc(100vh-108px)]">
      {/* Fotka */}
      <div className="px-4 pt-5 lg:p-10 lg:pr-0 flex">
        <div className="w-full rounded-t-[999px] rounded-b-[20px] border border-muza-ink p-[5px] max-w-[560px] mx-auto lg:max-w-none">
          <div className="relative h-[44vh] min-h-[300px] lg:h-full rounded-t-[999px] rounded-b-[14px] overflow-hidden bg-muza-mocha">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/hero-tmave-hnede-1080.webp"
              srcSet="/images/hero/hero-tmave-hnede-640.webp 640w, /images/hero/hero-tmave-hnede-1080.webp 1080w, /images/hero/hero-tmave-hnede-1600.webp 1600w"
              sizes="(min-width: 1024px) 52vw, 100vw"
              width={1600} height={2143}
              alt="Žena s dlouhými rovnými tmavě hnědými pravými vlasy u okna ve světlém pokoji"
              className="absolute inset-0 w-full h-full object-cover object-[45%_35%]" fetchPriority="high" />
          </div>
        </div>
      </div>

      {/* Ateliér */}
      <div className="px-5 pt-8 pb-14 lg:px-16 lg:py-16 flex flex-col justify-center">
        <h1 className="font-cormorant font-light text-muza-ink text-[44px] leading-[1.02] lg:text-[64px] tracking-[-0.01em]">
          Každý pramen prošel <em className="italic">našima rukama.</em>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-mid max-w-[420px]">
          Pravé vlasy z vlastní barvírny v Praze. Vyberte kolekci, délku a odstín si složíte na míru.
        </p>

        <div className="mt-8 max-w-[480px]">
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
