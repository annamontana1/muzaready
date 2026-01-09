'use client';

import { useState, useEffect } from 'react';

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
  note: string | null;
  createdAt: string;
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fromPath: '',
    toPath: '',
    statusCode: 301,
    isActive: true,
    note: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const response = await fetch('/api/admin/redirects');
      if (!response.ok) throw new Error('Chyba při načítání');
      const data = await response.json();
      setRedirects(data);
    } catch (err) {
      setError('Nepodařilo se načíst přesměrování');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingId
        ? `/api/admin/redirects/${editingId}`
        : '/api/admin/redirects';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Chyba při ukládání');
      }

      await fetchRedirects();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (redirect: Redirect) => {
    setFormData({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      statusCode: redirect.statusCode,
      isActive: redirect.isActive,
      note: redirect.note || '',
    });
    setEditingId(redirect.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat toto přesměrování?')) return;

    try {
      const response = await fetch(`/api/admin/redirects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Chyba při mazání');
      await fetchRedirects();
    } catch (err) {
      setError('Nepodařilo se smazat přesměrování');
    }
  };

  const resetForm = () => {
    setFormData({
      fromPath: '',
      toPath: '',
      statusCode: 301,
      isActive: true,
      note: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Přesměrování (Redirects)</h1>
          <p className="text-gray-500 text-sm mt-1">Správa URL přesměrování pro SEO</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {showForm ? 'Zrušit' : '+ Přidat přesměrování'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Upravit přesměrování' : 'Nové přesměrování'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Z cesty (fromPath) *
                </label>
                <input
                  type="text"
                  value={formData.fromPath}
                  onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                  placeholder="/stara-stranka"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Na cestu (toPath) *
                </label>
                <input
                  type="text"
                  value={formData.toPath}
                  onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                  placeholder="/nova-stranka"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status kód
                </label>
                <select
                  value={formData.statusCode}
                  onChange={(e) => setFormData({ ...formData, statusCode: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={301}>301 - Trvalé přesměrování</option>
                  <option value={302}>302 - Dočasné přesměrování</option>
                  <option value={307}>307 - Dočasné (zachová metodu)</option>
                  <option value={308}>308 - Trvalé (zachová metodu)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stav
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-600">Aktivní</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poznámka
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Důvod přesměrování..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Ukládám...' : editingId ? 'Uložit změny' : 'Vytvořit'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Z cesty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Na cestu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
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
            {redirects.map((redirect) => (
              <tr key={redirect.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {redirect.fromPath}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm bg-green-100 px-2 py-1 rounded">
                    {redirect.toPath}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {redirect.statusCode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {redirect.isActive ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Aktivní
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      Neaktivní
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(redirect)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(redirect.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {redirects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Zatím nejsou žádná přesměrování
          </div>
        )}
      </div>
    </div>
  );
}
