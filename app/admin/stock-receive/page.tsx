'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  availableGrams: number | null;
}

interface StockMovement {
  id: string;
  grams: number;
  location: string | null;
  batchNumber: string | null;
  costPerGramCzk: number | null;
  note: string | null;
  performedBy: string | null;
  createdAt: string;
  sku: {
    id: string;
    sku: string;
    name: string | null;
  };
}

export default function StockReceivePage() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [recentReceipts, setRecentReceipts] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    skuId: '',
    grams: '',
    location: '',
    batchNumber: '',
    costPerGramCzk: '',
    note: '',
    performedBy: '',
  });

  useEffect(() => {
    fetchSkus();
    fetchRecentReceipts();
  }, []);

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
      const response = await fetch('/api/admin/stock/receive?limit=20');
      const data = await response.json();
      if (data.movements) {
        setRecentReceipts(data.movements);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/stock/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skuId: formData.skuId,
          grams: parseInt(formData.grams),
          location: formData.location || null,
          batchNumber: formData.batchNumber || null,
          costPerGramCzk: formData.costPerGramCzk ? parseFloat(formData.costPerGramCzk) : null,
          note: formData.note || null,
          performedBy: formData.performedBy || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Zboží úspěšně naskladněno!' });
        setFormData({
          skuId: '',
          grams: '',
          location: formData.location, // Keep location
          batchNumber: '',
          costPerGramCzk: '',
          note: '',
          performedBy: formData.performedBy, // Keep performer
        });
        fetchRecentReceipts();
      } else {
        setMessage({ type: 'error', text: data.error || 'Chyba při naskladňování' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Příjem zboží (Naskladnění)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Receive Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Naskladnit zboží</h2>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <select
                value={formData.skuId}
                onChange={(e) => setFormData({ ...formData, skuId: e.target.value })}
                required
                disabled={loadingSkus}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Vyberte SKU...</option>
                {skus.map((sku) => (
                  <option key={sku.id} value={sku.id}>
                    {sku.sku} - {sku.name || 'Bez názvu'}
                    {sku.shadeName && ` (${sku.shadeName})`}
                    {sku.lengthCm && ` - ${sku.lengthCm}cm`}
                    {sku.availableGrams !== null && ` - Sklad: ${sku.availableGrams}g`}
                  </option>
                ))}
              </select>
            </div>

            {/* Grams */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Množství (gramy) *
              </label>
              <input
                type="number"
                value={formData.grams}
                onChange={(e) => setFormData({ ...formData, grams: e.target.value })}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="např. 100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokace (regál/police)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="např. A1-3, Shelf B2"
              />
            </div>

            {/* Batch Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Číslo šarže
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="např. BATCH-2024-001"
              />
            </div>

            {/* Cost per Gram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nákupní cena za gram (Kč)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPerGramCzk}
                onChange={(e) => setFormData({ ...formData, costPerGramCzk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="např. 15.50"
              />
            </div>

            {/* Performed By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provedl
              </label>
              <input
                type="text"
                value={formData.performedBy}
                onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Jméno pracovníka"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poznámka
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Volitelná poznámka..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Naskladňuji...' : '✓ Naskladnit zboží'}
            </button>
          </form>
        </div>

        {/* Recent Receipts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Poslední příjmy</h2>

          {recentReceipts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Žádné záznamy</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {recentReceipts.map((receipt) => (
                <div key={receipt.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {receipt.sku.name || receipt.sku.sku}
                      </p>
                      <p className="text-sm text-gray-600">SKU: {receipt.sku.sku}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">+{receipt.grams}g</p>
                  </div>

                  {receipt.location && (
                    <p className="text-sm text-gray-600">📍 {receipt.location}</p>
                  )}
                  {receipt.batchNumber && (
                    <p className="text-sm text-gray-600">📦 Šarže: {receipt.batchNumber}</p>
                  )}
                  {receipt.costPerGramCzk && (
                    <p className="text-sm text-gray-600">
                      💰 {receipt.costPerGramCzk} Kč/g
                    </p>
                  )}
                  {receipt.performedBy && (
                    <p className="text-sm text-gray-600">👤 {receipt.performedBy}</p>
                  )}
                  {receipt.note && (
                    <p className="text-sm text-gray-600 italic mt-2">{receipt.note}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(receipt.createdAt).toLocaleString('cs-CZ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
