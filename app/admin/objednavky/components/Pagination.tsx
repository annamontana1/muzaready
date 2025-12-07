'use client';

import { PaginationInfo } from '../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PaginationProps) {
  const { page, pageSize, totalPages, total } = pagination;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show ellipsis if needed
      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show ellipsis if needed
      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange(newSize);
  };

  if (totalPages <= 1 && total <= pageSize) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Info */}
        <div className="text-sm text-gray-600">
          Zobrazuji <span className="font-medium">{startItem}</span> až{' '}
          <span className="font-medium">{endItem}</span> z{' '}
          <span className="font-medium">{total}</span> objednávek
        </div>

        {/* Page Size */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Řádků na stránku:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            aria-label="Předchozí stránka"
          >
            ← Zpět
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-500">
                    ...
                  </span>
                );
              }

              const num = pageNum as number;
              const isCurrentPage = num === page;

              return (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  disabled={isLoading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                  aria-label={`Přejít na stránku ${num}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            aria-label="Další stránka"
          >
            Další →
          </button>
        </div>
      </div>

      {/* Info about being on last page */}
      {page === totalPages && total > 0 && (
        <div className="mt-3 text-xs text-gray-500 text-center md:text-right">
          Jste na poslední stránce
        </div>
      )}
    </div>
  );
}
