'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

interface Movement {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  grams: number;
  note: string | null;
  refOrderId: string | null;
  createdAt: string;
}

interface SkuDetail {
  id: string;
  sku: string;
  shortCode: string | null;
  name: string | null;
  shade: string | null;
  shadeName: string | null;
  structure: string | null;
  customerCategory: string | null;
  saleMode: string;
  pricePerGramCzk: number | null;
  availableGrams: number | null;
  weightTotalG: number | null;
  imageUrl: string | null;
  images: string[];
  inStock: boolean;
  isDyed: boolean;
  movements: Movement[];
}

function categoryLabel(cat: string | null): string {
  switch (cat) {
    case 'STANDARD': return 'Standard';
    case 'LUXE': return 'Luxe';
    case 'PLATINUM_EDITION': return 'Platinum Edition';
    case 'BABY_SHADES': return 'Baby Shades';
    default: return '-';
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SkuEditPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.skuId as string;

  const [sku, setSku] = useState<SkuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [addGrams, setAddGrams] = useState('');
  const [addingStock, setAddingStock] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);

  // isDyed toggle (Platinum Edition)
  const [isDyed, setIsDyed] = useState<boolean>(false);
  const [savingIsDyed, setSavingIsDyed] = useState(false);

  // Image management
  const [editingPhotos, setEditingPhotos] = useState(false);

  useEffect(() => {
    fetchSku();
  }, [skuId]);

  const fetchSku = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/skus/${skuId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Nenalezeno');
      const data = await res.json();
      setSku(data);
      setIsDyed(data.isDyed ?? false);
      setMovements(data.movements || []);
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    const gramsNum = Number(addGrams);
    if (!gramsNum || gramsNum <= 0) return;

    setAddingStock(true);
    try {
      const res = await fetch('/api/admin/stock/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          skuId,
          grams: gramsNum,
          note: 'Manualni naskladneni',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba');

      setAddGrams('');
      fetchSku(); // refresh
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    } finally {
      setAddingStock(false);
    }
  };

  const handleAddImage = async (url: string) => {
    if (!url || !sku) return;
    const newImages = [...(sku.images || []), url];
    try {
      const res = await fetch(`/api/admin/skus/${skuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          images: newImages,
          imageUrl: sku.imageUrl || url,
        }),
      });
      if (!res.ok) throw new Error('Chyba pri ukladani');
      fetchSku();
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!sku) return;
    const newImages = sku.images.filter((_, i) => i !== index);
    try {
      const res = await fetch(`/api/admin/skus/${skuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          images: newImages,
          imageUrl: newImages[0] || null,
        }),
      });
      if (!res.ok) throw new Error('Chyba pri ukladani');
      fetchSku();
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
  };

  const handleSaveIsDyed = async (value: boolean) => {
    setSavingIsDyed(true);
    try {
      await fetch(`/api/admin/skus/${skuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isDyed: value }),
      });
      setIsDyed(value);
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    } finally {
      setSavingIsDyed(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#722F37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sku) {
    return (
      <div className="text-center py-20 text-stone-500">
        SKU nenalezeno.
        <button onClick={() => router.push('/admin/sklad')} className="block mt-4 text-[#722F37] underline">
          Zpet na sklad
        </button>
      </div>
    );
  }

  const currentStock =
    sku.saleMode === 'PIECE_BY_WEIGHT' ? sku.weightTotalG || 0 : sku.availableGrams || 0;

  const skuType = sku.sku.toUpperCase().includes('-BR-')
    ? 'Barvene'
    : sku.sku.toUpperCase().includes('-NB-')
    ? 'Nebarvene'
    : '-';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/sklad')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-1"
          >
            &larr; Zpet na sklad
          </button>
          <h1 className="text-2xl font-bold text-stone-800">
            {sku.shadeName || sku.shade || sku.name || sku.sku}
          </h1>
          <p className="text-sm text-stone-400 font-mono">{sku.sku}</p>
        </div>
      </div>

      {/* Section 1: Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Informace</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Odstin</span>
            <span className="text-sm font-medium text-stone-700">
              {sku.shadeName || sku.shade || '-'}
            </span>
          </div>
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Struktura</span>
            <span className="text-sm font-medium text-stone-700">
              {sku.structure || '-'}
            </span>
          </div>
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Kategorie</span>
            <span className="text-sm font-medium text-stone-700">
              {categoryLabel(sku.customerCategory)}
            </span>
          </div>
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Typ</span>
            <span className="text-sm font-medium text-stone-700">{skuType}</span>
          </div>

          {/* isDyed selector — jen pro Platinum Edition */}
          {sku.customerCategory === 'PLATINUM_EDITION' && (
            <div className="col-span-2 sm:col-span-3 pt-3 border-t border-stone-100">
              <span className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                Barevná kategorie (Platinum)
              </span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Nebarvené (1–4)', value: false, shades: '1–4', disabled: Number(sku.shade) >= 5 },
                  { label: 'Nebarvené přírodní (5–10)', value: false, shades: '5–10', disabled: Number(sku.shade) < 5 },
                  { label: 'Barvené (5–10)', value: true, shades: '5–10', disabled: Number(sku.shade) < 5 },
                ].map((opt) => {
                  const isActive =
                    opt.value === isDyed &&
                    (opt.shades === '1–4' ? Number(sku.shade) < 5 : Number(sku.shade) >= 5);
                  return (
                    <button
                      key={opt.label}
                      disabled={opt.disabled || savingIsDyed}
                      onClick={() => !opt.disabled && handleSaveIsDyed(opt.value)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition border ${
                        isActive
                          ? 'bg-[#722F37] text-white border-[#722F37]'
                          : opt.disabled
                          ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#722F37]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {savingIsDyed && <span className="text-xs text-stone-400 self-center">Ukládám...</span>}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Aktuální odstín: <strong>{sku.shade}</strong>
                {' · '}
                {isDyed ? 'Barvené' : 'Nebarvené'}
              </p>
            </div>
          )}
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Zpusob prodeje</span>
            <span className="text-sm font-medium text-stone-700">
              {sku.saleMode === 'BULK_G' ? 'Na gramy' : 'Cely culik'}
            </span>
          </div>
          <div>
            <span className="block text-xs text-stone-400 uppercase tracking-wider">Cena/g</span>
            <span className="text-sm font-medium text-stone-700">
              {sku.pricePerGramCzk ? `${sku.pricePerGramCzk} Kc` : '-'}
            </span>
          </div>
        </div>

        {/* Photos */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-stone-700">Fotky</span>
            <button
              onClick={() => setEditingPhotos(!editingPhotos)}
              className="text-xs text-[#722F37] hover:underline"
            >
              {editingPhotos ? 'Hotovo' : 'Upravit fotky'}
            </button>
          </div>

          {sku.images && sku.images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {sku.images.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                  />
                  {editingPhotos && (
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">Zadne fotky</p>
          )}

          {editingPhotos && (
            <div className="mt-3">
              <ImageUpload value="" onChange={handleAddImage} folder="skus" />
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Pridat gramaz */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Pridat gramaz</h2>

        <div className="bg-stone-50 rounded-lg p-4 mb-4">
          <span className="text-sm text-stone-500">Na sklade:</span>
          <span className="ml-2 text-2xl font-bold text-stone-800">{currentStock}g</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-stone-600">Pridat gramaz:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={addGrams}
              onChange={(e) => setAddGrams(e.target.value)}
              placeholder="0"
              className="w-32 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
            <span className="text-sm text-stone-500">g</span>
          </div>
          <button
            onClick={handleAddStock}
            disabled={!addGrams || Number(addGrams) <= 0 || addingStock}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingStock ? 'Pridavam...' : '+ Pridat na sklad'}
          </button>
        </div>
      </div>

      {/* Section 3: Movement history */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Historie pohybu</h2>

        {movements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Datum</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-stone-500 uppercase">Mnozstvi</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Duvod</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2 text-stone-600">{formatDate(m.createdAt)}</td>
                    <td className={`px-3 py-2 text-right font-mono font-medium ${
                      m.type === 'IN' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {m.type === 'IN' ? '+' : '-'}{m.grams}g
                    </td>
                    <td className="px-3 py-2 text-stone-500">
                      {m.note || (m.type === 'IN' ? 'Naskladneno' : m.refOrderId ? `Prodej #${m.refOrderId.slice(-6)}` : 'Prodej')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-stone-400">Zadne pohyby.</p>
        )}
      </div>
    </div>
  );
}
