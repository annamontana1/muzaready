'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StockTake {
  id: string;
  name: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  performedBy: string | null;
  notes: string | null;
  items: any[];
}

export default function InventoryPage() {
  const [stockTakes, setStockTakes] = useState<StockTake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    performedBy: '',
    notes: '',
  });

  useEffect(() => {
    fetchStockTakes();
  }, []);

  const fetchStockTakes = async () => {
    try {
      const response = await fetch('/api/admin/stock/inventory');
      const data = await response.json();
      if (data.stockTakes) {
        setStockTakes(data.stockTakes);
      }
    } catch (error) {
      console.error('Error fetching stock takes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockTake = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/stock/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', performedBy: '', notes: '' });
        setShowNewForm(false);
        fetchStockTakes();
      } else {
        alert('Chyba při vytváření inventury');
      }
    } catch (error) {
      alert('Chyba při komunikaci se serverem');
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventury skladu</h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Nová inventura
        </button>
      </div>

      {/* New Stock Take Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Vytvořit inventuru</h2>

          <form onSubmit={handleCreateStockTake} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Název inventury *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="např. Měsíční inventura 12/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provádí
              </label>
              <input
                type="text"
                value={formData.performedBy}
                onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Jméno pracovníka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poznámka
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Volitelná poznámka..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Vytvořit inventuru
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stock Takes List */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Načítání...</div>
      ) : stockTakes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
          Žádné inventury nenalezeny. Vytvořte první inventuru.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Název
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stav
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provádí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Položky
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vytvořeno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockTakes.map((stockTake) => (
                <tr key={stockTake.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stockTake.name}</div>
                    {stockTake.notes && (
                      <div className="text-sm text-gray-500 italic">{stockTake.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(stockTake.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stockTake.performedBy || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stockTake.items?.length || 0} položek
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(stockTake.createdAt).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/admin/inventory/${stockTake.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
