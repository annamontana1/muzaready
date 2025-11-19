'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const context = useCart();
  const cart = context?.items || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-soft-cream py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-playfair text-burgundy mb-4">Váš košík je prázdný</h1>
            <p className="text-gray-600 mb-8">Přidejte si nějaké vlasy, než budete moci pokračovat.</p>
            <Link
              href="/vlasy-k-prodlouzeni"
              className="inline-block py-3 px-8 bg-burgundy text-white font-semibold rounded-lg hover:bg-maroon transition"
            >
              Zpět na nákup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair text-burgundy mb-2">Pokladna</h1>
        <p className="text-gray-600 mb-8">Vyplňte prosím své údaje a pokračujte k platbě</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-light p-8">
              <CheckoutForm />
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-light p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-burgundy mb-6">Přehled objednávky</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cart.map((item: any) => (
                  <div key={item.skuId} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.skuName}</p>
                      <p className="text-xs text-gray-500">Počet: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {((item.lineGrandTotal || item.lineTotal || 0) / 100).toFixed(2)} Kč
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mezisoučet:</span>
                  <span className="font-medium">
                    {(cart.reduce((sum: number, item: any) => sum + (item.lineTotal || 0), 0) / 100).toFixed(2)} Kč
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Poštovné:</span>
                  <span className="font-medium">Určeno při platbě</span>
                </div>

                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                  <span>Celkem:</span>
                  <span className="text-burgundy">
                    {(cart.reduce((sum: number, item: any) => sum + (item.lineGrandTotal || item.lineTotal || 0), 0) / 100).toFixed(2)} Kč
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Finální cena bude spočítána v závislosti na vámi vybraném způsobu doručení.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
