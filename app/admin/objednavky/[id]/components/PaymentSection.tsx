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

interface PaymentSectionProps {
  order: Order;
}

const getPaymentMethodLabel = (method: string | null) => {
  if (!method) return '–';

  switch (method) {
    case 'gopay':
      return 'GoPay';
    case 'bank_transfer':
      return 'Bankovní převod';
    case 'cash':
      return 'Hotovost';
    default:
      return method;
  }
};

const getDeliveryMethodLabel = (method: string) => {
  switch (method) {
    case 'standard':
      return 'Standardní';
    case 'express':
      return 'Express';
    case 'pickup':
      return 'Osobní odběr';
    default:
      return method;
  }
};

export default function PaymentSection({ order }: PaymentSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Platba a doprava</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Souhrn platby */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Souhrn platby</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Mezisoučet</p>
              <p className="text-base font-medium text-gray-900">
                {order.subtotal.toLocaleString('cs-CZ')} Kč
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Doprava</p>
              <p className="text-base font-medium text-gray-900">
                {order.shippingCost.toLocaleString('cs-CZ')} Kč
              </p>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Sleva</p>
                <p className="text-base font-medium text-red-600">
                  -{order.discountAmount.toLocaleString('cs-CZ')} Kč
                </p>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <p className="text-base font-bold text-gray-900">Celkem</p>
              <p className="text-lg font-bold text-gray-900">
                {order.total.toLocaleString('cs-CZ')} Kč
              </p>
            </div>
          </div>
        </div>

        {/* Metody */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metody</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Způsob platby</p>
              <p className="text-base font-medium text-gray-900">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Způsob dopravy</p>
              <p className="text-base font-medium text-gray-900">
                {getDeliveryMethodLabel(order.deliveryMethod)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
