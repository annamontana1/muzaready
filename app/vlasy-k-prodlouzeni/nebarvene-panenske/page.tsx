import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mock-products';

export const metadata: Metadata = {
  title: 'Nebarvené panenské vlasy – Standard, LUXE, Platinum | Mùza Hair',
  description: '100% panenské vlasy bez chemie. Odstíny 1-5 (Std/LUXE), 1-9 (Platinum). Délky 35-90 cm, různé struktury.',
};

export default function NebarvenePanenskePage() {
  // Filtruj pouze nebarvené produkty
  const products = mockProducts.filter((p) => p.category === 'nebarvene_panenske');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Nebarvené panenské vlasy
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            100% přírodní vlasy bez chemie. Dostupné v kvalitách Standard, LUXE a Platinum edition.
            Odstíny 1-5 (Standard/LUXE) nebo 1-9 (Platinum).
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-8 p-6 bg-ivory rounded-lg border-l-4 border-burgundy">
          <h3 className="font-semibold text-burgundy mb-2">📏 Jak měříme vlasy</h3>
          <p className="text-sm text-gray-700">
            Všechny délky měříme <strong>tak, jak vlasy leží</strong> – nic nenatahujeme.
            To platí i pro kudrnaté a vlnité struktury.
          </p>
        </div>

        {/* Filters placeholder */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-burgundy text-white rounded-full text-sm">
            Všechny kvality
          </button>
          <button className="px-4 py-2 bg-white text-burgundy border border-burgundy rounded-full text-sm hover:bg-burgundy hover:text-white transition">
            Standard
          </button>
          <button className="px-4 py-2 bg-white text-burgundy border border-burgundy rounded-full text-sm hover:bg-burgundy hover:text-white transition">
            LUXE
          </button>
          <button className="px-4 py-2 bg-white text-burgundy border border-burgundy rounded-full text-sm hover:bg-burgundy hover:text-white transition">
            Platinum edition
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state if no products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Žádné produkty nenalezeny.</p>
          </div>
        )}
      </div>
    </div>
  );
}
