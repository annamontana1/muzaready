'use client';

import Link from 'next/link';
import { useState } from 'react';

// Vzorník odstínů: vybraný odstín se rozevře, ostatní zůstanou jako proužky
const SHADES = [
  { num: 1, name: 'Černá', src: '/images/shades/01-cerna.jpg' },
  { num: 3, name: 'Tmavě hnědá', src: '/images/shades/03-tmava-hneda.jpg' },
  { num: 4, name: 'Hnědá', src: '/images/shades/04-hneda.jpg' },
  { num: 5, name: 'Světle hnědá', src: '/images/shades/05-svetla-hneda.jpg' },
  { num: 6, name: 'Tmavá blond', src: '/images/shades/06-tmava-blond.jpg' },
  { num: 7, name: 'Blond', src: '/images/shades/07-blond.jpg' },
  { num: 8, name: 'Světlá blond', src: '/images/shades/08-svetla-blond.jpg' },
  { num: 9, name: 'Velmi světlá blond', src: '/images/shades/09-velmi-svetla-blond.jpg' },
  { num: 10, name: 'Platinová blond', src: '/images/shades/10-platinova-blond.jpg' },
];

const WHATSAPP = 'https://wa.me/420728722880';

export default function ShadeLadder() {
  const [sel, setSel] = useState(5);
  const s = SHADES[sel];

  return (
    <section aria-labelledby="h-odstiny" className="bg-muza-ivory">
      <div className="max-w-7xl mx-auto px-5 lg:px-16 pt-6 pb-8 lg:pt-8 lg:pb-12 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:items-center">
        <div>
          <h2 id="h-odstiny" className="font-cormorant font-light text-muza-ink text-[34px] leading-[1.04] lg:text-[48px]">
            Najděte svůj odstín. <em className="italic">Barvíme ho sami.</em>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-text-mid max-w-[420px]">
            Odstíny z naší pražské barvírny. Vyberte ten svůj a ukážeme vám vlasy, které ho mají skladem.
          </p>

          {/* Desktop: informace o vybraném odstínu */}
          <div className="hidden lg:block mt-10 border-t border-muza-ink pt-6">
            <ShadeInfo shade={s} />
          </div>
        </div>

        {/* Žebřík odstínů */}
        <div role="radiogroup" aria-label="Odstíny" className="mt-9 lg:mt-0 flex gap-1.5 lg:gap-2 h-[380px] lg:h-[560px]">
          {SHADES.map((x, i) => {
            const on = i === sel;
            return (
              <button key={x.num} type="button" role="radio" aria-checked={on} aria-label={`Odstín ${x.num}, ${x.name}`}
                onClick={() => setSel(i)}
                className="relative min-w-0 overflow-hidden rounded-t-full rounded-b-xl bg-muza-mocha transition-[flex-grow,opacity] duration-[420ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                style={{ flex: on ? '6 1 0' : '1 1 0', opacity: on ? 1 : 0.85 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-cormorant text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${on ? 'text-2xl' : 'text-sm'}`}>
                  {x.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobil: informace pod žebříkem */}
        <div className="lg:hidden mt-6">
          <ShadeInfo shade={s} />
        </div>
      </div>

    </section>
  );
}

// Pruh „Odstín na míru“; na hlavní stránce stojí až pod culíky k odeslání
export function CustomShadeBand() {
  return (
      <div className="bg-muza-ink text-muza-onink">
        <div className="max-w-7xl mx-auto px-5 lg:px-12 py-10 lg:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="font-cormorant font-light text-[30px] lg:text-[36px] leading-tight">
              Váš odstín mezi nimi není? <em className="italic text-muza-sand">Namícháme ho.</em>
            </h3>
            <p className="mt-2 text-sm text-[#D8C3BA]">Pošlete fotku vlasů na denním světle a připravíme odstín na míru.</p>
          </div>
          <a href={`${WHATSAPP}?text=${encodeURIComponent('Dobrý den, posílám fotku svých vlasů, můžete mi namíchat odstín na míru?')}`}
            target="_blank" rel="noopener"
            className="h-14 px-8 flex-none rounded-full bg-muza-onink text-muza-ink text-[15px] flex items-center justify-center hover:opacity-90 transition-opacity">
            Poslat fotku
          </a>
        </div>
      </div>
  );
}

function ShadeInfo({ shade }: { shade: (typeof SHADES)[number] }) {
  return (
    <div aria-live="polite">
      <div className="flex items-baseline gap-3">
        <span className="font-cormorant text-[44px] leading-none text-muza-ink">{shade.num}</span>
        <span className="text-lg">{shade.name}</span>
      </div>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link href={`/katalog?odstin=${shade.num}`}
          className="h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm flex items-center justify-center hover:opacity-90 transition-opacity">
          Vlasy v odstínu {shade.num}
        </Link>
        <a href={`${WHATSAPP}?text=${encodeURIComponent('Dobrý den, nevím si rady s výběrem odstínu, můžete mi poradit?')}`}
          target="_blank" rel="noopener"
          className="h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm flex items-center justify-center hover:bg-muza-ink hover:text-muza-onink transition-colors">
          Nevím, poraďte
        </a>
      </div>
    </div>
  );
}
