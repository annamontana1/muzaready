import Link from 'next/link';
import { Metadata } from 'next';
import { mockProducts } from '@/lib/mock-products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Vlasy k prodloužení - Mùza Hair Praha',
  description: 'Prémiové vlasy k prodloužení. Nebarvené panenské vlasy, barvené blond, keratin, pásky, tresy. 100% přírodní vlasy.',
};

export default function VlasyKProdlouzeniPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Vlasy k prodloužení
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          Objevte naši kolekci prémiových vlasů k prodloužení. Nabízíme nebarvené panenské vlasy,
          profesionálně barvené blond odstíny, keratin, nano pásky i ručně šité tresy.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
          >
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Nebarvené panenské vlasy
            </h3>
            <p className="text-gray-700 mb-4">
              100% přírodní vlasy bez chemie. Standard, LUXE, Platinum edition.
            </p>
            <span className="text-burgundy font-medium group-hover:underline">
              Zobrazit produkty →
            </span>
          </Link>

          <Link
            href="/vlasy-k-prodlouzeni/barvene-blond"
            className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Barvené blond vlasy
            </h3>
            <p className="text-gray-700 mb-4">
              Profesionálně odbarvené odstíny 5-10. Dlouhá životnost.
            </p>
            <span className="text-burgundy font-medium group-hover:underline">
              Zobrazit produkty →
            </span>
          </Link>

          <Link
            href="/vlasy-k-prodlouzeni/vlasy-na-keratin"
            className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
          >
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Vlasy na keratin
            </h3>
            <p className="text-gray-700 mb-4">
              Prémiové vlasy vhodné pro keratinovou metodu prodlužování.
            </p>
            <span className="text-burgundy font-medium group-hover:underline">
              Zobrazit produkty →
            </span>
          </Link>

          <Link
            href="/vlasy-k-prodlouzeni/pasky-nano-tapes"
            className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
          >
            <div className="text-4xl mb-4">📏</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Pásky (nano tapes)
            </h3>
            <p className="text-gray-700 mb-4">
              Profesionální nano tapes. Rychlá aplikace, šetrné k vlasům.
            </p>
            <span className="text-burgundy font-medium group-hover:underline">
              Zobrazit produkty →
            </span>
          </Link>

          <Link
            href="/vlasy-k-prodlouzeni/vlasove-tresy"
            className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
          >
            <div className="text-4xl mb-4">🧵</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Vlasové tresy (ručně šité)
            </h3>
            <p className="text-gray-700 mb-4">
              Ručně šité vlasové tresy. Pevné, pohodlné, dlouhá životnost.
            </p>
            <span className="text-burgundy font-medium group-hover:underline">
              Zobrazit produkty →
            </span>
          </Link>
        </div>

        {/* Všechny produkty */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-playfair text-burgundy mb-4">
            Všechny produkty vlasy k prodloužení
          </h2>
          <p className="text-gray-700 mb-8">
            Kompletní nabídka našich vlasů - nebarvené panenské i barvené blond vlasy ve třech úrovních kvality.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
