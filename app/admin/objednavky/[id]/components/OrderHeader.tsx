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

const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Koncept';
    case 'pending':
      return 'Čeká na platbu';
    case 'paid':
      return 'Zaplaceno';
    case 'processing':
      return 'Zpracovává se';
    case 'shipped':
      return 'Odesláno';
    case 'completed':
      return 'Dokončeno';
    case 'cancelled':
      return 'Zrušeno';
    default:
      return status;
  }
};

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'unpaid':
      return 'Nezaplaceno';
    case 'partial':
      return 'Částečně';
    case 'paid':
      return 'Zaplaceno';
    case 'refunded':
      return 'Vráceno';
    default:
      return status;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'unpaid':
      return 'bg-red-100 text-red-800';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getDeliveryStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Čeká';
    case 'shipped':
      return 'Odesláno';
    case 'delivered':
      return 'Doručeno';
    case 'returned':
      return 'Vráceno';
    default:
      return status;
  }
};

const getDeliveryStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'returned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrderHeader({ order, onStatusChange }: OrderHeaderProps) {
  // Per-action loading state — prevents one slow request from disabling ALL buttons
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [localPaymentStatus, setLocalPaymentStatus] = useState<string | null>(null);
  const [localDeliveryStatus, setLocalDeliveryStatus] = useState<string | null>(null);
  const [localOrderStatus, setLocalOrderStatus] = useState<string | null>(null);
  const { showToast } = useToast();

  // Effective statuses — prefer local optimistic state over stale server data
  const effectivePaymentStatus = localPaymentStatus ?? order.paymentStatus;
  const effectiveDeliveryStatus = localDeliveryStatus ?? order.deliveryStatus;
  const effectiveOrderStatus = localOrderStatus ?? order.orderStatus;

  async function apiUpdate(action: string, body: Record<string, string>) {
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Chyba serveru' }));
        throw new Error(err.error || 'Chyba serveru');
      }
      return await res.json();
    } finally {
      setLoadingAction(null);
    }
  }

  const handleMarkAsPaid = async () => {
    try {
      await apiUpdate('paid', {
        paymentStatus: 'paid',
        orderStatus: order.orderStatus === 'pending' ? 'processing' : order.orderStatus,
      });
      setLocalPaymentStatus('paid');
      if (order.orderStatus === 'pending') setLocalOrderStatus('processing');
      showToast('Označeno jako zaplaceno ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba', 'error');
    }
  };

  const handleMarkAsUnpaid = async () => {
    try {
      const newOrderStatus = ['completed', 'shipped', 'processing'].includes(effectiveOrderStatus) ? 'pending' : effectiveOrderStatus;
      await apiUpdate('unpaid', {
        paymentStatus: 'unpaid',
        orderStatus: newOrderStatus,
      });
      setLocalPaymentStatus('unpaid');
      setLocalOrderStatus(newOrderStatus);
      showToast('Označeno jako nezaplaceno ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba', 'error');
    }
  };

  const handleMarkAsShipped = async () => {
    try {
      await apiUpdate('shipped', {
        deliveryStatus: 'shipped',
        orderStatus: order.orderStatus === 'processing' ? 'shipped' : order.orderStatus,
      });
      setLocalDeliveryStatus('shipped');
      if (order.orderStatus === 'processing') setLocalOrderStatus('shipped');
      showToast('Označeno jako odesláno ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba', 'error');
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      await apiUpdate('delivered', {
        deliveryStatus: 'delivered',
        orderStatus: 'completed',
      });
      setLocalDeliveryStatus('delivered');
      setLocalOrderStatus('completed');
      showToast('Označeno jako doručeno ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba', 'error');
    }
  };

  const handleMarkAsRefunded = async () => {
    try {
      await apiUpdate('refunded', { paymentStatus: 'refunded' });
      setLocalPaymentStatus('refunded');
      showToast('Vrácení zboží zaznamenáno ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba', 'error');
    }
  };

  const handleCancel = async () => {
    try {
      await apiUpdate('cancel', { orderStatus: 'cancelled', paymentStatus: 'refunded' });
      setLocalOrderStatus('cancelled');
      setLocalPaymentStatus('refunded');
      showToast('Objednávka stornována ✓', 'success');
      onStatusChange();
    } catch (e: any) {
      showToast(e.message || 'Chyba při stornování', 'error');
    }
  };

  function btn(
    label: string,
    action: string,
    onClick: () => void,
    disabled: boolean,
    color: string
  ) {
    const isLoading = loadingAction === action;
    const isDisabled = disabled || loadingAction !== null;
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className={`px-4 py-2 rounded font-medium transition ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : `${color} text-white cursor-pointer`
        }`}
      >
        {isLoading ? '⏳...' : label}
      </button>
    );
  }

  const shortId = String(order.orderNumber);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Objednávka #{shortId}
            </h1>
            <Link
              href={`/admin/objednavky/${order.id}/edit`}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              title="Upravit objednávku"
            >
              ✏️ Upravit objednávku
            </Link>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {order.total.toLocaleString('cs-CZ')} Kč
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(effectiveOrderStatus)}`}>
            {getOrderStatusLabel(effectiveOrderStatus)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(effectivePaymentStatus)}`}>
            {getPaymentStatusLabel(effectivePaymentStatus)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDeliveryStatusColor(effectiveDeliveryStatus)}`}>
            {getDeliveryStatusLabel(effectiveDeliveryStatus)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {btn('Označit jako zaplaceno', 'paid', handleMarkAsPaid,
          effectivePaymentStatus === 'paid',
          'bg-blue-600 hover:bg-blue-700')}

        {btn('Označit jako nezaplaceno', 'unpaid', handleMarkAsUnpaid,
          effectivePaymentStatus === 'unpaid',
          'bg-orange-600 hover:bg-orange-700')}

        {btn('Označit jako odesláno', 'shipped', handleMarkAsShipped,
          effectiveDeliveryStatus === 'shipped' || effectiveDeliveryStatus === 'delivered',
          'bg-blue-600 hover:bg-blue-700')}

        {btn('Zaznamenat platbu', 'capture', () => setShowCaptureModal(true),
          effectivePaymentStatus === 'paid',
          'bg-green-600 hover:bg-green-700')}

        {btn('Vytvořit zásilku', 'shipment', () => setShowShipmentModal(true),
          effectiveDeliveryStatus === 'shipped' || effectiveDeliveryStatus === 'delivered',
          'bg-purple-600 hover:bg-purple-700')}

        {btn('Označit jako doručeno', 'delivered', handleMarkAsDelivered,
          effectiveDeliveryStatus !== 'shipped',
          'bg-green-600 hover:bg-green-700')}

        {/* Separator */}
        <div className="w-px bg-gray-300 mx-1" />

        {btn('❌ Stornovat', 'cancel', handleCancel,
          effectiveOrderStatus === 'cancelled',
          'bg-red-600 hover:bg-red-700')}

        {btn('🔄 Vrácení zboží', 'refunded', handleMarkAsRefunded,
          effectivePaymentStatus === 'refunded',
          'bg-orange-600 hover:bg-orange-700')}
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
