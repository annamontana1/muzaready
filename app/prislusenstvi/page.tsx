import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Příslušenství k prodloužení vlasů | Keratin, Hřebeny | Múza Hair',
  description: 'Příslušenství pro prodloužení a péči o vlasy — keratin, speciální hřebeny, kosmetika. Vše pro správnou péči o prodloužené vlasy. Múza Hair Praha.',
  alternates: { canonical: 'https://muzahair.cz/prislusenstvi' },
  openGraph: {
    title: 'Příslušenství k prodloužení vlasů | Keratin, Hřebeny | Múza Hair',
    description: 'Příslušenství pro prodloužení a péči o vlasy — keratin, speciální hřebeny, kosmetika. Vše pro správnou péči o prodloužené vlasy. Múza Hair Praha.',
    url: 'https://muzahair.cz/prislusenstvi',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function PrislusenstviPage() {
  const items = [
    { href: '/prislusenstvi/tavici-kleste', title: 'Tavicí kleště' },
    { href: '/prislusenstvi/keratin', title: 'Keratin' },
    { href: '/prislusenstvi/pomykadlo', title: 'Pomykadlo' },
    { href: '/prislusenstvi/hrebeny', title: 'Hřebeny' },
    { href: '/prislusenstvi/kosmetika', title: 'Kosmetika' },
    { href: '/prislusenstvi/ostatni', title: 'Ostatní' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-cormorant font-light text-text-dark mb-4">Příslušenství</h1>
        <p className="text-lg text-text-mid mb-12 max-w-2xl">Vše potřebné pro práci s vlasy a péči o ně.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 min-h-[64px] px-6 py-5 bg-white border border-beige-mid transition-colors hover:border-burgundy"
            >
              <h2 className="text-2xl font-cormorant text-text-dark">{item.title}</h2>
              <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0 text-burgundy transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
