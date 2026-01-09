'use client';

import { useState, useEffect } from 'react';

interface FaqItem {
  id: string;
  category: string;
  questionCs: string;
  questionEn: string | null;
  answerCs: string;
  answerEn: string | null;
  sortOrder: number;
  isPublished: boolean;
}

const FAQ_CATEGORIES = [
  { value: 'objednavky', label: 'Objednávky a platby' },
  { value: 'doprava', label: 'Doprava a doručení' },
  { value: 'produkty', label: 'Produkty a péče' },
  { value: 'vraceni', label: 'Vrácení a reklamace' },
  { value: 'ostatni', label: 'Ostatní' },
];

export default function AdminFaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cs' | 'en'>('cs');
  const [formData, setFormData] = useState({
    category: 'objednavky',
    questionCs: '',
    questionEn: '',
    answerCs: '',
    answerEn: '',
    sortOrder: 0,
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchFaqItems();
  }, []);

  const fetchFaqItems = async () => {
    try {
      const response = await fetch('/api/admin/faq');
      if (!response.ok) throw new Error('Chyba při načítání');
      const data = await response.json();
      setFaqItems(data);
    } catch (err) {
      setError('Nepodařilo se načíst FAQ');
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
        ? `/api/admin/faq/${editingId}`
        : '/api/admin/faq';
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

      await fetchFaqItems();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setFormData({
      category: item.category,
      questionCs: item.questionCs,
      questionEn: item.questionEn || '',
      answerCs: item.answerCs,
      answerEn: item.answerEn || '',
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat tuto FAQ položku?')) return;

    try {
      const response = await fetch(`/api/admin/faq/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Chyba při mazání');
      await fetchFaqItems();
    } catch (err) {
      setError('Nepodařilo se smazat FAQ');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'objednavky',
      questionCs: '',
      questionEn: '',
      answerCs: '',
      answerEn: '',
      sortOrder: 0,
      isPublished: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = filterCategory
    ? faqItems.filter(item => item.category === filterCategory)
    : faqItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Správa</h1>
          <p className="text-gray-500 text-sm mt-1">Často kladené dotazy</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {showForm ? 'Zrušit' : '+ Přidat otázku'}
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
            {editingId ? 'Upravit otázku' : 'Nová otázka'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {FAQ_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pořadí
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stav
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-600">Publikováno</span>
                </label>
              </div>
            </div>

            {/* Language Tabs */}
            <div className="border-b">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('cs')}
                  className={`pb-2 px-1 font-medium ${activeTab === 'cs'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500'}`}
                >
                  Cestina
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`pb-2 px-1 font-medium ${activeTab === 'en'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500'}`}
                >
                  English
                </button>
              </div>
            </div>

            {activeTab === 'cs' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Otázka (CZ) *
                  </label>
                  <input
                    type="text"
                    value={formData.questionCs}
                    onChange={(e) => setFormData({ ...formData, questionCs: e.target.value })}
                    placeholder="Jak mohu sledovat svou objednávku?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Odpověď (CZ) *
                  </label>
                  <textarea
                    value={formData.answerCs}
                    onChange={(e) => setFormData({ ...formData, answerCs: e.target.value })}
                    placeholder="Po odeslání objednávky obdržíte email s trackovacím číslem..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.questionEn}
                    onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                    placeholder="How can I track my order?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer (EN)
                  </label>
                  <textarea
                    value={formData.answerEn}
                    onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                    placeholder="After your order is shipped, you will receive an email with tracking number..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

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

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-4 py-2 rounded-lg transition ${!filterCategory
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Vše ({faqItems.length})
        </button>
        {FAQ_CATEGORIES.map(cat => {
          const count = faqItems.filter(i => i.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition ${filterCategory === cat.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* FAQ Items by category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {FAQ_CATEGORIES.find(c => c.value === category)?.label || category}
          </h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {items.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.questionCs}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.answerCs}</p>
                    <div className="flex gap-2 mt-2">
                      {item.isPublished ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                          Publikováno
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                          Skryto
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        Pořadí: {item.sortOrder}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          Zatím nejsou žádné FAQ položky
        </div>
      )}
    </div>
  );
}
