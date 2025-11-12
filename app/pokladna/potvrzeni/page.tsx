'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variant: string;
}

interface Order {
  id: string;
  email: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Objednávka nebyla nalezena');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          setError('Chyba při načítání objednávky');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Chyba při načítání objednávky');
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám potvrzení objednávky...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chyba</h1>
            <p className="text-gray-600 mb-6">{error || 'Objednávka nebyla nalezena'}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Zpět na domů
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingPrice = order.total > 500 ? 0 : 79;
  const subtotal = order.total;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Objednávka potvrzena!</h1>
          <p className="text-gray-600 mb-4">
            Vaše objednávka byla přijata a čeká na zaplacení.
          </p>
          <p className="text-sm text-gray-500">
            Potvrzení byl odeslán na e-mail: <strong>{order.email}</strong>
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Podrobnosti objednávky</h2>

          {/* Order ID and Status */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Číslo objednávky</p>
              <p className="text-lg font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stav</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.status === 'pending' && 'Čeká na platbu'}
                {order.status === 'paid' && 'Zaplaceno'}
                {order.status === 'shipped' && 'Odesláno'}
                {order.status === 'delivered' && 'Doručeno'}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Položky v objednávce</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Produkt: {item.productId}</p>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                    <p className="text-sm text-gray-600">Počet: {item.quantity}x</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-600">Mezisoučet:</p>
              <p className="font-medium text-gray-900">{subtotal.toLocaleString('cs-CZ')} Kč</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Doprava:</p>
              <p className="font-medium text-gray-900">
                {shippingPrice === 0 ? (
                  <span className="text-green-600">Zdarma</span>
                ) : (
                  `${shippingPrice} Kč`
                )}
              </p>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <p className="text-lg font-bold text-gray-900">Celkem:</p>
              <p className="text-lg font-bold text-blue-600">
                {(subtotal + shippingPrice).toLocaleString('cs-CZ')} Kč
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Co bude dál?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Na e-mail <strong>{order.email}</strong> Vám přijde potvrzení objednávky</li>
            <li>Přesměrujeme Vás na platební bránu GoPay</li>
            <li>Po zaplacení bude objednávka označena jako zaplacená</li>
            <li>Pošleme Vám potvrzení o odeslání balíčku na e-mail</li>
          </ol>
        </div>

        {/* Payment Button - Will integrate GoPay later */}
        <div className="bg-white rounded-lg shadow p-6 text-center mb-8">
          <p className="text-gray-600 mb-4">Hotov ke své platbě?</p>
          <button
            disabled
            className="px-8 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
            title="GoPay integrace bude dostupná brzy"
          >
            Pokračovat k platbě (GoPay - brzy)
          </button>
          <p className="text-xs text-gray-500 mt-2">
            GoPay integrace bude aktivní do 3 dnů
          </p>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Pokračovat na nákupy
          </Link>
        </div>
      </div>
    </div>
  );
}
