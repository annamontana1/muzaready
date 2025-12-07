'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Filters, { FilterState } from './components/Filters';
import BulkActions from './components/BulkActions';
import Pagination from './components/Pagination';
import { Order } from './types';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSearchShortcut } from '@/hooks/useKeyboardShortcuts';
import { TableSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';
import { useOrders, useBulkAction } from '@/lib/queries/orders';

export default function AdminOrdersPage() {
  // Local UI state (filters, pagination, sorting, selection)
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: 'mark-shipped' | 'mark-paid';
    label: string;
  } | null>(null);

  const { showToast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // React Query: Fetch orders with automatic caching
  const { data, isLoading } = useOrders({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    orderStatus: filters.orderStatus,
    paymentStatus: filters.paymentStatus,
    deliveryStatus: filters.deliveryStatus,
    channel: filters.channel,
    email: filters.email,
    sort: sortField ? (sortDirection === 'desc' ? `-${sortField}` : sortField) : undefined,
  });

  // React Query: Bulk action mutation
  const bulkActionMutation = useBulkAction();

  // Derive data from React Query response
  const orders = data?.orders || [];
  const totalItems = data?.total || 0;

  // Calculate stats from current page (acknowledged limitation: per-page, not global)
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingCount: orders.filter(
      (o) => o.orderStatus === 'pending' || o.orderStatus === 'draft'
    ).length,
    paidCount: orders.filter((o) => o.paymentStatus === 'paid').length,
    shippedCount: orders.filter(
      (o) => o.deliveryStatus === 'shipped' || o.deliveryStatus === 'delivered'
    ).length,
  };

  // Keyboard shortcut: Cmd/Ctrl + K focuses email search
  useSearchShortcut(() => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
      emailInput.select();
    }
  });

  // Computed pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
    setSelectedIds([]); // Clear selection when filters change
    // React Query auto-refetches when filters state changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]); // Clear selection when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
    setSelectedIds([]); // Clear selection
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle: DESC → ASC → null (reset)
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      // New field - start with DESC
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to page 1
    setSelectedIds([]); // Clear selection
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const handleSelectOne = (orderId: string) => {
    setSelectedIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // CSV Export function
  const exportToCSV = (ordersToExport: Order[]) => {
    // CSV header with Czech labels
    const headers = [
      'ID', 'Email', 'Jméno', 'Celková cena',
      'Status objednávky', 'Status platby', 'Status doručení',
      'Kanál', 'Počet položek', 'Datum vytvoření'
    ];

    // CSV rows
    const rows = ordersToExport.map(order => [
      order.id.substring(0, 8),
      order.email,
      `${order.firstName || ''} ${order.lastName || ''}`.trim(),
      order.total.toLocaleString('cs-CZ'),
      getStatusLabel(order.orderStatus),
      order.paymentStatus,
      order.deliveryStatus,
      order.channel,
      order.itemCount.toString(),
      new Date(order.createdAt).toLocaleDateString('cs-CZ')
    ]);

    // Combine header and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Add UTF-8 BOM for Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Trigger download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `objednavky_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk action handler - shows confirmation for destructive actions
  const handleBulkAction = async (action: 'mark-shipped' | 'mark-paid' | 'export-csv') => {
    if (action === 'export-csv') {
      // Client-side CSV export (no confirmation needed)
      const selectedOrders = orders.filter(o => selectedIds.includes(o.id));
      exportToCSV(selectedOrders);
      return;
    }

    // Show confirmation dialog for status changes
    const actionLabels = {
      'mark-shipped': 'odesláno',
      'mark-paid': 'zaplaceno',
    };

    setPendingAction({
      action,
      label: actionLabels[action],
    });
    setConfirmOpen(true);
  };

  // Execute confirmed bulk action
  const executeBulkAction = async () => {
    if (!pendingAction) return;

    try {
      // Use React Query mutation (auto cache invalidation)
      await bulkActionMutation.mutateAsync({
        action: pendingAction.action,
        orderIds: selectedIds,
      });

      // React Query auto-invalidates cache - no manual refetch needed
      handleClearSelection();
      setConfirmOpen(false);
      setPendingAction(null);

      // Show success toast
      showToast(`${selectedIds.length} objednávek úspěšně aktualizováno`, 'success');
    } catch (error) {
      console.error('Bulk action error:', error);
      showToast('Chyba při hromadné akci', 'error');
      setConfirmOpen(false);
      setPendingAction(null);
    }
  };

  // Helper function to get color classes for status badges
  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to get Czech labels for status
  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      draft: 'Návrh',
      pending: 'Čekající',
      paid: 'Zaplaceno',
      processing: 'Zpracování',
      shipped: 'Odesláno',
      completed: 'Dokončeno',
      cancelled: 'Zrušeno',
    };
    return labels[status] || status;
  };

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('cs-CZ')} Kč`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Správa Objednávek</h1>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        {/* Table Skeleton */}
        <TableSkeleton rows={10} columns={7} />
      </div>
    );
  }

  // Main render
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa Objednávek</h1>
      </div>

      {/* Summary Stats - Keep existing enhancement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Celkový příjem</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Čekající objednávky</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Zaplacené objednávky</p>
          <p className="text-2xl font-bold text-blue-600">{stats.paidCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Odeslané objednávky</p>
          <p className="text-2xl font-bold text-purple-600">{stats.shippedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <Filters onFilter={handleFilterChange} />

      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <BulkActions
          selectedIds={selectedIds}
          selectedOrders={orders.filter(o => selectedIds.includes(o.id))}
          onAction={handleBulkAction}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.length === orders.length && orders.length > 0}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedIds.length > 0 && selectedIds.length < orders.length;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className={sortField === 'email' ? 'font-bold text-blue-600' : ''}>
                    Email
                  </span>
                  {sortField === 'email' ? (
                    sortDirection === 'desc' ? (
                      <span className="text-blue-600">↓</span>
                    ) : (
                      <span className="text-blue-600">↑</span>
                    )
                  ) : (
                    <span className="text-gray-400">⇅</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Položky
              </th>
              <th
                onClick={() => handleSort('total')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className={sortField === 'total' ? 'font-bold text-blue-600' : ''}>
                    Cena
                  </span>
                  {sortField === 'total' ? (
                    sortDirection === 'desc' ? (
                      <span className="text-blue-600">↓</span>
                    ) : (
                      <span className="text-blue-600">↑</span>
                    )
                  ) : (
                    <span className="text-gray-400">⇅</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th
                onClick={() => handleSort('createdAt')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className={sortField === 'createdAt' ? 'font-bold text-blue-600' : ''}>
                    Datum
                  </span>
                  {sortField === 'createdAt' ? (
                    sortDirection === 'desc' ? (
                      <span className="text-blue-600">↓</span>
                    ) : (
                      <span className="text-blue-600">↑</span>
                    )
                  ) : (
                    <span className="text-gray-400">⇅</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  selectedIds.includes(order.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => handleSelectOne(order.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-mono">{order.id.substring(0, 8)}...</td>
                <td className="px-6 py-4 text-sm">{order.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.itemCount}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startItem={startItem}
          endItem={endItem}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Potvrdit hromadnou akci"
        message={
          pendingAction ? (
            <>
              Opravdu chcete označit <strong>{selectedIds.length}</strong>{' '}
              {selectedIds.length === 1 ? 'objednávku' : 'objednávek'} jako{' '}
              <strong>{pendingAction.label}</strong>?
            </>
          ) : (
            ''
          )
        }
        confirmText="Potvrdit"
        cancelText="Zrušit"
        type="warning"
        onConfirm={executeBulkAction}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
      />
    </div>
  );
}
