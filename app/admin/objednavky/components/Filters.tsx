'use client';

import { useState } from 'react';

export interface FilterState {
  orderStatus?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  channel?: string;
  email?: string;
}

interface FiltersProps {
  onFilter: (filters: FilterState) => void;
}

export default function Filters({ onFilter }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  // Handle filter change for individual fields
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value === '' ? undefined : value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  // Reset all filters
  const handleReset = () => {
    const emptyFilters: FilterState = {};
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {/* Order Status Filter */}
        <div>
          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">
            Stav objednávky
          </label>
          <select
            id="orderStatus"
            value={filters.orderStatus || ''}
            onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">Všechny stavy</option>
            <option value="draft">Návrh</option>
            <option value="pending">Čekající</option>
            <option value="paid">Zaplaceno</option>
            <option value="processing">Zpracování</option>
            <option value="shipped">Odesláno</option>
            <option value="completed">Dokončeno</option>
            <option value="cancelled">Zrušeno</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
            Stav platby
          </label>
          <select
            id="paymentStatus"
            value={filters.paymentStatus || ''}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">Všechny platby</option>
            <option value="unpaid">Nezaplaceno</option>
            <option value="partial">Částečně</option>
            <option value="paid">Zaplaceno</option>
            <option value="refunded">Vráceno</option>
          </select>
        </div>

        {/* Delivery Status Filter */}
        <div>
          <label htmlFor="deliveryStatus" className="block text-sm font-medium text-gray-700">
            Stav dodání
          </label>
          <select
            id="deliveryStatus"
            value={filters.deliveryStatus || ''}
            onChange={(e) => handleFilterChange('deliveryStatus', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">Všechna dodání</option>
            <option value="pending">Čeká</option>
            <option value="shipped">Odesláno</option>
            <option value="delivered">Doručeno</option>
            <option value="returned">Vráceno</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-gray-700">
            Kanál
          </label>
          <select
            id="channel"
            value={filters.channel || ''}
            onChange={(e) => handleFilterChange('channel', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">Všechny kanály</option>
            <option value="web">Web</option>
            <option value="pos">POS</option>
            <option value="ig_dm">Instagram DM</option>
          </select>
        </div>

        {/* Email Search */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            placeholder="Hledat email..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Resetovat filtry
        </button>
        <button
          disabled
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md opacity-50 cursor-not-allowed"
          title="Funkce bude dostupná později"
        >
          Uložit pohled
        </button>
      </div>
    </div>
  );
}
