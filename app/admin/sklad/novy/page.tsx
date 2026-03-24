'use client';

import Link from 'next/link';
import NewSkuForm from '@/app/admin/konfigurator-sku/NewSkuForm';

export default function NewSkuPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nové SKU</h1>
          <p className="text-gray-500 mt-1">Přidejte novou položku na sklad</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/stock-receive"
            className="px-4 py-2 text-burgundy hover:text-maroon border border-burgundy rounded-lg hover:bg-burgundy/5 transition font-medium"
          >
            📦 Doskladnit existující
          </Link>
          <Link
            href="/admin/sklad"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Zpět na sklad
          </Link>
        </div>
      </div>

      <NewSkuForm />
    </div>
  );
}
