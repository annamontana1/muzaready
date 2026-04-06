'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product, HAIR_COLORS } from '@/types/product';
import ShadeGallery from '@/components/ShadeGallery';

type FilterState = {
  shades: number[];
  structures: string[];
  endings: string[];
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

export default function BarveneBlondStandardPage() {
  const [filters, setFilters] = useState<FilterState>({
    shades: [],
    structures: [],
    endings: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API: barvené blond + tier Standard
  useEffect(() => {
    fetch('/api/catalog?category=barvene_blond&tier=Standard')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Dostupné odstíny pro Standard barvené: 5-10
  const availableShades = [5, 6, 7, 8, 9, 10];
  // Aplikuj filtry
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
      return true;
    });
  }, [products, filters]);

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


  const resetFilters = () => {
    setFilters({
      shades: [],
      structures: [],
      endings: [],
    });
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-text-mid">
            <li><Link href="/" className="hover:text-burgundy">Domů</Link></li>
            <li><span className="mx-2">›</span></li>
            <li><Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link></li>
            <li><span className="mx-2">›</span></li>
            <li><Link href="/vlasy-k-prodlouzeni/barvene-vlasy" className="hover:text-burgundy">Barvené vlasy</Link></li>
            <li><span className="mx-2">›</span></li>
            <li className="text-burgundy font-medium">Standard</li>
          </ol>
        </nav>

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
            Barvené blond vlasy — Standard
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-text-mid max-w-4xl leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Profesionálně barvené blond vlasy ve Standard kvalitě. Odstíny 5–10,
            délky 35–75 cm. Krásné, rovnoměrné blond odstíny za výhodnou cenu.
          </motion.p>
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

          {/* Odstíny - mřížka 5×2, bordó outline */}
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

          {/* Aktivní filtry */}
          {(filters.shades.length > 0 || filters.structures.length > 0) && (
            <div className="pt-4 border-t border-warm-beige">
              <p className="text-sm text-text-mid mb-2">Aktivní filtry:</p>
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
              </div>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-burgundy border-r-transparent" />
            <p className="mt-4 text-text-mid">Načítání produktů...</p>
          </div>
        ) : (
        <>
        {/* Počet výsledků */}
        <div className="mb-6">
          <p className="text-text-mid">
            Zobrazeno <strong>{paginatedProducts.length}</strong> z <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produktu' : filteredProducts.length < 5 ? 'produktů' : 'produktů'}
            {totalPages > 1 && ` (stránka ${currentPage} z ${totalPages})`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
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
        </>
        )}
      </div>
    </div>
  );
}
