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
  availability: 'all' | 'in_stock' | 'on_order';
};

export default function BarveneBlondPage() {
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    shades: [],
    structures: [],
    lengths: [],
    availability: 'all',
  });

  // Filtruj pouze barvené produkty
  const barveneProdukty = mockProducts.filter((p) => p.category === 'barvene_blond');

  // Dostupné odstíny pro barvené (5-10)
  const availableShades = [5, 6, 7, 8, 9, 10];

  // Dostupné délky podle tieru
  const availableLengths = useMemo(() => {
    if (filters.tier === 'Standard') return [35, 40, 45, 50, 55, 60, 65, 70, 75];
    if (filters.tier === 'LUXE') return [40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
    if (filters.tier === 'Platinum edition') return [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
    return [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]; // Všechny
  }, [filters.tier]);

  // Aplikuj filtry
  const filteredProducts = useMemo(() => {
    return barveneProdukty.filter((product) => {
      // Tier filtr
      if (filters.tier !== 'all' && product.tier !== filters.tier) return false;

      // Odstín filtr
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
  }, [barveneProdukty, filters]);

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
      availability: 'all',
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Barvené blond vlasy
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed">
            Profesionálně odbarvené blond vlasy v odstínech 5-10. Dostupné ve všech kvalitách:
            Standard, LUXE, Platinum edition.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-8 p-5 bg-ivory rounded-lg border-l-4 border-burgundy">
          <h3 className="text-base font-semibold text-burgundy mb-2">✨ Vlastní barvírna</h3>
          <p className="text-xs text-gray-700">
            Všechny blond vlasy jsou profesionálně obarvené v naší pražské barvírně.
            Garantujeme krásné, rovnoměrné odstíny a dlouhou životnost.
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
              Profesionálně barvené vlasy s krásným blond odstínem. Délky 35–75 cm.
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
              Vyšší kvalita barvení, hustší konce. Délky 40–85 cm.
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
              Premium barvené vlasy, exkluzivní kvalita. Délky 45–90 cm.
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

          {/* Odstíny - mřížka 5×2, bordó outline */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Odstín {filters.shades.length > 0 && `(${filters.shades.sort((a, b) => a - b).map(s => HAIR_COLORS[s]?.name).join(', ')})`}
            </label>
            <div className="grid grid-cols-5 gap-2.5 max-w-md">
              {availableShades.map((shade) => {
                const color = HAIR_COLORS[shade];
                const isSelected = filters.shades.includes(shade);
                return (
                  <button
                    key={shade}
                    onClick={() => toggleShade(shade)}
                    aria-label={`#${shade} – ${color?.name}`}
                    className="flex flex-col items-center gap-1.5 transition cursor-pointer group"
                  >
                    {/* Číslo NAD kolečkem */}
                    <span className={`text-xs font-semibold transition ${
                      isSelected ? 'text-[#6E2A2A]' : 'text-gray-600 group-hover:text-[#6E2A2A]'
                    }`}>
                      #{shade}
                    </span>
                    {/* Kolečko s bordó outline */}
                    <div
                      className={`w-10 h-10 rounded-full transition ${
                        isSelected
                          ? 'shadow-md'
                          : 'group-hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: color?.hex,
                        outline: isSelected ? '2px solid #6E2A2A' : 'none',
                        outlineOffset: isSelected ? '2px' : '0'
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Warning pro odstíny 1-4 */}
            {filters.shades.some(s => s >= 1 && s <= 4) && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  ⚠️ Některé vybrané odstíny nejsou dostupné v barvených vlasech.
                  {filters.shades.filter(s => s >= 1 && s <= 4).length > 0 && (
                    <span className="block mt-1">
                      Pro odstíny 1-4 zkuste: <a href="/vlasy-k-prodlouzeni/nebarvene-panenske" className="font-semibold underline hover:text-amber-900">Nebarvené panenské vlasy</a>
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Struktura - JEN ikony, větší ploška */}
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
                      isSelected
                        ? 'bg-burgundy/5 shadow-md'
                        : 'bg-white hover:bg-burgundy/5 hover:shadow-sm'
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

          {/* Délka - menší chipy s větším textem */}
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

          {/* Aktivní filtry - sjednocené odstíny */}
          {(filters.tier !== 'all' || filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0) && (
            <div className="pt-4 border-t border-warm-beige">
              <p className="text-sm text-gray-600 mb-2">Aktivní filtry:</p>
              <div className="flex flex-wrap gap-2">
                {filters.tier !== 'all' && (
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {filters.tier}
                  </span>
                )}
                {/* Odstíny - jen slovní názvy */}
                {filters.shades.sort((a, b) => a - b).map((shade) => (
                  <span key={shade} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {HAIR_COLORS[shade]?.name}
                  </span>
                ))}
                {filters.structures.map((structure) => (
                  <span key={structure} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    Struktura: {structure.charAt(0).toUpperCase() + structure.slice(1)}
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
