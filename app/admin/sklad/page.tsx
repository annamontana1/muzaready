'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SkuFilterPanel from '@/components/admin/SkuFilterPanel';
import QuickAddSkuModal from '@/components/admin/QuickAddSkuModal';
import type { SkuFilters, PaginationMeta } from '@/lib/sku-filter-utils';
import { filtersToQueryString, queryStringToFilters } from '@/lib/sku-filter-utils';

interface Sku {
  id: string;
  sku: string;
  shortCode: string | null;
  name: string | null;
  shade: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  structure: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  saleMode: string;
  pricePerGramCzk: number;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  isListed: boolean;
  listingPriority: number | null;
  inStock: boolean;
  soldOut: boolean;
  reservedUntil: string | null;
}

function SkuListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<SkuFilters>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const initialFilters = queryStringToFilters(searchParams);
    setFilters(initialFilters);
    fetchSkus(initialFilters);
  }, []);

  const fetchSkus = async (appliedFilters: SkuFilters = {}) => {
    setLoading(true);
    try {
      const queryString = filtersToQueryString(appliedFilters);
      const url = `/api/admin/skus${queryString ? `?${queryString}` : ''}`;
      const res = await fetch(url, {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Handle both old format (array) and new format (object with skus/pagination)
      if (Array.isArray(data)) {
        setSkus(data);
        setPagination(null);
      } else {
        setSkus(data.skus || []);
        setPagination(data.pagination || null);
      }
    } catch (err: any) {
      console.error('Chyba pri nacitani SKU:', err);
      if (err.message !== 'Unauthorized - Admin session required') {
        alert('Chyba pri nacitani skladu: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: SkuFilters) => {
    setFilters(newFilters);

    const queryString = filtersToQueryString(newFilters);
    router.push(`/admin/sklad${queryString ? `?${queryString}` : ''}`, { scroll: false });

    fetchSkus(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    handleApplyFilters(newFilters);
  };

  const handleLimitChange = (newLimit: number) => {
    const newFilters = { ...filters, limit: newLimit, page: 1 };
    handleApplyFilters(newFilters);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === skus.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(skus.map((s) => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert('Vyberte SKU k smazani');
      return;
    }

    const confirmed = window.confirm(
      `Opravdu chcete smazat ${selectedIds.size} vybranych SKU? Tato akce je nevratna.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/skus/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba pri mazani');

      alert(`Smazano ${data.deleted} SKU`);
      setSelectedIds(new Set());
      fetchSkus(filters);
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      'Opravdu chcete smazat VSECHNY SKU bez objednavek? Tato akce je nevratna!'
    );
    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'Toto je nevratna akce. Naposledy se ptam - opravdu smazat vsechny testovaci produkty?'
    );
    if (!doubleConfirm) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/skus/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba pri mazani');

      alert(`Smazano ${data.deleted} SKU`);
      setSelectedIds(new Set());
      fetchSkus(filters);
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Nacitam...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sklad (SKU)</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Quick Add
          </button>
          <Link
            href="/admin/sklad/novy"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Wizard (vice delek)
          </Link>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddSkuModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onCreated={() => fetchSkus(filters)}
      />

      {/* Filter Panel */}
      <SkuFilterPanel onApplyFilters={handleApplyFilters} initialFilters={filters} />

      {/* Bulk Actions Toolbar */}
      {(selectedIds.size > 0 || skus.length > 0) && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {selectedIds.size > 0 ? `Vybrano: ${selectedIds.size} SKU` : `Celkem: ${pagination?.total || skus.length} SKU`}
            </span>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
              >
                {deleting ? 'Mazu...' : `Smazat vybrane (${selectedIds.size})`}
              </button>
            )}
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={deleting}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm font-medium"
          >
            Smazat vsechny test produkty
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-2 py-2 w-8">
                <input
                  type="checkbox"
                  checked={skus.length > 0 && selectedIds.size === skus.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Kod IG</th>
              <th className="px-4 py-2 text-left">Nazev</th>
              <th className="px-4 py-2 text-left">Kategorie</th>
              <th className="px-4 py-2 text-left">Odstin</th>
              <th className="px-4 py-2 text-left">Delka</th>
              <th className="px-4 py-2 text-left">Cena/g</th>
              <th className="px-4 py-2 text-left">Typ</th>
              <th className="px-4 py-2 text-left">Stav</th>
              <th className="px-4 py-2 text-left">Katalog</th>
              <th className="px-4 py-2 text-left">Priorita</th>
              <th className="px-4 py-2 text-left">Skladove info</th>
              <th className="px-4 py-2 text-left">Akce</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((sku) => (
              <tr key={sku.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(sku.id) ? 'bg-blue-50' : ''}`}>
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(sku.id)}
                    onChange={() => toggleSelect(sku.id)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="px-4 py-2 font-mono text-xs">{sku.sku}</td>
                <td className="px-4 py-2">
                  {sku.shortCode ? (
                    <span className="font-bold text-blue-600">{sku.shortCode}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-2">{sku.name || '-'}</td>
                <td className="px-4 py-2 text-xs">
                  <span className={`px-2 py-1 rounded ${
                    sku.customerCategory === 'PLATINUM_EDITION' ? 'bg-yellow-100' :
                    sku.customerCategory === 'LUXE' ? 'bg-pink-100' :
                    'bg-gray-100'
                  }`}>
                    {sku.customerCategory || '-'}
                  </span>
                </td>
                <td className="px-4 py-2">{sku.shadeName || sku.shade || '-'}</td>
                <td className="px-4 py-2">{sku.lengthCm ? `${sku.lengthCm} cm` : '-'}</td>
                <td className="px-4 py-2">{sku.pricePerGramCzk} Kc</td>
                <td className="px-4 py-2 text-xs">
                  <span className={`px-2 py-1 rounded ${sku.saleMode === 'PIECE_BY_WEIGHT' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {sku.saleMode === 'PIECE_BY_WEIGHT' ? 'Culik' : 'Gramy'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {sku.soldOut ? (
                    <span className="text-red-600 font-bold">Vyprodano</span>
                  ) : sku.inStock ? (
                    <span className="text-green-600 font-bold">Skladem</span>
                  ) : (
                    <span className="text-gray-500">Vyprodano</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  {sku.isListed ? (
                    <span className="text-blue-600 font-bold">Ano</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  {sku.listingPriority || '-'}
                </td>
                <td className="px-4 py-2 text-xs">
                  {sku.saleMode === 'PIECE_BY_WEIGHT' ? (
                    <span>{sku.weightTotalG}g</span>
                  ) : (
                    <span>{sku.availableGrams}g ({sku.minOrderG}g min, {sku.stepG}g krok)</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/sklad/${sku.id}/edit`}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    >
                      Upravit
                    </Link>
                    <Link
                      href={`/admin/sklad/${sku.id}/qr-codes`}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      QR
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {skus.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {Object.keys(filters).length > 0 ? 'Zadne SKU neodpovida filtrum.' : 'Zatim zadne SKU. Pridej prvni!'}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Zobrazeno {(pagination.page - 1) * pagination.limit + 1} -{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} z {pagination.total}
            </span>
            <select
              value={filters.limit || 25}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="border rounded px-3 py-1.5 text-sm"
            >
              <option value={25}>25 na stranku</option>
              <option value={50}>50 na stranku</option>
              <option value={100}>100 na stranku</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Predchozi
            </button>
            <span className="text-sm text-gray-700">
              Stranka {pagination.page} z {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dalsi →
            </button>
          </div>
        </div>
      )}

      <Link href="/admin" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
        ← Zpet na admin
      </Link>
    </div>
  );
}

export default function SkuListPage() {
  return (
    <Suspense fallback={<div className="p-4">Nacitam...</div>}>
      <SkuListPageContent />
    </Suspense>
  );
}
