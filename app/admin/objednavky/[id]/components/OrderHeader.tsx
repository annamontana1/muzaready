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
  const [updating, setUpdating] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const { showToast } = useToast();

  const handleMarkAsPaid = async () => {
    if (updating) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          orderStatus: order.orderStatus === 'pending' ? 'processing' : order.orderStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update payment status' }));
        throw new Error(errorData.error || 'Failed to update payment status');
      }

      const updatedOrder = await response.json();
      showToast('Objednávka byla označena jako zaplaceno', 'success');
      onStatusChange();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast(error instanceof Error ? error.message : 'Chyba při aktualizaci stavu platby', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsUnpaid = async () => {
    if (updating) return;

    // Potvrzení před změnou zpět na nezaplaceno
    if (!confirm('Opravdu chceš označit tuto objednávku jako nezaplaceno? Tato akce vrátí status platby zpět.')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'unpaid',
          orderStatus: order.orderStatus === 'completed' ? 'pending' : order.orderStatus === 'shipped' ? 'pending' : order.orderStatus === 'processing' ? 'pending' : order.orderStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update payment status' }));
        throw new Error(errorData.error || 'Failed to update payment status');
      }

      const updatedOrder = await response.json();
      showToast('Objednávka byla označena jako nezaplaceno', 'success');
      onStatusChange();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast(error instanceof Error ? error.message : 'Chyba při aktualizaci stavu platby', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsShipped = async () => {
    if (updating) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatus: 'shipped',
          orderStatus: order.orderStatus === 'processing' ? 'shipped' : order.orderStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update delivery status' }));
        throw new Error(errorData.error || 'Failed to update delivery status');
      }

      const updatedOrder = await response.json();
      showToast('Objednávka byla označena jako odeslána', 'success');
      onStatusChange();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      showToast(error instanceof Error ? error.message : 'Chyba při aktualizaci stavu dopravy', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    if (updating) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatus: 'delivered',
          orderStatus: 'completed',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update delivery status' }));
        throw new Error(errorData.error || 'Failed to update delivery status');
      }

      const updatedOrder = await response.json();
      showToast('Objednávka byla označena jako doručena', 'success');
      onStatusChange();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      showToast(error instanceof Error ? error.message : 'Chyba při aktualizaci stavu doručení', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Format order ID to show only first 8 characters
  const shortId = order.id.substring(0, 8);

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

        <div className="flex gap-2">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
            {getOrderStatusLabel(order.orderStatus)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {getPaymentStatusLabel(order.paymentStatus)}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDeliveryStatusColor(order.deliveryStatus)}`}>
            {getDeliveryStatusLabel(order.deliveryStatus)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleMarkAsPaid}
          disabled={updating || order.paymentStatus === 'paid'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.paymentStatus === 'paid'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Označit jako zaplaceno'}
        </button>

        <button
          onClick={handleMarkAsUnpaid}
          disabled={updating || order.paymentStatus === 'unpaid'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.paymentStatus === 'unpaid'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Označit jako nezaplaceno'}
        </button>

        <button
          onClick={handleMarkAsShipped}
          disabled={updating || order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Označit jako odesláno'}
        </button>

        <button
          onClick={() => setShowCaptureModal(true)}
          disabled={updating || order.paymentStatus === 'paid'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.paymentStatus === 'paid'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Zaznamenat platbu'}
        </button>

        <button
          onClick={() => setShowShipmentModal(true)}
          disabled={updating || order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Vytvořit zásilku'}
        </button>

        <button
          onClick={handleMarkAsDelivered}
          disabled={updating || order.deliveryStatus !== 'shipped' || order.deliveryStatus === 'delivered'}
          className={`px-4 py-2 rounded font-medium transition ${
            updating || order.deliveryStatus !== 'shipped' || order.deliveryStatus === 'delivered'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {updating ? 'Aktualizuji...' : 'Označit jako doručeno'}
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
