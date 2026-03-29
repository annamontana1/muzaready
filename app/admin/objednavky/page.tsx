'use client';

import { useState, useRef, useEffect } from 'react';

// Inline editable Náklad cell (owner only)
function NakladCell({
  orderId,
  naklad,
  onUpdate,
}: {
  orderId: string;
  naklad: number | null;
  onUpdate: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(naklad?.toString() || '');

  const save = async () => {
    const num = value ? parseFloat(value) : null;
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ naklad: num }),
    });
    onUpdate(num);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === 'Enter' && save()}
        autoFocus
        className="w-24 px-2 py-1 border border-stone-300 rounded text-sm"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer text-stone-600 hover:text-stone-900"
    >
      {naklad ? (
        `${naklad.toLocaleString('cs-CZ')} Kč`
      ) : (
        <span className="text-stone-300">+ přidat</span>
      )}
    </span>
  );
}
import Link from 'next/link';
import Filters, { FilterState } from './components/Filters';
import BulkActions from './components/BulkActions';
import Pagination from './components/Pagination';
import { Order } from './types';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSearchShortcut } from '@/hooks/useKeyboardShortcuts';
import { TableSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';
import { useOrders, useBulkAction, orderKeys } from '@/lib/queries/orders';
import { useQueryClient } from '@tanstack/react-query';
import CreateOrderModal from './components/CreateOrderModal';

export default function AdminOrdersPage() {
  // Local UI state (filters, pagination, sorting, selection)
  // Force deploy: 2026-01-23 08:32 UTC
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Current admin user (role-gated features)
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

  // Create order modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Confirmation dialog state (bulk actions)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: 'mark-shipped' | 'mark-paid';
    label: string;
  } | null>(null);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; shortId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Month/day/channel quick-filter state (client-side on current page)
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterChannelLocal, setFilterChannelLocal] = useState('');

  const { showToast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch current admin user on mount to determine role-gated UI
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.role) setCurrentUser({ role: data.role });
      })
      .catch(() => {});
  }, []);

  // React Query: Fetch orders with automatic caching
  const { data, isLoading } = useOrders({
    limit: 500,
    offset: 0,
    orderStatus: filters.orderStatus,
    paymentStatus: filters.paymentStatus,
    deliveryStatus: filters.deliveryStatus,
    channel: filters.channel,
    email: filters.email,
    sort: sortField ? (sortDirection === 'desc' ? `-${sortField}` : sortField) : undefined,
    month: filterMonth || undefined,
    day: filterDay || undefined,
  });

  // React Query: Bulk action mutation
  const bulkActionMutation = useBulkAction();

  // Derive data from React Query response
  const orders = data?.orders || [];
  const totalItems = data?.total || 0;

  // Update naklad optimistically in local React Query cache
  const updateOrderNaklad = (orderId: string, naklad: number | null) => {
    queryClient.setQueryData(
      orderKeys.list({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        orderStatus: filters.orderStatus,
        paymentStatus: filters.paymentStatus,
        deliveryStatus: filters.deliveryStatus,
        channel: filters.channel,
        email: filters.email,
        sort: sortField ? (sortDirection === 'desc' ? `-${sortField}` : sortField) : undefined,
      }),
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((o: any) =>
            o.id === orderId ? { ...o, naklad } : o
          ),
        };
      }
    );
  };

  // Client-side channel filter (month/day filtered server-side)
  const filteredOrders = filterChannelLocal
    ? orders.filter((order) => order.channel === filterChannelLocal)
    : orders;

  // Summary totals — exclude cancelled and refunded orders
  const activeOrders = filteredOrders.filter(
    (o) => o.orderStatus !== 'cancelled' && o.paymentStatus !== 'refunded'
  );
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalNaklad = activeOrders.reduce((sum, o) => sum + ((o as any).naklad ?? 0), 0);
  const totalMarze = totalRevenue - totalNaklad;

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

  // Initiate delete flow for a single order (opens confirmation dialog)
  const handleDeleteClick = (order: Order) => {
    setOrderToDelete({ id: order.id, shortId: order.id.substring(0, 8) });
    setDeleteConfirmOpen(true);
  };

  // Execute confirmed delete
  const executeDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Chyba při mazání objednávky' }));
        throw new Error(data.error || 'Chyba při mazání objednávky');
      }
      // Invalidate React Query cache so the list refreshes
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      showToast(`Objednávka #${orderToDelete.shortId} byla smazána`, 'success');
      setSelectedIds((prev) => prev.filter((id) => id !== orderToDelete.id));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Chyba při mazání objednávky', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
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

  // Create test order function
  const handleCreateTestOrder = async () => {
    // Prompt for email (optional)
    const email = prompt('Zadej email pro test objednávku (nebo nech prázdné pro test@example.com):');
    const testEmail = email && email.trim() ? email.trim() : undefined;

    try {
      const response = await fetch('/api/admin/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(testEmail ? { email: testEmail } : {}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Chyba při vytváření test objednávky' }));
        throw new Error(errorData.error || 'Chyba při vytváření test objednávky');
      }

      const data = await response.json();
      const message = data.warning 
        ? `${data.message} ${data.warning}`
        : data.message || 'Test objednávka byla úspěšně vytvořena';
      
      showToast(message, data.warning ? 'warning' : 'success');

      // Invalidate React Query cache to refresh list
      // React Query will auto-refetch when component re-renders
      window.location.reload();
    } catch (error) {
      console.error('Error creating test order:', error);
      showToast(error instanceof Error ? error.message : 'Chyba při vytváření test objednávky', 'error');
    }
  };

  // Main render
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa Objednávek</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium flex items-center gap-2"
            title="Vytvořit manuální objednávku (Instagram, telefon, showroom...)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            Nová objednávka
          </button>
          <button
            onClick={handleCreateTestOrder}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            title="Vytvořit test objednávku pro testování (rychlé)"
          >
            🧪 Test
          </button>
        </div>
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

      {/* Filtered summary totals (náklad/marže owner only) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-stone-200">
          <p className="text-xs text-stone-500">Celkový příjem</p>
          <p className="text-xl font-bold text-stone-800">
            {totalRevenue.toLocaleString('cs-CZ')} Kč
          </p>
        </div>
        {currentUser?.role === 'owner' && (
          <>
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <p className="text-xs text-stone-500">Celkový náklad</p>
              <p className="text-xl font-bold text-red-600">
                {totalNaklad.toLocaleString('cs-CZ')} Kč
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-stone-200">
              <p className="text-xs text-stone-500">Celková marže</p>
              <p className="text-xl font-bold text-green-600">
                {totalMarze.toLocaleString('cs-CZ')} Kč
              </p>
            </div>
          </>
        )}
      </div>

      {/* Month / day / channel quick-filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
        />
        <input
          type="number"
          placeholder="Den (1-31)"
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
          min="1"
          max="31"
          className="w-28 px-3 py-2 border border-stone-200 rounded-lg text-sm"
        />
        <select
          value={filterChannelLocal}
          onChange={(e) => setFilterChannelLocal(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
        >
          <option value="">Všechny kanály</option>
          <option value="prodejna">Prodejna</option>
          <option value="instagram">Instagram</option>
          <option value="web">E-shop</option>
        </select>
        {(filterMonth || filterDay || filterChannelLocal) && (
          <button
            onClick={() => {
              setFilterMonth('');
              setFilterDay('');
              setFilterChannelLocal('');
            }}
            className="px-3 py-2 text-sm text-stone-500 hover:text-stone-800"
          >
            ✕ Zrušit filtry
          </button>
        )}
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
              {currentUser?.role === 'owner' && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Náklad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Marže
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
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
                {currentUser?.role === 'owner' && (
                  <>
                    <td className="px-4 py-3 text-sm">
                      <NakladCell
                        orderId={order.id}
                        naklad={(order as any).naklad ?? null}
                        onUpdate={(v) => updateOrderNaklad(order.id, v)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">
                      {(order as any).naklad != null
                        ? `${(order.total - (order as any).naklad).toLocaleString('cs-CZ')} Kč`
                        : <span className="text-stone-300">—</span>
                      }
                    </td>
                  </>
                )}
                <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                  <Link
                    href={`/admin/objednavky/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Detaily
                  </Link>
                  {currentUser?.role === 'owner' && (
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                      title={`Smazat objednávku #${order.id.substring(0, 8)}`}
                      aria-label={`Smazat objednávku #${order.id.substring(0, 8)}`}
                    >
                      🗑️
                    </button>
                  )}
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

      {/* Delete Order Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Smazat objednávku"
        message={
          orderToDelete ? (
            <>
              Smazat objednávku <strong>#{orderToDelete.shortId}</strong>? Tato akce je nevratná.
            </>
          ) : (
            ''
          )
        }
        confirmText="Smazat"
        cancelText="Zrušit"
        type="danger"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteConfirmOpen(false);
            setOrderToDelete(null);
          }
        }}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
