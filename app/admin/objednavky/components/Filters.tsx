'use client';

import { useState } from 'react';
import { OrderFilters, OrderStatus, PaymentStatus, DeliveryMethod } from '../types';

interface FiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: OrderStatus.AWAITING_PAYMENT, label: 'Čeká na platbu' },
  { value: OrderStatus.PAID, label: 'Zaplaceno' },
  { value: OrderStatus.PROCESSING, label: 'Zpracování' },
  { value: OrderStatus.ASSEMBLY_IN_PROGRESS, label: 'Montáž probíhá' },
  { value: OrderStatus.SHIPPED, label: 'Odesláno' },
  { value: OrderStatus.CANCELLED_UNPAID, label: 'Zrušeno - nezaplaceno' },
  { value: OrderStatus.REFUNDED, label: 'Vráceno' },
];

const paymentStatusOptions = [
  { value: PaymentStatus.UNPAID, label: 'Nezaplaceno' },
  { value: PaymentStatus.PAID, label: 'Zaplaceno' },
  { value: PaymentStatus.REFUNDED, label: 'Vráceno' },
  { value: PaymentStatus.FAILED, label: 'Selhalo' },
];

const deliveryMethodOptions = [
  { value: DeliveryMethod.STANDARD, label: 'Standardní doručení' },
  { value: DeliveryMethod.EXPRESS, label: 'Expresní doručení' },
  { value: DeliveryMethod.PICKUP, label: 'Osobní vyzvednutí' },
];

export default function Filters({ filters, onFiltersChange, isLoading }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFiltersChange({ ...filters, status: value });
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFiltersChange({ ...filters, paymentStatus: value });
  };

  const handleDeliveryMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    onFiltersChange({ ...filters, deliveryMethod: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, searchTerm: value || undefined });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    onFiltersChange({ ...filters, dateFrom: value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    onFiltersChange({ ...filters, dateTo: value });
  };

  const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onFiltersChange({ ...filters, minAmount: value });
  };

  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onFiltersChange({ ...filters, maxAmount: value });
  };

  const resetFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Filtry</h3>
          {hasActiveFilters && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {Object.values(filters).filter((v) => v !== undefined && v !== '').length} aktivní
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          {isExpanded ? 'Skrýt' : 'Zobrazit'}
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Hledat podle emailu, jména nebo ID objednávky..."
          value={searchInput}
          onChange={handleSearchChange}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stav objednávky
              </label>
              <select
                value={filters.status || ''}
                onChange={handleStatusChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              >
                <option value="">Všechny stavy</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stav platby
              </label>
              <select
                value={filters.paymentStatus || ''}
                onChange={handlePaymentStatusChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              >
                <option value="">Všechny stavy</option>
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Způsob doručení
              </label>
              <select
                value={filters.deliveryMethod || ''}
                onChange={handleDeliveryMethodChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              >
                <option value="">Všechny způsoby</option>
                {deliveryMethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Od data</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={handleDateFromChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do data</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={handleDateToChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimální cena</label>
              <input
                type="number"
                value={filters.minAmount || ''}
                onChange={handleMinAmountChange}
                disabled={isLoading}
                placeholder="0 Kč"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximální cena</label>
              <input
                type="number"
                value={filters.maxAmount || ''}
                onChange={handleMaxAmountChange}
                disabled={isLoading}
                placeholder="Bez limitu"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Vymazat filtry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
