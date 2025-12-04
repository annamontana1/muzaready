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

interface ItemsSectionProps {
  order: Order;
}

export default function ItemsSection({ order }: ItemsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Položky v objednávce</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produkt</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hmotnost</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cena/gram</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Celkem</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => {
              // Use nameSnapshot if available, otherwise use sku.name
              const productName = item.nameSnapshot || item.sku?.name || 'Neznámý produkt';

              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.grams}g</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.pricePerGram.toLocaleString('cs-CZ')} Kč/g
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
                    {item.lineTotal.toLocaleString('cs-CZ')} Kč
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
