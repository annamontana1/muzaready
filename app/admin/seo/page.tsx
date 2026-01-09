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

interface ScannedPage {
  slug: string;
  name: string;
  type: string;
  hasSeo: boolean;
  seoId: string | null;
  titleCs: string | null;
  descriptionCs: string | null;
  seoStatus: 'missing' | 'incomplete' | 'complete';
}

interface ScanResult {
  pages: ScannedPage[];
  stats: {
    total: number;
    withSeo: number;
    complete: number;
    incomplete: number;
    missing: number;
  };
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [stats, setStats] = useState({ total: 0, withSeo: 0, complete: 0, incomplete: 0, missing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'missing' | 'incomplete' | 'complete'>('all');
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    scanPages();
  }, []);

  const scanPages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/seo/scan');
      if (!response.ok) throw new Error('Chyba při skenování');
      const data: ScanResult = await response.json();
      setPages(data.pages);
      setStats(data.stats);
    } catch (err) {
      setError('Nepodařilo se načíst stránky');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSeo = async (slug: string) => {
    setGenerating(slug);
    setMessage('');
    try {
      const response = await fetch('/api/admin/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`SEO vygenerováno pro ${slug}`);
        scanPages(); // Refresh
      } else {
        setMessage(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setMessage('Chyba při generování');
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  const generateAllSeo = async () => {
    setGeneratingAll(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/seo/generate', {
        method: 'PUT',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        scanPages(); // Refresh
      } else {
        setMessage(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setMessage('Chyba při generování');
      console.error(err);
    } finally {
      setGeneratingAll(false);
    }
  };

  const createMissingEntries = async () => {
    setGeneratingAll(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/seo/scan', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        scanPages(); // Refresh
      } else {
        setMessage(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setMessage('Chyba při vytváření');
      console.error(err);
    } finally {
      setGeneratingAll(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Kompletní</span>;
      case 'incomplete':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Neúplné</span>;
      case 'missing':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Chybí</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      main: 'bg-blue-100 text-blue-800',
      category: 'bg-purple-100 text-purple-800',
      info: 'bg-gray-100 text-gray-800',
      legal: 'bg-slate-100 text-slate-800',
      blog: 'bg-pink-100 text-pink-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.slug.toLowerCase().includes(search.toLowerCase()) ||
      page.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || page.seoStatus === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Skenuji stránky webu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Správa</h1>
          <p className="text-sm text-gray-500 mt-1">Spravujte SEO pro všechny stránky webu</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateAllSeo}
            disabled={generatingAll}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {generatingAll ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generuji...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generovat vše
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Chyba') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Celkem stránek</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600">{stats.complete}</div>
          <div className="text-sm text-gray-500">Kompletní SEO</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-yellow-600">{stats.incomplete}</div>
          <div className="text-sm text-gray-500">Neúplné SEO</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-red-600">{stats.missing}</div>
          <div className="text-sm text-gray-500">Chybí SEO</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-indigo-600">
            {stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-500">Pokrytí</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Hledat stránku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          {(['all', 'missing', 'incomplete', 'complete'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Vše' : f === 'missing' ? 'Chybí' : f === 'incomplete' ? 'Neúplné' : 'Kompletní'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stránka
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stav
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akce
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.map((page) => (
              <tr key={page.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{page.name}</div>
                  <div className="text-sm text-gray-500 font-mono">{page.slug}</div>
                </td>
                <td className="px-6 py-4">
                  {getTypeBadge(page.type)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {page.titleCs || <span className="text-gray-400 italic">Není nastaveno</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(page.seoStatus)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => generateSeo(page.slug)}
                    disabled={generating === page.slug}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                  >
                    {generating === page.slug ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    Generovat
                  </button>
                  {page.seoId && (
                    <Link
                      href={`/admin/seo/${page.seoId}`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Upravit
                    </Link>
                  )}
                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {search || filter !== 'all' ? 'Žádné stránky nenalezeny' : 'Žádné stránky k zobrazení'}
          </div>
        )}
      </div>

      {/* Help section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Jak to funguje?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Skenování</strong> - automaticky najde všechny stránky na webu</li>
          <li>• <strong>Generovat</strong> - vytvoří SEO (title, description, keywords) na základě obsahu stránky</li>
          <li>• <strong>Upravit</strong> - ruční úprava vygenerovaného SEO</li>
          <li>• <strong>Generovat vše</strong> - vygeneruje SEO pro všechny stránky najednou</li>
        </ul>
      </div>
    </div>
  );
}
