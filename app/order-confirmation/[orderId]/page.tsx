'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderConfirmation {
  id: string;
  email: string;
  total: number;
  status: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          setError('Objednávka nebyla nalezena');
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Chyba při načítání objednávky:', err);
        setError('Chyba při načítání objednávky');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-light p-8 text-center">
            <p className="text-gray-600">Načítám vaši objednávku...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-light p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-playfair text-burgundy mb-4">Chyba</h1>
              <p className="text-gray-600 mb-8">{error || 'Objednávka nebyla nalezena'}</p>
              <Link
                href="/"
                className="inline-block py-3 px-8 bg-burgundy text-white font-semibold rounded-lg hover:bg-maroon transition"
              >
                Zpět na domů
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-light p-8">
          {/* Success Message */}
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <h1 className="text-3xl font-playfair text-burgundy mb-2">Objednávka potvrzena!</h1>
            <p className="text-gray-600">
              Děkujeme za vaši objednávku. Potvrzení bylo odesláno na vaši emailovou adresu.
            </p>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-burgundy mb-4">Číslo objednávky</h2>
            <p className="text-2xl font-mono font-bold text-gray-900 break-all">{order.id}</p>
          </div>

          {/* Contact Info */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-burgundy mb-4">Vaše informace</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Email:</span> {order.email}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Celkem k platbě:</span>
              <span className="text-2xl font-bold text-burgundy">{order.total.toFixed(2)} Kč</span>
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-900">Stav objednávky:</span> Čeká na platbu
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Vaša objednávka bude v dalším kroku převedena na platbu. Prosím sledujte vaši emailovou schránku.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-burgundy mb-4">Jak dál?</h2>
            <ol className="space-y-3 text-gray-700 list-decimal list-inside">
              <li>Zkontrolujte svůj email na potvrzení objednávky</li>
              <li>Čekat na platební instrukce</li>
              <li>Po zaplacení bude objednávka poslána k vyřízení</li>
              <li>Dostanete email se sledovacím číslem</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition text-center"
            >
              Pokračovat v nákupu
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 bg-burgundy text-white font-semibold rounded-lg hover:bg-maroon transition text-center"
            >
              Zpět na domů
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
