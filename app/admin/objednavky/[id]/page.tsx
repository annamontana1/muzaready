'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
<<<<<<< HEAD
import { Order, OrderItem } from '../types';
=======
import { useOrder } from '@/lib/queries/orders';
import OrderHeader from './components/OrderHeader';
import CustomerSection from './components/CustomerSection';
import ItemsSection from './components/ItemsSection';
import PaymentSection from './components/PaymentSection';
import ShipmentHistory from './components/ShipmentHistory';
import MetadataSection from './components/MetadataSection';
import { CardSkeleton } from '@/components/ui/Skeleton';

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
>>>>>>> 2f26bf03adc91ad3c32e8f8433eb15b30a1a7b7a

type TabType = 'customer' | 'items' | 'payment' | 'shipments' | 'metadata';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  // React Query hook - replaces useState + useEffect + fetchOrder
  // Type assertion: useOrder returns simplified Order, but we need full Order with all fields
  const { data: order, isLoading, error } = useOrder(orderId) as { data: Order | undefined; isLoading: boolean; error: Error | null };

<<<<<<< HEAD
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) {
          setError('Objednávka nebyla nalezena');
          setLoading(false);
          return;
        }
=======
  const [activeTab, setActiveTab] = useState<TabType>('customer');
>>>>>>> 2f26bf03adc91ad3c32e8f8433eb15b30a1a7b7a

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
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Zpět na objednávky
        </Link>
      </div>

      {/* Order Header */}
      {/* Note: onStatusChange is no longer needed - React Query auto-invalidates cache */}
      <OrderHeader order={order} onStatusChange={() => {}} />

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
      </div>

      {/* Tab Content */}
      {activeTab === 'customer' && <CustomerSection order={order} />}
      {activeTab === 'items' && <ItemsSection order={order} />}
      {activeTab === 'payment' && <PaymentSection order={order} />}
      {activeTab === 'shipments' && <ShipmentHistory order={order} />}
      {activeTab === 'metadata' && <MetadataSection order={order} onUpdate={() => {}} />}
    </div>
  );
}
