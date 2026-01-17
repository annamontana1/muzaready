'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CleanupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const deleteTestOrders = async () => {
    if (!confirm('Opravdu chceš smazat VŠECHNY testovací objednávky? Tato akce je nevratná!')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/orders/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteTestOrders: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`Smazáno ${data.deleted} objednávek: ${data.deletedOrders?.join(', ') || 'žádné'}`);
      } else {
        setResult(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setResult('Chyba při komunikaci se serverem');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllSkus = async () => {
    if (!confirm('Opravdu chceš smazat VŠECHNY produkty (SKU) bez objednávek? Tato akce je nevratná!')) {
      return;
    }

    if (!confirm('POZOR: Toto smaže všechny produkty! Jsi si jistý/á?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/skus/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`Smazáno ${data.deleted} SKU`);
      } else {
        setResult(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setResult('Chyba při komunikaci se serverem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Zpět na dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vyčištění testovacích dat</h1>

      {result && (
        <div className={`p-4 rounded-lg mb-6 ${result.includes('Chyba') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {result}
        </div>
      )}

      <div className="space-y-6">
        {/* Delete Test Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Smazat testovací objednávky</h2>
          <p className="text-gray-600 mb-4">
            Smaže všechny objednávky od zákazníků obsahujících "Test" ve jméně nebo "test" v emailu.
          </p>
          <button
            onClick={deleteTestOrders}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Mažu...' : 'Smazat testovací objednávky'}
          </button>
        </div>

        {/* Delete All SKUs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Smazat všechny produkty (SKU)</h2>
          <p className="text-gray-600 mb-4">
            Smaže všechny SKU které nemají žádné objednávky. Spusť NEJDŘÍVE krok 1!
          </p>
          <button
            onClick={deleteAllSkus}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Mažu...' : 'Smazat všechny SKU'}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Tip:</strong> Po vyčištění refreshni dashboard pro aktualizaci počtů.
        </p>
      </div>
    </div>
  );
}
