'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

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
  orderNumber?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  deliveryMethod?: string;
  packetaPointId?: string | null;
  packetaPointName?: string | null;
  items: OrderItem[];
}

interface CreateShipmentModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

const CARRIER_OPTIONS = [
  { value: 'zasilkovna', label: 'Zásilkovna' },
  { value: 'dpd',        label: 'DPD' },
  { value: 'other',      label: 'Jiný dopravce' },
];

export default function CreateShipmentModal({ isOpen, order, onClose, onSuccess }: CreateShipmentModalProps) {
  const [carrier, setCarrier]               = useState('zasilkovna');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes]                   = useState('');
  const [error, setError]                   = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [createdBarcode, setCreatedBarcode] = useState<string | null>(null);
  const { showToast } = useToast();

  const isZasilkovna = carrier === 'zasilkovna';
  const hasPickupPoint = !!order.packetaPointId;
  // Auto mode: Zásilkovna + má výdejní místo + žádné manuální tracking číslo
  const autoMode = isZasilkovna && hasPickupPoint && !trackingNumber;

  useEffect(() => {
    if (isOpen) {
      setCarrier('zasilkovna');
      setTrackingNumber('');
      setNotes('');
      setError(null);
      setIsSubmitting(false);
      setCreatedBarcode(null);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!autoMode && !trackingNumber.trim()) {
      setError('Zadejte sledovací číslo');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          trackingNumber: trackingNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba při vytváření zásilky');

      showToast('Zásilka vytvořena ✓', 'success');
      if (data.shipment?.trackingNumber) {
        setCreatedBarcode(data.shipment.trackingNumber);
      }
      onSuccess();
      // Don't close immediately if we have a barcode to show
      if (!data.shipment?.trackingNumber) onClose();
    } catch (err: any) {
      setError(err.message || 'Chyba při vytváření zásilky');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePrintLabel() {
    if (!createdBarcode) return;
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/zasilkovna?barcode=${encodeURIComponent(createdBarcode)}`);
      if (!res.ok) throw new Error('Nepodařilo se načíst štítek');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err: any) {
      showToast(err.message || 'Chyba při tisku štítku', 'error');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vytvořit zásilku" size="lg" closeOnEsc={!isSubmitting}>
      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      {/* Success state — show barcode + print button */}
      {createdBarcode && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-800 mb-1">✅ Zásilka vytvořena v Zásilkovně</p>
          <p className="text-sm text-green-700 font-mono mb-3">{createdBarcode}</p>
          <div className="flex gap-2">
            <button
              onClick={handlePrintLabel}
              className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition"
            >
              🖨️ Tisknout štítek
            </button>
            <a
              href={`https://tracking.packeta.com/cs/?id=${createdBarcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition"
            >
              📦 Sledovat zásilku
            </a>
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 ml-auto">
              Zavřít
            </button>
          </div>
        </div>
      )}

      {!createdBarcode && (
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dopravce</label>
            <select
              value={carrier}
              onChange={e => { setCarrier(e.target.value); setError(null); }}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {CARRIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Zásilkovna info box */}
          {isZasilkovna && (
            <div className={`p-4 rounded-lg text-sm ${hasPickupPoint ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              {hasPickupPoint ? (
                <>
                  <p className="font-semibold text-blue-800 mb-1">📍 {order.packetaPointName || `Výdejní místo #${order.packetaPointId}`}</p>
                  <p className="text-blue-700">Zásilka bude automaticky vytvořena v Zásilkovně — tracking číslo se doplní samo.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-yellow-800 mb-1">⚠️ Objednávka nemá výdejní místo</p>
                  <p className="text-yellow-700">Zadejte tracking číslo ručně, nebo pošlete přes jiného dopravce.</p>
                </>
              )}
            </div>
          )}

          {/* Tracking number — optional for Zásilkovna s výdejním místem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sledovací číslo {autoMode ? <span className="font-normal text-gray-400">(doplní se automaticky)</span> : '*'}
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={e => { setTrackingNumber(e.target.value); setError(null); }}
              disabled={isSubmitting}
              placeholder={autoMode ? 'Automaticky z Zásilkovny...' : 'Zadejte sledovací číslo'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka (nepovinné)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="Poznámka k zásilce..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
              Zrušit
            </button>
            <button type="submit" disabled={isSubmitting || (!autoMode && !trackingNumber.trim())}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Vytvářím...</>
              ) : (
                autoMode ? '📦 Vytvořit v Zásilkovně' : 'Vytvořit zásilku'
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
