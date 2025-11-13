'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'nebarvene_panenske',
    tier: 'Standard',
    base_price_per_100g_45cm: 6900,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'base_price_per_100g_45cm') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Chyba při vytváření produktu');
        setSaving(false);
        return;
      }

      setSuccess('Produkt byl úspěšně vytvořen');
      setTimeout(() => {
        router.push('/admin/produkty');
      }, 1500);
    } catch (err) {
      setError('Chyba při vytváření produktu');
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nový Produkt</h1>
        <Link
          href="/admin/produkty"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          ← Zpět
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Název produktu *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="např. Nebarvené panenské vlasy Standard - Hnědá"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              >
                <option value="nebarvene_panenske">Nebarvené panenské</option>
                <option value="barvene_blond">Barvené blond</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Třída (Tier) *
              </label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
              >
                <option value="Standard">Standard</option>
                <option value="LUXE">LUXE</option>
                <option value="Platinum edition">Platinum edition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cena za 100g (45cm) v Kč *
            </label>
            <input
              type="number"
              name="base_price_per_100g_45cm"
              value={formData.base_price_per_100g_45cm}
              onChange={handleInputChange}
              placeholder="6900"
              step="100"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Základní cena pro výpočet - cena se bude přepočítávat podle výběru délky a váhy
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-burgundy text-white px-6 py-3 rounded-lg font-medium hover:bg-maroon transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Ukládání...' : 'Vytvořit produkt'}
            </button>
            <Link
              href="/admin/produkty"
              className="flex-1 text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Zrušit
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Tipy:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Standard:</strong> Výchozí cena 6900 Kč za 100g (45cm)</li>
            <li>• <strong>LUXE:</strong> Vyšší kvalita, cena 8900 Kč za 100g (45cm)</li>
            <li>• <strong>Platinum edition:</strong> Premium kvalita, cena 10900 Kč za 100g (45cm)</li>
            <li>• Cena se automaticky přepočítá podle délky a váhy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
