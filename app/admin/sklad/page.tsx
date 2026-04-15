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
  minOrderG: number | null;
  stepG: number | null;
  imageUrl: string | null;
  images: string[];
  inStock: boolean;
  isListed: boolean;
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
  const [listedFilter, setListedFilter] = useState<'all' | 'listed' | 'unlisted'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  // inline price edit
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInputValue, setPriceInputValue] = useState('');
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);
  // bulk price modal
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkSaving, setBulkSaving] = useState(false);

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

  const handleSaveInlinePrice = async (skuId: string) => {
    const price = parseFloat(priceInputValue);
    if (!price || price <= 0) return;
    setSavingPriceId(skuId);
    try {
      const res = await fetch(`/api/admin/skus/${skuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pricePerGramCzk: price }),
      });
      if (!res.ok) throw new Error('Chyba');
      setSkus(prev => prev.map(s => s.id === skuId ? { ...s, pricePerGramCzk: price } : s));
      setEditingPriceId(null);
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    } finally {
      setSavingPriceId(null);
    }
  };

  const handleBulkPrice = async () => {
    const price = parseFloat(bulkPrice);
    if (!price || price <= 0) { alert('Zadej cenu větší než 0'); return; }
    setBulkSaving(true);
    try {
      // Update all currently filtered SKUs that have 0/null price
      const targets = filtered.filter(s => !s.pricePerGramCzk || s.pricePerGramCzk === 0);
      await Promise.all(targets.map(s =>
        fetch(`/api/admin/skus/${s.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ pricePerGramCzk: price }),
        })
      ));
      setSkus(prev => prev.map(s =>
        targets.some(t => t.id === s.id) ? { ...s, pricePerGramCzk: price } : s
      ));
      setBulkPriceOpen(false);
      setBulkPrice('');
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    } finally {
      setBulkSaving(false);
    }
  };

  const handleToggleListed = async (e: React.MouseEvent, sku: Sku) => {
    e.stopPropagation();
    setTogglingId(sku.id);
    try {
      const res = await fetch(`/api/admin/skus/${sku.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isListed: !sku.isListed, listingPriority: !sku.isListed ? 5 : null }),
      });
      if (!res.ok) throw new Error('Chyba');
      setSkus(prev => prev.map(s => s.id === sku.id ? { ...s, isListed: !sku.isListed } : s));
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = skus.filter((sku) => {
    if (categoryFilter && sku.customerCategory !== categoryFilter) return false;
    if (structureFilter && sku.structure?.toLowerCase() !== structureFilter) return false;
    if (listedFilter === 'listed' && !sku.isListed) return false;
    if (listedFilter === 'unlisted' && sku.isListed) return false;
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-stone-800">Sklad</h1>
        <div className="flex items-center gap-2">
          {filtered.some(s => !s.pricePerGramCzk || s.pricePerGramCzk === 0) && (
            <button
              onClick={() => setBulkPriceOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-medium shadow-sm text-sm"
            >
              ⚠️ Nastavit ceny ({filtered.filter(s => !s.pricePerGramCzk || s.pricePerGramCzk === 0).length} bez ceny)
            </button>
          )}
          <Link
            href="/admin/konfigurator-sku"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium shadow-sm"
          >
            + Naskladnit
          </Link>
        </div>
      </div>

      {/* Bulk price modal */}
      {bulkPriceOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-stone-800 mb-1">Hromadné nastavení ceny</h2>
            <p className="text-sm text-stone-500 mb-4">
              Nastaví cenu všem <strong>{filtered.filter(s => !s.pricePerGramCzk || s.pricePerGramCzk === 0).length} SKU</strong> v aktuálním filtru, které nemají cenu.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-500 mb-1">Cena za gram (Kč/g)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="např. 89 (= 8 900 Kč / 100g)"
                value={bulkPrice}
                onChange={e => setBulkPrice(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]"
                autoFocus
              />
              {bulkPrice && parseFloat(bulkPrice) > 0 && (
                <p className="text-xs text-stone-400 mt-1">
                  = {Math.round(parseFloat(bulkPrice) * 100).toLocaleString('cs-CZ')} Kč / 100g
                </p>
              )}
            </div>
            <div className="bg-stone-50 rounded-lg p-3 mb-4 text-xs text-stone-500">
              <strong>Orientační ceny:</strong><br/>
              Standard: 69 Kč/g (= 6 900 Kč/100g)<br/>
              LUXE: 89 Kč/g (= 8 900 Kč/100g)<br/>
              Platinum: 109 Kč/g (= 10 900 Kč/100g)<br/>
              Baby Shades: 79 Kč/g (= 7 900 Kč/100g)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkPrice}
                disabled={bulkSaving || !bulkPrice || parseFloat(bulkPrice) <= 0}
                className="flex-1 py-2.5 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a1f26] disabled:opacity-50 transition"
              >
                {bulkSaving ? 'Ukládám...' : 'Uložit ceny'}
              </button>
              <button
                onClick={() => setBulkPriceOpen(false)}
                className="px-4 py-2.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Katalog</label>
            <select
              value={listedFilter}
              onChange={(e) => setListedFilter(e.target.value as 'all' | 'listed' | 'unlisted')}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              <option value="all">Vsechny</option>
              <option value="listed">✅ Publikovano</option>
              <option value="unlisted">❌ Skryto</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setTypeFilter(''); setStructureFilter(''); setListedFilter('all'); }}
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
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Cena / 100g</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Prodej</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Fotky</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">Katalog</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider w-20"></th>
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
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    {editingPriceId === sku.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={priceInputValue}
                          onChange={e => setPriceInputValue(e.target.value)}
                          className="w-16 px-1.5 py-1 border border-[#722F37] rounded text-xs text-right focus:outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveInlinePrice(sku.id);
                            if (e.key === 'Escape') setEditingPriceId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveInlinePrice(sku.id)}
                          disabled={savingPriceId === sku.id}
                          className="px-1.5 py-1 bg-[#722F37] text-white text-xs rounded hover:bg-[#5a1f26]"
                        >✓</button>
                        <button onClick={() => setEditingPriceId(null)} className="text-stone-400 text-xs">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingPriceId(sku.id); setPriceInputValue(sku.pricePerGramCzk ? String(sku.pricePerGramCzk) : ''); }}
                        className={`text-sm font-mono hover:underline ${!sku.pricePerGramCzk || sku.pricePerGramCzk === 0 ? 'text-red-500 font-bold' : 'text-stone-700'}`}
                        title="Klikni pro úpravu ceny"
                      >
                        {sku.pricePerGramCzk && sku.pricePerGramCzk > 0
                          ? `${Math.round(sku.pricePerGramCzk * 100).toLocaleString('cs-CZ')} Kč`
                          : '⚠️ 0 Kč'}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      sku.saleMode === 'BULK_G'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {sku.saleMode === 'BULK_G' ? 'Na gramy' : 'Cely culik'}
                    </span>
                    {sku.saleMode === 'BULK_G' && (!sku.minOrderG || !sku.stepG) && (
                      <span className="ml-1 text-orange-500 text-xs" title="Min/krok není nastaven — používají se výchozí hodnoty (50g/10g)">⚙️</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-stone-500">
                    {photoCount(sku) || '-'}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleListed(e, sku)}
                      disabled={togglingId === sku.id}
                      title={sku.isListed ? 'Skrýt z katalogu' : 'Publikovat v katalogu'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        sku.isListed ? 'bg-green-500' : 'bg-stone-300'
                      } ${togglingId === sku.id ? 'opacity-50' : ''}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        sku.isListed ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/admin/sklad/${sku.id}/edit`); }}
                      className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-[#722F37] hover:text-white text-stone-600 rounded transition-colors font-medium"
                      title="Upravit SKU"
                    >
                      ✏️ Upravit
                    </button>
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
