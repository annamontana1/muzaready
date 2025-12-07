'use client';

import React, { useState } from 'react';
import { Order } from '../types';

interface BulkActionsProps {
  selectedIds: string[];
  selectedOrders: Order[];
  onAction: (action: 'mark-shipped' | 'mark-paid' | 'export-csv') => Promise<void>;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  selectedOrders,
  onAction,
  onClearSelection,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const handleAction = async (action: 'mark-shipped' | 'mark-paid' | 'export-csv') => {
    setLoading(true);
    setCurrentAction(action);
    try {
      await onAction(action);
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-blue-100 border-b border-blue-200 px-6 py-4 flex items-center justify-between">
      {/* Selection Counter */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-blue-900">
          {selectedIds.length} vybráno
        </span>
        <button
          onClick={onClearSelection}
          className="text-sm text-blue-700 hover:text-blue-900 underline"
          disabled={loading}
        >
          Zrušit výběr
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleAction('mark-shipped')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] min-w-[44px]"
        >
          {loading && currentAction === 'mark-shipped' && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Označit odesláno
        </button>

        <button
          onClick={() => handleAction('mark-paid')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] min-w-[44px]"
        >
          {loading && currentAction === 'mark-paid' && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Označit zaplaceno
        </button>

        <button
          onClick={() => handleAction('export-csv')}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] min-w-[44px]"
        >
          {loading && currentAction === 'export-csv' && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default BulkActions;
