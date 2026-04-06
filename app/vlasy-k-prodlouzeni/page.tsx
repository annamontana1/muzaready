'use client';

import Link from 'next/link';
import { MESTA } from '@/lib/mesta';

const tiers = [
  {
    name: 'Standard',
    href: '/vlasy-k-prodlouzeni/standard',
    description: 'Kvalitní panenské vlasy za výhodnou cenu.',
    note: 'Ideální volba pro první prodloužení',
  },
  {
    name: 'Luxe',
    href: '/vlasy-k-prodlouzeni/luxe',
    description: 'Prémiové vlasy s hedvábnou strukturou.',
    note: 'Nejprodávanější kolekce',
  },
  {
    name: 'Platinum Edition',
    href: '/vlasy-k-prodlouzeni/platinum-edition',
    description: 'Exkluzivní culíky v limitované edici.',
    note: 'Limitovaná edice · nejvyšší kvalita',
  },
  {
    name: 'Baby Shades',
    href: '/vlasy-k-prodlouzeni/baby-shades',
    description: 'Jemné dětské vlasy v přirozených odstínech.',
    note: 'Přirozené odstíny · ultra jemná textura',
  },
];

export default function VlasyKProdlouzenLanding() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Hero section */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-light mb-10"
          style={{ color: 'var(--text-soft)' }}
        >
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          {' — '}
          <span style={{ color: 'var(--text-mid)' }}>Vlasy k prodloužení</span>
        </div>

        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          KOLEKCE
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Vlasy k prodloužení
        </h1>

        <p
          className="text-[15px] leading-[1.8] font-light max-w-[520px]"
          style={{ color: 'var(--text-soft)' }}
        >
          Vyberte si kvalitu panenských vlasů a prohlédněte si naši kompletní nabídku.
          Čtyři kolekce pro každou příležitost — od každodenního nošení po výjimečné momenty.
        </p>
      </section>

      {/* Tiers list */}
      <section style={{ background: 'var(--beige)' }}>
        {tiers.map((tier, index) => (
          <Link key={tier.name} href={tier.href} className="group block">
            <div
              className="px-8 lg:px-20 py-12 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-all"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div className="flex-1">
                <div
                  className="text-[11px] tracking-[0.15em] uppercase font-light mb-2"
                  style={{ color: 'var(--text-soft)' }}
                >
                  0{index + 1} — {tier.note}
                </div>
                <h2
                  className="font-cormorant text-[clamp(26px,3vw,38px)] font-light mb-2 transition-colors group-hover:opacity-80"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {tier.name}
                </h2>
                <p
                  className="text-[15px] leading-[1.8] font-light"
                  style={{ color: 'var(--text-soft)' }}
                >
                  {tier.description}
                </p>
              </div>
              <div
                className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-all group-hover:gap-4"
                style={{ color: 'var(--text-mid)' }}
              >
                Prohlédnout katalog →
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* City SEO section */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
        <div className="w-12 h-px mb-8" style={{ background: 'var(--accent)' }} />
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          MESTA
        </div>
        <h2
          className="font-cormorant text-[clamp(26px,3vw,38px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Doručujeme po celé České republice
        </h2>
        <p
          className="text-[15px] leading-[1.8] font-light mb-10 max-w-[440px]"
          style={{ color: 'var(--text-soft)' }}
        >
          Vyberte své město — stránka s informacemi o produktech a dopravě přímo k vám.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-x-6 gap-y-3">
          {MESTA.map((m) => (
            <Link
              key={m.slug}
              href={`/vlasy/${m.slug}`}
              className="text-[12px] tracking-[0.05em] uppercase font-light transition-colors hover:underline"
              style={{ color: 'var(--text-mid)' }}
            >
              {m.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
