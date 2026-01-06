'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StockMovement {
  id: string;
  grams: number;
  location: string | null;
  batchNumber: string | null;
  costPerGramCzk: number | null;
  note: string | null;
  performedBy: string | null;
  createdAt: string;
  soldAt: string | null;
  soldBy: string | null;
}

interface SkuData {
  id: string;
  sku: string;
  name: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  availableGrams: number | null;
}

export default function SkuQRCodesPage() {
  const params = useParams();
  const router = useRouter();
  const skuId = params.skuId as string;

  const [sku, setSku] = useState<SkuData | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [skuId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch SKU details and stock movements
      const response = await fetch(`/api/admin/stock/movements?skuId=${skuId}&type=IN&includeUnsold=true`);
      const data = await response.json();

      if (response.ok) {
        setSku(data.sku);
        setMovements(data.movements);
      } else {
        setError(data.error || 'Chyba při načítání dat');
      }
    } catch (err) {
      setError('Chyba při komunikaci se serverem');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Načítám...</div>
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error || 'SKU nenalezeno'}
        </div>
        <Link href="/admin/sklad" className="text-blue-600 hover:underline">
          ← Zpět na seznam SKU
        </Link>
      </div>
    );
  }

  const unsoldMovements = movements.filter(m => !m.soldAt);
  const soldMovements = movements.filter(m => m.soldAt);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/sklad" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Zpět na seznam SKU
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">QR kódy pro SKU</h1>
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">SKU</p>
              <p className="font-medium">{sku.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Název</p>
              <p className="font-medium">{sku.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Odstín</p>
              <p className="font-medium">{sku.shadeName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aktuální sklad</p>
              <p className="font-medium">{sku.availableGrams}g</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-700 font-medium">Na skladě (k prodeji)</p>
          <p className="text-2xl font-bold text-green-900">{unsoldMovements.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <p className="text-sm text-gray-700 font-medium">Již prodáno</p>
          <p className="text-2xl font-bold text-gray-900">{soldMovements.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-700 font-medium">Celkem naskladněno</p>
          <p className="text-2xl font-bold text-blue-900">{movements.length}</p>
        </div>
      </div>

      {/* Unsold Items (Available for Sale) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Na skladě ({unsoldMovements.length})
        </h2>

        {unsoldMovements.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Žádné neprodané položky na skladě
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unsoldMovements.map((movement) => (
              <div key={movement.id} className="bg-white rounded-lg shadow p-6 border-2 border-green-200">
                {/* QR Code */}
                <div className="text-center mb-4">
                  <img
                    src={`/api/admin/stock/qr-code/${movement.id}`}
                    alt="QR kód"
                    className="inline-block w-48 h-48 border-2 border-gray-300 rounded-lg"
                  />
                </div>

                {/* Movement Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Množství</span>
                    <span className="font-bold text-green-600">{movement.grams}g</span>
                  </div>

                  {movement.location && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Lokace</span>
                      <span className="font-medium">📍 {movement.location}</span>
                    </div>
                  )}

                  {movement.batchNumber && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Šarže</span>
                      <span className="font-medium">📦 {movement.batchNumber}</span>
                    </div>
                  )}

                  {movement.costPerGramCzk && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Náklady</span>
                      <span className="font-medium">{movement.costPerGramCzk} Kč/g</span>
                    </div>
                  )}

                  {movement.performedBy && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Naskladnil</span>
                      <span className="font-medium">👤 {movement.performedBy}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Naskladněno</span>
                    <span className="text-xs">
                      {new Date(movement.createdAt).toLocaleString('cs-CZ')}
                    </span>
                  </div>

                  {movement.note && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 italic">{movement.note}</p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <a
                  href={`/api/admin/stock/qr-code/${movement.id}`}
                  download
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Stáhnout QR kód
                </a>

                {/* Movement ID */}
                <p className="text-xs text-gray-500 text-center mt-2">ID: {movement.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sold Items */}
      {soldMovements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prodáno ({soldMovements.length})
          </h2>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Množství</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokace</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Šarže</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Naskladněno</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prodáno</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prodal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {soldMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{movement.grams}g</td>
                    <td className="px-4 py-3 text-sm">{movement.location || '-'}</td>
                    <td className="px-4 py-3 text-sm">{movement.batchNumber || '-'}</td>
                    <td className="px-4 py-3 text-sm text-xs">
                      {new Date(movement.createdAt).toLocaleString('cs-CZ')}
                    </td>
                    <td className="px-4 py-3 text-sm text-xs">
                      {movement.soldAt ? new Date(movement.soldAt).toLocaleString('cs-CZ') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">{movement.soldBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {movements.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Pro toto SKU zatím nebyly naskladněny žádné položky</p>
          <Link
            href="/admin/stock-receive"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Naskladnit zboží
          </Link>
        </div>
      )}
    </div>
  );
}
