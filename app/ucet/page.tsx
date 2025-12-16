'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  streetAddress: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  isWholesale: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  total: number;
  createdAt: string;
  trackingNumber: string | null;
  carrier: string | null;
}

export default function UcetPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.user) {
        router.push('/auth/login?redirect=/ucet');
        return;
      }

      setUser(data.user);
      await fetchOrders(data.user.email);
    } catch (error) {
      console.error('Error checking session:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (email: string) => {
    try {
      const response = await fetch(`/api/orders/lookup?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Čeká na zpracování',
      processing: 'Zpracovává se',
      shipped: 'Odesláno',
      delivered: 'Doručeno',
      cancelled: 'Zrušeno',
      paid: 'Zaplaceno',
      unpaid: 'Nezaplaceno',
      refunded: 'Vráceno',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-gray-600">Načítání...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Můj účet
        </h1>
        <p className="text-gray-600">
          Vítejte, {user.firstName || user.email}
          {user.isWholesale && (
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              Velkoobchod
            </span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-burgundy text-burgundy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Moje objednávky ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-burgundy text-burgundy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Profil a nastavení
          </button>
        </nav>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Zatím nemáte žádné objednávky</p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-2 bg-burgundy text-white rounded-lg hover:bg-maroon transition"
              >
                Začít nakupovat
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Objednávka č. {order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('cs-CZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {order.total.toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {getStatusText(order.paymentStatus)}
                    </span>
                    {order.deliveryStatus && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.deliveryStatus
                        )}`}
                      >
                        {getStatusText(order.deliveryStatus)}
                      </span>
                    )}
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Číslo zásilky:</span>{' '}
                        {order.trackingNumber}
                      </p>
                      {order.carrier && (
                        <p className="text-xs text-blue-700 mt-1">
                          Dopravce: {order.carrier}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Detail objednávky
                    </Link>
                    {order.trackingNumber && (
                      <Link
                        href={`/sledovani-objednavky?id=${order.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                      >
                        Sledovat zásilku
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Osobní údaje</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.firstName && (
                <div>
                  <p className="text-sm text-gray-500">Jméno</p>
                  <p className="text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}
              {user.phone && (
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}
              {user.streetAddress && (
                <div>
                  <p className="text-sm text-gray-500">Adresa</p>
                  <p className="text-gray-900">
                    {user.streetAddress}
                    <br />
                    {user.zipCode} {user.city}
                    {user.country && <>, {user.country}</>}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informace o účtu</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">Typ účtu</p>
                <p className="text-gray-900">
                  {user.isWholesale ? 'Velkoobchod' : 'Běžný zákazník'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Účet vytvořen</p>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('cs-CZ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Celkový počet objednávek</p>
                <p className="text-gray-900">{orders.length}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/velkoobchod"
                className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition"
              >
                {user.isWholesale
                  ? 'Velkoobchodní podmínky'
                  : 'Požádat o velkoobchod'}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Odhlásit se
              </button>
            </div>
          </div>

          {/* GDPR Section */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Ochrana osobních údajů (GDPR)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Stáhnout moje data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Získejte kompletní export všech vašich osobních údajů a historie
                  objednávek.
                </p>
                <button
                  onClick={async () => {
                    const response = await fetch('/api/gdpr/export', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: user.email }),
                    });
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `gdpr-export-${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Exportovat data
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Smazat můj účet</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Požádat o smazání účtu a osobních údajů (objednávky mladší 7 let
                  budou anonymizovány).
                </p>
                <Link
                  href="/ochrana-osobnich-udaju#gdpr-delete"
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Požádat o smazání
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
