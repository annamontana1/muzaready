'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { mockProducts } from '@/lib/mock-products';
import { HAIR_COLORS } from '@/types/product';
import { motion } from 'framer-motion';

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

export default function LuxeCategoryPage() {
  const [filters, setFilters] = useState<FilterState>({
    shades: [],
    structures: [],
    endings: [],
  });

  // Filtruj produkty: nebarvené + tier LUXE
  const products = useMemo(() => {
    return mockProducts.filter((p) =>
      p.category === 'nebarvene_panenske' && p.tier === 'LUXE'
    );
  }, []);

  // Dostupné odstíny pro LUXE: 1, 3, 4 (bez #2)
  const availableShades = [1, 3, 4];
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

      return true;
    });
  }, [products, filters]);

  const toggleShade = (shade: number) => {
    setFilters((prev) => {
      const newShades = prev.shades.includes(shade)
        ? prev.shades.filter((s) => s !== shade)
        : [...prev.shades, shade];

      console.log('🔍 Toggle shade:', shade);
      console.log('📋 New shades:', newShades);
      console.log('📦 Total products:', products.length);
      console.log('🎯 Products with selected shades:', products.filter(p => newShades.length === 0 || newShades.includes(p.variants[0]?.shade)));

      return {
        ...prev,
        shades: newShades,
      };
    });
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
            <li className="text-burgundy font-medium">LUXE</li>
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
            Nebarvené panenské vlasy — LUXE
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Prémiové nebarvené panenské vlasy v LUXE kvalitě. Hustší konce, vyšší kvalita.
            Dostupné v odstínech 1–4, délky 40–85 cm.
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

          {/* Aktivní filtry */}
          {(filters.shades.length > 0 || filters.structures.length > 0) && (
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
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={scaleIn}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
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
