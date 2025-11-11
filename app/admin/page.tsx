'use client';

import { useState, useEffect } from 'react';
import { mockProducts } from '@/lib/mock-products';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    // Mock data - v realné aplikaci by to byla data z DB
    setStats({
      totalProducts: mockProducts.length,
      totalOrders: 12,
      totalRevenue: 45600,
      pendingOrders: 3,
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Produkty</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Objednávky</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Příjmy (Kč)</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('cs-CZ')}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Čeká zpracování</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Poslední objednávky</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Zákazník</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cena</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Datum</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">#1001</td>
                <td className="px-6 py-4 text-sm text-gray-900">Jana Nováková</td>
                <td className="px-6 py-4 text-sm text-gray-900">5 200 Kč</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    Čeká
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">11. listopadu 2025</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">#1000</td>
                <td className="px-6 py-4 text-sm text-gray-900">Marie Svobodová</td>
                <td className="px-6 py-4 text-sm text-gray-900">3 800 Kč</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Poslána
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">10. listopadu 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
