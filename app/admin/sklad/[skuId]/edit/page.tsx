'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminShadePicker from '@/components/admin/AdminShadePicker';

interface SkuData {
  id: string;
  sku: string;
  shortCode: string | null;
  name: string | null;
  imageUrl: string | null;
  shade: string | null;
  shadeName: string | null;
  shadeHex: string | null;
  lengthCm: number | null;
  structure: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  saleMode: string;
  pricePerGramCzk: number | null;
  pricePerGramEur: number | null;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  inStock: boolean;
  isListed: boolean;
  listingPriority: number | null;
  soldOut: boolean;
}

export default function SkuEditPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.skuId as string;

  const [sku, setSku] = useState<SkuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    shade: '',
    shadeName: '',
    shadeHex: '',
    lengthCm: '',
    structure: '',
    customerCategory: 'STANDARD',
    pricePerGramCzk: '',
    pricePerGramEur: '',
    weightTotalG: '',
    availableGrams: '',
    minOrderG: '',
    stepG: '',
    inStock: false,
    isListed: false,
    listingPriority: '',
    soldOut: false,
  });

  useEffect(() => {
    fetchSku();
  }, [skuId]);

  const fetchSku = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/skus/${skuId}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Chyba pri nacitani SKU');
        return;
      }

      setSku(data);
      setFormData({
        name: data.name || '',
        imageUrl: data.imageUrl || '',
        shade: data.shade || '',
        shadeName: data.shadeName || '',
        shadeHex: data.shadeHex || '',
        lengthCm: data.lengthCm?.toString() || '',
        structure: data.structure || '',
        customerCategory: data.customerCategory || 'STANDARD',
        pricePerGramCzk: data.pricePerGramCzk?.toString() || '',
        pricePerGramEur: data.pricePerGramEur?.toString() || '',
        weightTotalG: data.weightTotalG?.toString() || '',
        availableGrams: data.availableGrams?.toString() || '',
        minOrderG: data.minOrderG?.toString() || '',
        stepG: data.stepG?.toString() || '',
        inStock: data.inStock || false,
        isListed: data.isListed || false,
        listingPriority: data.listingPriority?.toString() || '',
        soldOut: data.soldOut || false,
      });
    } catch (err) {
      setError('Chyba pri komunikaci se serverem');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name || null,
        imageUrl: formData.imageUrl || null,
        shade: formData.shade || null,
        shadeName: formData.shadeName || null,
        shadeHex: formData.shadeHex || null,
        lengthCm: formData.lengthCm ? parseInt(formData.lengthCm) : null,
        structure: formData.structure || null,
        customerCategory: formData.customerCategory,
        pricePerGramCzk: formData.pricePerGramCzk ? parseFloat(formData.pricePerGramCzk) : null,
        pricePerGramEur: formData.pricePerGramEur ? parseFloat(formData.pricePerGramEur) : null,
        weightTotalG: formData.weightTotalG ? parseInt(formData.weightTotalG) : null,
        availableGrams: formData.availableGrams ? parseInt(formData.availableGrams) : null,
        minOrderG: formData.minOrderG ? parseInt(formData.minOrderG) : null,
        stepG: formData.stepG ? parseInt(formData.stepG) : null,
        inStock: formData.inStock,
        isListed: formData.isListed,
        listingPriority: formData.listingPriority ? parseInt(formData.listingPriority) : null,
        soldOut: formData.soldOut,
      };

      const res = await fetch(`/api/admin/skus/${skuId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Chyba pri ukladani');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Nacitam...</div>
      </div>
    );
  }

  if (error && !sku) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">{error}</div>
        <Link href="/admin/sklad" className="text-blue-600 hover:underline">
          ← Zpet na seznam SKU
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/sklad" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Zpet na seznam SKU
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Upravit SKU</h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">{sku?.sku}</span>
          {sku?.shortCode && (
            <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
              {sku.shortCode}
            </span>
          )}
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">Ulozeno!</div>
      )}
      {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Zakladni informace</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazev</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Nazev produktu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                name="customerCategory"
                value={formData.customerCategory}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="LUXE">LUXE</option>
                <option value="PLATINUM_EDITION">PLATINUM EDITION</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotka produktu</label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
              folder="skus"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vlastnosti produktu</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <AdminShadePicker
                selectedShadeCode={formData.shade}
                onSelect={(shade) => {
                  if (shade) {
                    setFormData((prev) => ({
                      ...prev,
                      shade: shade.code,
                      shadeName: shade.name,
                      shadeHex: shade.hex,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      shade: '',
                      shadeName: '',
                      shadeHex: '',
                    }));
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delka (cm)</label>
              <input
                type="number"
                name="lengthCm"
                value={formData.lengthCm}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="45"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Struktura</label>
              <select
                name="structure"
                value={formData.structure}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Vyberte strukturu</option>
                <option value="rovné">rovné</option>
                <option value="mírně vlnité">mírně vlnité</option>
                <option value="vlnité">vlnité</option>
                <option value="kudrnaté">kudrnaté</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ceny</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cena za gram (CZK)</label>
              <input
                type="number"
                step="0.01"
                name="pricePerGramCzk"
                value={formData.pricePerGramCzk}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cena za gram (EUR)</label>
              <input
                type="number"
                step="0.01"
                name="pricePerGramEur"
                value={formData.pricePerGramEur}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="1.00"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sklad</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sku?.saleMode === 'PIECE_BY_WEIGHT' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vaha culicku (g)
                </label>
                <input
                  type="number"
                  name="weightTotalG"
                  value={formData.weightTotalG}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dostupne gramy
                  </label>
                  <input
                    type="number"
                    name="availableGrams"
                    value={formData.availableGrams}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. (g)</label>
                  <input
                    type="number"
                    name="minOrderG"
                    value={formData.minOrderG}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Krok (g)</label>
                  <input
                    type="number"
                    name="stepG"
                    value={formData.stepG}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorita zobrazeni
              </label>
              <input
                type="number"
                name="listingPriority"
                value={formData.listingPriority}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="1-10"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium">Na sklade</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isListed"
                checked={formData.isListed}
                onChange={handleInputChange}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium">Zobrazit v katalogu</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="soldOut"
                checked={formData.soldOut}
                onChange={handleInputChange}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-red-600">Vyprodano</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-between items-center">
          <Link href="/admin/sklad" className="text-gray-600 hover:text-gray-800">
            Zrusit
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
          >
            {saving ? 'Ukladam...' : 'Ulozit zmeny'}
          </button>
        </div>
      </form>
    </div>
  );
}
