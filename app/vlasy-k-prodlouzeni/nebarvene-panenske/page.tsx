'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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

  const [activeModal, setActiveModal] = useState<'standard' | 'luxe' | 'platinum' | null>(null);

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

        {/* Tier modaly */}
        {activeModal === 'standard' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-burgundy text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Standard — nebarvené</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm">
                  Výběrové východoevropské panenské vlasy z výkupu z jedné hlavy. <strong>Původ:</strong> Indie,
                  Kambodža, Uzbekistán. Přirozeně pevnější a odolné, skvěle drží tvar účesu a přidají objem.
                  Každý culík je ustřižený z jedné hlavy (originální barva a struktura), nemíchané z více culíků.
                  Přírodní odstíny 1–4. Vhodné pro prodloužení vlasů i profesionální tónování/odbarvování.
                </p>
                <div className="bg-ivory p-4 rounded-lg">
                  <p className="font-semibold text-burgundy mb-2">Pro koho:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Máte spíše pevnější a hustší vlastní vlasy a chcete větší objem.</li>
                    <li>Hledáte cenově dostupné, ale kvalitní vlasy pro častější styling.</li>
                    <li>Preferujete méně náročnou údržbu než u extra jemných vlasů.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'luxe' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-burgundy text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">LUXE — nebarvené</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm">
                  Luxusní evropské nebarvené vlasy z výkupu. <strong>Původ:</strong> Ukrajina, Polsko, Bělorusko.
                  Jemné a lesklé, &ldquo;zlatá střední cesta&rdquo; – jemnější než východoevropské, ale pevnější než dětské;
                  nesplihnou a dodají nadýchaný objem. Husté konce, přírodní odstíny 1–4. Vhodné pro prodloužení
                  i profesionální tónování/odbarvování.
                </p>
                <div className="bg-ivory p-4 rounded-lg">
                  <p className="font-semibold text-burgundy mb-2">Pro koho:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Máte středně pevné a středně husté vlasy a chcete objem bez zatížení.</li>
                    <li>Hledáte vyvážený poměr kvality a ceny.</li>
                    <li>Plánujete barvení/zesvětlení.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'platinum' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-burgundy text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Platinum Edition — nebarvené</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm">
                  Nejvzácnější culíky z našeho výkupu v ČR a SR. Panenské vlasy nejvyšší kvality – mimořádně hebké
                  a lesklé, s hustými konci. Přirozené textury od extra jemných rovných po normální až pevnější.
                  Dostupné v omezeném množství.
                </p>
                <div className="bg-ivory p-4 rounded-lg">
                  <p className="font-semibold text-burgundy mb-2">Pro koho:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Máte jemné, křehké, snadno lámavé vlasy a potřebujete minimální zátěž na kořínky.</li>
                    <li>Vyžadujete nejvyšší kvalitu a maximálně přirozený vzhled.</li>
                    <li>Plánujete barvit/zesvětlovat s důrazem na jemnost a lesk.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Nebarvené panenské vlasy – vlasy k prodloužení
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed mb-4">
            <strong>100 % nebarvené panenské vlasy z našeho výkupu.</strong> Přirozené odstíny, dlouhá životnost,
            vhodné pro profesionální barvení a odbarvování. Prémiové vlasy k prodloužení pro salony i koncové
            klientky – Praha i celá ČR.
          </p>
          <div className="bg-ivory p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2"><strong>Zvolte si surové copy, nebo je pro vás připravíme na metodu:</strong></p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/metody-zakonceni/keratin"
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-burgundy border border-burgundy/20 hover:bg-burgundy hover:text-white transition"
              >
                Keratin / Mikrokeratin
              </Link>
              <Link
                href="/metody-zakonceni/tape-in"
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-burgundy border border-burgundy/20 hover:bg-burgundy hover:text-white transition"
              >
                Tape-in (nano tapes)
              </Link>
              <Link
                href="/metody-zakonceni/sewing-weft"
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-burgundy border border-burgundy/20 hover:bg-burgundy hover:text-white transition"
              >
                Ručně šité vlasové tresy — sewing wefts
              </Link>
            </div>
          </div>
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
            <h3 className="text-xl font-playfair text-burgundy mb-2">Standard — nebarvené</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Výběrové východoevropské panenské vlasy z výkupu z jedné hlavy.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('standard');
              }}
              className="text-xs text-burgundy font-semibold hover:underline"
            >
              Pro koho? →
            </button>
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
            <h3 className="text-xl font-playfair text-burgundy mb-2">LUXE — nebarvené</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Luxusní evropské nebarvené vlasy z výkupu.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('luxe');
              }}
              className="text-xs text-burgundy font-semibold hover:underline"
            >
              Pro koho? →
            </button>
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
            <h3 className="text-xl font-playfair text-burgundy mb-2">Platinum Edition — nebarvené</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Nejvzácnější culíky z našeho výkupu v ČR a SR.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('platinum');
              }}
              className="text-xs text-burgundy font-semibold hover:underline"
            >
              Pro koho? →
            </button>
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
