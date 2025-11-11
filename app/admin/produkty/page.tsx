'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-products';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Opravdu chcete smazat tento produkt?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Správa Produktů</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Přidat produkt
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Hledat produkty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Název</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cena/100g</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Varianty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Akce</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {product.tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.base_price_per_100g_45cm.toLocaleString('cs-CZ')} Kč
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.variants.length}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex">
                  <Link
                    href={`/admin/produkty/${product.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Upravit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Žádné produkty se nezakládají kritériům vyhledávání.</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Přidat nový produkt</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Název produktu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Vyberte tier</option>
                <option>Standard</option>
                <option>LUXE</option>
                <option>Platinum edition</option>
              </select>
              <input
                type="number"
                placeholder="Cena za 100g"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Zrušit
                </button>
                <button
                  onClick={() => {
                    // Zde by byla logika na přidání produktu
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Přidat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
