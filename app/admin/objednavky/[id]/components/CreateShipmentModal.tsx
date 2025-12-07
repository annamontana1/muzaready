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
  items: OrderItem[];
}

interface CreateShipmentModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

type CarrierType = 'dpd' | 'zasilkovna' | 'fedex' | 'gls' | 'ups' | 'other';

const carrierOptions: { value: CarrierType; label: string }[] = [
  { value: 'zasilkovna', label: 'Zásilkovna' },
  { value: 'dpd', label: 'DPD' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'gls', label: 'GLS' },
  { value: 'ups', label: 'UPS' },
  { value: 'other', label: 'Jiný dopravce' },
];

export default function CreateShipmentModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: CreateShipmentModalProps) {
  const [carrier, setCarrier] = useState<CarrierType>('zasilkovna');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCarrier('zasilkovna');
      setTrackingNumber('');
      setSelectedItems(order.items.map((item) => item.id));
      setNotes('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, order.items]);

  const validateForm = (): string | null => {
    // Validate carrier
    if (!carrier || !carrierOptions.find((opt) => opt.value === carrier)) {
      return 'Vyberte platného dopravce';
    }

    // Validate tracking number
    if (!trackingNumber.trim()) {
      return 'Sledovací číslo je povinné';
    }

    if (trackingNumber.trim().length < 3) {
      return 'Sledovací číslo musí mít alespoň 3 znaky';
    }

    if (trackingNumber.trim().length > 100) {
      return 'Sledovací číslo může mít maximálně 100 znaků';
    }

    // Validate items
    if (selectedItems.length === 0) {
      return 'Vyberte alespoň jednu položku k odeslání';
    }

    // Validate notes length
    if (notes.length > 500) {
      return 'Poznámky mohou mít maximálně 500 znaků';
    }

    return null;
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCarrier(e.target.value as CarrierType);

    // Clear error when user changes input
    if (error) {
      setError(null);
    }
  };

  const handleTrackingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    // Clear error when user changes selection
    if (error) {
      setError(null);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);

    // Clear error when user changes input
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          trackingNumber: trackingNumber.trim(),
          items: selectedItems,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chyba při vytváření zásilky');
      }

      showToast(data.message || 'Zásilka úspěšně vytvořena', 'success');
      onSuccess(); // Refresh order
      onClose(); // Close modal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chyba při vytváření zásilky';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vytvořit zásilku" size="2xl" closeOnEsc={!isSubmitting}>
      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Carrier dropdown */}
          <div className="mb-4">
            <label
              htmlFor="carrier"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dopravce *
            </label>
            <select
              id="carrier"
              value={carrier}
              onChange={handleCarrierChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              {carrierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking number input */}
          <div className="mb-4">
            <label
              htmlFor="trackingNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sledovací číslo *
            </label>
            <input
              id="trackingNumber"
              type="text"
              minLength={3}
              maxLength={100}
              value={trackingNumber}
              onChange={handleTrackingNumberChange}
              disabled={isSubmitting}
              placeholder="Zadejte sledovací číslo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimálně 3 znaky, maximálně 100 znaků
            </p>
          </div>

          {/* Items checkboxes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Odeslané položky
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
              {order.items.map((item) => {
                const skuName = item.sku?.name || item.nameSnapshot || 'Neznámá položka';
                const gramage = `${item.grams}g`;
                const price = `${item.lineTotal.toLocaleString('cs-CZ')} Kč`;

                return (
                  <div key={item.id} className="flex items-start mb-2 last:mb-0">
                    <input
                      id={`item-${item.id}`}
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemToggle(item.id)}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      <span className="font-medium">{skuName}</span>
                      <span className="text-gray-500"> - {gramage}, {price}</span>
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {selectedItems.length} z {order.items.length} položek vybráno
            </p>
          </div>

          {/* Notes textarea */}
          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Poznámky
            </label>
            <textarea
              id="notes"
              maxLength={500}
              rows={3}
              value={notes}
              onChange={handleNotesChange}
              disabled={isSubmitting}
              placeholder="Volitelné poznámky k zásilce..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
            <p className="mt-1 text-sm text-gray-500">
              {notes.length}/500 znaků
            </p>
          </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !trackingNumber.trim() || selectedItems.length === 0}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Vytvářím zásilku...</span>
              </>
            ) : (
              'Vytvořit zásilku'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
