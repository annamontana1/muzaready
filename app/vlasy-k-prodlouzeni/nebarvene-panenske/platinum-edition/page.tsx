'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { mockProducts } from '@/lib/mock-products';
import { HAIR_COLORS } from '@/types/product';

type FilterState = {
  shades: number[];
  structures: string[];
  lengths: number[];
  endings: string[];
};

export default function PlatinumCategoryPage() {
  const [filters, setFilters] = useState<FilterState>({
    shades: [],
    structures: [],
    lengths: [],
    endings: [],
  });

  // Filtruj produkty: nebarvené + tier Platinum edition
  const products = useMemo(() => {
    return mockProducts.filter((p) =>
      p.category === 'nebarvene_panenske' && p.tier === 'Platinum edition'
    );
  }, []);

  // Dostupné odstíny pro Platinum: 1, 3-10 (bez #2)
  const availableShades = [1, 3, 4, 5, 6, 7, 8, 9, 10];

  // Dostupné délky pro Platinum: 45-90
  const availableLengths = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

  // Aplikuj filtry
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.shades.length > 0) {
        const productShade = product.variants[0]?.shade;
        if (!productShade || !filters.shades.includes(productShade)) return false;
      }

      if (filters.structures.length > 0) {
        const productStructure = product.variants[0]?.structure;
        if (!productStructure || !filters.structures.includes(productStructure)) return false;
      }

      if (filters.lengths.length > 0) {
        const productLength = product.variants[0]?.length_cm;
        if (!productLength || !filters.lengths.includes(productLength)) return false;
      }

      return true;
    });
  }, [products, filters]);

  const toggleShade = (shade: number) => {
    setFilters((prev) => ({
      ...prev,
      shades: prev.shades.includes(shade)
        ? prev.shades.filter((s) => s !== shade)
        : [...prev.shades, shade],
    }));
  };

  const toggleStructure = (structure: string) => {
    setFilters((prev) => ({
      ...prev,
      structures: prev.structures.includes(structure)
        ? prev.structures.filter((s) => s !== structure)
        : [...prev.structures, structure],
    }));
  };

  const toggleLength = (length: number) => {
    setFilters((prev) => ({
      ...prev,
      lengths: prev.lengths.includes(length)
        ? prev.lengths.filter((l) => l !== length)
        : [...prev.lengths, length],
    }));
  };

  const resetFilters = () => {
    setFilters({
      shades: [],
      structures: [],
      lengths: [],
      endings: [],
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-burgundy">Domů</Link></li>
            <li><span className="mx-2">›</span></li>
            <li><Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link></li>
            <li><span className="mx-2">›</span></li>
            <li><Link href="/vlasy-k-prodlouzeni/nebarvene-panenske" className="hover:text-burgundy">Nebarvené panenské</Link></li>
            <li><span className="mx-2">›</span></li>
            <li className="text-burgundy font-medium">Platinum Edition</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Nebarvené panenské vlasy — Platinum Edition
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed">
            Exkluzivní Platinum Edition. Nejvyšší kvalita, nejhustší konce, širší škála odstínů 1–9.
            Délky 45–90 cm pro maximální variabilitu.
          </p>
        </div>

        {/* Filtr Lišta */}
        <div className="mb-8 p-6 bg-ivory rounded-xl border border-warm-beige">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-burgundy">Filtrovat produkty</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-burgundy hover:text-maroon transition underline"
            >
              Vymazat filtry
            </button>
          </div>

          {/* Odstíny - galerie s fotkami */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Odstín {filters.shades.length > 0 && `(${filters.shades.sort((a, b) => a - b).map(s => HAIR_COLORS[s]?.name).join(', ')})`}
            </label>
            <ShadeGallery
              availableShades={availableShades}
              selectedShades={filters.shades}
              onToggleShade={toggleShade}
            />
          </div>

          {/* Struktura */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Struktura {filters.structures.length > 0 && `(${filters.structures.length} vybráno)`}
            </label>
            <div className="flex flex-wrap gap-3 max-w-xl">
              {[
                { name: 'rovné', icon: '——' },
                { name: 'mírně vlnité', icon: '∼' },
                { name: 'vlnité', icon: '〜〜' },
                { name: 'kudrnaté', icon: '⟲' }
              ].map(({ name, icon }) => {
                const isSelected = filters.structures.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleStructure(name)}
                    aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                    className={`flex items-center justify-center w-14 h-11 rounded-lg transition ${
                      isSelected ? 'bg-burgundy/5 shadow-md' : 'bg-white hover:bg-burgundy/5 hover:shadow-sm'
                    }`}
                    style={{
                      outline: isSelected ? '2px solid #6E2A2A' : 'none',
                      outlineOffset: isSelected ? '2px' : '0'
                    }}
                  >
                    <span className="text-2xl leading-none text-burgundy">{icon}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Délka */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Délka (cm) {filters.lengths.length > 0 && `(${filters.lengths.length} vybráno)`}
            </label>
            <div className="flex flex-wrap gap-2 max-w-2xl">
              {availableLengths.map((length) => {
                const isSelected = filters.lengths.includes(length);
                return (
                  <button
                    key={length}
                    onClick={() => toggleLength(length)}
                    className={`px-3 h-9 rounded-lg text-base font-medium transition ${
                      isSelected
                        ? 'bg-burgundy/10 text-burgundy border-2 border-burgundy'
                        : 'bg-white text-burgundy border border-burgundy/30 hover:border-burgundy hover:bg-burgundy/5'
                    }`}
                  >
                    {length}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aktivní filtry */}
          {(filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0) && (
            <div className="pt-4 border-t border-warm-beige">
              <p className="text-sm text-gray-600 mb-2">Aktivní filtry:</p>
              <div className="flex flex-wrap gap-2">
                {filters.shades.sort((a, b) => a - b).map((shade) => (
                  <span key={shade} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {HAIR_COLORS[shade]?.name}
                  </span>
                ))}
                {filters.structures.map((structure) => (
                  <span key={structure} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {structure.charAt(0).toUpperCase() + structure.slice(1)}
                  </span>
                ))}
                {filters.lengths.map((length) => (
                  <span key={length} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {length} cm
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Počet výsledků */}
        <div className="mb-6">
          <p className="text-gray-600">
            Zobrazeno <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produkt' : filteredProducts.length < 5 ? 'produkty' : 'produktů'}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-playfair text-burgundy mb-2">
              Žádné produkty nenalezeny
            </h3>
            <p className="text-gray-600 mb-6">
              Zkuste změnit filtry nebo je vymažte a prohlédněte si celou nabídku.
            </p>
            <button onClick={resetFilters} className="btn-primary">
              Vymazat všechny filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
