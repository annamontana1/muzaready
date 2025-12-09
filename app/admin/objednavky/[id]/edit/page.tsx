'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  email: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    orderStatus: '',
    paymentStatus: '',
    deliveryStatus: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) {
          setError('Objednávka nebyla nalezena');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrder(data);
        setFormData({
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
          deliveryStatus: data.deliveryStatus,
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Chyba při aktualizaci objednávky');
        setSaving(false);
        return;
      }

      setSuccess('Objednávka byla úspěšně aktualizována');
      setTimeout(() => {
        router.push(`/admin/objednavky/${orderId}`);
      }, 1500);
    } catch (err) {
      setError('Chyba při aktualizaci objednávky');
      console.error(err);
      setSaving(false);
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
        <Link href={`/admin/objednavky/${orderId}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Zpět na detaily
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Upravit objednávku</h1>
        <p className="text-gray-600 mt-2">ID: {order.id}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Order Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status objednávky</label>
          <select
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleChange}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Čeká na platbu</option>
            <option value="paid">Zaplaceno</option>
            <option value="processing">Zpracovává se</option>
            <option value="shipped">Odesláno</option>
            <option value="completed">Dokončeno</option>
          </select>
        </div>

        {/* Payment Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stav platby</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="unpaid">Nezaplaceno</option>
            <option value="partial">Částečně</option>
            <option value="paid">Zaplaceno</option>
            <option value="refunded">Vráceno</option>
          </select>
        </div>

        {/* Delivery Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stav doručení</label>
          <select
            name="deliveryStatus"
            value={formData.deliveryStatus}
            onChange={handleChange}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Čeká</option>
            <option value="shipped">Odesláno</option>
            <option value="delivered">Doručeno</option>
            <option value="returned">Vráceno</option>
          </select>
        </div>

        {/* Order Info Display */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informace o objednávce</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{order.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Celková cena</p>
              <p className="font-medium text-gray-900">{order.total.toLocaleString('cs-CZ')} Kč</p>
            </div>
            <div>
              <p className="text-gray-600">Počet položek</p>
              <p className="font-medium text-gray-900">{order.items.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Datum vytvoření</p>
              <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('cs-CZ')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Ukládám...' : 'Uložit změny'}
          </button>
          <Link
            href={`/admin/objednavky/${orderId}`}
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-center"
          >
            Zrušit
          </Link>
        </div>
      </form>
    </div>
  );
}
