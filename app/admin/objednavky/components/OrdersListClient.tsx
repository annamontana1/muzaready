'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import BulkActionsToolbar from './BulkActionsToolbar';
import { Order, BulkActionPayload } from '../types';

interface OrdersListClientProps {
  orders: Order[];
}

export default function OrdersListClient({ orders }: OrdersListClientProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedOrderIds.size === orders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(orders.map((o) => o.id)));
    }
  }, [orders, selectedOrderIds.size]);

  const handleBulkAction = async (payload: BulkActionPayload) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Chyba při hromadné akci');
        return;
      }

      // Success - reload page or update state
      window.location.reload();
    } catch (error) {
      console.error('Chyba:', error);
      alert('Chyba při hromadné akci');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelection = useCallback(() => {
    setSelectedOrderIds(new Set());
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na platbu';
      case 'paid':
        return 'Zaplaceno';
      case 'shipped':
        return 'Odesláno';
      case 'delivered':
        return 'Doručeno';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Checkbox Column */}
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrderIds.size === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                  disabled={orders.length === 0}
                  className="rounded border-gray-300 cursor-pointer disabled:opacity-50"
                  aria-label="Vybrat všechny objednávky"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Položky
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Cena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-600">
                  Zatím nejsou žádné objednávky
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    selectedOrderIds.has(order.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Checkbox Cell */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 cursor-pointer"
                      aria-label={`Vybrat objednávku ${order.id}`}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono font-medium">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {order.total.toLocaleString('cs-CZ')} Kč
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <Link
                      href={`/admin/objednavky/${order.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Detaily
                    </Link>
                    <Link
                      href={`/admin/objednavky/${order.id}/edit`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Upravit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedOrderIds={Array.from(selectedOrderIds)}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
        isLoading={isLoading}
      />

      {/* Bottom Padding for Toolbar */}
      {selectedOrderIds.size > 0 && <div className="h-24" />}
    </>
  );
}
