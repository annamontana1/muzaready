'use client';

import { useState } from 'react';
import Link from 'next/link';
import CapturePaymentModal from './CapturePaymentModal';
import CreateShipmentModal from './CreateShipmentModal';
import { useToast } from '@/components/ui/ToastProvider';

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
}

interface OrderHeaderProps {
  order: Order;
  onStatusChange: () => void;
}

// ── Status options ────────────────────────────────────────────────────────────

const ORDER_STATUS_OPTIONS = [
  { value: 'draft',      label: 'Koncept',        color: 'bg-gray-100 text-gray-700' },
  { value: 'pending',    label: 'Čeká na platbu', color: 'bg-orange-100 text-orange-800' },
  { value: 'processing', label: 'Ve výrobě',      color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shipped',    label: 'Odesláno',        color: 'bg-blue-100 text-blue-800' },
  { value: 'completed',  label: 'Dokončeno',      color: 'bg-green-100 text-green-800' },
  { value: 'cancelled',  label: 'Stornováno',     color: 'bg-red-100 text-red-800' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'unpaid',   label: 'Nezaplaceno',          color: 'bg-red-100 text-red-800' },
  { value: 'partial',  label: 'Částečně zaplaceno',   color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid',     label: 'Zaplaceno',             color: 'bg-green-100 text-green-800' },
  { value: 'refunded', label: 'Vráceno / Stornováno', color: 'bg-gray-100 text-gray-700' },
];

const DELIVERY_STATUS_OPTIONS = [
  { value: 'pending',   label: 'Neodesláno',  color: 'bg-orange-100 text-orange-800' },
  { value: 'shipped',   label: 'Odesláno',    color: 'bg-blue-100 text-blue-800' },
  { value: 'delivered', label: 'Doručeno',    color: 'bg-green-100 text-green-800' },
  { value: 'returned',  label: 'Vráceno',     color: 'bg-red-100 text-red-800' },
];

function getOption<T extends { value: string }>(opts: T[], val: string) {
  return opts.find(o => o.value === val) ?? opts[0];
}

// ── StatusSelect component ────────────────────────────────────────────────────

interface StatusSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string; color: string }[];
  saving: boolean;
  onChange: (val: string) => void;
}

function StatusSelect({ label, value, options, saving, onChange }: StatusSelectProps) {
  const opt = getOption(options, value);
  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={saving}
          className={`w-full appearance-none pl-3 pr-8 py-2 rounded-lg border text-sm font-medium cursor-pointer transition
            ${opt.color} border-transparent focus:outline-none focus:ring-2 focus:ring-[#722F37]/40
            disabled:opacity-60 disabled:cursor-wait`}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-50">
          {saving ? '⏳' : '▼'}
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OrderHeader({ order, onStatusChange }: OrderHeaderProps) {
  const [orderStatus, setOrderStatus]     = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);
  const [savingField, setSavingField]     = useState<string | null>(null);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const { showToast } = useToast();

  async function saveStatus(field: string, updates: Record<string, string>) {
    setSavingField(field);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Chyba' }));
        throw new Error(err.error || 'Chyba serveru');
      }
      showToast('Uloženo ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba při ukládání', 'error');
      // revert optimistic state
      if (field === 'order')    setOrderStatus(order.orderStatus);
      if (field === 'payment')  setPaymentStatus(order.paymentStatus);
      if (field === 'delivery') setDeliveryStatus(order.deliveryStatus);
    } finally {
      setSavingField(null);
    }
  }

  function handleOrderStatus(val: string) {
    setOrderStatus(val);
    saveStatus('order', { orderStatus: val });
  }

  function handlePaymentStatus(val: string) {
    setPaymentStatus(val);
    saveStatus('payment', { paymentStatus: val });
  }

  function handleDeliveryStatus(val: string) {
    setDeliveryStatus(val);
    saveStatus('delivery', { deliveryStatus: val });
  }

  const isSaving = savingField !== null;
  const shortId = String(order.orderNumber);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">

      {/* ── Top row: title + price ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Objednávka #{shortId}</h1>
            <Link
              href={`/admin/objednavky/${order.id}/edit`}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              ✏️ Upravit
            </Link>
          </div>
          <p className="text-3xl font-bold text-[#722F37]">
            {order.total.toLocaleString('cs-CZ')} Kč
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{order.channel === 'instagram' ? 'Instagram' : order.channel === 'store' ? 'Showroom' : 'Eshop'}
          </p>
        </div>

        {/* ── Status dropdowns ── */}
        <div className="flex flex-wrap gap-4">
          <StatusSelect
            label="Stav objednávky"
            value={orderStatus}
            options={ORDER_STATUS_OPTIONS}
            saving={savingField === 'order'}
            onChange={handleOrderStatus}
          />
          <StatusSelect
            label="Stav platby"
            value={paymentStatus}
            options={PAYMENT_STATUS_OPTIONS}
            saving={savingField === 'payment'}
            onChange={handlePaymentStatus}
          />
          <StatusSelect
            label="Stav zásilky"
            value={deliveryStatus}
            options={DELIVERY_STATUS_OPTIONS}
            saving={savingField === 'delivery'}
            onChange={handleDeliveryStatus}
          />
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={() => setShowCaptureModal(true)}
          disabled={isSaving || paymentStatus === 'paid'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isSaving || paymentStatus === 'paid'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          💳 Zaznamenat platbu
        </button>

        <button
          type="button"
          onClick={() => setShowShipmentModal(true)}
          disabled={isSaving || deliveryStatus === 'shipped' || deliveryStatus === 'delivered'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isSaving || deliveryStatus === 'shipped' || deliveryStatus === 'delivered'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          📦 Vytvořit zásilku
        </button>

        <div className="flex-1" />

        <button
          type="button"
          disabled={isSaving || orderStatus === 'cancelled'}
          onClick={() => {
            handleOrderStatus('cancelled');
            handlePaymentStatus('refunded');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isSaving || orderStatus === 'cancelled'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          ❌ Stornovat objednávku
        </button>
      </div>

      <CapturePaymentModal
        isOpen={showCaptureModal}
        order={order}
        onClose={() => setShowCaptureModal(false)}
        onSuccess={onStatusChange}
      />

      <CreateShipmentModal
        isOpen={showShipmentModal}
        order={order}
        onClose={() => setShowShipmentModal(false)}
        onSuccess={onStatusChange}
      />
    </div>
  );
}
