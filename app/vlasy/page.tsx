import { Metadata } from 'next';
import Link from 'next/link';
import { MESTA } from '@/lib/mesta';

export const metadata: Metadata = {
  title: 'Vlasy k prodloužení — doručení po celé ČR | Múza Hair',
  description: 'Vlasy k prodloužení s doručením po celé České republice. Keratinové pramínky, vlasové pásky nanotapes, vlasové tresy weft. Objednávka online, doprava do 2 pracovních dní.',
  alternates: { canonical: 'https://muzahair.cz/vlasy' },
  openGraph: {
    title: 'Vlasy k prodloužení — doručení po celé ČR | Múza Hair',
    description: 'Keratinové pramínky, nanotapes, vlasové tresy — objednávka online s doručením do celé ČR.',
    url: 'https://muzahair.cz/vlasy',
    siteName: 'Múza Hair',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function VlasyIndexPage() {
  return (
    <div className="py-12 bg-soft-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Breadcrumb */}
        <div className="text-sm text-text-mid mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <span className="text-burgundy">Vlasy k prodloužení — doručení po ČR</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Vlasy k prodloužení — doručení po celé ČR
          </h1>
          <p className="text-lg text-text-mid max-w-2xl mx-auto">
            Objednávka online. Keratinové pramínky, vlasové pásky nanotapes a vlasové tresy
            zasíláme na celou Českou republiku. Expedice do 2 pracovních dní.
          </p>
        </div>

        {/* Produkty */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-medium p-6">
            <span className="text-3xl">💎</span>
            <h2 className="font-playfair text-xl text-burgundy mt-3 mb-2">Keratinové pramínky</h2>
            <p className="text-sm text-text-mid mb-4">Standart, mikrokeratin, platinum. Délky 40–70 cm, nebarvené i barvené.</p>
            <Link href="/vlasy-k-prodlouzeni" className="text-burgundy text-sm font-semibold hover:underline">
              Nakonfigurovat →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-medium p-6">
            <span className="text-3xl">🩹</span>
            <h2 className="font-playfair text-xl text-burgundy mt-3 mb-2">Vlasové pásky Nanotapes</h2>
            <p className="text-sm text-text-mid mb-4">Tape-In 2,8 cm i 4 cm. 10 spojů / balení. Bez tepla a chemie.</p>
            <Link href="/metody-zakonceni/vlasove-pasky-tape-in" className="text-burgundy text-sm font-semibold hover:underline">
              Zobrazit →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-medium p-6">
            <span className="text-3xl">🧵</span>
            <h2 className="font-playfair text-xl text-burgundy mt-3 mb-2">Vlasové tresy Weft</h2>
            <p className="text-sm text-text-mid mb-4">Ručně šité na zakázku. Výroba 14 dní. Hollywoodské prodloužení.</p>
            <Link href="/metody-zakonceni/vlasove-tresy" className="text-burgundy text-sm font-semibold hover:underline">
              Zobrazit →
            </Link>
          </div>
        </div>

        {/* Města */}
        <h2 className="text-2xl font-playfair text-burgundy mb-6">Vyberte své město</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MESTA.map((m) => (
            <Link
              key={m.slug}
              href={`/vlasy/${m.slug}`}
              className="bg-white border border-warm-beige rounded-xl p-4 text-center hover:border-burgundy hover:shadow-medium transition group"
            >
              <p className="font-semibold text-text-dark group-hover:text-burgundy transition">{m.name}</p>
              <p className="text-xs text-text-soft mt-0.5">{m.region.replace(' kraj', '')}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-text-soft">
            Vaše město tu není?{' '}
            <Link href="/vlasy-k-prodlouzeni" className="text-burgundy hover:underline font-medium">
              Objednávka je možná kamkoliv v ČR →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
