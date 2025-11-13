'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  shade: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  structure: string | null;
  saleMode: string;
  pricePerGramCzk: number;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  inStock: boolean;
  soldOut: boolean;
}

export default function SkuListPage() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    shade: '',
    shadeName: '',
    lengthCm: '',
    structure: '',
    saleMode: 'PIECE_BY_WEIGHT',
    pricePerGramCzk: '',
    weightTotalG: '',
    availableGrams: '',
    minOrderG: '',
    stepG: '',
    inStock: false,
  });

  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    try {
      const res = await fetch('/api/admin/skus');
      if (!res.ok) throw new Error('Failed to fetch SKUs');
      const data = await res.json();
      setSkus(data);
    } catch (err) {
      console.error(err);
      alert('Chyba při načítání skladů');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pricePerGramCzk: parseInt(formData.pricePerGramCzk) || 0,
        weightTotalG: formData.weightTotalG ? parseInt(formData.weightTotalG) : null,
        availableGrams: formData.availableGrams ? parseInt(formData.availableGrams) : null,
        minOrderG: formData.minOrderG ? parseInt(formData.minOrderG) : null,
        stepG: formData.stepG ? parseInt(formData.stepG) : null,
        lengthCm: formData.lengthCm ? parseInt(formData.lengthCm) : null,
      };

      const res = await fetch('/api/admin/skus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create SKU');
      }

      alert('SKU vytvořeno!');
      setFormData({
        sku: '',
        name: '',
        shade: '',
        shadeName: '',
        lengthCm: '',
        structure: '',
        saleMode: 'PIECE_BY_WEIGHT',
        pricePerGramCzk: '',
        weightTotalG: '',
        availableGrams: '',
        minOrderG: '',
        stepG: '',
        inStock: false,
      });
      setShowForm(false);
      fetchSkus();
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Načítám...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sklad (SKU)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Zrušit' : '+ Nový SKU'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4">
          <input
            type="text"
            name="sku"
            placeholder="SKU (kód)"
            value={formData.sku}
            onChange={handleInputChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="name"
            placeholder="Název"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="shade"
            placeholder="Odstín (ID)"
            value={formData.shade}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="shadeName"
            placeholder="Jméno odstínu"
            value={formData.shadeName}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            name="lengthCm"
            placeholder="Délka (cm)"
            value={formData.lengthCm}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          />
          <select
            name="structure"
            value={formData.structure}
            onChange={handleInputChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Struktura</option>
            <option value="rovné">rovné</option>
            <option value="vlna">vlna</option>
            <option value="kudrna">kudrna</option>
          </select>

          <select
            name="saleMode"
            value={formData.saleMode}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 col-span-2"
          >
            <option value="PIECE_BY_WEIGHT">Culík (pevná váha)</option>
            <option value="BULK_G">Sypané gramy</option>
          </select>

          <input
            type="number"
            name="pricePerGramCzk"
            placeholder="Cena za 1g (Kč)"
            value={formData.pricePerGramCzk}
            onChange={handleInputChange}
            required
            className="border rounded px-3 py-2"
          />

          {formData.saleMode === 'PIECE_BY_WEIGHT' && (
            <input
              type="number"
              name="weightTotalG"
              placeholder="Váha culičku (g)"
              value={formData.weightTotalG}
              onChange={handleInputChange}
              className="border rounded px-3 py-2"
            />
          )}

          {formData.saleMode === 'BULK_G' && (
            <>
              <input
                type="number"
                name="availableGrams"
                placeholder="Dostupné gramy"
                value={formData.availableGrams}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                name="minOrderG"
                placeholder="Min. objednávka (g)"
                value={formData.minOrderG}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                name="stepG"
                placeholder="Krok (g)"
                value={formData.stepG}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
              />
            </>
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            Na skladě
          </label>

          <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Vytvořit SKU
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Název</th>
              <th className="px-4 py-2 text-left">Odstín</th>
              <th className="px-4 py-2 text-left">Délka</th>
              <th className="px-4 py-2 text-left">Cena/g</th>
              <th className="px-4 py-2 text-left">Typ</th>
              <th className="px-4 py-2 text-left">Stav</th>
              <th className="px-4 py-2 text-left">Skladové info</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((sku) => (
              <tr key={sku.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{sku.sku}</td>
                <td className="px-4 py-2">{sku.name || '-'}</td>
                <td className="px-4 py-2">{sku.shadeName || sku.shade || '-'}</td>
                <td className="px-4 py-2">{sku.lengthCm ? `${sku.lengthCm} cm` : '-'}</td>
                <td className="px-4 py-2">{sku.pricePerGramCzk} Kč</td>
                <td className="px-4 py-2 text-xs">
                  <span className={`px-2 py-1 rounded ${sku.saleMode === 'PIECE_BY_WEIGHT' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {sku.saleMode === 'PIECE_BY_WEIGHT' ? 'Culík' : 'Gramy'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {sku.soldOut ? (
                    <span className="text-red-600 font-bold">Vyprodáno</span>
                  ) : sku.inStock ? (
                    <span className="text-green-600 font-bold">Skladem</span>
                  ) : (
                    <span className="text-gray-500">Vyprodáno</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  {sku.saleMode === 'PIECE_BY_WEIGHT' ? (
                    <span>{sku.weightTotalG}g</span>
                  ) : (
                    <span>{sku.availableGrams}g ({sku.minOrderG}g min, {sku.stepG}g krok)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {skus.length === 0 && (
        <div className="text-center py-8 text-gray-500">Zatím žádné SKU. Přidej první!</div>
      )}

      <Link href="/admin" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
        ← Zpět na admin
      </Link>
    </div>
  );
}
