'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PacketaPoint {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (apiKey: string, callback: (point: PacketaPoint | null) => void, options?: any) => void;
      };
    };
  }
}

export default function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Customer data
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping data
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('CZ');
  const [deliveryMethod, setDeliveryMethod] = useState('zasilkovna');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PacketaPoint | null>(null);

  // Items
  const [skuId, setSkuId] = useState('');
  const [grams, setGrams] = useState(100);
  const [availableSkus, setAvailableSkus] = useState<any[]>([]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  // Notes
  const [notesInternal, setNotesInternal] = useState('');
  const [notesCustomer, setNotesCustomer] = useState('');

  // Sales channel
  const [channel, setChannel] = useState('ig_dm');

  // Load Packeta widget script
  useEffect(() => {
    if (!isOpen) return;

    const scriptId = 'packeta-widget-script';
    if (document.getElementById(scriptId)) {
      setWidgetLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://widget.packeta.com/v6/www/js/library.js';
    script.async = true;
    script.onload = () => setWidgetLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Packeta widget');
      setError('Nepodařilo se načíst Zásilkovna widget');
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isOpen]);

  // Fetch available SKUs
  useEffect(() => {
    if (!isOpen) return;

    const fetchSkus = async () => {
      try {
        const response = await fetch('/api/admin/skus?stockStatus=IN_STOCK&limit=100');
        if (response.ok) {
          const data = await response.json();
          setAvailableSkus(data.skus || []);
          if (data.skus?.length > 0) {
            setSkuId(data.skus[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch SKUs:', err);
      }
    };

    fetchSkus();
  }, [isOpen]);

  const openPacketaWidget = () => {
    if (!window.Packeta) {
      setError('Zásilkovna widget ještě není načten. Zkuste to za chvíli.');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY || 'demo-api-key';
    window.Packeta.Widget.pick(apiKey, (point) => {
      if (point) {
        setSelectedPickupPoint(point);
        setError(null);
      }
    }, {
      country: 'cz',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!email || !firstName || !lastName) {
      setError('Vyplňte zákaznické údaje (email, jméno, příjmení)');
      setIsLoading(false);
      return;
    }

    if (!city || !zipCode) {
      setError('Vyplňte doručovací údaje (město, PSČ)');
      setIsLoading(false);
      return;
    }

    if (deliveryMethod === 'zasilkovna' && !selectedPickupPoint) {
      setError('Pro Zásilkovnu musíte vybrat výdejní místo');
      setIsLoading(false);
      return;
    }

    if (!skuId || grams <= 0) {
      setError('Vyberte SKU a zadejte gramáž');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customer: {
            email,
            firstName,
            lastName,
            phone,
          },
          shipping: {
            streetAddress,
            city,
            zipCode,
            country,
            deliveryMethod,
            packetaPoint: selectedPickupPoint,
          },
          items: [
            {
              skuId,
              saleMode: 'BULK_G',
              grams,
              ending: 'NONE',
              assemblyFeeType: 'FLAT',
              assemblyFeeCzk: 0,
            },
          ],
          payment: {
            paymentMethod,
            paymentStatus,
            paidAt: paymentStatus === 'paid' ? new Date().toISOString() : undefined,
          },
          channel,
          notesInternal,
          notesCustomer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chyba při vytváření objednávky');
      }

      // Success - redirect to order detail
      router.push(`/admin/objednavky/${data.order.id}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vytvořit manuální objednávku</h2>
            <p className="text-sm text-gray-600 mt-1">Vyplňte údaje zákazníka a vyberte prodejní kanál</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zákaznické údaje</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="zakaznik@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+420 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jméno *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Jan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Příjmení *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Novák"
                />
              </div>
            </div>
          </section>

          {/* Sales Channel */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prodejní kanál</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Odkud přišla objednávka? *</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="ig_dm">📷 Instagram DM</option>
                <option value="fb_messenger">💬 Facebook Messenger</option>
                <option value="whatsapp">📱 WhatsApp</option>
                <option value="phone">☎️ Telefon</option>
                <option value="showroom">🏪 Showroom (osobně)</option>
                <option value="email">📧 Email</option>
                <option value="web">🌐 Web (e-shop)</option>
                <option value="other">🔹 Jiné</option>
              </select>
            </div>
          </section>

          {/* Delivery Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doručení</h3>

            {/* Delivery Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Způsob doručení *</label>
              <select
                value={deliveryMethod}
                onChange={(e) => {
                  setDeliveryMethod(e.target.value);
                  if (e.target.value !== 'zasilkovna') {
                    setSelectedPickupPoint(null);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="zasilkovna">Zásilkovna (150 Kč)</option>
                <option value="dpd">DPD (200 Kč)</option>
                <option value="standard">Česká pošta (150 Kč)</option>
                <option value="personal">Osobní odběr (0 Kč)</option>
              </select>
            </div>

            {/* Zásilkovna Pickup Point */}
            {deliveryMethod === 'zasilkovna' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Výdejní místo Zásilkovny *</label>
                <button
                  type="button"
                  onClick={openPacketaWidget}
                  disabled={!widgetLoaded}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {widgetLoaded ? '📦 Vybrat výdejní místo' : 'Načítám widget...'}
                </button>
                {selectedPickupPoint && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-green-900">{selectedPickupPoint.name}</p>
                        <p className="text-xs text-green-700 mt-1">
                          {selectedPickupPoint.street}, {selectedPickupPoint.city} {selectedPickupPoint.zip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Address (for non-Zásilkovna) */}
            {deliveryMethod !== 'zasilkovna' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ulice a č.p.</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ulice 123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Město *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Praha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PSČ *</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="11000"
                  />
                </div>
              </div>
            )}

            {/* For Zásilkovna, still need city/zip for backup */}
            {deliveryMethod === 'zasilkovna' && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Město (pro fakturu) *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Praha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PSČ (pro fakturu) *</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="11000"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Items */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Položky objednávky</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                <select
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {availableSkus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.name || sku.sku} - {sku.availableGrams}g skladem
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gramáž *</label>
                <input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(parseInt(e.target.value) || 0)}
                  required
                  min="1"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="100"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platba</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Způsob platby</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="bank_transfer">Bankovní převod</option>
                  <option value="gopay">GoPay</option>
                  <option value="cash">Hotově</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stav platby</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="unpaid">Nezaplaceno</option>
                  <option value="paid">Zaplaceno</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Poznámky</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interní poznámka (vidí jen admin)</label>
                <textarea
                  value={notesInternal}
                  onChange={(e) => setNotesInternal(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Instagram DM objednávka od @username..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poznámka pro zákazníka</label>
                <textarea
                  value={notesCustomer}
                  onChange={(e) => setNotesCustomer(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Speciální požadavek..."
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Vytvářím...
                </>
              ) : (
                <>
                  ✓ Vytvořit objednávku
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
