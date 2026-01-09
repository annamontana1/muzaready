'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageSeo {
  id: string;
  slug: string;
  pageName: string | null;
  titleCs: string | null;
  titleEn: string | null;
  descriptionCs: string | null;
  descriptionEn: string | null;
  noIndex: boolean;
  noFollow: boolean;
  updatedAt: string;
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/seo');
      if (!response.ok) throw new Error('Chyba při načítání');
      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError('Nepodařilo se načíst SEO stránky');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeoStatus = (page: PageSeo) => {
    if (!page.titleCs && !page.descriptionCs) {
      return { status: 'missing', label: 'Chybí', color: 'bg-red-100 text-red-800' };
    }
    if (!page.titleCs || !page.descriptionCs) {
      return { status: 'partial', label: 'Neúplné', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (page.titleCs.length < 30 || page.titleCs.length > 60) {
      return { status: 'warning', label: 'Title délka', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (page.descriptionCs.length < 120 || page.descriptionCs.length > 160) {
      return { status: 'warning', label: 'Desc délka', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'ok', label: 'OK', color: 'bg-green-100 text-green-800' };
  };

  const filteredPages = pages.filter(page =>
    page.slug.toLowerCase().includes(search.toLowerCase()) ||
    page.pageName?.toLowerCase().includes(search.toLowerCase()) ||
    page.titleCs?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SEO Správa</h1>
        <Link
          href="/admin/seo/new"
          className="bg-burgundy text-white px-4 py-2 rounded-lg hover:bg-maroon transition"
        >
          + Přidat stránku
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Hledat stránku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
          <div className="text-sm text-gray-500">Celkem stránek</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {pages.filter(p => getSeoStatus(p).status === 'ok').length}
          </div>
          <div className="text-sm text-gray-500">Optimalizováno</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {pages.filter(p => ['partial', 'warning'].includes(getSeoStatus(p).status)).length}
          </div>
          <div className="text-sm text-gray-500">K vylepšení</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">
            {pages.filter(p => getSeoStatus(p).status === 'missing').length}
          </div>
          <div className="text-sm text-gray-500">Chybí SEO</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stránka
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title CZ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stav
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Robots
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akce
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.map((page) => {
              const status = getSeoStatus(page);
              return (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{page.slug}</div>
                    {page.pageName && (
                      <div className="text-sm text-gray-500">{page.pageName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {page.titleCs || <span className="text-gray-400 italic">Není nastaveno</span>}
                    </div>
                    {page.titleCs && (
                      <div className="text-xs text-gray-500">{page.titleCs.length} znaků</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {page.noIndex && <span className="text-red-600 mr-2">noindex</span>}
                    {page.noFollow && <span className="text-red-600">nofollow</span>}
                    {!page.noIndex && !page.noFollow && <span className="text-green-600">index, follow</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/seo/${page.id}`}
                      className="text-burgundy hover:text-maroon mr-4"
                    >
                      Upravit
                    </Link>
                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Zobrazit ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {search ? 'Žádné stránky nenalezeny' : 'Zatím nejsou žádné SEO stránky'}
          </div>
        )}
      </div>
    </div>
  );
}
