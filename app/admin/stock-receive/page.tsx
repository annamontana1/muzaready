'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Sku {
  id: string;
  sku: string;
  shortCode: string | null;
  name: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  structure: string | null;
  availableGrams: number | null;
  customerCategory: string | null;
  saleMode: string | null;
}

interface StockMovement {
  id: string;
  grams: number;
  note: string | null;
  performedBy: string | null;
  createdAt: string;
  sku: {
    id: string;
    sku: string;
    shortCode: string | null;
    name: string | null;
  };
}

export default function StockReceivePage() {
  const searchParams = useSearchParams();
  const preselectedSkuId = searchParams.get('skuId');

  const [skus, setSkus] = useState<Sku[]>([]);
  const [recentReceipts, setRecentReceipts] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastMovementId, setLastMovementId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    skuId: preselectedSkuId || '',
    grams: '',
    note: '',
  });

  useEffect(() => {
    fetchSkus();
    fetchRecentReceipts();
  }, []);

  useEffect(() => {
    if (preselectedSkuId) {
      setFormData(prev => ({ ...prev, skuId: preselectedSkuId }));
    }
  }, [preselectedSkuId]);

  const fetchSkus = async () => {
    try {
      const response = await fetch('/api/admin/sku-list');
      const data = await response.json();
      if (data.skus) {
        setSkus(data.skus);
      }
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoadingSkus(false);
    }
  };

  const fetchRecentReceipts = async () => {
    try {
      const response = await fetch('/api/admin/stock/receive?limit=10');
      const data = await response.json();
      if (data.movements) {
        setRecentReceipts(data.movements);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const selectedSku = skus.find(s => s.id === formData.skuId);

  const filteredSkus = skus.filter(sku => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sku.sku.toLowerCase().includes(q) ||
      (sku.shortCode && sku.shortCode.toLowerCase().includes(q)) ||
      (sku.name && sku.name.toLowerCase().includes(q)) ||
      (sku.shadeName && sku.shadeName.toLowerCase().includes(q))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skuId || !formData.grams) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/stock/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skuId: formData.skuId,
          grams: parseInt(formData.grams),
          note: formData.note || null,
          performedBy: null,
          location: null,
          batchNumber: null,
          costPerGramCzk: null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Přidáno ${formData.grams}g ke ${selectedSku?.shortCode || selectedSku?.sku}` });
        setLastMovementId(data.movement?.id || null);
        setFormData(prev => ({ ...prev, grams: '', note: '' }));
        fetchRecentReceipts();
        fetchSkus(); // Refresh stock counts
      } else {
        setMessage({ type: 'error', text: data.error || 'Chyba při naskladňování' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    } finally {
      setLoading(false);
    }
  };

  const formatSkuLabel = (sku: Sku) => {
    const parts = [];
    if (sku.shortCode) parts.push(sku.shortCode);
    if (sku.customerCategory) parts.push(sku.customerCategory);
    if (sku.shadeName) parts.push(sku.shadeName);
    if (sku.structure) parts.push(sku.structure);
    if (sku.lengthCm) parts.push(`${sku.lengthCm}cm`);
    parts.push(`(${sku.availableGrams ?? 0}g skladem)`);
    return parts.join(' — ');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Doskladnit</h1>
          <p className="text-gray-500 mt-1">Přidejte gramáž k existující položce</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/sklad/novy"
            className="px-4 py-2 text-burgundy hover:text-maroon border border-burgundy rounded-lg hover:bg-burgundy/5 transition font-medium"
          >
            + Nové SKU
          </Link>
          <Link
            href="/admin/sklad"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Zpět na sklad
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="font-medium">{message.text}</p>
                {message.type === 'success' && lastMovementId && (
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={`/api/admin/stock/qr-code/${lastMovementId}`}
                      alt="QR kód"
                      className="w-24 h-24 border rounded"
                    />
                    <a
                      href={`/api/admin/stock/qr-code/${lastMovementId}`}
                      download
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Stáhnout QR kód
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SKU Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  1. Vyberte SKU
                </label>
                <input
                  type="text"
                  placeholder="Hledat podle kódu, názvu, odstínu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                />
                <select
                  value={formData.skuId}
                  onChange={(e) => setFormData({ ...formData, skuId: e.target.value })}
                  required
                  disabled={loadingSkus}
                  size={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
                >
                  <option value="">— Vyberte SKU —</option>
                  {filteredSkus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {formatSkuLabel(sku)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected SKU Info */}
              {selectedSku && (
                <div className="p-4 bg-burgundy/5 border border-burgundy/20 rounded-lg">
                  <div className="font-bold text-burgundy text-lg">{selectedSku.shortCode || selectedSku.sku}</div>
                  <div className="text-sm text-gray-700 mt-1">
                    {selectedSku.name} — {selectedSku.shadeName} — {selectedSku.structure} — {selectedSku.lengthCm}cm
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Aktuálně skladem: <span className="text-burgundy">{selectedSku.availableGrams ?? 0}g</span>
                  </div>
                </div>
              )}

              {/* Grams */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  2. Kolik gramů přidáváte?
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={formData.grams}
                    onChange={(e) => setFormData({ ...formData, grams: e.target.value })}
                    required
                    min="1"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-burgundy"
                    placeholder="např. 200"
                  />
                  <span className="flex items-center text-lg font-medium text-gray-500">gramů</span>
                </div>
                {/* Quick buttons */}
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, 300, 500].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, grams: String(g) })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        formData.grams === String(g)
                          ? 'bg-burgundy text-white border-burgundy'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Poznámka <span className="font-normal text-gray-400">(volitelné)</span>
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
                  placeholder="např. nová várka z Indie"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.skuId || !formData.grams}
                className="w-full px-6 py-4 bg-burgundy text-white rounded-xl font-bold text-lg hover:bg-maroon disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Naskladňuji...' : '✓ Přidat na sklad'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Receipts Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-gray-900 mb-4">Poslední příjmy</h2>
            {recentReceipts.length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm">Žádné záznamy</p>
            ) : (
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {receipt.sku.shortCode || receipt.sku.sku}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(receipt.createdAt).toLocaleDateString('cs-CZ')}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600">+{receipt.grams}g</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
