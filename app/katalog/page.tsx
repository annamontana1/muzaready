'use client';

import { useState, useEffect } from 'react';
import CatalogCard from '@/components/CatalogCard';
import WholesaleBand from '@/components/WholesaleBand';
import { Product, ProductVariant } from '@/types/product';

/**
 * Hybridní katalog (PLP) zobrazující:
 * - BULK produkty (Standard/LUXE) → "Vybrat parametry" → /produkt/[slug]
 * - PIECE SKU (Platinum/unikátní) → "Do košíku" / "Zadat poptávku"
 *
 * Datová struktura se fetchuje z `/api/katalog/unified`
 */

interface CatalogItem {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string; // BULK
  name: string;
  tier: string;
  imageUrl?: string;
  imageUrl2?: string;
  shade?: number;
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightGrams?: number; // PIECE
  pricePerGramCzk?: number; // BULK
  pricePerGramEur?: number;
  priceCzk?: number; // PIECE
  priceEur?: number;
  inStock: boolean;
  priority: number;
  saleMode?: 'PIECE_BY_WEIGHT' | 'BULK_G';
  isDyed?: boolean;
  createdAt?: string;
  availableGrams?: number;
  minOrderG?: number;
  stepG?: number;
}

// Řazení: kategorie se v katalogu nefiltruje (je vidět až na detailu kusu)
type SortKey = 'recommended' | 'newest' | 'price-asc' | 'price-desc';
const SORTS: { v: SortKey; label: string }[] = [
  { v: 'recommended', label: 'Doporučené' },
  { v: 'newest', label: 'Nejnovější' },
  { v: 'price-asc', label: 'Nejlevnější' },
  { v: 'price-desc', label: 'Nejdražší' },
];
// Cena kusu pro řazení: celá cena, u kusů po gramech cena za gram × hmotnost; bez ceny = null
const priceOf = (i: { priceCzk?: number; pricePerGramCzk?: number; weightGrams?: number }) =>
  i.priceCzk || (i.pricePerGramCzk && i.weightGrams ? i.pricePerGramCzk * i.weightGrams : i.pricePerGramCzk) || null;

// Stejné fotky odstínů jako ve vzorníku na hlavní stránce
const SHADES = [
  { num: 1, name: 'Černá', src: '/images/shades/01-cerna.jpg' },
  { num: 3, name: 'Tmavě hnědá', src: '/images/shades/03-tmava-hneda.jpg' },
  { num: 4, name: 'Hnědá', src: '/images/shades/04-hneda.jpg' },
  { num: 5, name: 'Světle hnědá', src: '/images/shades/05-svetla-hneda.jpg' },
  { num: 6, name: 'Tmavá blond', src: '/images/shades/06-tmava-blond.jpg' },
  { num: 7, name: 'Blond', src: '/images/shades/07-blond.jpg' },
  { num: 8, name: 'Světlá blond', src: '/images/shades/08-svetla-blond.jpg' },
  { num: 9, name: 'Velmi světlá blond', src: '/images/shades/09-velmi-svetla-blond.jpg' },
  { num: 10, name: 'Platinová blond', src: '/images/shades/10-platinova-blond.jpg' },
];

// Změna jednoho parametru v adrese bez přenačtení stránky
function setParam(key: string, value: string | null) {
  const p = new URLSearchParams(window.location.search);
  if (value) p.set(key, value); else p.delete(key);
  window.history.replaceState(null, '', p.toString() ? `/katalog?${p}` : '/katalog');
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'ALL' | 'BULK' | 'PIECE'>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  // ?odstin=7 — odkaz ze vzorníku odstínů na hlavní stránce
  const [shadeFilter, setShadeFilter] = useState<number | null>(null);
  // ?druh=stredoevropske (barvené) | panenske (nebarvené, virgin)
  const [kind, setKind] = useState<'stredoevropske' | 'panenske' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const odstin = Number(params.get('odstin'));
    if (odstin) setShadeFilter(odstin);
    const druh = params.get('druh');
    if (druh === 'stredoevropske' || druh === 'panenske') setKind(druh);
    const typ = params.get('typ');
    if (typ === 'BULK' || typ === 'PIECE') setSelectedType(typ);
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/katalog/unified');
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const data: CatalogItem[] = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching catalog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Řazení; kusy bez ceny jsou při řazení podle ceny vždy na konci
  const sortItems = (itemsToSort: CatalogItem[]): CatalogItem[] => {
    const sorted = [...itemsToSort];
    const byPrice = (dir: 1 | -1) => (a: CatalogItem, b: CatalogItem) => {
      const pa = priceOf(a), pb = priceOf(b);
      if (pa === null || pb === null) return pa === pb ? a.priority - b.priority : pa === null ? 1 : -1;
      return (pa - pb) * dir;
    };
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || a.priority - b.priority);
      case 'price-asc':
        return sorted.sort(byPrice(1));
      case 'price-desc':
        return sorted.sort(byPrice(-1));
      case 'recommended':
      default:
        return sorted.sort((a, b) => a.priority - b.priority);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    if (shadeFilter && Number(item.shade) !== shadeFilter) return false;
    // druh určuje u kusu pole isDyed (barvené = středoevropské, nebarvené = panenské);
    // u položek bez něj se odvodí z odstínu jako dřív
    if (kind) {
      const dyed = typeof item.isDyed === 'boolean' && item.type === 'PIECE' ? item.isDyed : Number(item.shade) >= 8;
      if (kind === 'stredoevropske' && !dyed) return false;
      if (kind === 'panenske' && dyed) return false;
    }
    return true;
  });

  const sortedItems = sortItems(filteredItems);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-text-mid">Načítám katalog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soft-cream py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-h2 md:text-h1 font-playfair text-burgundy mb-3">
            Katalog vlasů
          </h1>
          <p className="text-text-mid max-w-2xl mx-auto">
            Vyberte si z naší prémiové kolekce vlasů pro prodloužení. Čistě přírodní vlasy v různých kvalitách a stylech.
          </p>
        </div>

        {/* Druh vlasů: stejné dvě volby jako na hlavní stránce */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {([
            { v: null, label: 'Vše' },
            { v: 'stredoevropske', label: 'Středoevropské vlasy' },
            { v: 'panenske', label: 'Panenské vlasy' },
          ] as const).map((o) => {
            const on = kind === o.v;
            return (
              <button key={o.label} type="button" aria-pressed={on}
                onClick={() => { setKind(o.v); setParam('druh', o.v); }}
                className={`h-9 px-4 rounded-full text-[13px] border transition-colors ${on ? 'bg-muza-ink text-muza-onink border-muza-ink' : 'bg-transparent text-text-dark border-muza-line hover:border-muza-ink'}`}>
                {o.label}
              </button>
            );
          })}
        </div>

        {/* Odstín */}
        <div className="mb-6">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-ink mb-2">Odstín</div>
          {/* Fotky odstínů v oblouku jako na hlavní stránce; na mobilu se posouvají do strany */}
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[null, ...SHADES].map((x) => {
              const n = x ? x.num : null;
              const on = shadeFilter === n;
              return (
                <button key={n ?? 'vse'} type="button" aria-pressed={on}
                  aria-label={x ? `Odstín ${x.num}, ${x.name}` : 'Všechny odstíny'}
                  onClick={() => {
                    setShadeFilter(n);
                    setParam('odstin', n ? String(n) : null);
                  }}
                  className="flex-none w-14 lg:w-16 text-center">
                  <span className={`block h-[76px] lg:h-[88px] rounded-t-full rounded-b-lg overflow-hidden bg-muza-mocha transition-[box-shadow,opacity] ${on ? 'ring-2 ring-muza-ink ring-offset-2 ring-offset-soft-cream' : 'opacity-80 hover:opacity-100'}`}>
                    {x ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={x.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[12px] text-text-dark">Vše</span>
                    )}
                  </span>
                  <span className={`mt-1 block font-cormorant text-[18px] leading-none ${on ? 'text-muza-ink' : 'text-text-mid'}`}>{x ? x.num : '\u00A0'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Počet a řazení */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-text-mid tabular-nums">{sortedItems.length} {sortedItems.length === 1 ? 'kus' : sortedItems.length >= 2 && sortedItems.length <= 4 ? 'kusy' : 'kusů'}</span>
          <div role="group" aria-label="Seřadit" className="ml-auto flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-soft mr-1 flex-none">Seřadit</span>
            {SORTS.map((o) => {
              const on = sortBy === o.v;
              return (
                <button key={o.v} type="button" aria-pressed={on} onClick={() => setSortBy(o.v)}
                  className={`flex-none h-9 px-3.5 rounded-full text-[13px] transition-colors ${on ? 'bg-muza-ink text-muza-onink' : 'text-text-dark hover:bg-muza-mocha/60'}`}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-mid text-lg">Není dostupný žádný produkt v této kategorii.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 lg:gap-x-6 lg:gap-y-10">
            {sortedItems.map((item) => (
              <CatalogCard
                key={`${item.type}-${item.id}`}
                type={item.type}
                id={item.id}
                slug={item.slug}
                name={item.name}
                tier={item.tier}
                imageUrl={item.imageUrl}
                imageUrl2={item.imageUrl2}
                shade={item.shade}
                shadeName={item.shadeName}
                structure={item.structure}
                lengthCm={item.lengthCm}
                weightGrams={item.weightGrams}
                pricePerGramCzk={item.pricePerGramCzk}
                priceCzk={item.priceCzk}
                inStock={item.inStock}
                saleMode={item.saleMode}
                availableGrams={item.availableGrams}
                minOrderG={item.minOrderG}
                stepG={item.stepG}
              />
            ))}
          </div>
        )}
      </div>
      <WholesaleBand className="pb-12" />
    </div>
  );
}
