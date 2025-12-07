'use client';

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

interface ShipmentHistoryProps {
  order: Order;
}

const getDeliveryStatusLabel = (status: string): string => {
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

export default function ShipmentHistory({ order }: ShipmentHistoryProps) {
  const hasShipment = order.trackingNumber && order.shippedAt;

  return (
    <div className="space-y-6">
      {/* Info Banner - always show */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Poznámka:
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Tento systém podporuje zatím pouze jednu zásilku na objednávku. Tracking number je uloženo v poli order.trackingNumber.
            </p>
          </div>
        </div>
      </div>

      {/* Shipment Content */}
      {!hasShipment ? (
        // Empty State
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Žádné zásilky
            </h3>
            <p className="text-gray-600">
              Tato objednávka zatím nebyla odeslána.
            </p>
          </div>
        </div>
      ) : (
        // Shipment Card
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Zásilka #1
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Tracking Number */}
            <div className="flex items-start">
              <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
                Sledovací číslo:
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {order.trackingNumber}
              </dd>
            </div>

            {/* Shipped At */}
            <div className="flex items-start">
              <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
                Odesláno:
              </dt>
              <dd className="text-sm text-gray-900">
                {new Date(order.shippedAt).toLocaleString('cs-CZ', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>

            {/* Delivery Status */}
            <div className="flex items-start">
              <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
                Stav:
              </dt>
              <dd className="text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {getDeliveryStatusLabel(order.deliveryStatus)}
                </span>
              </dd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
