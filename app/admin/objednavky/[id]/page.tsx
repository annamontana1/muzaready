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
import { CardSkeleton } from '@/components/ui/Skeleton';
import { orderKeys } from '@/lib/queries/orders';

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
  orderNumber: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  deliveryMethod: string;
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
  fakturoidInvoiceId: string | null;
  fakturoidIsProforma: boolean;
  fakturoidInvoiceUrl: string | null;
  fakturoidInvoiceNum: string | null;
  naklad: number | null;
  invoiceUrl?: string | null;
}

type TabType = 'customer' | 'items' | 'payment' | 'invoice' | 'shipments';

function InvoiceSection({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(order.fakturoidInvoiceUrl ?? order.invoiceUrl ?? null);
  const [isProforma, setIsProforma] = useState<boolean>(order.fakturoidIsProforma ?? false);
  const [converting, setConverting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [extending, setExtending] = useState(false);
  const [extendDate, setExtendDate] = useState('');
  const [showExtend, setShowExtend] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [creatingDeposit, setCreatingDeposit] = useState(false);

  const isCancelled = order.orderStatus === 'cancelled';
  const isInstagram = order.channel === 'instagram';
  const isStore = order.channel === 'store';
  const paymentLabel = order.paymentMethod === 'bank_transfer' ? 'Převod' : order.paymentMethod === 'cash' ? 'Hotovost' : order.paymentMethod || '—';

  async function generateInvoice() {
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/resend-invoice`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
      } else setResult({ error: data.error || 'Nepodařilo se vytvořit fakturu' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setLoading(false); }
  }

  async function cancelFakturoid() {
    if (!confirm('Stornovat tuto fakturu ve Fakturoidu?')) return;
    setCancelling(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/cancel-fakturoid`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) setResult({ success: true, message: 'Faktura stornována ✓' });
      else setResult({ error: data.error || 'Storno se nezdařilo' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setCancelling(false); }
  }

  async function convertProforma() {
    setConverting(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/convert-proforma`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsProforma(false);
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
        setResult({ success: true, message: `Faktura ${data.invoiceNumber || ''} vytvořena` });
      } else setResult({ error: data.error || 'Nepodařilo se převést proformu' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setConverting(false); }
  }

  async function restoreOrder() {
    if (!confirm('Obnovit objednávku (cancelled → pending)?')) return;
    setRestoring(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/restore`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: 'Objednávka obnovena ✓' });
        onRefresh();
      } else setResult({ error: data.error || 'Obnovení se nezdařilo' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setRestoring(false); }
  }

  async function createDeposit() {
    const amount = parseFloat(depositAmount.replace(/\s/g, '').replace(',', '.'));
    if (!amount || amount <= 0) return;
    setCreatingDeposit(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/create-deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, note: depositNote || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
        if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
        setIsProforma(true);
        setShowDeposit(false);
        setDepositAmount('');
        setDepositNote('');
        onRefresh();
      } else setResult({ error: data.error || 'Zálohu se nepodařilo vytvořit' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setCreatingDeposit(false); }
  }

  async function extendProforma() {
    if (!extendDate) return;
    setExtending(true); setResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/extend-proforma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDateIso: extendDate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ success: true, message: data.message });
        setShowExtend(false);
        onRefresh();
      } else setResult({ error: data.error || 'Prodloužení se nezdařilo' });
    } catch (err: any) {
      setResult({ error: err.message || 'Chyba' });
    } finally { setExtending(false); }
  }

  const formatPrice = (v: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-800">
              {isProforma ? '📄 Proforma faktura' : '📄 Faktura'}
            </h3>
            <p className="text-sm text-stone-500">
              {isInstagram ? 'Zálohová faktura — převod na účet' : isStore ? 'Pokladní doklad' : 'Faktura'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {invoiceUrl && (
              <a href={invoiceUrl} target="_blank" rel="noopener noreferrer"
                className="px-3 py-2 bg-[#722F37] text-white rounded-lg text-sm font-medium hover:bg-[#5a252c] transition">
                👁 Náhled
              </a>
            )}
            <button
              onClick={() => { const url = invoiceUrl || `${window.location.origin}/nahled/${order.id}`; navigator.clipboard.writeText(url).then(() => alert('Odkaz zkopírován!')); }}
              className="px-3 py-2 bg-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-300 transition"
            >
              🔗 Odkaz
            </button>
            <button
              onClick={() => { const url = invoiceUrl || `${window.location.origin}/nahled/${order.id}`; const text = `Dobrý den, zde je váš doklad z Muzahair.cz:\n${url}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }}
              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
            >
              📱 WhatsApp
            </button>
            <button onClick={() => setShowDeposit(v => !v)} disabled={loading}
              className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50">
              💰 Záloha
            </button>
            <button onClick={generateInvoice} disabled={loading}
              className="px-3 py-2 bg-stone-700 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
              {loading ? '⏳...' : '📨 Fakturoid'}
            </button>
            {order.fakturoidInvoiceId && !isCancelled && (
              <button onClick={cancelFakturoid} disabled={cancelling}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                {cancelling ? '⏳...' : '🚫 Storno'}
              </button>
            )}
          </div>
        </div>

        {/* Deposit panel */}
        {showDeposit && (
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-3">
              Zálohová faktura — celková cena objednávky je <strong>{formatPrice(order.total)}</strong>
            </p>
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-xs font-medium text-amber-800 mb-1">Částka zálohy (Kč)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder={String(Math.round(order.total / 2))}
                  className="w-36 px-3 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-800 mb-1">Poznámka (nepovinné)</label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={e => setDepositNote(e.target.value)}
                  placeholder="např. 1. splátka"
                  className="w-44 px-3 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button onClick={createDeposit} disabled={creatingDeposit || !depositAmount}
                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50">
                {creatingDeposit ? '⏳ Vytvářím...' : '✅ Vytvořit zálohu'}
              </button>
              <button onClick={() => setShowDeposit(false)} className="text-sm text-stone-500 hover:text-stone-700">Zrušit</button>
            </div>
            <p className="text-xs text-amber-700 mt-2">
              Zákazník dostane proformu na zadanou částku. Po zaplacení převedeš na fakturu tlačítkem "Vytvořit fakturu".
            </p>
          </div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-sm text-red-800 font-medium">❌ Objednávka stornována</span>
            <div className="flex gap-2 flex-wrap">
              <button onClick={restoreOrder} disabled={restoring}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap">
                {restoring ? '⏳...' : '🔄 Obnovit objednávku'}
              </button>
              {order.fakturoidInvoiceId && (
                <button onClick={() => setShowExtend(v => !v)}
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition whitespace-nowrap">
                  📅 Prodloužit splatnost proformy
                </button>
              )}
            </div>
          </div>
        )}

        {/* Extend date picker */}
        {showExtend && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-amber-800 font-medium">Nové datum splatnosti:</span>
            <input
              type="date"
              value={extendDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setExtendDate(e.target.value)}
              className="px-3 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400"
            />
            <button onClick={extendProforma} disabled={extending || !extendDate}
              className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50">
              {extending ? '⏳ Ukládám...' : '✅ Uložit'}
            </button>
            <button onClick={() => setShowExtend(false)} className="text-sm text-stone-500 hover:text-stone-700">Zrušit</button>
          </div>
        )}

        {/* Proforma banner */}
        {isProforma && !isCancelled && (
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between gap-4">
            <span className="text-sm text-yellow-800 font-medium">⏳ Proforma — čeká na zaplacení</span>
            <button onClick={convertProforma} disabled={converting}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap">
              {converting ? '⏳...' : '✅ Vytvořit fakturu'}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`px-6 py-3 text-sm ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.success ? '✅ ' : '❌ '}{result.message || result.error}
          </div>
        )}

        {/* Invoice preview */}
        <div className="p-6">
          <div className="max-w-lg mx-auto border border-stone-200 rounded-lg p-6 bg-white">
            <div className="text-center mb-4 pb-3 border-b border-dashed border-stone-300">
              <h4 className="text-xl font-bold text-stone-900">MÙZA HAIR</h4>
              <p className="text-xs text-stone-500">muzahaircz@gmail.com</p>
            </div>
            <div className="text-center mb-4">
              <p className="font-bold text-sm uppercase tracking-wider text-stone-700">
                {isProforma ? 'Proforma faktura' : isStore && order.paymentMethod === 'cash' ? 'Zjednodušený daňový doklad' : 'Faktura'}
              </p>
              <p className="text-xs text-stone-500">Obj. č.: {order.orderNumber}</p>
            </div>
            <div className="text-sm mb-4 pb-3 border-b border-stone-200">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-stone-700">Odběratel:</p>
                  <p>{order.firstName} {order.lastName}</p>
                  {order.email && <p className="text-stone-500">{order.email}</p>}
                  {order.phone && <p className="text-stone-500">{order.phone}</p>}
                </div>
                <div className="text-right text-xs">
                  <p><span className="text-stone-500">Datum:</span> {new Date(order.createdAt).toLocaleDateString('cs-CZ')}</p>
                  <p><span className="text-stone-500">Platba:</span> {paymentLabel}</p>
                </div>
              </div>
            </div>
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
                  <tr><td className="py-2 text-stone-500 italic" colSpan={2}>Položky viz interní poznámka</td></tr>
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
            <div className="border-t-2 border-dashed border-stone-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-stone-900">CELKEM</span>
              <span className="text-lg font-bold text-[#722F37]">{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-stone-400 text-right mt-1">Neplátce DPH — cena je konečná</p>
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
  const { data: order, isLoading, error, refetch } = useOrder(orderId) as { data: Order | undefined; isLoading: boolean; error: Error | null; refetch: () => void };
  const [activeTab, setActiveTab] = useState<TabType>('customer');

  const handleStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    refetch();
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto p-6">
      <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Zpět</Link>
      <CardSkeleton />
      <div className="mt-6 space-y-6"><CardSkeleton /><CardSkeleton /></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p className="text-red-800">{error.message || 'Chyba při načítání objednávky'}</p>
      </div>
      <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">← Zpět</Link>
    </div>
  );

  if (!order) return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <p className="text-yellow-800">Objednávka nenalezena</p>
      </div>
      <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">← Zpět</Link>
    </div>
  );

  const tabs: { key: TabType; label: string }[] = [
    { key: 'customer', label: 'Zákazník' },
    { key: 'items', label: 'Položky' },
    { key: 'payment', label: 'Platba' },
    { key: 'invoice', label: '📄 Faktura' },
    { key: 'shipments', label: 'Zásilky' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">← Zpět na objednávky</Link>
        <Link href={`/admin/objednavky/${orderId}/edit`}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition">
          ✏️ Upravit
        </Link>
      </div>

      <OrderHeader order={order} onStatusChange={handleStatusChange} />

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'customer' && <CustomerSection order={order} />}
      {activeTab === 'items' && <ItemsSection order={order} />}
      {activeTab === 'payment' && <PaymentSection order={order} />}
      {activeTab === 'invoice' && <InvoiceSection order={order} onRefresh={handleStatusChange} />}
      {activeTab === 'shipments' && <ShipmentHistory order={order} onStatusChange={handleStatusChange} />}
    </div>
  );
}
