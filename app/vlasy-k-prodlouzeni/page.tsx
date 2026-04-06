'use client';

import Link from 'next/link';
import { MESTA } from '@/lib/mesta';

const tiers = [
  {
    name: 'Standard',
    href: '/vlasy-k-prodlouzeni/standard',
    description: 'Kvalitní panenské vlasy za výhodnou cenu.',
    color: 'bg-warm-beige',
  },
  {
    name: 'Luxe',
    href: '/vlasy-k-prodlouzeni/luxe',
    description: 'Prémiové vlasy s hedvábnou strukturou.',
    color: 'bg-warm-beige',
  },
  {
    name: 'Platinum Edition',
    href: '/vlasy-k-prodlouzeni/platinum-edition',
    description: 'Exkluzivní culíky v limitované edici.',
    color: 'bg-warm-beige',
  },
  {
    name: 'Baby Shades',
    href: '/vlasy-k-prodlouzeni/baby-shades',
    description: 'Jemné dětské vlasy v přirozených odstínech.',
    color: 'bg-warm-beige',
  },
];

export default function VlasyKProdlouzenLanding() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-text-mid">
            <li>
              <Link href="/" className="hover:text-burgundy transition">
                Domu
              </Link>
            </li>
            <li>/</li>
            <li className="text-burgundy font-medium">Vlasy k prodloužení</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-playfair text-burgundy mb-6">
            Vlasy k prodloužení
          </h1>
          <p className="text-xl text-text-mid max-w-2xl mx-auto">
            Vyberte si kvalitu panenských vlasu a prohlédněte si naši kompletní nabídku s možností filtrování
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <Link key={tier.name} href={tier.href} className="group">
              <div className={`${tier.color} rounded-2xl shadow-light hover:shadow-card-hover transition-all p-12 text-center h-full flex flex-col justify-center items-center border border-warm-beige hover:border-burgundy`}>
                <h2 className="text-3xl font-playfair font-bold text-burgundy mb-3 group-hover:text-maroon transition">
                  {tier.name}
                </h2>
                <p className="text-text-mid mb-6">
                  {tier.description}
                </p>
                <span className="text-burgundy font-semibold group-hover:text-maroon transition">
                  Prohlédnout katalog &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-light p-8 text-center border border-warm-beige">
          <h3 className="text-2xl font-semibold text-burgundy mb-4">
            Jak funguje filtrování?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="font-semibold text-burgundy mb-2">Typ vlasu</div>
              <p className="text-text-mid text-sm">
                Filtrujte podle typu: nebarvené panenské nebo barvené blond vlasy
              </p>
            </div>
            <div>
              <div className="font-semibold text-burgundy mb-2">Odstín</div>
              <p className="text-text-mid text-sm">
                Vyberte si z dostupných odstínu 1-10 podle galerie barev
              </p>
            </div>
            <div>
              <div className="font-semibold text-burgundy mb-2">Struktura</div>
              <p className="text-text-mid text-sm">
                Filtrujte podle typu: rovné, mírně vlnité, vlnité, kudrnaté
              </p>
            </div>
          </div>
        </div>

        {/* Doručujeme po celé ČR */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-playfair text-burgundy mb-2">Doručujeme po celé České republice</h2>
          <p className="text-sm text-text-soft mb-6">Vyberte své město — stránka s informacemi o produktech a dopravě přímo k vám</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {MESTA.map((m) => (
              <Link key={m.slug} href={`/vlasy/${m.slug}`} className="bg-white border border-warm-beige rounded-lg px-3 py-2.5 text-center hover:border-burgundy hover:text-burgundy text-sm text-text-mid transition">
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
