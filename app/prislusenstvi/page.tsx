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
    { href: '/prislusenstvi/tavici-kleste', title: 'Tavicí kleště', icon: '🔧' },
    { href: '/prislusenstvi/keratin', title: 'Keratin', icon: '💊' },
    { href: '/prislusenstvi/pomykadlo', title: 'Pomykadlo', icon: '🪛' },
    { href: '/prislusenstvi/hrebeny', title: 'Hřebeny', icon: '💆‍♀️' },
    { href: '/prislusenstvi/kosmetika', title: 'Kosmetika', icon: '🧴' },
    { href: '/prislusenstvi/ostatni', title: 'Ostatní', icon: '📦' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-playfair text-burgundy mb-6">Příslušenství</h1>
        <p className="text-lg text-text-mid mb-12">Vše potřebné pro práci s vlasy a péči o ně.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-6 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-playfair text-burgundy">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
