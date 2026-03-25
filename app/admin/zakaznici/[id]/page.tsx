'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CustomerDetail {
  id: string;
  source: 'registered' | 'guest';
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  companyName: string | null;
  businessType: string | null;
  taxId: string | null;
  streetAddress: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  isWholesale: boolean;
  wholesaleRequested?: boolean;
  website?: string | null;
  instagram?: string | null;
  type: 'B2C' | 'B2B';
  status: string | null;
  createdAt: string;
  updatedAt?: string;
  stats: {
    totalSpent: number;
    orderCount: number;
    avgOrder: number;
    firstOrder: string | null;
    lastOrder: string | null;
  };
}

interface OrderItem {
  id: string;
  nameSnapshot: string;
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  saleMode: string;
}

interface Order {
  id: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  channel: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  paymentMethod: string | null;
  deliveryMethod: string | null;
  itemCount: number;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-green-50 text-green-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
  draft: 'bg-stone-100 text-stone-600',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Navrh',
  pending: 'Cekajici',
  paid: 'Zaplaceno',
  processing: 'Zpracovani',
  shipped: 'Odeslano',
  completed: 'Dokonceno',
  cancelled: 'Zruseno',
  unpaid: 'Nezaplaceno',
  partial: 'Castecne',
  refunded: 'Vraceno',
  delivered: 'Doruceno',
  returned: 'Vraceno',
};

const CHANNEL_LABELS: Record<string, string> = {
  web: 'E-shop',
  pos: 'Prodejna',
  ig_dm: 'Instagram',
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setCustomer(data.customer);
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error('Error fetching customer:', err);
      setError(err.message || 'Chyba pri nacitani zakaznika');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (!customer) return;
    setEditData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
      companyName: customer.companyName || '',
      businessType: customer.businessType || '',
      taxId: customer.taxId || '',
      streetAddress: customer.streetAddress || '',
      city: customer.city || '',
      zipCode: customer.zipCode || '',
      country: customer.country || '',
      isWholesale: customer.isWholesale,
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditData({});
  };

  const saveEdits = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Chyba pri ukladani');
      }

      setEditing(false);
      fetchCustomer(); // Refresh data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => `${price.toLocaleString('cs-CZ')} Kc`;
  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('cs-CZ') : '\u2014';
  const formatDateTime = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString('cs-CZ', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '\u2014';

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-24 bg-stone-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-100 space-y-4 animate-pulse">
              <div className="h-6 bg-stone-200 rounded w-40" />
              <div className="h-4 bg-stone-200 rounded w-56" />
              <div className="h-4 bg-stone-200 rounded w-32" />
              <div className="h-4 bg-stone-200 rounded w-48" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-100 animate-pulse">
              <div className="h-6 bg-stone-200 rounded w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-stone-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/zakaznici"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpet na zakazniky
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error || 'Zakaznik nebyl nalezen'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/zakaznici"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Zpet na zakazniky
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-lg font-semibold flex-shrink-0">
            {customer.firstName?.[0]?.toUpperCase() || '?'}
            {customer.lastName?.[0]?.toUpperCase() || ''}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              {customer.firstName} {customer.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-stone-500">{customer.email}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  customer.type === 'B2B'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {customer.type}
              </span>
              {customer.source === 'guest' && (
                <span className="text-xs bg-stone-100 text-stone-400 px-2 py-0.5 rounded">
                  Neregistrovany
                </span>
              )}
              {customer.isWholesale && (
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                  Velkoobchod
                </span>
              )}
            </div>
          </div>
        </div>

        {customer.source === 'registered' && !editing && (
          <button
            onClick={startEditing}
            className="px-4 py-2 text-sm font-medium text-[#722F37] border border-[#722F37]/30 rounded-lg hover:bg-[#722F37]/5 transition-colors"
          >
            Upravit udaje
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
          <p className="text-xs text-stone-400 mb-1">Celkova utrata</p>
          <p className="text-lg font-bold text-stone-800">{formatPrice(customer.stats.totalSpent)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
          <p className="text-xs text-stone-400 mb-1">Pocet objednavek</p>
          <p className="text-lg font-bold text-stone-800">{customer.stats.orderCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
          <p className="text-xs text-stone-400 mb-1">Prumerna objednavka</p>
          <p className="text-lg font-bold text-stone-800">{formatPrice(customer.stats.avgOrder)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
          <p className="text-xs text-stone-400 mb-1">Prvni nakup</p>
          <p className="text-lg font-bold text-stone-800">{formatDate(customer.stats.firstOrder)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-stone-100">
          <p className="text-xs text-stone-400 mb-1">Posledni nakup</p>
          <p className="text-lg font-bold text-stone-800">{formatDate(customer.stats.lastOrder)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer info card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Informace o zakaznikovi</h3>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Jmeno</label>
                    <input
                      type="text"
                      value={editData.firstName || ''}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Prijmeni</label>
                    <input
                      type="text"
                      value={editData.lastName || ''}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Firma</label>
                  <input
                    type="text"
                    value={editData.companyName || ''}
                    onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">ICO</label>
                  <input
                    type="text"
                    value={editData.taxId || ''}
                    onChange={(e) => setEditData({ ...editData, taxId: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Ulice</label>
                  <input
                    type="text"
                    value={editData.streetAddress || ''}
                    onChange={(e) => setEditData({ ...editData, streetAddress: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Mesto</label>
                    <input
                      type="text"
                      value={editData.city || ''}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">PSC</label>
                    <input
                      type="text"
                      value={editData.zipCode || ''}
                      onChange={(e) => setEditData({ ...editData, zipCode: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isWholesale"
                    checked={editData.isWholesale || false}
                    onChange={(e) => setEditData({ ...editData, isWholesale: e.target.checked })}
                    className="w-4 h-4 rounded border-stone-300 text-[#722F37] focus:ring-[#722F37]"
                  />
                  <label htmlFor="isWholesale" className="text-sm text-stone-600">
                    Velkoobchodni zakaznik
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveEdits}
                    disabled={saving}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#722F37] rounded-lg hover:bg-[#5a252c] disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Ukladam...' : 'Ulozit'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Zrusit
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <InfoRow label="Jmeno" value={`${customer.firstName} ${customer.lastName}`} />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Telefon" value={customer.phone} />
                {customer.companyName && <InfoRow label="Firma" value={customer.companyName} />}
                {customer.businessType && <InfoRow label="Typ podnikani" value={customer.businessType} />}
                {customer.taxId && <InfoRow label="ICO" value={customer.taxId} />}
                {(customer.streetAddress || customer.city) && (
                  <InfoRow
                    label="Adresa"
                    value={[customer.streetAddress, `${customer.zipCode || ''} ${customer.city || ''}`.trim(), customer.country]
                      .filter(Boolean)
                      .join(', ')}
                  />
                )}
                {customer.website && <InfoRow label="Web" value={customer.website} />}
                {customer.instagram && <InfoRow label="Instagram" value={customer.instagram} />}
                <InfoRow label="Registrace" value={formatDate(customer.createdAt)} />
                {customer.status && (
                  <InfoRow
                    label="Stav"
                    value={
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : customer.status === 'suspended'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {customer.status === 'active' ? 'Aktivni' : customer.status === 'suspended' ? 'Pozastaveny' : customer.status}
                      </span>
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="px-6 py-4 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-800">
                Historie objednavek ({orders.length})
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="px-6 py-12 text-center text-stone-400 text-sm">
                Zadne objednavky
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Cislo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Polozky
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Celkem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Stav
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Kanal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => router.push(`/admin/objednavky/${order.id}`)}
                        className="hover:bg-stone-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-stone-600">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-3 text-sm font-mono text-stone-700">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-3 text-sm text-stone-500">
                          <div>
                            {order.items.slice(0, 2).map((item, i) => (
                              <div key={item.id} className="truncate max-w-[200px]">
                                {item.nameSnapshot}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-stone-400">
                                +{order.items.length - 2} dalsich
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-stone-700">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[order.orderStatus] || 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-stone-500">
                          {CHANNEL_LABELS[order.channel] || order.channel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start">
      <span className="text-stone-400 flex-shrink-0">{label}</span>
      <span className="text-stone-700 text-right ml-4">{value}</span>
    </div>
  );
}
