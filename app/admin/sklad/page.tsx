'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Sku {
  id: string;
  sku: string;
  shade: string | null;
  shadeName: string | null;
  structure: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | 'BABY_SHADES' | null;
  saleMode: string;
  pricePerGramCzk: number;
  availableGrams: number | null;
  weightTotalG: number | null;
  imageUrl: string | null;
  images: string[];
  inStock: boolean;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Vsechny' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'LUXE', label: 'Luxe' },
  { value: 'PLATINUM_EDITION', label: 'Platinum' },
  { value: 'BABY_SHADES', label: 'Baby Shades' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'Vsechny' },
  { value: 'barvene', label: 'Barvene' },
  { value: 'nebarvene', label: 'Nebarvene' },
];

const STRUCTURE_OPTIONS = [
  { value: '', label: 'Vsechny' },
  { value: 'rovne', label: 'Rovne' },
  { value: 'vlnite', label: 'Vlnite' },
  { value: 'mirne_vlnite', label: 'Mirne vlnite' },
  { value: 'kudrnate', label: 'Kudrnate' },
];

function categoryLabel(cat: string | null): string {
  switch (cat) {
    case 'STANDARD': return 'Standard';
    case 'LUXE': return 'Luxe';
    case 'PLATINUM_EDITION': return 'Platinum';
    case 'BABY_SHADES': return 'Baby Shades';
    default: return '-';
  }
}

function structureLabel(s: string | null): string {
  if (!s) return '-';
  const map: Record<string, string> = {
    'rovne': 'Rovne',
    'vlnite': 'Vlnite',
    'mirne_vlnite': 'Mirne vlnite',
    'kudrnate': 'Kudrnate',
    'rovne': 'Rovne',
    'vlnite': 'Vlnite',
    'mirne vlnite': 'Mirne vlnite',
    'kudrnate': 'Kudrnate',
  };
  return map[s.toLowerCase()] || s;
}

export default function SkladPage() {
  const router = useRouter();
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [structureFilter, setStructureFilter] = useState('');

  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skus', { credentials: 'include' });
      if (!res.ok) throw new Error('Chyba pri nacitani');
      const data = await res.json();
      setSkus(Array.isArray(data) ? data : data.skus || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = skus.filter((sku) => {
    if (categoryFilter && sku.customerCategory !== categoryFilter) return false;
    if (structureFilter && sku.structure?.toLowerCase() !== structureFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = sku.shadeName?.toLowerCase().includes(q);
      const matchShade = sku.shade?.toLowerCase().includes(q);
      const matchSku = sku.sku.toLowerCase().includes(q);
      if (!matchName && !matchShade && !matchSku) return false;
    }
    // Type filter: check SKU code for BR (barvene) or NB (nebarvene)
    if (typeFilter) {
      const skuUpper = sku.sku.toUpperCase();
      if (typeFilter === 'barvene' && !skuUpper.includes('-BR-')) return false;
      if (typeFilter === 'nebarvene' && !skuUpper.includes('-NB-')) return false;
    }
    return true;
  });

  const stockDisplay = (sku: Sku) => {
    if (sku.saleMode === 'PIECE_BY_WEIGHT') return `${sku.weightTotalG || 0}g`;
    return `${sku.availableGrams || 0}g`;
  };

  const photoCount = (sku: Sku) => {
    let count = 0;
    if (sku.imageUrl) count++;
    if (sku.images) count += sku.images.length;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#722F37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Sklad</h1>
        <Link
          href="/admin/konfigurator-sku"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium shadow-sm"
        >
          + Naskladnit
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Hledat odstin</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nazev, kod..."
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Kategorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Typ</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Struktura</label>
            <select
              value={structureFilter}
              onChange={(e) => setStructureFilter(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              {STRUCTURE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setTypeFilter(''); setStructureFilter(''); }}
              className="px-3 py-2 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              Resetovat filtry
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Odstin</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Struktura</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Kategorie</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Typ</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Sklad (g)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Cena/g</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Prodej</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Fotky</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((sku) => (
                <tr
                  key={sku.id}
                  onClick={() => router.push(`/admin/sklad/${sku.id}/edit`)}
                  className="hover:bg-[#722F37]/5 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-stone-800">
                    {sku.shadeName || sku.shade || '-'}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {structureLabel(sku.structure)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      sku.customerCategory === 'PLATINUM_EDITION' ? 'bg-amber-100 text-amber-800' :
                      sku.customerCategory === 'LUXE' ? 'bg-pink-100 text-pink-800' :
                      sku.customerCategory === 'BABY_SHADES' ? 'bg-blue-100 text-blue-800' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {categoryLabel(sku.customerCategory)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {sku.sku.toUpperCase().includes('-BR-') ? 'Barvene' : sku.sku.toUpperCase().includes('-NB-') ? 'Nebarvene' : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-stone-700">
                    {stockDisplay(sku)}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {sku.pricePerGramCzk ? `${sku.pricePerGramCzk} Kc` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      sku.saleMode === 'BULK_G'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {sku.saleMode === 'BULK_G' ? 'Na gramy' : 'Cely culik'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-stone-500">
                    {photoCount(sku) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            Zadne polozky neodpovidaji filtrum.
          </div>
        )}
      </div>

      <div className="text-sm text-stone-400">
        Celkem {filtered.length} polozek
      </div>
    </div>
  );
}
