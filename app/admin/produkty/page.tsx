import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  // Fetch products from database
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Správa Produktů</h1>
        <Link
          href="/admin/produkty/new"
          className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-maroon transition"
        >
          + Přidat produkt
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Název
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Cena/100g 45cm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Varianty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                  Zatím nejsou žádné produkty
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      {product.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.base_price_per_100g_45cm.toLocaleString('cs-CZ')} Kč
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.variants.length}</td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <Link
                      href={`/admin/produkty/${product.id}/edit`}
                      className="text-burgundy hover:text-maroon font-medium"
                    >
                      Upravit
                    </Link>
                    <button
                      disabled
                      className="text-red-600 hover:text-red-800 font-medium opacity-50 cursor-not-allowed"
                      title="Brzy bude implementováno"
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Celkový počet produktů</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Celkový počet variant</p>
          <p className="text-2xl font-bold text-gray-900">
            {products.reduce((sum, p) => sum + p.variants.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Kategorie</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
