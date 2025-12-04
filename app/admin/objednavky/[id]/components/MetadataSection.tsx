'use client';

import { useState } from 'react';
import EditOrderMetadataModal from './EditOrderMetadataModal';

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

interface MetadataSectionProps {
  order: Order;
  onUpdate: () => void;
}

const getRiskColor = (score: number): string => {
  if (score <= 30) return 'text-green-600 bg-green-50 border-green-200';
  if (score <= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

const getRiskLabel = (score: number): string => {
  if (score <= 30) return 'Nízké riziko';
  if (score <= 70) return 'Střední riziko';
  return 'Vysoké riziko';
};

export default function MetadataSection({ order, onUpdate }: MetadataSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Parse tags from JSON string to array
  const tags: string[] = order.tags ? JSON.parse(order.tags) : [];

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Metadata objednávky</h2>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
          >
            ✏️ Upravit metadata
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tagy</h3>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Žádné tagy</p>
            )}
          </div>

          {/* Risk Score */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skóre rizika</h3>
            <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${getRiskColor(order.riskScore)}`}>
              <span className="text-3xl font-bold">{order.riskScore}</span>
              <div>
                <p className="text-sm font-medium">{getRiskLabel(order.riskScore)}</p>
                <p className="text-xs opacity-75">z 100 bodů</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internal Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔒 Interní poznámky
              <span className="ml-2 text-xs text-gray-500 font-normal">(pouze pro admin)</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border border-gray-200">
              {order.notesInternal ? (
                <p className="text-gray-800 whitespace-pre-wrap">{order.notesInternal}</p>
              ) : (
                <p className="text-gray-400 italic">Bez interních poznámek</p>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              👤 Poznámky pro zákazníka
              <span className="ml-2 text-xs text-gray-500 font-normal">(viditelné v emailech)</span>
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 min-h-[100px] border border-blue-200">
              {order.notesCustomer ? (
                <p className="text-gray-800 whitespace-pre-wrap">{order.notesCustomer}</p>
              ) : (
                <p className="text-gray-400 italic">Bez poznámek pro zákazníka</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditOrderMetadataModal
        isOpen={showEditModal}
        order={order}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false);
          onUpdate();
        }}
      />
    </>
  );
}
