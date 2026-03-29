'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface LowStockSku {
  id: string;
  sku: string;
  name: string | null;
  availableGrams: number | null;
  inStock: boolean;
  saleMode: string;
}

interface B2bMonthStats {
  totalPayments: number;
  totalSales: number;
  total: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockSkus, setLowStockSkus] = useState<LowStockSku[]>([]);
  const [loading, setLoading] = useState(true);
  const [b2bStats, setB2bStats] = useState<B2bMonthStats | null>(null);
  const [monthlyOrders, setMonthlyOrders] = useState<Order[]>([]);

  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, skusRes, b2bStatsRes, monthlyOrdersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/skus'),
          fetch(`/api/admin/b2b/stats?month=${currentMonth}`),
          fetch(`/api/admin/orders?month=${currentMonth}&limit=100`),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const ordersList = ordersData.orders || ordersData;
          setOrders(ordersList);
        }

        if (skusRes.ok) {
          const skusData = await skusRes.json();
          const lowStock = skusData.filter((sku: any) => {
            if (!sku.inStock) return true;
            if (sku.saleMode === 'BULK_G' && sku.availableGrams !== null) {
              return sku.availableGrams < 100;
            }
            return false;
          });
          setLowStockSkus(lowStock);
        }

        if (b2bStatsRes.ok) {
          const b2bData = await b2bStatsRes.json();
          setB2bStats(b2bData);
        }

        if (monthlyOrdersRes.ok) {
          const monthlyData = await monthlyOrdersRes.json();
          setMonthlyOrders(monthlyData.orders || monthlyData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter((o: Order) => o.orderStatus === 'pending').length;
  const paidOrders = orders.filter((o: Order) => o.paymentStatus === 'paid').length;

  const formatCzech = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: cs });
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700',
      unpaid: 'bg-red-100 text-red-700',
      paid: 'bg-emerald-100 text-emerald-700',
      partial: 'bg-amber-100 text-amber-700',
    };

    const labels: Record<string, string> = {
      pending: 'Čeká',
      processing: 'Zpracovává se',
      completed: 'Dokončeno',
      cancelled: 'Zrušeno',
      unpaid: 'Nezaplaceno',
      paid: 'Zaplaceno',
      partial: 'Částečně',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-stone-200 rounded w-20 mb-3"></div>
              <div className="h-8 bg-stone-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 font-medium">Produkty</p>
              <p className="text-3xl font-bold text-stone-800 mt-1">{totalProducts}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <Link href="/admin/sklad" className="text-sm text-[#722F37] font-medium mt-3 inline-block hover:underline">
            Zobrazit sklad →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 font-medium">Objednávky</p>
              <p className="text-3xl font-bold text-stone-800 mt-1">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm text-amber-600 font-medium">{pendingOrders} čeká</span>
            <span className="text-sm text-emerald-600 font-medium">{paidOrders} zaplaceno</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 font-medium">Tržby</p>
              <p className="text-3xl font-bold text-stone-800 mt-1">
                {totalRevenue.toLocaleString('cs-CZ')}
                <span className="text-lg text-stone-400 ml-1">Kč</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-stone-400 mt-3">Celkem z objednávek</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 font-medium">Nízký stav</p>
              <p className="text-3xl font-bold text-stone-800 mt-1">{lowStockSkus.length}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockSkus.length > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <span className="text-2xl">{lowStockSkus.length > 0 ? '⚠️' : '✅'}</span>
            </div>
          </div>
          {lowStockSkus.length > 0 ? (
            <Link href="/admin/sklad" className="text-sm text-amber-600 font-medium mt-3 inline-block hover:underline">
              Zkontrolovat →
            </Link>
          ) : (
            <p className="text-sm text-emerald-600 mt-3">Vše skladem</p>
          )}
        </div>
      </div>

      {/* Monthly Revenue Summary */}
      {(b2bStats || monthlyOrders.length > 0) && (() => {
        const monthlyRetailRevenue = monthlyOrders.reduce((sum: number, o: Order) => sum + (o.total || 0), 0);
        const monthlyB2bPayments = b2bStats?.totalPayments || 0;
        const monthlyB2bSales = b2bStats?.totalSales || 0;
        const monthlyTotal = monthlyRetailRevenue + monthlyB2bPayments + monthlyB2bSales;
        const monthLabel = new Date(currentMonth + '-01').toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-stone-800">Tržby tento měsíc</h2>
              <span className="text-sm text-stone-400 capitalize">{monthLabel}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <p className="text-xs text-stone-500 font-medium">Retail (objednávky)</p>
                <p className="text-xl font-bold text-stone-800 mt-1">
                  {monthlyRetailRevenue.toLocaleString('cs-CZ')}
                  <span className="text-sm text-stone-400 ml-1">Kč</span>
                </p>
                <p className="text-xs text-stone-400 mt-1">{monthlyOrders.length} objednávek</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <p className="text-xs text-stone-500 font-medium">B2B přijaté platby</p>
                <p className="text-xl font-bold text-stone-800 mt-1">
                  {monthlyB2bPayments.toLocaleString('cs-CZ')}
                  <span className="text-sm text-stone-400 ml-1">Kč</span>
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <p className="text-xs text-stone-500 font-medium">B2B komise (prodeje)</p>
                <p className="text-xl font-bold text-stone-800 mt-1">
                  {monthlyB2bSales.toLocaleString('cs-CZ')}
                  <span className="text-sm text-stone-400 ml-1">Kč</span>
                </p>
              </div>
              <div className="bg-[#722F37]/5 rounded-xl p-4 border border-[#722F37]/20">
                <p className="text-xs text-stone-500 font-medium">Celkem</p>
                <p className="text-xl font-bold text-[#722F37] mt-1">
                  {monthlyTotal.toLocaleString('cs-CZ')}
                  <span className="text-sm text-[#722F37]/60 ml-1">Kč</span>
                </p>
                <Link href="/admin/b2b" className="text-xs text-[#722F37] font-medium mt-1 inline-block hover:underline">
                  B2B přehled →
                </Link>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Low Stock Alert */}
      {lowStockSkus.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">
                Nízký stav skladu ({lowStockSkus.length} SKU)
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {lowStockSkus.slice(0, 5).map((sku) => (
                  <span key={sku.id} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-sm">
                    <span className="font-mono font-medium">{sku.sku}</span>
                    {sku.availableGrams !== null && (
                      <span className="ml-1.5 text-amber-600">({sku.availableGrams}g)</span>
                    )}
                  </span>
                ))}
                {lowStockSkus.length > 5 && (
                  <span className="text-sm text-amber-600">+{lowStockSkus.length - 5} dalších</span>
                )}
              </div>
              <Link href="/admin/sklad" className="text-sm text-amber-700 font-medium mt-3 inline-block hover:underline">
                Spravovat sklad →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/prodeje/novy', icon: '🛒', label: 'Nový prodej', color: 'bg-emerald-50 text-emerald-700' },
          { href: '/admin/konfigurator-sku', icon: '📥', label: 'Naskladnit', color: 'bg-purple-50 text-purple-700' },
          { href: '/admin/objednavky', icon: '📋', label: 'Objednávky', color: 'bg-blue-50 text-blue-700' },
          { href: '/admin/reporty', icon: '📈', label: 'Reporty', color: 'bg-amber-50 text-amber-700' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} rounded-2xl p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">Poslední objednávky</h2>
          <Link href="/admin/objednavky" className="text-sm text-[#722F37] font-medium hover:underline">
            Zobrazit vše →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <span className="text-4xl block mb-3">📭</span>
            <p>Zatím žádné objednávky</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/admin/objednavky/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-medium">
                    {(order.firstName?.[0] || order.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">
                      {order.firstName && order.lastName
                        ? `${order.firstName} ${order.lastName}`
                        : order.email}
                    </p>
                    <p className="text-sm text-stone-400">{formatCzech(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-stone-800">{order.total.toLocaleString('cs-CZ')} Kč</p>
                    <div className="flex gap-2 mt-1">
                      {getStatusBadge(order.orderStatus, 'order')}
                      {getStatusBadge(order.paymentStatus, 'payment')}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
