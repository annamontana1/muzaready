'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ShadeGallery from '@/components/ShadeGallery';
import { Product, HAIR_COLORS } from '@/types/product';
import SimilarFromOtherTiers from '@/components/SimilarFromOtherTiers';

type FilterState = {
  colorType: '' | 'nebarvene' | 'barvene';
  shades: number[];
  structures: string[];
  lengths: number[];
};

const PRODUCTS_PER_PAGE = 12;

export default function LuxeTierPage() {
  const [filters, setFilters] = useState<FilterState>({
    colorType: '',
    shades: [],
    structures: [],
    lengths: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    let url = '/api/catalog?tier=LUXE';
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

  const availableShades = [1, 3, 4, 5, 6, 7, 8, 9, 10]; // všechny odstíny kromě #2

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

  const setColorType = (ct: '' | 'nebarvene' | 'barvene') => {
    setFilters((prev) => ({ ...prev, colorType: ct }));
  };

  const resetFilters = () => {
    setFilters({ colorType: '', shades: [], structures: [], lengths: [] });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.colorType || filters.shades.length > 0 || filters.structures.length > 0 || filters.lengths.length > 0;

  return (
    <div style={{ background: 'var(--white)' }}>

      {/* ─── HERO ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden" style={{ minHeight: '52vh' }}>
        {/* Left: text */}
        <div
          className="flex flex-col justify-center px-4 py-12 md:px-8 lg:px-20"
          style={{ background: 'var(--ivory)' }}
        >
          {/* Breadcrumbs */}
          <nav className="mb-8 text-[11px] tracking-[0.12em] uppercase" style={{ color: 'var(--text-soft)' }}>
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-burgundy transition-colors">Domů</Link></li>
              <li style={{ color: 'var(--beige-mid)' }}>›</li>
              <li><Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy transition-colors">Vlasy k prodloužení</Link></li>
              <li style={{ color: 'var(--beige-mid)' }}>›</li>
              <li style={{ color: 'var(--burgundy)' }}>LUXE</li>
            </ol>
          </nav>

          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            Prémiová kolekce
          </div>

          <h1
            className="font-cormorant font-light leading-[1.1] mb-6 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(40px,4.5vw,60px)', color: 'var(--text-dark)' }}
          >
            Vlasy k prodloužení<br />
            <em className="italic" style={{ color: 'var(--burgundy)' }}>LUXE</em>
          </h1>

          <p className="text-[15px] leading-[1.8] max-w-[400px] mb-10 font-light" style={{ color: 'var(--text-soft)' }}>
            Prémiová kvalita s hustšími konci a vyšší hustotou. Luxusní vzhled a delší životnost díky pečlivému výběru vlasů.
          </p>

          <div className="flex gap-4 items-center flex-wrap">
            <a
              href="#produkty"
              className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
              style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--burgundy-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--burgundy)')}
            >
              Zobrazit produkty
            </a>
            <Link
              href="/vlasy-k-prodlouzeni/standard"
              className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-colors"
              style={{ color: 'var(--text-mid)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mid)')}
            >
              Standard kolekce →
            </Link>
          </div>
        </div>

        {/* Right: gradient image area */}
        <div
          className="relative min-h-[320px] lg:min-h-0 flex flex-col justify-end"
          style={{ background: 'linear-gradient(160deg, #C9B494 0%, #A8896A 55%, #7A5A4A 100%)' }}
        >
          <span
            className="font-cormorant text-[13px] tracking-[0.15em] uppercase absolute"
            style={{ color: 'rgba(74,21,32,0.35)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', right: '32px', top: '50%' }}
          >
            Luxe kolekce
          </span>
          {/* Feature badge */}
          <div className="relative z-10 p-10">
            <div
              className="rounded-sm p-5 flex items-center gap-4 max-w-[280px]"
              style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
            >
              <div
                className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 font-cormorant text-base"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                ✦
              </div>
              <div className="text-[12px] leading-[1.5]" style={{ color: 'var(--text-mid)' }}>
                <strong className="block text-[14px] font-medium mb-0.5" style={{ color: 'var(--text-dark)' }}>
                  Hustší konce
                </strong>
                Pečlivý výběr vlasů, delší životnost
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BAR ─── */}
      <div className="border-b py-6 px-3 md:px-12" style={{ background: 'var(--white)', borderColor: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-around items-center gap-5">
          {[
            { num: '✦', strong: 'Hustší konce', sub: 'Prémiový výběr každého pramene' },
            { num: '✦', strong: 'Delší životnost', sub: 'Odolnější vůči teplu i barvení' },
            { num: '✦', strong: '100% panenské', sub: 'Bez chemického předšetření' },
            { num: '✦', strong: '9 odstínů', sub: 'Přirozené i barvené tóny' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block w-px h-8" style={{ background: 'var(--beige-mid)' }} />}
              <span className="font-cormorant text-[22px] font-light" style={{ color: 'var(--burgundy)' }}>
                {item.num}
              </span>
              <div className="text-[12px] leading-[1.4] font-light" style={{ color: 'var(--text-soft)' }}>
                <strong className="block text-[13px] font-normal" style={{ color: 'var(--text-mid)' }}>{item.strong}</strong>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRODUKTY + FILTRY ─── */}
      <section id="produkty" className="py-16 px-3 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="mb-10">
            <div
              className="text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-3 font-normal"
              style={{ color: 'var(--accent)' }}
            >
              <span className="block w-6 h-px" style={{ background: 'var(--accent)' }} />
              Kolekce LUXE
            </div>
            <div className="flex justify-between items-end">
              <h2
                className="font-cormorant font-light leading-[1.2] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(28px,2.5vw,40px)', color: 'var(--text-dark)' }}
              >
                Prémiové vlasy<br />k <em className="italic" style={{ color: 'var(--burgundy)' }}>prodloužení</em>
              </h2>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.1em] uppercase font-light items-center gap-2 transition-colors hidden md:flex"
                style={{ color: 'var(--text-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mid)')}
              >
                Všechny kolekce →
              </Link>
            </div>
          </div>

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

            {/* Typ vlasu */}
            <div className="mb-8">
              <div
                className="text-[10px] tracking-[0.18em] uppercase mb-4 font-normal"
                style={{ color: 'var(--text-soft)' }}
              >
                Typ vlasu
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { label: 'Vše', value: '' as const },
                  { label: 'Nebarvené', value: 'nebarvene' as const },
                  { label: 'Barvené', value: 'barvene' as const },
                ]).map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setColorType(value)}
                    className="text-[11px] tracking-[0.1em] uppercase px-5 py-2 rounded-sm font-normal transition-all"
                    style={
                      filters.colorType === value
                        ? { background: 'var(--burgundy)', color: 'var(--ivory)' }
                        : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--beige-mid)' }
                    }
                    onMouseEnter={e => { if (filters.colorType !== value) e.currentTarget.style.borderColor = 'var(--burgundy)'; }}
                    onMouseLeave={e => { if (filters.colorType !== value) e.currentTarget.style.borderColor = 'var(--beige-mid)'; }}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
              <div className="grid grid-cols-4 gap-2">
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
                      className="relative rounded-sm transition-all overflow-hidden"
                      style={{
                        aspectRatio: '1',
                        ...(isSelected
                          ? { outline: '2px solid var(--burgundy)', outlineOffset: '2px', boxShadow: '0 2px 8px rgba(74,21,32,0.15)' }
                          : { outline: '1px solid var(--beige-mid)' })
                      }}
                    >
                      <Image src={image} alt={name} fill className="object-cover" sizes="25vw" />
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
                {filters.colorType && (
                  <span
                    className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm font-normal flex items-center gap-2"
                    style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                  >
                    {filters.colorType === 'nebarvene' ? 'Nebarvené' : 'Barvené'}
                    <button onClick={() => setColorType('')} className="hover:opacity-70">×</button>
                  </span>
                )}
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
                  <div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px" style={{ background: 'var(--beige)' }}>
                    {paginatedProducts.map((product) => (
                      <div key={product.id} style={{ background: 'var(--white)' }}>
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
      <div className="px-3 md:px-12 py-16" style={{ background: 'var(--white)' }}>
        <div className="max-w-7xl mx-auto">
          <SimilarFromOtherTiers currentTier="Luxe" activeShades={filters.shades} />
        </div>
      </div>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 px-3 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto text-center relative">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-cormorant font-light"
              style={{ fontSize: 'clamp(100px,14vw,200px)', color: 'rgba(74,21,32,0.04)', lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              LUXE
            </span>
          </div>
          <div className="relative z-10">
            <div
              className="text-[11px] tracking-[0.2em] uppercase mb-5 font-normal flex items-center justify-center gap-3"
              style={{ color: 'var(--accent)' }}
            >
              <span className="block w-6 h-px" style={{ background: 'var(--accent)' }} />
              Potřebujete poradit?
              <span className="block w-6 h-px" style={{ background: 'var(--accent)' }} />
            </div>
            <h2
              className="font-cormorant font-light leading-[1.2] mb-5 tracking-[-0.01em]"
              style={{ fontSize: 'clamp(32px,3vw,48px)', color: 'var(--text-dark)' }}
            >
              Navštivte náš<br />
              <em className="italic" style={{ color: 'var(--burgundy)' }}>Showroom v Praze</em>
            </h2>
            <p className="text-[14px] leading-[1.8] max-w-[420px] mx-auto mb-10 font-light" style={{ color: 'var(--text-soft)' }}>
              Osobní konzultace, výběr odstínu na místě a profesionální poradenství. Revoluční 8, Praha.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/kontakt"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--burgundy-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--burgundy)')}
              >
                Rezervovat konzultaci
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/standard"
                className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-colors"
                style={{ color: 'var(--text-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--burgundy)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mid)')}
              >
                Prohlédnout Standard →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
