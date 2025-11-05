'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { mockProducts } from '@/lib/mock-products';
import { ProductTier, HAIR_COLORS } from '@/types/product';

type FilterState = {
  tier: ProductTier | 'all';
  shades: number[];
  structures: string[];
  weightRange: string;
  availability: 'all' | 'in_stock' | 'on_order';
};

export default function NebarvenePanenskePage() {
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    shades: [],
    structures: [],
    weightRange: 'all',
    availability: 'all',
  });

  const [activeModal, setActiveModal] = useState<'standard' | 'luxe' | 'platinum' | null>(null);

  // Filtruj pouze nebarvené produkty
  const nebarveneProdukty = mockProducts.filter((p) => p.category === 'nebarvene_panenske');

  // Dostupné odstíny podle tieru (bez #2)
  const availableShades = useMemo(() => {
    if (filters.tier === 'Platinum edition') return [1, 3, 4, 5, 6, 7, 8, 9, 10];
    if (filters.tier === 'all') return [1, 3, 4, 5, 6, 7, 8, 9, 10];
    return [1, 3, 4]; // Standard a LUXE
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

      return true;
    });
  }, [nebarveneProdukty, filters]);

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

  const resetFilters = () => {
    setFilters({
      tier: 'all',
      shades: [],
      structures: [],
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
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Standard</h2>
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
              <h2 className="text-3xl font-playfair text-burgundy mb-4">LUXE</h2>
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
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Platinum Edition</h2>
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
            Nebarvené panenské vlasy
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed mb-4">
            <strong>100 % nebarvené panenské vlasy z našeho výkupu.</strong> Přirozené odstíny, dlouhá životnost,
            vhodné pro profesionální barvení a odbarvování. Prémiové vlasy k prodloužení pro salony i koncové
            klientky – Praha i celá ČR.
          </p>
          {/* Metody zakončení - kompaktní verze */}
          <div className="mt-5 p-4 bg-gradient-to-br from-ivory/50 to-warm-beige/20 rounded-lg border border-warm-beige/60">
            <p className="text-xs text-gray-600 mb-3">
              Připravíme na metodu zakončení:
            </p>

            {/* Metody zakončení - menší karty vždy vedle sebe */}
            <div className="flex gap-2">
              <Link
                href="/metody-zakonceni/keratin"
                className="flex-1 group px-3 py-2 bg-white border border-warm-beige rounded-lg hover:border-burgundy hover:shadow-md transition-all text-center"
              >
                <div className="text-sm font-medium text-burgundy group-hover:text-[#6E2A2A]">
                  Keratin
                </div>
              </Link>
              <Link
                href="/metody-zakonceni/pasky"
                className="flex-1 group px-3 py-2 bg-white border border-warm-beige rounded-lg hover:border-burgundy hover:shadow-md transition-all text-center"
              >
                <div className="text-sm font-medium text-burgundy group-hover:text-[#6E2A2A]">
                  Pásky
                </div>
              </Link>
              <Link
                href="/metody-zakonceni/vlasove-tresy"
                className="flex-1 group px-3 py-2 bg-white border border-warm-beige rounded-lg hover:border-burgundy hover:shadow-md transition-all text-center"
              >
                <div className="text-sm font-medium text-burgundy group-hover:text-[#6E2A2A]">
                  Tresy
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Tier Kategorie - 3 boxy jako odkazy */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Standard */}
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske/standard"
            className="relative p-6 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-xl transition-all block overflow-hidden group"
          >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('standard');
              }}
              className="absolute top-3 right-3 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed, větší */}
            <div className="text-center mb-4 mt-2">
              <h3 className="text-2xl md:text-3xl font-playfair text-burgundy font-bold">Standard</h3>
            </div>

            {/* Popis větší */}
            <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
              Výběrové východoevropské panenské vlasy z výkupu z jedné hlavy.
            </p>
          </Link>

          {/* LUXE */}
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
            className="relative p-6 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-xl transition-all block overflow-hidden group"
          >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('luxe');
              }}
              className="absolute top-3 right-3 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed, větší */}
            <div className="text-center mb-4 mt-2">
              <h3 className="text-2xl md:text-3xl font-playfair text-burgundy font-bold">LUXE</h3>
            </div>

            {/* Popis větší */}
            <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
              Luxusní evropské nebarvené vlasy z výkupu.
            </p>
          </Link>

          {/* Platinum Edition */}
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
            className="relative p-6 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-xl transition-all block overflow-hidden group"
          >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('platinum');
              }}
              className="absolute top-3 right-3 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed, větší */}
            <div className="text-center mb-4 mt-2">
              <h3 className="text-2xl md:text-3xl font-playfair text-burgundy font-bold">Platinum Edition</h3>
            </div>

            {/* Popis větší */}
            <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
              Nejvzácnější culíky z našeho výkupu v ČR a SR.
            </p>
          </Link>
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

          {/* Odstíny - Scrollovací galerie s fotografiemi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Odstín {filters.shades.length > 0 && `(${filters.shades.sort((a, b) => a - b).map(s => HAIR_COLORS[s]?.name).join(', ')})`}
            </label>
            <ShadeGallery
              availableShades={availableShades}
              selectedShades={filters.shades}
              onToggleShade={toggleShade}
            />
            {/* Varování pro nedostupné odstíny */}
            {filters.shades.some(s => !availableShades.includes(s)) && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  ⚠️ Některé vybrané odstíny nejsou dostupné v aktuálním tieru.
                  {filters.shades.filter(s => s >= 5 && s <= 10).length > 0 && (
                    <span className="block mt-1">
                      Pro odstíny 5-10 zkuste: <a href="/vlasy-k-prodlouzeni/barvene-blond" className="font-semibold underline hover:text-amber-900">Barvené blond</a>
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

          {/* Aktivní filtry - sjednocené odstíny */}
          {(filters.tier !== 'all' || filters.shades.length > 0 || filters.structures.length > 0) && (
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
                    {structure.charAt(0).toUpperCase() + structure.slice(1)}
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
