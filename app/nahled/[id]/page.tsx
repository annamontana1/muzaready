'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ReceiptData {
  type: 'order' | 'b2b_sale';
  id: string;
  createdAt: string;
  // order fields
  firstName?: string;
  lastName?: string;
  companyName?: string;
  ico?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  total?: number;
  subtotal?: number;
  shippingCost?: number;
  discountAmount?: number;
  channel?: string;
  items?: Array<{
    id: string;
    nameSnapshot: string;
    grams: number;
    pricePerGram: number;
    lineTotal: number;
    ending: string;
    assemblyFeeTotal: number;
  }>;
  // b2b fields
  partnerName?: string;
  partnerIco?: string;
  partnerEmail?: string;
  partnerAddress?: string;
  totalAmount?: number;
  invoiceType?: string;
  invoiceNumber?: string;
  notes?: string;
  items?: Array<{
    id: string;
    druh: string;
    barva: string;
    delkaCm: number;
    gramaz: number;
    amount: number;
  }>;
}

const paymentLabel: Record<string, string> = {
  hotovost: 'Hotovost',
  karta: 'Karta',
  prevod: 'Bankovní převod',
  gopay: 'Online platba',
};

export default function NahledPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/nahled/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
        setLoading(false);
      })
      .catch(() => { setError('Nepodařilo se načíst doklad'); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400 text-sm">Načítám doklad…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-red-500 text-sm">{error || 'Doklad nenalezen'}</p>
      </div>
    );
  }

  const date = new Date(data.createdAt);
  const dateStr = date.toLocaleDateString('cs-CZ');

  if (data.type === 'order') {
    const receiptNumber = `PD-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}-${data.id.substring(0,6).toUpperCase()}`;
    const total = data.total ?? 0;
    const shipping = data.shippingCost ?? 0;
    const discount = data.discountAmount ?? 0;

    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4">
        <div className="max-w-[560px] mx-auto bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Hlavička */}
          <div className="bg-[#722F37] text-white px-6 py-5 text-center">
            <p className="text-xs font-light tracking-widest uppercase opacity-80 mb-1">Muzahair.cz</p>
            <p className="text-lg font-semibold">Doklad o prodeji</p>
            <p className="text-xs opacity-70 mt-1">{receiptNumber}</p>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Datum + platba */}
            <div className="flex justify-between text-sm text-stone-500 border-b border-dashed border-stone-200 pb-4">
              <span>📅 {dateStr}</span>
              <span>💳 {paymentLabel[data.paymentMethod ?? ''] ?? data.paymentMethod}</span>
            </div>

            {/* Zákazník */}
            {(data.firstName !== 'Prodejní' || data.companyName) && (
              <div className="text-sm space-y-0.5">
                <p className="font-medium text-stone-700">
                  {data.companyName || `${data.firstName} ${data.lastName}`}
                </p>
                {data.ico && <p className="text-stone-500">IČO: {data.ico}</p>}
                {data.email && <p className="text-stone-500">{data.email}</p>}
                {data.phone && <p className="text-stone-500">{data.phone}</p>}
              </div>
            )}

            {/* Položky */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-400 text-xs border-b border-stone-100">
                  <th className="text-left pb-2 font-medium">Položka</th>
                  <th className="text-right pb-2 font-medium">Cena</th>
                </tr>
              </thead>
              <tbody>
                {data.items?.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50">
                    <td className="py-2 text-stone-700">
                      <p>{item.nameSnapshot}</p>
                      <p className="text-xs text-stone-400">
                        {item.grams}g × {item.pricePerGram} Kč/g
                        {item.ending && item.ending !== 'none' ? ` · ${item.ending}` : ''}
                      </p>
                    </td>
                    <td className="py-2 text-right text-stone-700 font-medium">
                      {(item.lineTotal + (item.assemblyFeeTotal ?? 0)).toLocaleString('cs-CZ')} Kč
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Souhrn */}
            <div className="space-y-1 text-sm">
              {shipping > 0 && (
                <div className="flex justify-between text-stone-500">
                  <span>Doprava</span>
                  <span>{shipping.toLocaleString('cs-CZ')} Kč</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Sleva</span>
                  <span>−{discount.toLocaleString('cs-CZ')} Kč</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-stone-200 pt-2 mt-1">
                <span>Celkem</span>
                <span className="text-[#722F37]">{total.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            {/* Patička */}
            <div className="text-center text-xs text-stone-400 border-t border-dashed border-stone-200 pt-4">
              <p className="font-medium text-stone-600">Muzahair.cz</p>
              <p>Anna Zvinchuk · IČO 17989230</p>
              <p>Šrámkova 430/12, Praha 8</p>
            </div>
          </div>
        </div>

        {/* Tlačítko tisk */}
        <div className="max-w-[560px] mx-auto mt-4 text-center">
          <button
            onClick={() => window.print()}
            className="text-sm text-stone-400 hover:text-stone-600 underline print:hidden"
          >
            🖨️ Tisknout
          </button>
        </div>
      </div>
    );
  }

  // B2B prodej
  const total = data.totalAmount ?? 0;
  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-[560px] mx-auto bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-[#722F37] text-white px-6 py-5 text-center">
          <p className="text-xs font-light tracking-widest uppercase opacity-80 mb-1">Muzahair.cz</p>
          <p className="text-lg font-semibold">Prodej — přehled zboží</p>
          {data.invoiceNumber && (
            <p className="text-xs opacity-70 mt-1">{data.invoiceNumber}</p>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex justify-between text-sm text-stone-500 border-b border-dashed border-stone-200 pb-4">
            <span>📅 {dateStr}</span>
          </div>

          <div className="text-sm space-y-0.5">
            <p className="font-medium text-stone-700">{data.partnerName}</p>
            {data.partnerIco && <p className="text-stone-500">IČO: {data.partnerIco}</p>}
            {data.partnerAddress && <p className="text-stone-500">{data.partnerAddress}</p>}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-400 text-xs border-b border-stone-100">
                <th className="text-left pb-2 font-medium">Zboží</th>
                <th className="text-right pb-2 font-medium">Cena</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.map((item) => (
                <tr key={item.id} className="border-b border-stone-50">
                  <td className="py-2 text-stone-700">
                    <p>{item.druh} · {item.barva}</p>
                    <p className="text-xs text-stone-400">{item.delkaCm} cm · {item.gramaz}g</p>
                  </td>
                  <td className="py-2 text-right text-stone-700 font-medium">
                    {item.amount.toLocaleString('cs-CZ')} Kč
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between font-bold text-base border-t border-stone-200 pt-2">
            <span>Celkem</span>
            <span className="text-[#722F37]">{total.toLocaleString('cs-CZ')} Kč</span>
          </div>

          {data.notes && (
            <p className="text-xs text-stone-500 italic">{data.notes}</p>
          )}

          <div className="text-center text-xs text-stone-400 border-t border-dashed border-stone-200 pt-4">
            <p className="font-medium text-stone-600">Muzahair.cz</p>
            <p>Anna Zvinchuk · IČO 17989230</p>
            <p>Šrámkova 430/12, Praha 8</p>
          </div>
        </div>
      </div>
      <div className="max-w-[560px] mx-auto mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="text-sm text-stone-400 hover:text-stone-600 underline print:hidden"
        >
          🖨️ Tisknout
        </button>
      </div>
    </div>
  );
}
