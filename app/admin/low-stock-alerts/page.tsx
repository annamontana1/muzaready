'use client';

import { useState, useEffect } from 'react';

interface LowStockItem {
  id: string;
  sku: string;
  name: string | null;
  availableGrams: number | null;
  shade: string | null;
  lengthCm: number | null;
  shadeName: string | null;
}

export default function LowStockAlertsPage() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(200);
  const [adminEmail, setAdminEmail] = useState('info@muzahair.cz');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  const checkLowStock = async (sendEmail = false) => {
    setLoading(true);
    setError(null);
    if (sendEmail) setEmailSending(true);

    try {
      const response = await fetch(
        `/api/admin/stock/check-low-stock?threshold=${threshold}&sendEmail=${sendEmail}&email=${encodeURIComponent(adminEmail)}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check low stock');
      }

      const data = await response.json();
      setItems(data.items);
      setLastChecked(new Date());

      if (sendEmail && data.emailSent) {
        alert(`✅ Alert email odeslán na ${adminEmail}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setEmailSending(false);
    }
  };

  useEffect(() => {
    checkLowStock(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatGrams = (grams: number | null) => {
    if (grams === null || grams === undefined) return '❌ Neznámé';
    if (grams === 0) return '🔴 0g';
    if (grams < 50) return `🔴 ${grams}g`;
    if (grams < 100) return `🟡 ${grams}g`;
    return `🟠 ${grams}g`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-burgundy mb-2">
          ⚠️ Monitoring nízkých zásob
        </h1>
        <p className="text-gray-600">
          Automatická kontrola skladových zásob a upozornění na nízké stavy
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Práh upozornění (gramy)
              </label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 200)}
                min={0}
                max={1000}
                step={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upozornit když množství klesne pod tuto hranici
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email pro upozornění
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kam poslat alert email
              </p>
            </div>

            <div className="flex items-end">
              <div className="space-x-2">
                <button
                  onClick={() => checkLowStock(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  {loading ? '⏳ Kontroluji...' : '🔄 Zkontrolovat'}
                </button>
                <button
                  onClick={() => checkLowStock(true)}
                  disabled={loading || emailSending}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {emailSending ? '📧 Odesílám...' : '📧 Poslat Alert'}
                </button>
              </div>
            </div>
          </div>

          {lastChecked && (
            <p className="text-sm text-gray-500">
              Poslední kontrola: {lastChecked.toLocaleString('cs-CZ')}
            </p>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <strong className="text-red-800">Chyba:</strong> <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Results */}
      {items.length === 0 && !loading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <span className="text-green-800">
            ✅ <strong>Výborně!</strong> Žádné produkty s nízkými zásobami (pod {threshold}g).
          </span>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <span className="text-yellow-800">
              ⚠️ <strong>Nalezeno {items.length} produktů s nízkými zásobami!</strong> Doporučujeme okamžitě objednat nové zásoby.
            </span>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Odstín
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Délka
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dostupné gramy
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.name || 'Bez názvu'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.shadeName || item.shade || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        {item.lengthCm ? `${item.lengthCm} cm` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                        {formatGrams(item.availableGrams)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <a
                          href={`/admin/sklad?search=${item.sku}`}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Upravit →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          ℹ️ Jak funguje automatický monitoring
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Práh upozornění:</strong> Systém kontroluje všechny SKU, které jsou na skladě (inStock=true) a mají dostupné gramy pod nastaveným prahem.
          </p>
          <p>
            <strong>Email alert:</strong> Při kliknutí na "📧 Poslat Alert" systém odešle detailní email s přehledem všech produktů s nízkými zásobami.
          </p>
          <p>
            <strong>Doporučení:</strong> Nastavte si tento endpoint jako cron job (např. každé ráno v 9:00) pro automatické upozornění.
          </p>
          <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded font-mono">
            <strong className="block mb-1">Cron job příklad:</strong>
            GET /api/admin/stock/check-low-stock?threshold=200&sendEmail=true&email=info@muzahair.cz
          </p>
        </div>
      </div>
    </div>
  );
}
