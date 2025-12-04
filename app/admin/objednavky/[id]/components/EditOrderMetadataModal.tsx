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

interface EditOrderMetadataModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

const getRiskColor = (score: number): string => {
  if (score <= 30) return 'text-green-600';
  if (score <= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getRiskLabel = (score: number): string => {
  if (score <= 30) return 'Nízké riziko';
  if (score <= 70) return 'Střední riziko';
  return 'Vysoké riziko';
};

export default function EditOrderMetadataModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: EditOrderMetadataModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [tagsInput, setTagsInput] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [notesInternal, setNotesInternal] = useState('');
  const [notesCustomer, setNotesCustomer] = useState('');

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Parse tags from JSON string to array, then join with commas
      const currentTags: string[] = order.tags ? JSON.parse(order.tags) : [];
      setTagsInput(currentTags.join(', '));
      setRiskScore(order.riskScore || 0);
      setNotesInternal(order.notesInternal || '');
      setNotesCustomer(order.notesCustomer || '');
      setError(null);
    }
  }, [isOpen, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (notesInternal.length > 500) {
      setError('Interní poznámky mohou mít maximálně 500 znaků');
      return;
    }

    if (notesCustomer.length > 500) {
      setError('Poznámky pro zákazníka mohou mít maximálně 500 znaků');
      return;
    }

    // Parse tags: split by comma, trim, filter empty, limit to 10 tags with max 20 chars each
    const tagsArray = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => tag.substring(0, 20)) // Limit each tag to 20 chars
      .slice(0, 10); // Limit to 10 tags

    if (tagsArray.some((tag) => tag.length > 20)) {
      setError('Každý tag může mít maximálně 20 znaků');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tagsArray,
          riskScore: riskScore,
          notesInternal: notesInternal || null,
          notesCustomer: notesCustomer || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nepodařilo se aktualizovat metadata');
      }

      showToast('Metadata úspěšně aktualizována', 'success');
      onSuccess();
    } catch (err) {
      console.error('Error updating order metadata:', err);
      setError(err instanceof Error ? err.message : 'Chyba při ukládání metadata');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upravit metadata objednávky"
      size="lg"
      closeOnEsc={!isSubmitting}
    >
      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagy
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (max 10 tagů, oddělte čárkami)
            </span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="vip, urgent, follow-up, fraud-check"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Příklad: vip, urgent, follow-up (každý tag max 20 znaků)
          </p>
        </div>

        {/* Risk Score Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skóre rizika
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={riskScore}
              onChange={(e) => setRiskScore(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className={`text-3xl font-bold ${getRiskColor(riskScore)}`}>
                {riskScore}
              </span>
              <div>
                <p className={`text-sm font-medium ${getRiskColor(riskScore)}`}>
                  {getRiskLabel(riskScore)}
                </p>
                <p className="text-xs text-gray-500">z 100 bodů</p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0 - Bez rizika</span>
            <span>50 - Střední</span>
            <span>100 - Vysoké riziko</span>
          </div>
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔒 Interní poznámky
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (pouze pro admin tým, max 500 znaků)
            </span>
          </label>
          <textarea
            value={notesInternal}
            onChange={(e) => setNotesInternal(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Interní poznámky, které uvidí pouze admin tým..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500 text-right">
            {notesInternal.length}/500 znaků
          </p>
        </div>

        {/* Customer Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👤 Poznámky pro zákazníka
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (viditelné v emailech, max 500 znaků)
            </span>
          </label>
          <textarea
            value={notesCustomer}
            onChange={(e) => setNotesCustomer(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Poznámky, které uvidí zákazník v potvrzovacím emailu..."
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-blue-50"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500 text-right">
            {notesCustomer.length}/500 znaků
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Ukládám...
              </>
            ) : (
              <>💾 Uložit změny</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
