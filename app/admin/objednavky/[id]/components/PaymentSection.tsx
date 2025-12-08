'use client';

import { useState } from 'react';

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

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  createdAt: string;
  pdfGenerated: boolean;
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
  invoice?: Invoice | null;
}

interface PaymentSectionProps {
  order: Order;
}

const getPaymentMethodLabel = (method: string | null) => {
  if (!method) return '–';

  switch (method) {
    case 'gopay':
      return 'GoPay (online platba)';
    case 'card':
      return 'Karta (showroom)';
    case 'cash':
      return 'Hotovost (showroom)';
    case 'bank_transfer':
      return 'Bankovní převod';
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
    case 'zasilkovna':
      return 'Zásilkovna';
    case 'gls':
      return 'GLS';
    case 'courier':
      return 'Kuriér';
    default:
      return method;
  }
};

export default function PaymentSection({ order }: PaymentSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || 'gopay');
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState(order.deliveryMethod || 'standard');

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nepodařilo se vygenerovat fakturu');
      }

      // Download PDF
      if (data.pdfBase64) {
        const link = document.createElement('a');
        link.href = data.pdfBase64;
        link.download = `faktura_${data.invoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setSuccess(`Faktura ${data.invoice.invoiceNumber} byla vygenerována a odeslána na ${order.email}`);

      // Reload page to show updated invoice info
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při generování faktury');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePaymentMethod = async () => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Nepodařilo se uložit způsob platby');
      }

      setSuccess('Způsob platby byl úspěšně uložen');
      setIsEditingPayment(false);

      // Reload page to show updated payment method
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při ukládání způsobu platby');
    }
  };

  const handleSaveDeliveryMethod = async () => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryMethod }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Nepodařilo se uložit způsob dopravy');
      }

      setSuccess('Způsob dopravy byl úspěšně uložen');
      setIsEditingDelivery(false);

      // Reload page to show updated delivery method
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při ukládání způsobu dopravy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Faktura Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Faktura</h2>

        {order.invoice ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-900">
                  Faktura č. {order.invoice.invoiceNumber}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Vystavena: {new Date(order.invoice.createdAt).toLocaleDateString('cs-CZ')}
                </p>
                <p className="text-sm text-green-700">
                  Stav: {order.invoice.status === 'paid' ? 'Zaplaceno' : 'Vystaveno'}
                </p>
              </div>
              {order.invoice.pdfGenerated && (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/invoices/${order.invoice!.id}/download`);
                      const data = await res.json();

                      if (res.ok && data) {
                        const link = document.createElement('a');
                        link.href = data;
                        link.download = `faktura_${order.invoice!.invoiceNumber}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    } catch (err) {
                      console.error('Failed to download invoice:', err);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Stáhnout PDF
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Pro tuto objednávku zatím nebyla vygenerována faktura.
            </p>

            <button
              onClick={handleGenerateInvoice}
              disabled={isGenerating || order.paymentStatus !== 'paid'}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                order.paymentStatus !== 'paid'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isGenerating
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGenerating ? 'Generuji...' : 'Vygenerovat fakturu'}
            </button>

            {order.paymentStatus !== 'paid' && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ Fakturu lze vygenerovat pouze pro zaplacené objednávky
              </p>
            )}
          </div>
        )}
      </div>

      {/* Platba a doprava */}
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
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Způsob platby</p>
                  {!isEditingPayment && (
                    <button
                      onClick={() => setIsEditingPayment(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Upravit
                    </button>
                  )}
                </div>

                {isEditingPayment ? (
                  <div className="space-y-2">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gopay">GoPay (online platba)</option>
                      <option value="card">Karta (showroom)</option>
                      <option value="cash">Hotovost (showroom)</option>
                      <option value="bank_transfer">Bankovní převod</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePaymentMethod}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Uložit
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPayment(false);
                          setPaymentMethod(order.paymentMethod || 'gopay');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium text-gray-900">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                    {order.channel === 'showroom' && order.paymentMethod && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {order.paymentMethod === 'card' ? '💳 Karta' : '💵 Hotovost'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Způsob dopravy</p>
                  {!isEditingDelivery && (
                    <button
                      onClick={() => setIsEditingDelivery(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Upravit
                    </button>
                  )}
                </div>

                {isEditingDelivery ? (
                  <div className="space-y-2">
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standardní</option>
                      <option value="express">Express</option>
                      <option value="zasilkovna">📦 Zásilkovna</option>
                      <option value="gls">🚚 GLS</option>
                      <option value="courier">Kuriér</option>
                      <option value="pickup">Osobní odběr</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDeliveryMethod}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Uložit
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingDelivery(false);
                          setDeliveryMethod(order.deliveryMethod || 'standard');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {getDeliveryMethodLabel(order.deliveryMethod)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
