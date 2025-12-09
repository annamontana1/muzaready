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

interface CustomerSectionProps {
  order: Order;
}

export default function CustomerSection({ order }: CustomerSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Informace o zákazníkovi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Osobní údaje */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Osobní údaje</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Jméno</p>
              <p className="text-base font-medium text-gray-900">
                {order.firstName} {order.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-gray-900">{order.email}</p>
                {order.email.includes('@example.com') && (
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">
                    ⚠️ Test email
                  </span>
                )}
              </div>
              {order.email.includes('@example.com') && (
                <p className="text-xs text-amber-600 mt-1">
                  Emaily se nedostanou. Změň email v edit stránce (po deploymentu nových změn).
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Telefon</p>
              <p className="text-base font-medium text-gray-900">{order.phone || '–'}</p>
            </div>
          </div>
        </div>

        {/* Doručovací adresa */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doručovací adresa</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ulice</p>
              <p className="text-base font-medium text-gray-900">{order.streetAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Město</p>
              <p className="text-base font-medium text-gray-900">
                {order.zipCode} {order.city}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Země</p>
              <p className="text-base font-medium text-gray-900">{order.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
