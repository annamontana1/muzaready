'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/lib/queries/orders';
import { useQueryClient } from '@tanstack/react-query';
import OrderHeader from './components/OrderHeader';
import CustomerSection from './components/CustomerSection';
import ItemsSection from './components/ItemsSection';
import PaymentSection from './components/PaymentSection';
import ShipmentHistory from './components/ShipmentHistory';
import MetadataSection from './components/MetadataSection';
import OrderHistorySection from './components/OrderHistorySection';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { orderKeys } from '@/lib/queries/orders';

// Note: Using local Order interface because detail page needs more fields
// than the simplified Order type in types.ts (which is for list view)
interface OrderItem {
  id: string;
  orderId: string;
  grams: number;
  lineTotal: number;
  pricePerGram: number;
  nameSnapshot: string | null;
  saleMode: string;
  ending: string;
  skuId: string;
  sku?: {
    id: string;
    sku: string;
    name: string | null;
    shadeName: string | null;
    lengthCm: number | null;
  };
}

interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  deliveryMethod: string;

  // Zásilkovna data
  packetaPointId: string | null;
  packetaPointName: string | null;
  packetaPointData: string | null;

  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  paymentMethod: string | null;
  channel: string;
  tags: string | null;
  riskScore: number;
  notesInternal: string | null;
  notesCustomer: string | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  lastStatusChangeAt: string | null;
  items: OrderItem[];
  // Fakturoid proforma fields
  fakturoidInvoiceId: string | null;
  fakturoidIsProforma: boolean;
  fakturoidInvoiceUrl: string | null;
  fakturoidInvoiceNum: string | null;
  naklad: number | null;
  // Legacy / computed
  invoiceUrl?: string | null;
}

type TabType = 'customer' | 'items' | 'payment' | 'invoice' | 'shipments' | 'metadata' | 'history';

function InvoiceSection({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(order.fakturoidInvoiceUrl ?? order.invoiceUrl ?? null);
  const [isProforma, setIsProforma] = useState<boolean>(order.fakturoidIsProforma ?? false);
  const [converting, setConverting] = useState(false);

  const isInstagram = order.channel === 'instagram';
  const isStore = order.channel === 'store';
  const paymentLabel = order.paymentMethod === 'bank_transfer' ? 'Převod' : order.paymentMethod === 'cash' ? 'Hotovost' : order.paymentMethod || '—';

  async function generateInvoice() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/resend-invoice`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
      } else {
        setResult({ error: data.error || 'Nepodařilo se vytvořit fakturu' });
      }
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally {
      setLoading(false);
    }
  }

  async function convertProforma() {
    setConverting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/convert-proforma`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsProforma(false);
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
        setResult({ success: true, message: `Faktura ${data.invoiceNumber || ''} byla vytvořena` });
      } else {
        setResult({ error: data.error || 'Nepodařilo se převést proformu' });
      }
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally {
      setConverting(false);
    }
  }

  const formatPrice = (v: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      {/* Invoice preview card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-stone-800">
              {isInstagram ? '📄 Proforma faktura' : '📄 Faktura'}
            </h3>
            <p className="text-sm text-stone-500">
              {isInstagram ? 'Zálohová faktura — převod na účet' : isStore ? 'Pokladní doklad' : 'Faktura'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Náhled — vždy viditelný */}
            {invoiceUrl ? (
              <a href={invoiceUrl} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#722F37] text-white rounded-lg text-sm font-medium hover:bg-[#5a252c] transition">
                👁 Náhled faktury
              </a>
            ) : (
              <a href={`/nahled/${order.id}`} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#722F37] text-white rounded-lg text-sm font-medium hover:bg-[#5a252c] transition">
                👁 Náhled dokladu
              </a>
            )}
            {isStore && order.paymentMethod === 'cash' && (
              <a href={`/admin/prodeje/doklad?id=${order.id}`} target="_blank"
                className="px-4 py-2 bg-stone-600 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition">
                🖨️ Pokladní doklad
              </a>
            )}
            <button
              onClick={() => {
                const url = invoiceUrl || `${window.location.origin}/nahled/${order.id}`;
                const text = `Dobrý den, zde je váš doklad z Muzahair.cz:\n${url}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
            >
              📱 WhatsApp
            </button>
            <button
              onClick={() => {
                const url = invoiceUrl || `${window.location.origin}/nahled/${order.id}`;
                navigator.clipboard.writeText(url).then(() => alert('Odkaz zkopírován!'));
              }}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-300 transition"
            >
              🔗 Odkaz
            </button>
            <button onClick={generateInvoice} disabled={loading}
              className="px-4 py-2 bg-stone-700 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
              {loading ? '⏳ Generuji...' : '📨 Fakturoid'}
            </button>
          </div>
        </div>

        {/* Proforma banner */}
        {isProforma && (
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between gap-4">
            <span className="text-sm text-yellow-800 font-medium">
              ⏳ Proforma faktura — čeká na zaplacení
            </span>
            <button
              onClick={convertProforma}
              disabled={converting}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
            >
              {converting ? '⏳ Převádím...' : '✅ Vytvořit fakturu'}
            </button>
          </div>
        )}

        {/* Result message */}
        {result && (
          <div className={`px-6 py-3 text-sm ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.success ? '✅ ' : '❌ '}{result.message || result.error}
          </div>
        )}

        {/* Invoice preview */}
        <div className="p-6">
          <div className="max-w-lg mx-auto border border-stone-200 rounded-lg p-6 bg-white">
            {/* Company header */}
            <div className="text-center mb-4 pb-3 border-b border-dashed border-stone-300">
              <h4 className="text-xl font-bold text-stone-900">MÙZA HAIR</h4>
              <p className="text-xs text-stone-500">Panenské vlasy & prodloužení</p>
              <p className="text-xs text-stone-500">muzahaircz@gmail.com</p>
            </div>

            {/* Doc type */}
            <div className="text-center mb-4">
              <p className="font-bold text-sm uppercase tracking-wider text-stone-700">
                {isInstagram ? 'Proforma faktura' : isStore && order.paymentMethod === 'cash' ? 'Zjednodušený daňový doklad' : 'Faktura'}
              </p>
              <p className="text-xs text-stone-500">Obj. č.: {order.id.substring(0, 12)}</p>
            </div>

            {/* Customer */}
            <div className="text-sm mb-4 pb-3 border-b border-stone-200">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-stone-700">Odběratel:</p>
                  <p>{order.firstName} {order.lastName}</p>
                  {order.email && <p className="text-stone-500">{order.email}</p>}
                  {order.phone && <p className="text-stone-500">{order.phone}</p>}
                </div>
                <div className="text-right">
                  <p><span className="text-stone-500">Datum:</span> {new Date(order.createdAt).toLocaleDateString('cs-CZ')}</p>
                  <p><span className="text-stone-500">Platba:</span> {paymentLabel}</p>
                  <p><span className="text-stone-500">Kanál:</span> {order.channel}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-1 text-stone-600 font-medium">Položka</th>
                  <th className="text-right py-1 text-stone-600 font-medium">Celkem</th>
                </tr>
              </thead>
              <tbody>
                {order.items.length > 0 ? order.items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100">
                    <td className="py-1.5">
                      <p className="text-stone-800">{item.nameSnapshot || item.sku?.name || 'Položka'}</p>
                      <p className="text-xs text-stone-500">
                        {item.saleMode === 'BULK_G' ? `${item.grams}g × ${item.pricePerGram} Kč/g` : '1 ks'}
                        {item.ending && item.ending !== 'NONE' && ` + ${item.ending}`}
                      </p>
                    </td>
                    <td className="text-right py-1.5 font-medium text-stone-800">{formatPrice(item.lineTotal)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td className="py-2 text-stone-500 italic" colSpan={2}>
                      Položky viz interní poznámka
                    </td>
                  </tr>
                )}
                {order.shippingCost > 0 && (
                  <tr className="border-b border-stone-100">
                    <td className="py-1.5 text-stone-800">Doprava</td>
                    <td className="text-right py-1.5 font-medium text-stone-800">{formatPrice(order.shippingCost)}</td>
                  </tr>
                )}
                {order.discountAmount > 0 && (
                  <tr className="border-b border-stone-100">
                    <td className="py-1.5 text-green-700">Sleva</td>
                    <td className="text-right py-1.5 font-medium text-green-700">-{formatPrice(order.discountAmount)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-dashed border-stone-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-stone-900">CELKEM</span>
              <span className="text-lg font-bold text-[#722F37]">{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-stone-400 text-right mt-1">Neplátce DPH — cena je konečná</p>

            {/* Internal notes for Instagram orders */}
            {order.notesInternal && isInstagram && (
              <div className="mt-4 pt-3 border-t border-stone-200">
                <p className="text-xs font-medium text-stone-600 mb-1">Detaily objednávky:</p>
                <pre className="text-xs text-stone-500 whitespace-pre-wrap font-sans">{order.notesInternal}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();

  // React Query hook - replaces useState + useEffect + fetchOrder
  // Type assertion: useOrder returns simplified Order, but we need full Order with all fields
  const { data: order, isLoading, error, refetch } = useOrder(orderId) as { data: Order | undefined; isLoading: boolean; error: Error | null; refetch: () => void };

  const [activeTab, setActiveTab] = useState<TabType>('customer');

  // Handler to refresh order data after status changes
  const handleStatusChange = () => {
    // Invalidate and refetch order data
    queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Zpět na objednávky
        </Link>

        <CardSkeleton />

        <div className="mt-6 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-800">{error.message || 'Chyba při načítání objednávky'}</p>
        </div>
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">
          ← Zpět na objednávky
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800">Objednávka nebyla nalezena</p>
        </div>
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">
          ← Zpět na objednávky
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">
            ← Zpět na objednávky
          </Link>
          <Link
            href={`/admin/objednavky/${orderId}/edit`}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition shadow-sm inline-block"
            style={{ display: 'inline-block' }}
          >
            ✏️ Upravit objednávku
          </Link>
        </div>
      </div>

      {/* Order Header */}
      <OrderHeader order={order} onStatusChange={handleStatusChange} />

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'customer'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Zákazník
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'items'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Položky
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'payment'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Platba
        </button>
        <button
          onClick={() => setActiveTab('invoice')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'invoice'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📄 Faktura
        </button>
        <button
          onClick={() => setActiveTab('shipments')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'shipments'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Zásilky
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'metadata'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Metadata
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Historie
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'customer' && <CustomerSection order={order} />}
      {activeTab === 'items' && <ItemsSection order={order} />}
      {activeTab === 'payment' && <PaymentSection order={order} />}
      {activeTab === 'invoice' && <InvoiceSection order={order} />}
      {activeTab === 'shipments' && <ShipmentHistory order={order} onStatusChange={handleStatusChange} />}
      {activeTab === 'metadata' && <MetadataSection order={order} onUpdate={handleStatusChange} />}
      {activeTab === 'history' && <OrderHistorySection orderId={order.id} />}
    </div>
  );
}
