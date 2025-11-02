import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mock-products';

export const metadata: Metadata = {
  title: 'Barvené blond vlasy – profesionálně odbarvené | Mùza Hair',
  description: 'Prémiově barvené blond vlasy v odstínech 5-10. Délky 35-90 cm, rovné i vlnité.',
};

export default function BarveneBlondPage() {
  // Filtruj pouze barvené produkty
  const products = mockProducts.filter((p) => p.category === 'barvene_blond');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Barvené blond vlasy
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Profesionálně odbarvené blond vlasy v odstínech 5-10. Dostupné ve všech kvalitách:
            Standard, LUXE, Platinum edition.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-8 p-6 bg-ivory rounded-lg border-l-4 border-burgundy">
          <h3 className="font-semibold text-burgundy mb-2">✨ Vlastní barvírna</h3>
          <p className="text-sm text-gray-700">
            Všechny blond vlasy jsou profesionálně obarvené v naší pražské barvírně.
            Garantujeme krásné, rovnoměrné odstíny a dlouhou životnost.
          </p>
        </div>

        {/* Filters placeholder */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-burgundy text-white rounded-full text-sm">
            Všechny odstíny
          </button>
          <button className="px-4 py-2 bg-white text-burgundy border border-burgundy rounded-full text-sm hover:bg-burgundy hover:text-white transition">
            Odstín 5-7
          </button>
          <button className="px-4 py-2 bg-white text-burgundy border border-burgundy rounded-full text-sm hover:bg-burgundy hover:text-white transition">
            Odstín 8-10
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
