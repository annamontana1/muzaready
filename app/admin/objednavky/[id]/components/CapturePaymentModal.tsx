'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface Order {
  id: string;
  total: number;
  paymentStatus: string;
}

interface CapturePaymentModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CapturePaymentModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: CapturePaymentModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Initialize amount with order total when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(order.total.toString());
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, order.total]);

  const validateAmount = (value: string): string | null => {
    const num = parseFloat(value);

    if (isNaN(num) || num <= 0) {
      return 'Částka musí být větší než 0';
    }

    if (num > order.total) {
      return `Částka nemůže být vyšší než celková cena objednávky (${order.total.toLocaleString('cs-CZ')} Kč)`;
    }

    return null;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/capture-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chyba při zaznamenávání platby');
      }

      showToast(data.message || 'Platba úspěšně zaznamenána', 'success');
      onSuccess(); // Refresh order
      onClose(); // Close modal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chyba při zaznamenávání platby';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountNum = parseFloat(amount);
  const isFullPayment = !isNaN(amountNum) && amountNum >= order.total;
  const isPartialPayment = !isNaN(amountNum) && amountNum > 0 && amountNum < order.total;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zaznamenat platbu" size="md">
      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount input */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Částka (Kč)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={order.total}
              value={amount}
              onChange={handleAmountChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Celková cena objednávky: <strong>{order.total.toLocaleString('cs-CZ')} Kč</strong>
            </p>
          </div>

          {/* Payment status indicator */}
          {(isFullPayment || isPartialPayment) && (
            <div className={`mb-4 p-3 rounded-lg ${isFullPayment ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              {isFullPayment ? (
                <span className="text-green-700 font-medium text-sm">
                  ✓ Objednávka bude označena jako <strong>Zaplaceno</strong>
                </span>
              ) : (
                <span className="text-yellow-700 font-medium text-sm">
                  ⚠ Objednávka bude označena jako <strong>Částečně zaplaceno</strong>
                </span>
              )}
            </div>
          )}

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
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <span>Zpracovávám...</span>
              </>
            ) : (
              'Zaznamenat platbu'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
