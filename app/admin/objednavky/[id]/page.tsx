'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variant: string;
}

interface Order {
  id: string;
  email: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          setError('Objednávka nebyla nalezena');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Chyba při načítání objednávky');
        console.error(err);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na platbu';
      case 'paid':
        return 'Zaplaceno';
      case 'shipped':
        return 'Odesláno';
      case 'delivered':
        return 'Doručeno';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Načítám...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800">
          ← Zpět na objednávky
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/objednavky" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Zpět na objednávky
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detaily objednávky</h1>
            <p className="text-gray-600 mt-2">ID: {order.id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Informace o objednávce</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg font-medium text-gray-900">{order.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Datum vytvoření</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Počet položek</p>
            <p className="text-lg font-medium text-gray-900">{order.items.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Celková cena</p>
            <p className="text-lg font-medium text-gray-900">{order.total.toLocaleString('cs-CZ')} Kč</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Položky v objednávce</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produkt</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Varianta</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Počet</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cena</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Celkem</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.productId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.variant}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.price.toLocaleString('cs-CZ')} Kč</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/objednavky/${order.id}/edit`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Upravit objednávku
        </Link>
        <Link
          href="/admin/objednavky"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Zpět
        </Link>
      </div>
    </div>
  );
}
