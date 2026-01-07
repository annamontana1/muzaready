'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { Product, ProductTier, HAIR_COLORS } from '@/types/product';

type FilterState = {
  tier: ProductTier | 'all';
  shades: number[];
  structures: string[];
  lengths: number[]; // Pro Platinum
  weightRange: string;
  availability: 'all' | 'in_stock' | 'on_order';
};

const PRODUCTS_PER_PAGE = 14;

export default function NebarvenePanenskePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    shades: [],
    structures: [],
    lengths: [],
    weightRange: 'all',
    availability: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [activeModal, setActiveModal] = useState<'standard' | 'luxe' | 'platinum' | null>(null);

  // Načti produkty z API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/catalog?category=nebarvene_panenske');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        console.log('[DEBUG] Products loaded:', data.length, 'products');
        console.log('[DEBUG] First product:', data[0]);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtruj pouze nebarvené produkty
  const nebarveneProdukty = products;

  // Dostupné odstíny podle tieru (bez #2)
  const availableShades = useMemo(() => {
    if (filters.tier === 'Platinum edition') return [1, 3, 4, 5, 6, 7, 8, 9, 10];
    if (filters.tier === 'all') return [1, 3, 4, 5, 6, 7, 8, 9, 10];
    return [1, 3, 4]; // Standard a LUXE
  }, [filters.tier]);

  // Dostupné délky - POUZE pro Platinum
  const availableLengths = useMemo(() => {
    if (filters.tier !== 'Platinum edition' && filters.tier !== 'all') return [];
    const platinumProducts = nebarveneProdukty.filter(p => p.tier === 'Platinum edition');
    const lengths = new Set<number>();
    platinumProducts.forEach(p => {
      p.variants.forEach(v => {
        if (v.length_cm) lengths.add(v.length_cm);
      });
    });
    return Array.from(lengths).sort((a, b) => a - b);
  }, [nebarveneProdukty, filters.tier]);

  // Aplikuj filtry
  const filteredProducts = useMemo(() => {
    console.log('[DEBUG FILTER] Starting filter with', nebarveneProdukty.length, 'products');
    console.log('[DEBUG FILTER] Active filters:', filters);

    const filtered = nebarveneProdukty.filter((product, idx) => {
      console.log(`[DEBUG FILTER] Product ${idx}:`, product.name, 'tier:', product.tier);

      // Tier filtr
      if (filters.tier !== 'all' && product.tier !== filters.tier) {
        console.log(`  ❌ REJECTED by tier filter: ${product.tier} !== ${filters.tier}`);
        return false;
      }

      // Odstín filtr (pokud jsou vybrané odstíny)
      if (filters.shades.length > 0) {
        const hasMatchingShade = product.variants.some(v =>
          v.shade && filters.shades.includes(v.shade)
        );
        if (!hasMatchingShade) {
          console.log(`  ❌ REJECTED by shade filter: no variant matches`, filters.shades);
          return false;
        }
      }

      // Struktura filtr
      if (filters.structures.length > 0) {
        const hasMatchingStructure = product.variants.some(v =>
          v.structure && filters.structures.includes(v.structure)
        );
        if (!hasMatchingStructure) {
          console.log(`  ❌ REJECTED by structure filter: no variant matches`, filters.structures);
          return false;
        }
      }

      // Délka filtr - POUZE pro Platinum
      if (filters.lengths.length > 0 && product.tier === 'Platinum edition') {
        const productLengths = product.variants.map(v => v.length_cm).filter(Boolean) as number[];
        const hasMatchingLength = productLengths.some(len => filters.lengths.includes(len));
        if (!hasMatchingLength) {
          console.log(`  ❌ REJECTED by length filter: ${productLengths} not matching`, filters.lengths);
          return false;
        }
      }

      console.log(`  ✅ PASSED all filters`);
      return true;
    });
    console.log('[DEBUG] Filtered products:', filtered.length, 'from', nebarveneProdukty.length, 'total');
    console.log('[DEBUG] Active filters:', filters);
    return filtered;
  }, [nebarveneProdukty, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset stránky při změně filtrů
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
    setCurrentPage(1);
  };

  // Vyčisti délkové filtry při přepnutí z Platinum
  useEffect(() => {
    if (filters.tier !== 'Platinum edition' && filters.tier !== 'all') {
      setFilters(prev => ({ ...prev, lengths: [] }));
    }
  }, [filters.tier]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
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
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Nebarvené panenské vlasy
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed mb-4">
            <strong>100 % nebarvené panenské vlasy z našeho výkupu.</strong> Přirozené odstíny, dlouhá životnost,
            vhodné pro profesionální barvení a odbarvování. Prémiové vlasy k prodloužení pro salony i koncové
            klientky – Praha i celá ČR.
          </p>
          {/* Metody zakončení - kompaktní verze */}
          <motion.div
            className="mt-5 p-4 bg-gradient-to-br from-ivory/50 to-warm-beige/20 rounded-lg border border-warm-beige/60 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xs text-gray-600 mb-3">
              Připravíme na metodu zakončení:
            </p>

            {/* Metody zakončení - menší karty vždy vedle sebe */}
            <div className="flex gap-2">
              <Link
                href="/metody-zakonceni/vlasy-na-keratin"
                className="flex-1 group px-3 py-2 bg-white border border-warm-beige rounded-lg hover:border-burgundy hover:shadow-md transition-all text-center"
              >
                <div className="text-sm font-medium text-burgundy group-hover:text-[#6E2A2A]">
                  Keratin
                </div>
              </Link>
              <Link
                href="/metody-zakonceni/pasky-nano-tapes"
                className="flex-1 group px-3 py-2 bg-white border border-warm-beige rounded-lg hover:border-burgundy hover:shadow-md transition-all text-center"
              >
                <div className="text-sm font-medium text-burgundy group-hover:text-[#6E2A2A]">
                  Tape in
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
          </motion.div>
        </motion.div>

        {/* Tier Kategorie - 3 boxy jako odkazy */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Standard */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske/standard"
              className="relative p-4 rounded-lg border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-lg hover:scale-105 transition-all block overflow-hidden group"
            >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('standard');
              }}
              className="absolute top-2 right-2 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed */}
            <div className="text-center mb-3 mt-1">
              <h3 className="text-xl md:text-2xl font-playfair text-burgundy font-bold">Standard</h3>
            </div>

            {/* Popis */}
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
              Výběrové východoevropské vlasy z výkupu
            </p>
            </Link>
          </motion.div>

          {/* LUXE */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
              className="relative p-4 rounded-lg border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-lg hover:scale-105 transition-all block overflow-hidden group"
            >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('luxe');
              }}
              className="absolute top-2 right-2 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed */}
            <div className="text-center mb-3 mt-1">
              <h3 className="text-xl md:text-2xl font-playfair text-burgundy font-bold">LUXE</h3>
            </div>

            {/* Popis */}
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
              Výběrové evropské vlasy z výkupu
            </p>
            </Link>
          </motion.div>

          {/* Platinum Edition */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
              className="relative p-4 rounded-lg border-2 border-warm-beige bg-white hover:border-burgundy hover:shadow-lg hover:scale-105 transition-all block overflow-hidden group"
            >
            {/* Pro koho v rohu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModal('platinum');
              }}
              className="absolute top-2 right-2 text-xs text-burgundy/60 hover:text-burgundy font-medium hover:underline"
            >
              Pro koho? →
            </button>

            {/* Název uprostřed */}
            <div className="text-center mb-3 mt-1">
              <h3 className="text-xl md:text-2xl font-playfair text-burgundy font-bold">Platinum Edition</h3>
            </div>

            {/* Popis */}
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
              Nejvzácnější culíky na trhu z výkupu ČR
            </p>
            </Link>
          </motion.div>
        </motion.div>

        {/* Filtr Lišta */}
        <motion.div
          className="mb-8 p-6 bg-ivory rounded-xl border border-warm-beige"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
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
                      Pro odstíny 5-10 zkuste: <a href="/vlasy-k-prodlouzeni/barvene-vlasy" className="font-semibold underline hover:text-amber-900">Barvené vlasy</a>
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Struktura - fotky vlasů */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Struktura {filters.structures.length > 0 && `(${filters.structures.length} vybráno)`}
            </label>
            <div className="flex flex-wrap gap-2 max-w-xl">
              {[
                { name: 'rovné', image: '/images/structures/rovne.png' },
                { name: 'mírně vlnité', image: '/images/structures/mirne-vlnite.png' },
                { name: 'vlnité', image: '/images/structures/vlnite.png' },
                { name: 'kudrnaté', image: '/images/structures/kudrnate.png' }
              ].map(({ name, image }) => {
                const isSelected = filters.structures.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleStructure(name)}
                    aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                    className={`relative w-16 h-16 rounded-lg transition overflow-hidden ${
                      isSelected
                        ? 'ring-2 ring-burgundy ring-offset-2 shadow-md'
                        : 'ring-1 ring-warm-beige hover:ring-burgundy hover:shadow-sm'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Délka filtr - POUZE pro Platinum */}
          {availableLengths.length > 0 && (
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
          )}

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
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
            <p className="text-gray-600">Načítám produkty...</p>
          </div>
        )}

        {/* Počet výsledků */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Zobrazeno <strong>{paginatedProducts.length}</strong> z <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produktu' : filteredProducts.length < 5 ? 'produktů' : 'produktů'}
              {totalPages > 1 && ` (stránka ${currentPage} z ${totalPages})`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={scaleIn}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-3">
                {/* Levá šipka */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Předchozí stránka"
                  className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-burgundy text-burgundy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-burgundy/10 transition"
                >
                  ←
                </button>

                <div className="flex gap-2 items-center">
                  {totalPages <= 7 ? (
                    // Zobraz všechna čísla když je ≤7 stránek
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Stránka ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                          currentPage === page
                            ? 'bg-[#4A2B29] text-white'
                            : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    // Komplexní logika pro > 7 stránek
                    <>
                      {/* Vždy zobraz 1 */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        aria-label="Stránka 1"
                        aria-current={currentPage === 1 ? 'page' : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                          currentPage === 1
                            ? 'bg-[#4A2B29] text-white'
                            : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                        }`}
                      >
                        1
                      </button>

                      {/* Vždy zobraz 2 */}
                      <button
                        onClick={() => setCurrentPage(2)}
                        aria-label="Stránka 2"
                        aria-current={currentPage === 2 ? 'page' : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                          currentPage === 2
                            ? 'bg-[#4A2B29] text-white'
                            : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                        }`}
                      >
                        2
                      </button>

                      {/* Vždy zobraz 3 */}
                      <button
                        onClick={() => setCurrentPage(3)}
                        aria-label="Stránka 3"
                        aria-current={currentPage === 3 ? 'page' : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                          currentPage === 3
                            ? 'bg-[#4A2B29] text-white'
                            : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                        }`}
                      >
                        3
                      </button>

                      {/* Tři tečky ... */}
                      {currentPage > 4 && currentPage < totalPages - 2 ? (
                        <span className="text-burgundy px-1">…</span>
                      ) : currentPage <= 4 && totalPages > 4 ? (
                        <span className="text-burgundy px-1">…</span>
                      ) : null}

                      {/* Aktuální stránka pokud je uprostřed (4 až N-3) */}
                      {currentPage > 4 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => setCurrentPage(currentPage)}
                          aria-label={`Stránka ${currentPage}`}
                          aria-current="page"
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition bg-[#4A2B29] text-white"
                        >
                          {currentPage}
                        </button>
                      )}

                      {/* Tři tečky před koncem pokud nejsme u konce */}
                      {currentPage < totalPages - 3 && (
                        <span className="text-burgundy px-1">…</span>
                      )}

                      {/* Poslední 3 stránky když jsme blízko konce */}
                      {currentPage >= totalPages - 3 && totalPages > 5 && (
                        <>
                          {totalPages - 3 > 3 && (
                            <button
                              onClick={() => setCurrentPage(totalPages - 3)}
                              aria-label={`Stránka ${totalPages - 3}`}
                              aria-current={currentPage === totalPages - 3 ? 'page' : undefined}
                              className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                                currentPage === totalPages - 3
                                  ? 'bg-[#4A2B29] text-white'
                                  : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                              }`}
                            >
                              {totalPages - 3}
                            </button>
                          )}
                          <button
                            onClick={() => setCurrentPage(totalPages - 2)}
                            aria-label={`Stránka ${totalPages - 2}`}
                            aria-current={currentPage === totalPages - 2 ? 'page' : undefined}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                              currentPage === totalPages - 2
                                ? 'bg-[#4A2B29] text-white'
                                : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                            }`}
                          >
                            {totalPages - 2}
                          </button>
                          <button
                            onClick={() => setCurrentPage(totalPages - 1)}
                            aria-label={`Stránka ${totalPages - 1}`}
                            aria-current={currentPage === totalPages - 1 ? 'page' : undefined}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                              currentPage === totalPages - 1
                                ? 'bg-[#4A2B29] text-white'
                                : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                            }`}
                          >
                            {totalPages - 1}
                          </button>
                        </>
                      )}

                      {/* Vždy zobraz poslední stránku */}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        aria-label={`Stránka ${totalPages}`}
                        aria-current={currentPage === totalPages ? 'page' : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-medium transition ${
                          currentPage === totalPages
                            ? 'bg-[#4A2B29] text-white'
                            : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Pravá šipka */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Další stránka"
                  className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-burgundy text-burgundy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-burgundy/10 transition"
                >
                  →
                </button>
              </div>
            )}
          </>
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
