'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  availableGrams: number | null;
}

interface StockTakeItem {
  id: string;
  skuId: string;
  expectedGrams: number;
  countedGrams: number;
  difference: number;
  location: string | null;
  notes: string | null;
  sku: Sku;
}

interface StockTake {
  id: string;
  name: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  performedBy: string | null;
  notes: string | null;
  items: StockTakeItem[];
}

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  const [stockTake, setStockTake] = useState<StockTake | null>(null);
  const [loading, setLoading] = useState(true);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    skuId: '',
    countedGrams: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchStockTake();
    fetchSkus();
  }, [params.id]);

  const fetchStockTake = async () => {
    try {
      const response = await fetch(`/api/admin/stock/inventory/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setStockTake(data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Chyba při načítání inventury' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSkus = async () => {
    try {
      const response = await fetch('/api/admin/sku-list');
      const data = await response.json();
      if (data.skus) {
        setSkus(data.skus);
      }
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockTake) return;

    const selectedSku = skus.find(s => s.id === formData.skuId);
    if (!selectedSku) return;

    try {
      const response = await fetch(`/api/admin/stock/inventory/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            skuId: formData.skuId,
            expectedGrams: selectedSku.availableGrams || 0,
            countedGrams: parseInt(formData.countedGrams),
            location: formData.location || null,
            notes: formData.notes || null,
          }],
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Položka přidána' });
        setFormData({ skuId: '', countedGrams: '', location: formData.location, notes: '' });
        setShowAddForm(false);
        fetchStockTake();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Chyba při přidávání položky' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/stock/inventory/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Inventura ${newStatus === 'IN_PROGRESS' ? 'zahájena' : 'dokončena'}` });
        fetchStockTake();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Chyba při změně stavu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Opravdu chcete smazat tuto inventuru?')) return;

    try {
      const response = await fetch(`/api/admin/stock/inventory/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/inventory');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Chyba při mazání' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Chyba při komunikaci se serverem' });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PLANNED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      PLANNED: 'Naplánováno',
      IN_PROGRESS: 'Probíhá',
      COMPLETED: 'Dokončeno',
      CANCELLED: 'Zrušeno',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 text-gray-600">Načítání...</div>
      </div>
    );
  }

  if (!stockTake) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
          Inventura nenalezena
        </div>
      </div>
    );
  }

  const totalDifference = stockTake.items.reduce((sum, item) => sum + item.difference, 0);
  const itemsWithDifferences = stockTake.items.filter(item => item.difference !== 0).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/inventory"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Zpět na inventury
            </Link>
          </div>
          <div className="flex gap-3">
            {stockTake.status === 'PLANNED' && (
              <button
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
              >
                ▶ Zahájit inventuru
              </button>
            )}
            {stockTake.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleStatusChange('COMPLETED')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                ✓ Dokončit inventuru
              </button>
            )}
            {stockTake.status !== 'COMPLETED' && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                🗑 Smazat
              </button>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{stockTake.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div>{getStatusBadge(stockTake.status)}</div>
          {stockTake.performedBy && <div>👤 {stockTake.performedBy}</div>}
          <div>📅 Vytvořeno: {new Date(stockTake.createdAt).toLocaleDateString('cs-CZ')}</div>
          {stockTake.startedAt && (
            <div>▶ Zahájeno: {new Date(stockTake.startedAt).toLocaleString('cs-CZ')}</div>
          )}
          {stockTake.completedAt && (
            <div>✓ Dokončeno: {new Date(stockTake.completedAt).toLocaleString('cs-CZ')}</div>
          )}
        </div>
        {stockTake.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic">
            {stockTake.notes}
          </div>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Celkem položek</div>
          <div className="text-3xl font-bold text-gray-900">{stockTake.items.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Položek s rozdílem</div>
          <div className="text-3xl font-bold text-orange-600">{itemsWithDifferences}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Celkový rozdíl</div>
          <div className={`text-3xl font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalDifference >= 0 ? '+' : ''}{totalDifference}g
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Stav</div>
          <div className="mt-2">{getStatusBadge(stockTake.status)}</div>
        </div>
      </div>

      {/* Add Item Form */}
      {stockTake.status === 'IN_PROGRESS' && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Přidat položku</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {showAddForm ? 'Zrušit' : '+ Přidat položku'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <select
                  value={formData.skuId}
                  onChange={(e) => setFormData({ ...formData, skuId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Vyberte SKU...</option>
                  {skus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.sku} - {sku.name || 'Bez názvu'}
                      {sku.shadeName && ` (${sku.shadeName})`}
                      {sku.availableGrams !== null && ` - Systém: ${sku.availableGrams}g`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Napočítáno (gramy) *
                </label>
                <input
                  type="number"
                  value={formData.countedGrams}
                  onChange={(e) => setFormData({ ...formData, countedGrams: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Fyzicky napočítané gramy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokace
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="např. A1-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámka
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Volitelná poznámka"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  ✓ Přidat položku
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Položky inventury</h2>
        </div>

        {stockTake.items.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            Žádné položky. {stockTake.status === 'IN_PROGRESS' && 'Přidejte první položku výše.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Očekáváno
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Napočítáno
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rozdíl
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokace
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poznámka
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockTake.items.map((item) => (
                  <tr key={item.id} className={item.difference !== 0 ? 'bg-orange-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.sku.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sku.name || '—'}
                      {item.sku.shadeName && (
                        <div className="text-xs text-gray-500">{item.sku.shadeName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {item.expectedGrams}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {item.countedGrams}g
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                      item.difference > 0 ? 'text-green-600' : item.difference < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.difference >= 0 ? '+' : ''}{item.difference}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.location || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    Celkový rozdíl:
                  </td>
                  <td className={`px-6 py-3 text-right text-sm font-bold ${
                    totalDifference >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totalDifference >= 0 ? '+' : ''}{totalDifference}g
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Completion Warning */}
      {stockTake.status === 'IN_PROGRESS' && stockTake.items.length > 0 && itemsWithDifferences > 0 && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-orange-900 mb-2">Upozornění před dokončením</h3>
              <p className="text-sm text-orange-800 mb-3">
                Při dokončení inventury dojde k následujícím změnám:
              </p>
              <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                <li><strong>{itemsWithDifferences} položek</strong> má rozdíl oproti systému</li>
                <li>Systém automaticky vytvoří <strong>ADJUST movements</strong> pro všechny rozdíly</li>
                <li>Stavy SKU budou <strong>přepsány</strong> na napočítané hodnoty</li>
                <li>Celkový rozdíl: <strong className={totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {totalDifference >= 0 ? '+' : ''}{totalDifference}g
                </strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
