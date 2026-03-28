'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface OrderData {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  ico?: string;
  email: string;
  phone?: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  notesInternal?: string;
  items: Array<{
    id: string;
    nameSnapshot: string;
    grams: number;
    pricePerGram: number;
    lineTotal: number;
    saleMode: string;
    ending: string;
    assemblyFeeCzk?: number;
    assemblyFeeTotal?: number;
  }>;
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Načítání dokladu...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Objednávka nenalezena</p>
      </div>
    );
  }

  const date = new Date(order.createdAt);
  const receiptNumber = `PD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${order.id.substring(0, 6).toUpperCase()}`;

  const paymentLabel: Record<string, string> = {
    cash: 'Hotovost',
    card: 'Platební karta',
    bank_transfer: 'Bankovní převod',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
      {/* Print button - hidden when printing */}
      <div className="max-w-[600px] mx-auto mb-4 flex gap-3 print:hidden flex-wrap">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium"
        >
          🖨️ Vytisknout
        </button>
        <button
          onClick={() => {
            const url = `${window.location.origin}/nahled/${orderId}`;
            const text = `Dobrý den, zde je váš doklad z Muzahair.cz:\n${url}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
        >
          📱 Sdílet WhatsApp
        </button>
        <button
          onClick={() => {
            const url = `${window.location.origin}/nahled/${orderId}`;
            navigator.clipboard.writeText(url).then(() => alert('Odkaz zkopírován!'));
          }}
          className="px-6 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition font-medium"
        >
          🔗 Kopírovat odkaz
        </button>
        <button
          onClick={() => { window.history.back(); }}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          ← Zpět
        </button>
      </div>

      {/* Receipt */}
      <div className="max-w-[600px] mx-auto bg-white border border-gray-300 print:border-none">
        <div className="p-8 print:p-6">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-gray-300">
            <h1 className="text-2xl font-bold text-gray-900">MÙZA HAIR</h1>
            <p className="text-sm text-gray-500 mt-1">Anna Zvinchuk</p>
            <p className="text-sm text-gray-500">IČO: 17989230</p>
            <p className="text-sm text-gray-500">Šrámkova 430/12, Lesná, 638 00 Brno</p>
            <p className="text-sm text-gray-500">muzahaircz@gmail.com</p>
          </div>

          {/* Receipt title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
              Zjednodušený daňový doklad
            </h2>
            <p className="text-sm text-gray-500 mt-1">Číslo: {receiptNumber}</p>
          </div>

          {/* Info row */}
          <div className="flex justify-between text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
            <div>
              <p><span className="font-medium">Datum:</span> {date.toLocaleDateString('cs-CZ')}</p>
              <p><span className="font-medium">Čas:</span> {date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="text-right">
              <p><span className="font-medium">Platba:</span> {paymentLabel[order.paymentMethod] || order.paymentMethod}</p>
              {order.companyName && <p><span className="font-medium">Firma:</span> {order.companyName}</p>}
              {order.ico && <p><span className="font-medium">IČO:</span> {order.ico}</p>}
            </div>
          </div>

          {/* Customer */}
          {(order.firstName !== 'Prodejní' || order.companyName) && (
            <div className="text-sm text-gray-600 mb-4">
              <p className="font-medium text-gray-700">Zákazník:</p>
              <p>{order.firstName} {order.lastName}</p>
              {order.email && order.email !== 'prodejna@muzahair.cz' && <p>{order.email}</p>}
              {order.phone && <p>{order.phone}</p>}
            </div>
          )}

          {/* Items */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 font-semibold text-gray-700">Položka</th>
                <th className="text-right py-2 font-semibold text-gray-700">Množství</th>
                <th className="text-right py-2 font-semibold text-gray-700">Cena/j.</th>
                <th className="text-right py-2 font-semibold text-gray-700">Celkem</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} className={i < order.items.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-2 text-gray-800">
                    {item.nameSnapshot}
                    {item.ending && item.ending !== 'NONE' && (
                      <span className="text-gray-500 text-xs block">+ {item.ending}</span>
                    )}
                  </td>
                  <td className="text-right py-2 text-gray-600">
                    {item.saleMode === 'BULK_G' ? `${item.grams} g` : '1 ks'}
                  </td>
                  <td className="text-right py-2 text-gray-600">
                    {item.saleMode === 'BULK_G'
                      ? `${item.pricePerGram} Kč/g`
                      : `${item.lineTotal.toLocaleString('cs-CZ')} Kč`}
                  </td>
                  <td className="text-right py-2 font-medium text-gray-800">
                    {item.lineTotal.toLocaleString('cs-CZ')} Kč
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>CELKEM</span>
              <span>{order.total.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              Neplátce DPH — cena je konečná
            </p>
          </div>

          {/* Note */}
          {order.notesInternal && order.notesInternal !== 'POS prodej na prodejně' && (
            <div className="mt-4 text-sm text-gray-500">
              <p className="font-medium">Poznámka:</p>
              <p>{order.notesInternal}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>Děkujeme za Váš nákup!</p>
            <p className="mt-1">www.muzahair.cz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Načítání...</p></div>}>
      <ReceiptContent />
    </Suspense>
  );
}
