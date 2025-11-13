'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  skuId: string;
  skuName: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  ending: string;
  assemblyFeeType: string;
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;
}

export default function SkuCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('sku-cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error('Failed to parse cart:', err);
      }
    }
    setLoading(false);
  }, []);

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('sku-cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('sku-cart');
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.lineGrandTotal, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryBadge = (category: string | null) => {
    switch (category) {
      case 'PLATINUM_EDITION':
        return { label: '✨ Platinum Edition', color: 'bg-yellow-100 text-yellow-800' };
      case 'LUXE':
        return { label: '💎 Luxe', color: 'bg-pink-100 text-pink-800' };
      case 'STANDARD':
        return { label: '⭐ Standard', color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: 'Neznámá', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getEndingLabel = (ending: string) => {
    switch (ending) {
      case 'KERATIN':
        return '✨ Keratin (5 Kč/g)';
      case 'PASKY':
        return '🎀 Pásky (200 Kč)';
      case 'TRESSY':
        return '💎 Tressy (150 Kč)';
      case 'NONE':
        return '- Bez zakončení';
      default:
        return ending;
    }
  };

  const handleCreateOrder = async () => {
    if (!email.trim()) {
      alert('Zadej prosím svůj e-mail');
      return;
    }

    if (cart.length === 0) {
      alert('Košík je prázdný');
      return;
    }

    setCreatingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          items: cart,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Chyba při vytváření objednávky');
      }

      const data = await res.json();
      setOrderId(data.id);
      setOrderCreated(true);
      setCart([]);
      localStorage.removeItem('sku-cart');
    } catch (err: any) {
      alert(`Chyba: ${err.message}`);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-gray-600">Načítám košík...</p>
        </div>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">✓ Objednávka vytvořena!</h1>
            <p className="text-green-700 mb-2">Číslo objednávky:</p>
            <p className="text-2xl font-mono font-bold text-green-800 mb-6">{orderId}</p>
            <p className="text-gray-700 mb-6">
              Nyní přejdeš na platební bránu GoPay. Poté, co zaplatíš, obdrží vás potvrzovací e-mail s detaily objednávky.
            </p>
            <Link href="/katalog" className="inline-block bg-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-maroon transition">
              ← Zpět na katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/katalog" className="text-burgundy hover:text-maroon flex items-center gap-1">
            ← Zpět na katalog
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-burgundy mb-8">Nákupní košík</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-6">Tvůj košík je prázdný</p>
            <Link href="/katalog" className="inline-block bg-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-maroon transition">
              Jít nakupovat
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const badge = getCategoryBadge(item.customerCategory);
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-burgundy">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-burgundy mb-1">{item.skuName || 'Bez názvu'}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        ✕ Odstranit
                      </button>
                    </div>

                    {/* Configuration */}
                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Gramy:</span>
                        <span>{item.grams}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cena za 1g:</span>
                        <span>{formatPrice(item.pricePerGram)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Zakončení:</span>
                        <span>{getEndingLabel(item.ending)}</span>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-gray-200">
                      <div className="flex justify-between">
                        <span>Vlasy:</span>
                        <span className="font-medium">{formatPrice(item.lineTotal)}</span>
                      </div>
                      {item.assemblyFeeTotal > 0 && (
                        <div className="flex justify-between text-amber-700">
                          <span>Zakončení:</span>
                          <span className="font-medium">{formatPrice(item.assemblyFeeTotal)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-burgundy">
                        <span>Celkem za 1 ks:</span>
                        <span className="text-lg">{formatPrice(item.lineGrandTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-burgundy/10 to-maroon/10 rounded-lg p-4 space-y-3">
                  <h3 className="font-bold text-burgundy text-lg">Shrnutí objednávky</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Počet položek:</span>
                      <span className="font-medium">{cart.length}</span>
                    </div>
                  </div>
                  <div className="border-t border-burgundy/30 pt-3 flex justify-between">
                    <span className="font-bold">Celkem:</span>
                    <span className="text-2xl font-bold text-burgundy">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tvuj@email.cz"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-burgundy outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Potvrzení a detaily objednávky budou odeslány na tento e-mail
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCreateOrder}
                  disabled={creatingOrder || cart.length === 0}
                  className="w-full bg-burgundy text-white py-3 rounded-lg font-semibold hover:bg-maroon transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingOrder ? '⏳ Vytvářím objednávku...' : '💳 Pokračovat k platbě'}
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Vyprázdnit košík
                </button>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                  <p className="font-medium mb-2">ℹ️ Jak dál:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Zadej svůj e-mail</li>
                    <li>Klikni na "Pokračovat k platbě"</li>
                    <li>Zaplať přes GoPay</li>
                    <li>Obdrž potvrzení a číslo objednávky</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
