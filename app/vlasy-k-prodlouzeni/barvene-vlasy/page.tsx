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
  lengths: number[];
  availability: 'all' | 'in_stock' | 'on_order';
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const PRODUCTS_PER_PAGE = 14;

export default function BarveneBlondPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    shades: [],
    structures: [],
    lengths: [],
    availability: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Načti produkty z API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/catalog?category=barvene_blond');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
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

  // Filtruj pouze barvené produkty
  const barveneProdukty = products;

  // Dostupné odstíny pro barvené (5-10)
  const availableShades = [5, 6, 7, 8, 9, 10];

  // Dostupné délky - POUZE pro Platinum
  const availableLengths = useMemo(() => {
    if (filters.tier !== 'Platinum edition' && filters.tier !== 'all') return [];
    const platinumProducts = barveneProdukty.filter(p => p.tier === 'Platinum edition');
    const lengths = new Set<number>();
    platinumProducts.forEach(p => {
      p.variants.forEach(v => {
        if (v.length_cm) lengths.add(v.length_cm);
      });
    });
    return Array.from(lengths).sort((a, b) => a - b);
  }, [barveneProdukty, filters.tier]);

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

      // Délka filtr - POUZE pro Platinum
      if (filters.lengths.length > 0 && product.tier === 'Platinum edition') {
        const productLengths = product.variants.map(v => v.length_cm).filter(Boolean) as number[];
        const hasMatchingLength = productLengths.some(len => filters.lengths.includes(len));
        if (!hasMatchingLength) return false;
      }

      return true;
    });
  }, [barveneProdukty, filters]);

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

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-playfair text-burgundy mb-3"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            Barvené blond vlasy
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-text-mid max-w-4xl leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Profesionálně odbarvené blond vlasy v odstínech 5-10. Dostupné ve všech kvalitách:
            Standard, LUXE, Platinum edition.
          </motion.p>
        </motion.div>

        {/* Info banner */}
        <motion.div
          className="mb-8 p-5 bg-ivory rounded-lg border-l-4 border-burgundy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-base font-semibold text-burgundy mb-2">✨ Vlastní barvírna</h3>
          <p className="text-xs text-text-mid">
            Všechny blond vlasy jsou profesionálně obarvené v naší pražské barvírně.
            Garantujeme krásné, rovnoměrné odstíny a dlouhou životnost.
          </p>
        </motion.div>

        {/* Tier Kategorie - 3 boxy */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Standard */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy/standard"
              className="p-5 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy/50 hover:shadow-lg transition-all text-left block h-full"
            >
              <h3 className="text-xl font-playfair text-burgundy mb-2">Standard</h3>
              <p className="text-xs text-text-mid leading-relaxed">
                Profesionálně barvené vlasy s krásným blond odstínem. Délky 35–75 cm.
              </p>
            </Link>
          </motion.div>

          {/* LUXE */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy/luxe"
              className="p-5 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy/50 hover:shadow-lg transition-all text-left block h-full"
            >
              <h3 className="text-xl font-playfair text-burgundy mb-2">LUXE</h3>
              <p className="text-xs text-text-mid leading-relaxed">
                Vyšší kvalita barvení, hustší konce. Délky 40–85 cm.
              </p>
            </Link>
          </motion.div>

          {/* Platinum Edition */}
          <motion.div variants={scaleIn}>
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition"
              className="p-5 rounded-xl border-2 border-warm-beige bg-white hover:border-burgundy/50 hover:shadow-lg transition-all text-left block h-full"
            >
              <h3 className="text-xl font-playfair text-burgundy mb-2">Platinum Edition</h3>
              <p className="text-xs text-text-mid leading-relaxed">
                Premium barvené vlasy, exkluzivní kvalita. Délky 45–90 cm.
              </p>
            </Link>
          </motion.div>
        </motion.div>

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

          {/* Délka - POUZE pro Platinum */}
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
              <p className="text-sm text-text-mid mb-2">Aktivní filtry:</p>
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
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
            <p className="text-text-mid">Načítám produkty...</p>
          </div>
        )}

        {/* Počet výsledků */}
        {!loading && (
          <div className="mb-6">
            <p className="text-text-mid">
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
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {paginatedProducts.map((product) => (
                <motion.div key={product.id} variants={scaleIn}>
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
            <p className="text-text-mid mb-6">
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
