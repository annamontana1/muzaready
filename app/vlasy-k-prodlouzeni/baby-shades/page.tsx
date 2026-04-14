'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { Product, HAIR_COLORS } from '@/types/product';
import SimilarFromOtherTiers from '@/components/SimilarFromOtherTiers';

type FilterState = {
  shades: number[];
  structures: string[];
  lengths: number[];
};

const PRODUCTS_PER_PAGE = 12;

export default function BabyShadesTierPage() {
  const [filters, setFilters] = useState<FilterState>({
    shades: [],
    structures: [],
    lengths: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/catalog?tier=BABY_SHADES')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const availableShades = [1, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const resetFilters = () => {
    setFilters({ shades: [], structures: [], lengths: [] });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0;

  return (
    <div style={{ background: 'var(--ivory)' }}>
      <div className="max-w-7xl mx-auto px-3 md:px-12 pt-8 pb-4">

        {/* ─── NADPIS ─── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-1 font-normal" style={{ color: 'var(--accent)' }}>
              Světlé odstíny
            </p>
            <h1 className="font-cormorant font-light leading-none" style={{ fontSize: 'clamp(24px,3vw,36px)', color: 'var(--text-dark)' }}>
              Vlasy k prodloužení <em className="italic" style={{ color: 'var(--burgundy)' }}>Baby Shades</em>
            </h1>
          </div>
          <Link
            href="/vlasy-k-prodlouzeni"
            className="text-[11px] tracking-[0.1em] uppercase font-light hidden md:flex items-center gap-1.5 transition-colors"
            style={{ color: 'var(--text-soft)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            ← Všechny kolekce
          </Link>
        </div>
      </div>

      {/* ─── PRODUKTY + FILTRY ─── */}
      <section id="produkty" className="pb-16 px-3 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto">

          {/* ─── FILTER PANEL ─── */}
          <div
            className="mb-10 p-4 md:p-8 rounded-sm border"
            style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mb-1 font-normal"
                  style={{ color: 'var(--accent)' }}
                >
                  Filtrování
                </div>
                <h3
                  className="font-cormorant font-light text-[22px] leading-none"
                  style={{ color: 'var(--text-dark)' }}
                >
                  Vybrat kolekci
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] tracking-[0.12em] uppercase font-light transition-colors flex items-center gap-2"
                  style={{ color: 'var(--text-soft)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
                >
                  × Vymazat filtry
                </button>
              )}
            </div>

            {/* Odstíny */}
            <div className="mb-8">
              <div
                className="text-[10px] tracking-[0.18em] uppercase mb-4 font-normal"
                style={{ color: 'var(--text-soft)' }}
              >
                Odstín {filters.shades.length > 0 && `· ${filters.shades.sort((a, b) => a - b).map(s => HAIR_COLORS[s]?.name).join(', ')}`}
              </div>
              <ShadeGallery
                availableShades={availableShades}
                selectedShades={filters.shades}
                onToggleShade={toggleShade}
              />
            </div>

            {/* Struktura */}
            <div className="mb-8">
              <div
                className="text-[10px] tracking-[0.18em] uppercase mb-4 font-normal"
                style={{ color: 'var(--text-soft)' }}
              >
                Struktura {filters.structures.length > 0 && `· ${filters.structures.length} vybráno`}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'].map((name) => {
                  const isSelected = filters.structures.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => toggleStructure(name)}
                      className="text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 rounded-sm font-light transition-all flex-shrink-0 whitespace-nowrap"
                      style={
                        isSelected
                          ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                          : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                      }
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--burgundy)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--beige-mid)'; }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Délka */}
            <div>
              <div
                className="text-[10px] tracking-[0.18em] uppercase mb-4 font-normal"
                style={{ color: 'var(--text-soft)' }}
              >
                Délka {filters.lengths.length > 0 && `· ${filters.lengths.sort((a, b) => a - b).map(l => `${l} cm`).join(', ')}`}
              </div>
              <div className="grid grid-cols-5 md:flex md:flex-wrap gap-2">
                {[40, 45, 50, 55, 60, 65, 70, 75, 80].map((length) => (
                  <button
                    key={length}
                    onClick={() => toggleLength(length)}
                    className="text-[11px] tracking-[0.08em] py-2.5 rounded-sm font-light transition-all text-center"
                    style={
                      filters.lengths.includes(length)
                        ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                        : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                    }
                    onMouseEnter={e => { if (!filters.lengths.includes(length)) e.currentTarget.style.borderColor = 'var(--burgundy)'; }}
                    onMouseLeave={e => { if (!filters.lengths.includes(length)) e.currentTarget.style.borderColor = 'var(--beige-mid)'; }}
                  >
                    {length} cm
                  </button>
                ))}
              </div>
            </div>

            {/* Aktivní filtry */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--beige)' }}>
                {filters.shades.sort((a, b) => a - b).map((shade) => (
                  <span
                    key={shade}
                    className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm font-normal flex items-center gap-2"
                    style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                  >
                    {HAIR_COLORS[shade]?.name}
                    <button onClick={() => toggleShade(shade)} className="hover:opacity-70">×</button>
                  </span>
                ))}
                {filters.structures.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm font-normal flex items-center gap-2"
                    style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                  >
                    {s}
                    <button onClick={() => toggleStructure(s)} className="hover:opacity-70">×</button>
                  </span>
                ))}
                {filters.lengths.sort((a, b) => a - b).map((l) => (
                  <span
                    key={l}
                    className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm font-normal flex items-center gap-2"
                    style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                  >
                    {l} cm
                    <button onClick={() => toggleLength(l)} className="hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ─── PRODUKTY ─── */}
          {loading ? (
            <div className="text-center py-20">
              <div
                className="inline-block h-7 w-7 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--burgundy)', borderRightColor: 'transparent' }}
              />
              <p className="mt-4 text-[13px] font-light tracking-[0.1em]" style={{ color: 'var(--text-soft)' }}>
                Načítání…
              </p>
            </div>
          ) : (
            <>
              {/* Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[12px] font-light tracking-[0.05em]" style={{ color: 'var(--text-soft)' }}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produkt' : filteredProducts.length < 5 ? 'produkty' : 'produktů'}
                  {totalPages > 1 && ` · stránka ${currentPage} z ${totalPages}`}
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {paginatedProducts.map((product) => (
                      <div key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 rounded-sm flex items-center justify-center text-[13px] transition-all disabled:opacity-30"
                        style={{ border: '1px solid var(--beige-mid)', color: 'var(--text-mid)' }}
                      >
                        ←
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className="w-9 h-9 rounded-sm text-[12px] tracking-[0.05em] font-light transition-all"
                          style={
                            currentPage === page
                              ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                              : { border: '1px solid var(--beige-mid)', color: 'var(--text-mid)' }
                          }
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 rounded-sm flex items-center justify-center text-[13px] transition-all disabled:opacity-30"
                        style={{ border: '1px solid var(--beige-mid)', color: 'var(--text-mid)' }}
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p
                    className="font-cormorant font-light text-[28px] mb-3"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Žádné produkty nenalezeny
                  </p>
                  <p className="text-[14px] font-light mb-8" style={{ color: 'var(--text-soft)' }}>
                    Zkuste změnit nebo vymazat filtry.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm transition-all hover:-translate-y-px"
                    style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                  >
                    Vymazat filtry
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── SIMILAR TIERS ─── */}
      <div className="px-3 md:px-12 py-12" style={{ background: 'var(--white)' }}>
        <div className="max-w-7xl mx-auto">
          <SimilarFromOtherTiers currentTier="Baby Shades" activeShades={filters.shades} />
        </div>
      </div>

    </div>
  );
}
