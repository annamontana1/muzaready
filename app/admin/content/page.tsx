'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageContent {
  id: string;
  slug: string;
  pageName: string | null;
  pageType: string;
  sectionKey: string | null;
  contentCs: string | null;
  contentEn: string | null;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

const PAGE_TYPES: Record<string, string> = {
  static: 'Statická stránka',
  category: 'Kategorie',
  homepage_section: 'Homepage sekce',
  faq: 'FAQ',
};

export default function AdminContentPage() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (!response.ok) throw new Error('Chyba při načítání');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError('Nepodařilo se načíst obsah stránek');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item =>
    !filter || item.pageType === filter
  );

  const groupedContent = filteredContent.reduce((acc, item) => {
    const type = item.pageType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, PageContent[]>);

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
        <h1 className="text-2xl font-bold text-gray-900">Správa obsahu</h1>
        <Link
          href="/admin/content/new"
          className="bg-burgundy text-white px-4 py-2 rounded-lg hover:bg-maroon transition"
        >
          + Přidat obsah
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg transition ${!filter ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Vše ({content.length})
        </button>
        {Object.entries(PAGE_TYPES).map(([key, label]) => {
          const count = content.filter(c => c.pageType === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg transition ${filter === key ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content by type */}
      {Object.entries(groupedContent).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {PAGE_TYPES[type] || type}
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stránka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Obsah CZ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stav
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.pageName || item.slug}
                      </div>
                      <div className="text-xs text-gray-500">{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {item.contentCs
                          ? `${item.contentCs.substring(0, 100)}...`
                          : <span className="italic text-gray-400">Prázdné</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.isPublished ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Publikováno
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Skryto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/content/${item.id}`}
                        className="text-burgundy hover:text-maroon font-medium"
                      >
                        Upravit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filteredContent.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          Zatím není žádný obsah
        </div>
      )}
    </div>
  );
}
