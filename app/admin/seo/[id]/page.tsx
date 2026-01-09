'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface PageSeo {
  id: string;
  slug: string;
  pageName: string | null;
  titleCs: string | null;
  titleEn: string | null;
  descriptionCs: string | null;
  descriptionEn: string | null;
  keywordsCs: string | null;
  keywordsEn: string | null;
  ogImageUrl: string | null;
  ogType: string;
  structuredData: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  noFollow: boolean;
}

// Google SERP Preview Component
function SerpPreview({ title, description, url }: { title: string; description: string; url: string }) {
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const truncatedDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-xs text-gray-500 mb-1">Náhled ve vyhledávači Google</div>
      <div className="font-medium text-[#1a0dab] text-lg hover:underline cursor-pointer">
        {truncatedTitle || 'Název stránky'}
      </div>
      <div className="text-sm text-[#006621] mb-1">
        https://muzahair.cz{url}
      </div>
      <div className="text-sm text-[#545454]">
        {truncatedDesc || 'Popis stránky se zobrazí zde...'}
      </div>
    </div>
  );
}

// Character counter with color coding
function CharCounter({ current, min, max }: { current: number; min: number; max: number }) {
  let color = 'text-gray-500';
  if (current > 0) {
    if (current < min) color = 'text-yellow-600';
    else if (current > max) color = 'text-red-600';
    else color = 'text-green-600';
  }

  return (
    <span className={`text-xs ${color}`}>
      {current}/{min}-{max} znaků
    </span>
  );
}

export default function AdminSeoEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'cs' | 'en'>('cs');

  const [formData, setFormData] = useState<Partial<PageSeo>>({
    slug: '',
    pageName: '',
    titleCs: '',
    titleEn: '',
    descriptionCs: '',
    descriptionEn: '',
    keywordsCs: '',
    keywordsEn: '',
    ogImageUrl: '',
    ogType: 'website',
    structuredData: '',
    canonicalUrl: '',
    noIndex: false,
    noFollow: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [params.id]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/admin/seo/${params.id}`);
      if (!response.ok) throw new Error('Stránka nenalezena');
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError('Nepodařilo se načíst SEO stránku');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = isNew ? '/api/admin/seo' : `/api/admin/seo/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chyba při ukládání');
      }

      setSuccess(data.revalidated
        ? `Uloženo a stránka ${data.revalidatedPath} byla aktualizována!`
        : 'Uloženo!'
      );

      if (isNew) {
        setTimeout(() => router.push(`/admin/seo/${data.id}`), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se uložit');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PageSeo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Back button - prominent */}
      <Link
        href="/admin/seo"
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Zpět na seznam
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Nová SEO stránka' : `SEO: ${formData.slug}`}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Základní informace</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL (slug) *
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="/o-nas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                required
                disabled={!isNew}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Název stránky (pro admin)
              </label>
              <input
                type="text"
                value={formData.pageName || ''}
                onChange={(e) => handleChange('pageName', e.target.value)}
                placeholder="O nás"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-4 mb-4 border-b">
            <button
              type="button"
              onClick={() => setActiveTab('cs')}
              className={`pb-2 px-1 font-medium ${activeTab === 'cs'
                ? 'text-burgundy border-b-2 border-burgundy'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              🇨🇿 Čeština
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`pb-2 px-1 font-medium ${activeTab === 'en'
                ? 'text-burgundy border-b-2 border-burgundy'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              🇬🇧 English
            </button>
          </div>

          {activeTab === 'cs' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Title CZ
                  </label>
                  <CharCounter current={formData.titleCs?.length || 0} min={30} max={60} />
                </div>
                <input
                  type="text"
                  value={formData.titleCs || ''}
                  onChange={(e) => handleChange('titleCs', e.target.value)}
                  placeholder="Název stránky | Mùza Hair"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description CZ
                  </label>
                  <CharCounter current={formData.descriptionCs?.length || 0} min={120} max={160} />
                </div>
                <textarea
                  value={formData.descriptionCs || ''}
                  onChange={(e) => handleChange('descriptionCs', e.target.value)}
                  placeholder="Popis stránky pro vyhledávače..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords CZ (oddělené čárkou)
                </label>
                <input
                  type="text"
                  value={formData.keywordsCs || ''}
                  onChange={(e) => handleChange('keywordsCs', e.target.value)}
                  placeholder="vlasy, prodloužení, keratin, Praha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Title EN
                  </label>
                  <CharCounter current={formData.titleEn?.length || 0} min={30} max={60} />
                </div>
                <input
                  type="text"
                  value={formData.titleEn || ''}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  placeholder="Page Title | Mùza Hair"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description EN
                  </label>
                  <CharCounter current={formData.descriptionEn?.length || 0} min={120} max={160} />
                </div>
                <textarea
                  value={formData.descriptionEn || ''}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  placeholder="Page description for search engines..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords EN (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.keywordsEn || ''}
                  onChange={(e) => handleChange('keywordsEn', e.target.value)}
                  placeholder="hair, extensions, keratin, Prague"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* SERP Preview */}
        <SerpPreview
          title={activeTab === 'cs' ? (formData.titleCs || '') : (formData.titleEn || '')}
          description={activeTab === 'cs' ? (formData.descriptionCs || '') : (formData.descriptionEn || '')}
          url={formData.slug || '/'}
        />

        {/* OpenGraph */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">OpenGraph (sociální sítě)</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL
              </label>
              <input
                type="text"
                value={formData.ogImageUrl || ''}
                onChange={(e) => handleChange('ogImageUrl', e.target.value)}
                placeholder="https://muzahair.cz/og-image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Type
              </label>
              <select
                value={formData.ogType || 'website'}
                onChange={(e) => handleChange('ogType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pokročilé nastavení</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={formData.canonicalUrl || ''}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://muzahair.cz/o-nas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ponechte prázdné pro automatické nastavení
              </p>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.noIndex || false}
                  onChange={(e) => handleChange('noIndex', e.target.checked)}
                  className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                />
                <span className="text-sm text-gray-700">noindex (nezobrazovat ve vyhledávačích)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.noFollow || false}
                  onChange={(e) => handleChange('noFollow', e.target.checked)}
                  className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                />
                <span className="text-sm text-gray-700">nofollow (nesledovat odkazy)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strukturovaná data (JSON-LD)
              </label>
              <textarea
                value={formData.structuredData || ''}
                onChange={(e) => handleChange('structuredData', e.target.value)}
                placeholder='{"@context": "https://schema.org", "@type": "..."}'
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/seo"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Zrušit
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-burgundy text-white rounded-lg hover:bg-maroon transition disabled:opacity-50"
          >
            {saving ? 'Ukládám...' : 'Uložit'}
          </button>
        </div>
      </form>
    </div>
  );
}
