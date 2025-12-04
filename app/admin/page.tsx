'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Order {
  id: string;
  email: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/orders'),
        ]);
        
        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        
        // Handle new orders format (with pagination)
        const ordersList = ordersData.orders || ordersData;
        setProducts(productsData);
        setOrders(ordersList);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter((o: Order) => o.orderStatus === 'pending').length;

  const formatCzech = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: cs });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na zpracování';
      case 'processing':
        return 'Zpracovává se';
      case 'completed':
        return 'Dokončeno';
      case 'cancelled':
        return 'Zrušeno';
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'Nezaplaceno';
      case 'paid':
        return 'Zaplaceno';
      case 'partial':
        return 'Částečně zaplaceno';
      case 'refunded':
        return 'Vráceno';
      default:
        return status;
    }
  };

  const getDeliveryStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na odeslání';
      case 'shipped':
        return 'Odesláno';
      case 'delivered':
        return 'Doručeno';
      case 'cancelled':
        return 'Zrušeno';
      default:
        return status;
    }
  };

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
              <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Objednávky</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Příjmy (Kč)</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalRevenue.toLocaleString('cs-CZ')}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Čeká zpracování</p>
              <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Cena
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Objednávka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Platba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                    Zatím nejsou žádné objednávky
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.total.toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getOrderStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatCzech(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
