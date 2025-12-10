'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface OrderHistoryItem {
  id: string;
  orderId: string;
  changedBy: string | null;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: string;
  note: string | null;
  createdAt: string;
}

interface OrderHistorySectionProps {
  orderId: string;
}

export default function OrderHistorySection({ orderId }: OrderHistorySectionProps) {
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${orderId}/history`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        setHistory(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError(err instanceof Error ? err.message : 'Chyba při načítání historie');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchHistory();
    }
  }, [orderId]);

  const getChangeTypeLabel = (changeType: string) => {
    const labels: Record<string, string> = {
      status_change: 'Změna statusu',
      field_update: 'Změna pole',
      note_added: 'Přidána poznámka',
      stock_deduction: 'Odečtení zásob',
      stock_return: 'Vrácení zásob',
    };
    return labels[changeType] || changeType;
  };

  const getChangeTypeColor = (changeType: string) => {
    const colors: Record<string, string> = {
      status_change: 'bg-blue-100 text-blue-800',
      field_update: 'bg-gray-100 text-gray-800',
      note_added: 'bg-yellow-100 text-yellow-800',
      stock_deduction: 'bg-red-100 text-red-800',
      stock_return: 'bg-green-100 text-green-800',
    };
    return colors[changeType] || 'bg-gray-100 text-gray-800';
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      orderStatus: 'Status objednávky',
      paymentStatus: 'Status platby',
      deliveryStatus: 'Status doručení',
      email: 'Email zákazníka',
      notesInternal: 'Interní poznámka',
      notesCustomer: 'Poznámka pro zákazníka',
      stock: 'Zásoby',
    };
    return labels[field] || field;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historie změn</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Načítám historii...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historie změn</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ {error}
            {error.includes('does not exist') && (
              <span className="block mt-2 text-sm">
                Spusť migraci databáze pro povolení sledování historie změn.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historie změn</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Zatím nebyly provedeny žádné změny této objednávky.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Historie změn</h2>
      
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getChangeTypeColor(item.changeType)}`}
                  >
                    {getChangeTypeLabel(item.changeType)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {getFieldLabel(item.field)}
                  </span>
                </div>
                
                {item.oldValue && item.newValue && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Z:</span>{' '}
                    <span className="line-through text-red-600">{item.oldValue}</span>
                    {' → '}
                    <span className="text-green-600 font-medium">{item.newValue}</span>
                  </div>
                )}
                
                {item.note && (
                  <p className="mt-2 text-sm text-gray-600 italic">{item.note}</p>
                )}
              </div>
              
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">
                  {format(new Date(item.createdAt), 'd. M. yyyy HH:mm', { locale: cs })}
                </p>
                {item.changedBy && (
                  <p className="text-xs text-gray-400 mt-1">{item.changedBy}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

