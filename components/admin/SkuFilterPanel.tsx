'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import type { SkuFilters, StockStatus, SaleMode, CustomerCategory } from '@/lib/sku-filter-utils';

interface SkuFilterPanelProps {
  onApplyFilters: (filters: SkuFilters) => void;
  initialFilters?: SkuFilters;
}

export default function SkuFilterPanel({ onApplyFilters, initialFilters = {} }: SkuFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(initialFilters.search || '');
  const [selectedShades, setSelectedShades] = useState<string[]>(initialFilters.shades || []);
  const [selectedLengths, setSelectedLengths] = useState<number[]>(initialFilters.lengths || []);
  const [stockStatus, setStockStatus] = useState<StockStatus>(initialFilters.stockStatus || 'ALL');
  const [selectedSaleModes, setSelectedSaleModes] = useState<SaleMode[]>(initialFilters.saleModes || []);
  const [selectedCategories, setSelectedCategories] = useState<CustomerCategory[]>(
    initialFilters.categories || []
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-apply search after 500ms of no typing
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleToggleShade = (shade: string) => {
    setSelectedShades((prev) =>
      prev.includes(shade) ? prev.filter((s) => s !== shade) : [...prev, shade]
    );
  };

  const handleToggleLength = (length: number) => {
    setSelectedLengths((prev) =>
      prev.includes(length) ? prev.filter((l) => l !== length) : [...prev, length]
    );
  };

  const handleToggleSaleMode = (mode: SaleMode) => {
    setSelectedSaleModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleToggleCategory = (category: CustomerCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleApplyFilters = () => {
    const filters: SkuFilters = {
      search: searchValue || undefined,
      shades: selectedShades.length > 0 ? selectedShades : undefined,
      lengths: selectedLengths.length > 0 ? selectedLengths : undefined,
      stockStatus: stockStatus !== 'ALL' ? stockStatus : undefined,
      saleModes: selectedSaleModes.length > 0 ? selectedSaleModes : undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedShades([]);
    setSelectedLengths([]);
    setStockStatus('ALL');
    setSelectedSaleModes([]);
    setSelectedCategories([]);
    onApplyFilters({});
  };

  // Count active filters (excluding search)
  const activeFilterCount =
    selectedShades.length +
    selectedLengths.length +
    (stockStatus !== 'ALL' ? 1 : 0) +
    selectedSaleModes.length +
    selectedCategories.length;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Filtry</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-900 font-medium text-sm"
        >
          {isExpanded ? '▲ Skrýt' : '▼ Zobrazit'}
        </button>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hledat SKU nebo název</label>
            <Input
              type="text"
              placeholder="Zadej SKU kód nebo název..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />
          </div>

          {/* Grid for other filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Shade Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Odstín (1-10)</label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((shade) => (
                  <button
                    key={shade}
                    onClick={() => handleToggleShade(shade.toString())}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border transition ${
                      selectedShades.includes(shade.toString())
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {shade}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Délka (cm)</label>
              <div className="space-y-2">
                {[40, 50, 60, 70].map((length) => (
                  <label key={length} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLengths.includes(length)}
                      onChange={() => handleToggleLength(length)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{length} cm</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stav skladu</label>
              <div className="space-y-2">
                {[
                  { value: 'ALL', label: 'Vše' },
                  { value: 'IN_STOCK', label: 'Skladem' },
                  { value: 'SOLD_OUT', label: 'Vyprodáno' },
                  { value: 'LOW_STOCK', label: 'Nízký sklad (<100g)' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={stockStatus === value}
                      onChange={() => setStockStatus(value as StockStatus)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sale Mode Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Typ prodeje</label>
              <div className="space-y-2">
                {[
                  { value: 'PIECE_BY_WEIGHT', label: 'Culík (pevná váha)' },
                  { value: 'BULK_G', label: 'Sypané gramy' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSaleModes.includes(value as SaleMode)}
                      onChange={() => handleToggleSaleMode(value as SaleMode)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategorie zákazníka</label>
              <div className="space-y-2">
                {[
                  { value: 'STANDARD', label: 'Standard' },
                  { value: 'LUXE', label: 'Luxe' },
                  { value: 'PLATINUM_EDITION', label: 'Platinum Edition' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(value as CustomerCategory)}
                      onChange={() => handleToggleCategory(value as CustomerCategory)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleApplyFilters} variant="primary" size="md">
              Použít filtry
            </Button>
            <Button onClick={handleClearFilters} variant="secondary" size="md">
              Vymazat vše
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
