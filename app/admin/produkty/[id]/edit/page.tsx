'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  tier: string;
  base_price_per_100g_45cm: number;
  category: string;
  set_id?: string;
  variants: any[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tier: '',
    base_price_per_100g_45cm: 0,
  });

  useEffect(() => {
    // Fetch product from API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          setError('Produkt nebyl nalezen');
          setLoading(false);
          return;
        }

        const foundProduct = await response.json();
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          tier: foundProduct.tier,
          base_price_per_100g_45cm: foundProduct.base_price_per_100g_45cm,
        });
        setLoading(false);
      } catch (err) {
        setError('Chyba při načítání produktu');
        console.error(err);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Chyba při ukládání produktu');
        setSaving(false);
        return;
      }

      setSuccess('Produkt byl úspěšně aktualizován');
      setTimeout(() => {
        router.push('/admin/produkty');
      }, 1500);
    } catch (err) {
      setError('Chyba při ukládání produktu');
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Načítání...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
        <Link href="/admin/produkty" className="text-blue-600 hover:text-blue-800">
          ← Zpět na produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/produkty" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Zpět na produkty
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Upravit Produkt</h1>
        <p className="text-gray-600 mt-2">{product.name}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Název produktu</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
        </div>

        {/* Tier Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
          <select
            name="tier"
            value={formData.tier}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          >
            <option value="">Vyberte tier</option>
            <option value="Standard">Standard</option>
            <option value="LUXE">LUXE</option>
            <option value="Platinum edition">Platinum edition</option>
          </select>
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cena za 100g (45cm)</label>
          <input
            type="number"
            name="base_price_per_100g_45cm"
            value={formData.base_price_per_100g_45cm}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-1">V Kč</p>
        </div>

        {/* Product Info Display */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informace o produktu</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID produktu</p>
              <p className="font-medium text-gray-900">{product.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Počet variant</p>
              <p className="font-medium text-gray-900">{product.variants.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Kategorie</p>
              <p className="font-medium text-gray-900">{product.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Sada</p>
              <p className="font-medium text-gray-900">{product.set_id || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Ukládám...' : 'Uložit změny'}
          </button>
          <Link
            href="/admin/produkty"
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-center"
          >
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  );
}
