'use client';

import { useState } from 'react';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';

interface OrderItem {
  id: string;
  skuId: string;
  skuName: string | null;
  shade: string | null;
  lengthCm: number | null;
  structure: string | null;
  saleMode: string;
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  ending: string;
  assemblyFeeType: string | null;
  assemblyFeeCzk: number | null;
  assemblyFeeTotal: number | null;
  lineGrandTotal: number;
}

interface Order {
  id: string;
  email: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderTrackingPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, orderId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Nepodařilo se vyhledat objednávku');
      }

      const data = await response.json();
      setOrder(data);
      setIsSearching(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při vyhledávání objednávky');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setOrderId('');
    setOrder(null);
    setError(null);
    setIsSearching(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-burgundy mb-3">Sledování objednávky</h1>
          <p className="text-gray-600">
            Vyhledejte si svou objednávku pomocí e-mailu a ID objednávky
          </p>
        </div>

        {!isSearching ? (
          // Search Form
          <div className="bg-white rounded-xl shadow-light p-8 border border-gray-200">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailová adresa *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jmeno@example.com"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID objednávky *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Např. cljr5m2g00000gkqu1a1b2c3d"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  ID objednávky naleznete v potvrzovacím e-mailu
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
                  <p className="font-semibold">Chyba</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-burgundy text-white font-semibold rounded-lg hover:bg-maroon disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Vyhledávám...
                  </span>
                ) : (
                  'Hledat objednávku'
                )}
              </button>
            </form>
          </div>
        ) : order ? (
          // Order Details
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={handleReset}
              className="text-burgundy font-semibold hover:text-maroon transition"
            >
              ← Nové vyhledávání
            </button>

            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-light p-8 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 text-sm mb-1">ID objednávky</p>
                  <p className="text-2xl font-bold text-gray-900 break-all">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">E-mail</p>
                  <p className="text-lg font-semibold text-gray-900">{order.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Datum objednávky</p>
                  <p className="text-lg text-gray-900">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Poslední aktualizace</p>
                  <p className="text-lg text-gray-900">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-light p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Stav objednávky</h2>
              <OrderStatusTimeline currentStatus={order.status} />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-light p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Obsah objednávky</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Item Details */}
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">{item.skuName || 'Neznámý produkt'}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          {item.shade && <p>Odstín: {item.shade}</p>}
                          {item.lengthCm && <p>Délka: {item.lengthCm} cm</p>}
                          {item.structure && <p>Struktura: {item.structure}</p>}
                          <p>Typ: {item.saleMode === 'PIECE_BY_WEIGHT' ? 'Kus' : 'Hromadný prodej'}</p>
                          <p>Váha: {item.grams} g</p>
                          {item.ending !== 'NONE' && <p>Zakončení: {item.ending}</p>}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cena za gram:</span>
                          <span className="font-semibold text-gray-900">{formatPrice(item.pricePerGram)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Řádek celkem:</span>
                          <span className="font-semibold text-gray-900">{formatPrice(item.lineTotal)}</span>
                        </div>
                        {item.assemblyFeeTotal !== null && item.assemblyFeeTotal > 0 && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Poplatek za montáž:</span>
                              <span className="font-semibold text-gray-900">
                                {formatPrice(item.assemblyFeeTotal)}
                              </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                              <span className="font-semibold text-gray-900">Součet:</span>
                              <span className="text-lg font-bold text-burgundy">
                                {formatPrice(item.lineGrandTotal)}
                              </span>
                            </div>
                          </>
                        )}
                        {(!item.assemblyFeeTotal || item.assemblyFeeTotal === 0) && (
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold text-gray-900">Součet:</span>
                            <span className="text-lg font-bold text-burgundy">
                              {formatPrice(item.lineTotal)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Celková suma objednávky:</span>
                  <span className="text-3xl font-bold text-burgundy">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-6">
              <p className="font-semibold text-blue-900 mb-2">Máte otázky?</p>
              <p className="text-blue-800 text-sm">
                Pokud máte jakékoliv dotazy ohledně vaší objednávky, kontaktujte nás prosím na
                <a href="mailto:info@muzaready.cz" className="font-semibold underline">
                  {' '}
                  info@muzaready.cz
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
