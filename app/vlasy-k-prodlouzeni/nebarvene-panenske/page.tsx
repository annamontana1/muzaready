'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/mock-products';
import { ProductTier, HAIR_COLORS } from '@/types/product';

type FilterState = {
  tier: ProductTier | 'all';
  shades: number[];
  structures: string[];
  lengths: number[];
  weightRange: string;
  availability: 'all' | 'in_stock' | 'on_order';
};

export default function NebarvenePanenskePage() {
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    shades: [],
    structures: [],
    lengths: [],
    weightRange: 'all',
    availability: 'all',
  });

  // Filtruj pouze nebarvené produkty
  const nebarveneProdukty = mockProducts.filter((p) => p.category === 'nebarvene_panenske');

  // Dostupné odstíny podle tieru
  const availableShades = useMemo(() => {
    if (filters.tier === 'Platinum edition') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (filters.tier === 'all') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return [1, 2, 3, 4]; // Standard a LUXE
  }, [filters.tier]);

  // Dostupné délky podle tieru
  const availableLengths = useMemo(() => {
    if (filters.tier === 'Standard') return [35, 40, 45, 50, 55, 60, 65, 70, 75];
    if (filters.tier === 'LUXE') return [40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
    if (filters.tier === 'Platinum edition') return [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
    return [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]; // Všechny
  }, [filters.tier]);

  // Aplikuj filtry
  const filteredProducts = useMemo(() => {
    return nebarveneProdukty.filter((product) => {
      // Tier filtr
      if (filters.tier !== 'all' && product.tier !== filters.tier) return false;

      // Odstín filtr (pokud jsou vybrané odstíny)
      if (filters.shades.length > 0) {
        const productShade = product.variants[0]?.shade;
        if (!productShade || !filters.shades.includes(productShade)) return false;
      }

      // Struktura filtr
      if (filters.structures.length > 0) {
        const productStructure = product.variants[0]?.structure;
        if (!productStructure || !filters.structures.includes(productStructure)) return false;
      }

      // Délka filtr
      if (filters.lengths.length > 0) {
        const productLength = product.variants[0]?.length_cm;
        if (!productLength || !filters.lengths.includes(productLength)) return false;
      }

      return true;
    });
  }, [nebarveneProdukty, filters]);

  const handleTierBoxClick = (tier: ProductTier) => {
    setFilters((prev) => ({
      ...prev,
      tier,
    }));
  };

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
      tier: 'all',
      shades: [],
      structures: [],
      lengths: [],
      weightRange: 'all',
      availability: 'all',
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Nebarvené panenské vlasy
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed">
            100 % panenské vlasy bez chemického ošetření. Přirozené odstíny, vysoká životnost, krásné konce.
            Délku měříme tak, jak vlasy leží (nenatahujeme). Na přání zakončíme: keratin / mikro-keratin /
            nano tapes / ručně šité tresy (sewing weft).
          </p>
        </div>

        {/* Tier Kategorie - 3 boxy */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Standard */}
          <button
            onClick={() => handleTierBoxClick('Standard')}
            className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              filters.tier === 'Standard'
                ? 'border-burgundy bg-burgundy/5'
                : 'border-warm-beige bg-white hover:border-burgundy/50'
            }`}
          >
            <h3 className="text-xl font-playfair text-burgundy mb-2">Standard</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Skvělý poměr cena / životnost. Pečlivě vybrané copánky, přirozené odstíny 1–4,
              délky 35–75 cm.
            </p>
          </button>

          {/* LUXE */}
          <button
            onClick={() => handleTierBoxClick('LUXE')}
            className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              filters.tier === 'LUXE'
                ? 'border-burgundy bg-burgundy/5'
                : 'border-warm-beige bg-white hover:border-burgundy/50'
            }`}
          >
            <h3 className="text-xl font-playfair text-burgundy mb-2">LUXE</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Hustší konce, vyšší selekce, konzistentní struktura. Přirozené odstíny 1–4,
              délky 40–85 cm.
            </p>
          </button>

          {/* Platinum Edition */}
          <button
            onClick={() => handleTierBoxClick('Platinum edition')}
            className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              filters.tier === 'Platinum edition'
                ? 'border-burgundy bg-burgundy/5'
                : 'border-warm-beige bg-white hover:border-burgundy/50'
            }`}
          >
            <h3 className="text-xl font-playfair text-burgundy mb-2">Platinum Edition</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Náš nejvyšší výběr: extra husté konce, unikátní délky, limitované šarže.
              Přirozené odstíny 1–10, délky 45–90 cm.
            </p>
          </button>
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

          {/* Odstíny */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Odstín {filters.shades.length > 0 && `(${filters.shades.length} vybráno)`}
            </label>
            <div className="grid grid-cols-5 gap-2 max-w-xl">
              {availableShades.map((shade) => {
                const color = HAIR_COLORS[shade];
                return (
                  <button
                    key={shade}
                    onClick={() => toggleShade(shade)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                      filters.shades.includes(shade)
                        ? 'bg-burgundy text-white'
                        : 'bg-white text-burgundy border border-burgundy hover:bg-burgundy/10'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color?.hex }}
                      title={color?.name}
                    />
                    <span>{shade}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Struktura */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Struktura {filters.structures.length > 0 && `(${filters.structures.length} vybráno)`}
            </label>
            <div className="flex gap-2 max-w-xl">
              {['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'].map((structure) => (
                <button
                  key={structure}
                  onClick={() => toggleStructure(structure)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    filters.structures.includes(structure)
                      ? 'bg-burgundy text-white'
                      : 'bg-white text-burgundy border border-burgundy hover:bg-burgundy/10'
                  }`}
                >
                  {structure.charAt(0).toUpperCase() + structure.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Délka */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Délka (cm) {filters.lengths.length > 0 && `(${filters.lengths.length} vybráno)`}
            </label>
            <div className="grid grid-cols-6 gap-2 max-w-2xl">
              {availableLengths.map((length) => (
                <button
                  key={length}
                  onClick={() => toggleLength(length)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                    filters.lengths.includes(length)
                      ? 'bg-burgundy text-white'
                      : 'bg-white text-burgundy border border-burgundy hover:bg-burgundy/10'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Aktivní filtry */}
          {(filters.tier !== 'all' || filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0) && (
            <div className="pt-4 border-t border-warm-beige">
              <p className="text-sm text-gray-600 mb-2">Aktivní filtry:</p>
              <div className="flex flex-wrap gap-2">
                {filters.tier !== 'all' && (
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full text-xs">
                    {filters.tier}
                  </span>
                )}
                {filters.shades.map((shade) => (
                  <span key={shade} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs">
                    Odstín {shade}
                  </span>
                ))}
                {filters.structures.map((structure) => (
                  <span key={structure} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs">
                    {structure}
                  </span>
                ))}
                {filters.lengths.map((length) => (
                  <span key={length} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs">
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
            <button
              onClick={resetFilters}
              className="btn-primary"
            >
              Vymazat všechny filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
