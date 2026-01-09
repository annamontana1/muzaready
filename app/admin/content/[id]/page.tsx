'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
}

const PAGE_TYPES = [
  { value: 'static', label: 'Statická stránka' },
  { value: 'category', label: 'Kategorie' },
  { value: 'homepage_section', label: 'Homepage sekce' },
  { value: 'faq', label: 'FAQ' },
];

// Simple Markdown preview (converts basic markdown to HTML)
function MarkdownPreview({ content }: { content: string }) {
  const renderMarkdown = (md: string) => {
    if (!md) return '';

    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      // Bold & Italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Lists
      .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-burgundy underline">$1</a>')
      // Paragraphs (double newlines)
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      // Single newlines to <br>
      .replace(/\n/gim, '<br>');

    // Wrap in paragraph
    html = '<p class="mb-4">' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4"><\/p>/g, '');

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li[^>]*>.*?<\/li>)+/gim, '<ul class="list-disc mb-4">$&</ul>');

    return html;
  };

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}

export default function AdminContentEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'cs' | 'en'>('cs');
  const [showPreview, setShowPreview] = useState(true);

  const [formData, setFormData] = useState<Partial<PageContent>>({
    slug: '',
    pageName: '',
    pageType: 'static',
    sectionKey: '',
    contentCs: '',
    contentEn: '',
    isPublished: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetchContent();
    }
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${params.id}`);
      if (!response.ok) throw new Error('Obsah nenalezen');
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError('Nepodařilo se načíst obsah');
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
      const url = isNew ? '/api/admin/content' : `/api/admin/content/${params.id}`;
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
        setTimeout(() => router.push(`/admin/content/${data.id}`), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se uložit');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PageContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentContent = activeTab === 'cs' ? formData.contentCs : formData.contentEn;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/content" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Zpět na seznam
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Nový obsah' : `Editace: ${formData.pageName || formData.slug}`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
            />
            <span className="text-sm text-gray-600">Zobrazit náhled</span>
          </label>
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

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Základní informace</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL / Slug *
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="/o-nas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
                required
                disabled={!isNew}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Název (pro admin)
              </label>
              <input
                type="text"
                value={formData.pageName || ''}
                onChange={(e) => handleChange('pageName', e.target.value)}
                placeholder="O nás"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Typ stránky *
              </label>
              <select
                value={formData.pageType || 'static'}
                onChange={(e) => handleChange('pageType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy"
                required
              >
                {PAGE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publikováno
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished || false}
                  onChange={(e) => handleChange('isPublished', e.target.checked)}
                  className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                />
                <span className="text-sm text-gray-600">Zobrazit na webu</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Language Tabs */}
          <div className="flex gap-4 px-6 pt-4 border-b">
            <button
              type="button"
              onClick={() => setActiveTab('cs')}
              className={`pb-3 px-1 font-medium ${activeTab === 'cs'
                ? 'text-burgundy border-b-2 border-burgundy'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              🇨🇿 Čeština
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`pb-3 px-1 font-medium ${activeTab === 'en'
                ? 'text-burgundy border-b-2 border-burgundy'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Editor + Preview */}
          <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} divide-x`}>
            {/* Editor */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Obsah (Markdown)
                </label>
                <div className="text-xs text-gray-500">
                  Podporuje: **bold**, *italic*, # nadpisy, - seznamy, [odkaz](url)
                </div>
              </div>
              <textarea
                value={activeTab === 'cs' ? (formData.contentCs || '') : (formData.contentEn || '')}
                onChange={(e) => handleChange(activeTab === 'cs' ? 'contentCs' : 'contentEn', e.target.value)}
                placeholder={activeTab === 'cs'
                  ? '# Nadpis\n\nText stránky...\n\n- Položka seznamu\n- Další položka'
                  : '# Title\n\nPage content...\n\n- List item\n- Another item'
                }
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy font-mono text-sm"
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="p-4 bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-2">Náhled</div>
                <div className="bg-white p-4 rounded border min-h-[400px]">
                  {currentContent ? (
                    <MarkdownPreview content={currentContent} />
                  ) : (
                    <p className="text-gray-400 italic">Začněte psát pro zobrazení náhledu...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/content"
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
