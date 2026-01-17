'use client';

import { useState } from 'react';
import { getCarrierName, getTrackingUrl } from '@/lib/shipping';

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
  carrier?: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  lastStatusChangeAt: string | null;
  items: OrderItem[];
  // Zásilkovna data
  packetaPointId?: string | null;
  packetaPointName?: string | null;
}

interface ShipmentHistoryProps {
  order: Order;
  onStatusChange?: () => void;
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

export default function ShipmentHistory({ order, onStatusChange }: ShipmentHistoryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasShipment = order.trackingNumber && order.shippedAt;
  const hasZasilkovnaPoint = !!(order as any).packetaPointId;
  const canShipViaZasilkovna = hasZasilkovnaPoint && !hasShipment && order.paymentStatus === 'paid';

  const handleZasilkovnaShip = async () => {
    if (!confirm('Opravdu chcete odeslat tuto objednávku přes Zásilkovnu?\n\nZákazník obdrží automaticky email a SMS s informacemi o zásilce.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/zasilkovna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          weight: 0.5, // Default weight
          cod: 0, // Prepaid orders
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chyba při vytváření zásilky');
      }

      setSuccess(`Zásilka vytvořena! Tracking: ${data.barcode}`);

      // Refresh order data
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Zásilkovna Action Card */}
      {canShipViaZasilkovna && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Odeslat přes Zásilkovnu</h3>
                <p className="text-red-100 text-sm">
                  Výdejní místo: {(order as any).packetaPointName || (order as any).packetaPointId}
                </p>
              </div>
            </div>
            <button
              onClick={handleZasilkovnaShip}
              disabled={isLoading}
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Odesílám...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Odeslat zásilku
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-red-100 text-xs">
            Zákazník automaticky obdrží email a SMS od Zásilkovny o stavu zásilky.
          </p>
        </div>
      )}

      {/* Info about Zásilkovna not available */}
      {!hasZasilkovnaPoint && !hasShipment && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-800 font-medium">Zásilkovna není k dispozici</p>
              <p className="text-sm text-amber-700 mt-1">
                Tato objednávka nemá vybrané výdejní místo Zásilkovny. Použijte jiného dopravce nebo zadejte tracking ručně.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment not completed warning */}
      {hasZasilkovnaPoint && !hasShipment && order.paymentStatus !== 'paid' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-amber-800 font-medium">Čeká na platbu</p>
              <p className="text-sm text-amber-700 mt-1">
                Objednávka zatím nebyla zaplacena. Tlačítko pro odeslání přes Zásilkovnu se zobrazí po zaplacení.
              </p>
            </div>
          </div>
        </div>
      )}

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
            {/* Carrier */}
            {(order as any).carrier && (
              <div className="flex items-start">
                <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
                  Dopravce:
                </dt>
                <dd className="text-sm text-gray-900 font-semibold">
                  {getCarrierName((order as any).carrier)}
                </dd>
              </div>
            )}

            {/* Tracking Number */}
            <div className="flex items-start">
              <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
                Sledovací číslo:
              </dt>
              <dd className="text-sm text-gray-900 font-medium">
                {order.trackingNumber}
                {(order as any).carrier && (
                  <a
                    href={getTrackingUrl((order as any).carrier, order.trackingNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-purple-600 hover:text-purple-800 text-xs underline"
                  >
                    Sledovat →
                  </a>
                )}
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
