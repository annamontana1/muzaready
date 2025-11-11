'use client';

import { useState } from 'react';

export default function AdminOrdersPage() {
  const [orders] = useState([
    {
      id: '1001',
      customer: 'Jana Nováková',
      email: 'jana@example.com',
      total: 5200,
      status: 'pending',
      date: '2025-11-11',
      items: 3,
    },
    {
      id: '1000',
      customer: 'Marie Svobodová',
      email: 'marie@example.com',
      total: 3800,
      status: 'shipped',
      date: '2025-11-10',
      items: 2,
    },
    {
      id: '999',
      customer: 'Pavel Horák',
      email: 'pavel@example.com',
      total: 7500,
      status: 'delivered',
      date: '2025-11-08',
      items: 5,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká';
      case 'shipped':
        return 'Poslána';
      case 'delivered':
        return 'Doručena';
      case 'cancelled':
        return 'Zrušena';
      default:
        return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Správa Objednávek</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Zákazník</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Položky</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cena</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Akce</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {order.total.toLocaleString('cs-CZ')} Kč
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString('cs-CZ')}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Detaily
                  </button>
                  <button className="text-green-600 hover:text-green-800 font-medium">
                    Upravit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Celkový příjem</p>
          <p className="text-2xl font-bold text-gray-900">
            {(5200 + 3800 + 7500).toLocaleString('cs-CZ')} Kč
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Čekající objednávky</p>
          <p className="text-2xl font-bold text-orange-600">1</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Poslané objednávky</p>
          <p className="text-2xl font-bold text-blue-600">1</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Doručené objednávky</p>
          <p className="text-2xl font-bold text-green-600">1</p>
        </div>
      </div>
    </div>
  );
}
