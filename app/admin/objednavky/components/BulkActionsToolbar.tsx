'use client';

import { useState } from 'react';
import { BulkActionPayload } from '../types';

interface BulkActionsToolbarProps {
  selectedOrderIds: string[];
  onClearSelection: () => void;
  onBulkAction: (payload: BulkActionPayload) => Promise<void>;
  isLoading?: boolean;
}

export default function BulkActionsToolbar({
  selectedOrderIds,
  onClearSelection,
  onBulkAction,
  isLoading,
}: BulkActionsToolbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');

  if (selectedOrderIds.length === 0) {
    return null;
  }

  const handleBulkAction = async (action: string, value?: string) => {
    if (!action) return;

    setActionInProgress(true);
    try {
      const payload: BulkActionPayload = {
        orderIds: selectedOrderIds,
        action: action as 'updateStatus' | 'updatePaymentStatus' | 'delete',
        value,
      };
      await onBulkAction(payload);
      onClearSelection();
      setSelectedAction('');
      setSelectedValue('');
    } catch (error) {
      console.error('Chyba při hromadné akci:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedValue) return;
    await handleBulkAction('updateStatus', selectedValue);
  };

  const handlePaymentStatusUpdate = async () => {
    if (!selectedValue) return;
    await handleBulkAction('updatePaymentStatus', selectedValue);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Jste si jistí? Chystáte se smazat ${selectedOrderIds.length} objednávek. Tuto akci nelze vrátit zpět.`)) {
      return;
    }
    await handleBulkAction('delete');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left Side - Selection Info */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Vybráno: <span className="font-bold text-lg">{selectedOrderIds.length}</span> objednávek
            </span>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Status Update Dropdown */}
            <div className="relative">
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                disabled={actionInProgress || isLoading}
                className="px-3 py-2 bg-blue-700 text-white border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 cursor-pointer"
              >
                <option value="">Vyberte akci...</option>
                <option value="---status---">-- Změnit stav --</option>
                <option value="awaiting_payment">Čeká na platbu</option>
                <option value="paid">Zaplaceno</option>
                <option value="processing">Zpracování</option>
                <option value="assembly_in_progress">Montáž probíhá</option>
                <option value="shipped">Odesláno</option>
                <option value="cancelled_unpaid">Zrušeno - nezaplaceno</option>
                <option value="refunded">Vráceno</option>
                <option value="---payment---">-- Změnit stav platby --</option>
                <option value="unpaid">Nezaplaceno</option>
                <option value="paid_payment">Zaplaceno</option>
                <option value="refunded_payment">Vráceno</option>
                <option value="failed">Selhalo</option>
              </select>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (selectedValue.startsWith('---')) {
                  return;
                } else if (selectedValue.startsWith('awaiting_payment') || selectedValue.startsWith('paid') || selectedValue.startsWith('processing') || selectedValue.startsWith('assembly_in_progress') || selectedValue.startsWith('shipped') || selectedValue.startsWith('cancelled_unpaid') || selectedValue.startsWith('refunded')) {
                  handleStatusUpdate();
                } else if (selectedValue === 'unpaid' || selectedValue === 'paid_payment' || selectedValue === 'refunded_payment' || selectedValue === 'failed') {
                  handlePaymentStatusUpdate();
                }
              }}
              disabled={!selectedValue || selectedValue.startsWith('---') || actionInProgress || isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionInProgress ? 'Zpracování...' : 'Použít'}
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={actionInProgress || isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionInProgress ? 'Mazání...' : 'Smazat'}
            </button>

            {/* Clear Selection Button */}
            <button
              onClick={onClearSelection}
              disabled={actionInProgress || isLoading}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition border border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zrušit výběr
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
