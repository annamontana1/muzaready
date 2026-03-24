'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { Product, HAIR_COLORS } from '@/types/product';
import { motion } from 'framer-motion';
import SimilarFromOtherTiers from '@/components/SimilarFromOtherTiers';

type FilterState = {
  colorType: '' | 'nebarvene' | 'barvene';
  shades: number[];
  structures: string[];
  lengths: number[];
};

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

const PRODUCTS_PER_PAGE = 12;

export default function StandardTierPage() {
  const [filters, setFilters] = useState<FilterState>({
    colorType: '',
    shades: [],
    structures: [],
    lengths: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API with colorType filter
  const fetchProducts = useCallback(() => {
    setLoading(true);
    let url = '/api/catalog?tier=Standard';
    if (filters.colorType) {
      url += `&colorType=${filters.colorType}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters.colorType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const availableShades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Apply client-side filters (shade, structure)
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
        const productLength = product.variants[0]?.lengthCm;
        if (!productLength || !filters.lengths.includes(productLength)) return false;
      }
      return true;
    });
  }, [products, filters.shades, filters.structures, filters.lengths]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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

  const setColorType = (ct: '' | 'nebarvene' | 'barvene') => {
    setFilters((prev) => ({ ...prev, colorType: ct }));
  };

  const resetFilters = () => {
    setFilters({ colorType: '', shades: [], structures: [], lengths: [] });
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-burgundy">Domu</Link></li>
            <li><span className="mx-2">&rsaquo;</span></li>
            <li><Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link></li>
            <li><span className="mx-2">&rsaquo;</span></li>
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
            Standard
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Kvalitní panenské vlasy ve Standard kvalitě.
          </motion.p>
        </motion.div>

        {/* Filter Bar */}
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

          {/* Typ vlasu toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">Typ vlasu</label>
            <div className="flex gap-2">
              {([
                { label: 'Všechny', value: '' as const },
                { label: 'Nebarvené', value: 'nebarvene' as const },
                { label: 'Barvené', value: 'barvene' as const },
              ]).map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setColorType(value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filters.colorType === value
                      ? 'bg-burgundy text-white'
                      : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Shades gallery */}
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

          {/* Structure filter */}
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

          {/* Length filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-burgundy mb-3">
              Délka {filters.lengths.length > 0 && `(${filters.lengths.sort((a, b) => a - b).map(l => `${l}cm`).join(', ')})`}
            </label>
            <div className="flex flex-wrap gap-2">
              {[40, 45, 50, 55, 60, 65, 70, 75, 80].map((length) => (
                <button
                  key={length}
                  onClick={() => toggleLength(length)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filters.lengths.includes(length)
                      ? 'bg-burgundy text-white'
                      : 'border border-burgundy text-burgundy hover:bg-burgundy/10'
                  }`}
                >
                  {length} cm
                </button>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(filters.colorType || filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0) && (
            <div className="pt-4 border-t border-warm-beige">
              <p className="text-sm text-gray-600 mb-2">Aktivní filtry:</p>
              <div className="flex flex-wrap gap-2">
                {filters.colorType && (
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {filters.colorType === 'nebarvene' ? 'Nebarvené' : 'Barvené'}
                  </span>
                )}
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
                {filters.lengths.sort((a, b) => a - b).map((length) => (
                  <span key={`len-${length}`} className="px-3 py-1 bg-burgundy text-white rounded-full text-xs font-medium">
                    {length} cm
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
            <p className="mt-4 text-gray-600">Načítání produktu...</p>
          </div>
        ) : (
        <>
        {/* Result count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Zobrazeno <strong>{paginatedProducts.length}</strong> z <strong>{filteredProducts.length}</strong> produktu
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
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Předchozí stránka"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-burgundy text-burgundy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-burgundy/10 transition"
                >
                  &larr;
                </button>

                <div className="flex gap-2 items-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Další stránka"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-burgundy text-burgundy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-burgundy/10 transition"
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4">
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
        </>
        )}

        {/* Similar products from other tiers */}
        <SimilarFromOtherTiers currentTier="Standard" activeShades={filters.shades} />
      </div>
    </div>
  );
}
