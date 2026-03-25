'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  source: 'registered' | 'guest';
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  companyName: string | null;
  isWholesale: boolean;
  type: 'B2C' | 'B2B';
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

interface Stats {
  totalCustomers: number;
  b2bCount: number;
  avgSpent: number;
}

type FilterType = 'all' | 'b2c' | 'b2b' | 'wholesale';

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Vsichni',
  b2c: 'B2C',
  b2b: 'B2B',
  wholesale: 'Velkoobchod',
};

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, b2bCount: 0, avgSpent: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sortParam = sortDir === 'desc' ? `-${sortField}` : sortField;
      const offset = (currentPage - 1) * itemsPerPage;

      const params = new URLSearchParams({
        limit: String(itemsPerPage),
        offset: String(offset),
        sort: sortParam,
        filter,
      });
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/customers?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
      setStats(data.stats || { totalCustomers: 0, b2bCount: 0, avgSpent: 0 });
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Chyba pri nacitani zakazniku');
    } finally {
      setLoading(false);
    }
  }, [search, filter, sortField, sortDir, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => `${price.toLocaleString('cs-CZ')} Kc`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('cs-CZ');

  const totalPages = Math.ceil(total / itemsPerPage);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <span className="text-stone-300 ml-1">&#8693;</span>;
    return (
      <span className="text-[#722F37] ml-1">
        {sortDir === 'desc' ? '\u2193' : '\u2191'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-100">
          <p className="text-sm text-stone-500 mb-1">Celkem zakazniku</p>
          <p className="text-2xl font-bold text-stone-800">
            {loading ? '...' : stats.totalCustomers.toLocaleString('cs-CZ')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-100">
          <p className="text-sm text-stone-500 mb-1">B2B zakazniku</p>
          <p className="text-2xl font-bold text-[#722F37]">
            {loading ? '...' : stats.b2bCount.toLocaleString('cs-CZ')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-100">
          <p className="text-sm text-stone-500 mb-1">Prumerna utrata</p>
          <p className="text-2xl font-bold text-stone-800">
            {loading ? '...' : formatPrice(stats.avgSpent)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Hledat jmeno, email, telefon, firmu..."
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
            {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  filter === f
                    ? 'bg-white text-[#722F37] shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center">
                    Jmeno
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Typ
                </th>
                <th
                  onClick={() => handleSort('orderCount')}
                  className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center">
                    Pocet obj.
                    <SortIcon field="orderCount" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalSpent')}
                  className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center">
                    Celkova utrata
                    <SortIcon field="totalSpent" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center">
                    Registrace
                    <SortIcon field="createdAt" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-40" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-12" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-8" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-20" /></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-400 text-sm">
                    Zadni zakaznici nenalezeni
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/admin/zakaznici/${customer.id}`)}
                    className="hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-medium flex-shrink-0">
                          {customer.firstName?.[0]?.toUpperCase() || '?'}
                          {customer.lastName?.[0]?.toUpperCase() || ''}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-stone-800">
                            {customer.firstName} {customer.lastName}
                          </div>
                          {customer.companyName && (
                            <div className="text-xs text-stone-400">{customer.companyName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      <div className="flex items-center gap-1.5">
                        {customer.email}
                        {customer.source === 'guest' && (
                          <span className="text-[10px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded">
                            host
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {customer.phone || '\u2014'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.type === 'B2B'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {customer.type}
                        {customer.isWholesale && (
                          <span className="ml-1 text-purple-400" title="Velkoobchod">
                            VO
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-700 font-medium">
                      {customer.orderCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-700 font-medium">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
            <p className="text-sm text-stone-500">
              Zobrazeno {(currentPage - 1) * itemsPerPage + 1}
              {'\u2013'}
              {Math.min(currentPage * itemsPerPage, total)} z {total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Predchozi
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#722F37] text-white'
                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Dalsi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
