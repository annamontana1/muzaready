'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  maxUsesPerUser: number | null;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: '',
    maxDiscount: '',
    maxUses: '',
    maxUsesPerUser: '1',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, [search, filterActive]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterActive !== 'all') params.append('isActive', filterActive);

      const response = await fetch(`/api/admin/coupons?${params.toString()}`);
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        maxUsesPerUser: formData.maxUsesPerUser ? Number(formData.maxUsesPerUser) : null,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil || null,
        isActive: formData.isActive,
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Chyba při ukládání kupónu');
        return;
      }

      // Reset form
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderAmount: '',
        maxDiscount: '',
        maxUses: '',
        maxUsesPerUser: '1',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        isActive: true,
      });
      setShowCreateForm(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Chyba při ukládání kupónu');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      maxUsesPerUser: coupon.maxUsesPerUser?.toString() || '1',
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
      isActive: coupon.isActive,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento kupón?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Chyba při mazání kupónu');
        return;
      }

      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Chyba při mazání kupónu');
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    }
    return `${coupon.discountValue} Kč`;
  };

  const getUsageText = (coupon: Coupon) => {
    if (coupon.maxUses === null) return `${coupon.usedCount}x použito`;
    return `${coupon.usedCount} / ${coupon.maxUses}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slevové kupóny</h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingCoupon(null);
            setFormData({
              code: '',
              description: '',
              discountType: 'percentage',
              discountValue: 0,
              minOrderAmount: '',
              maxDiscount: '',
              maxUses: '',
              maxUsesPerUser: '1',
              validFrom: new Date().toISOString().split('T')[0],
              validUntil: '',
              isActive: true,
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Zrušit' : '+ Nový kupón'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCoupon ? 'Upravit kupón' : 'Nový kupón'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kód kupónu *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md uppercase"
                  placeholder="SLEVA20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Typ slevy *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="percentage">Procenta (%)</option>
                  <option value="fixed_amount">Fixní částka (Kč)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hodnota slevy *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Minimální částka objednávky
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximální sleva (pouze pro %)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="500"
                  disabled={formData.discountType === 'fixed_amount'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximální počet použití
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUses: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Neomezeno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max. použití na uživatele
                </label>
                <input
                  type="number"
                  value={formData.maxUsesPerUser}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUsesPerUser: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Platný od *
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Platný do
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Popis</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Popis kupónu pro interní účely"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Aktivní kupón
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingCoupon ? 'Uložit změny' : 'Vytvořit kupón'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingCoupon(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat podle kódu..."
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Všechny</option>
            <option value="true">Pouze aktivní</option>
            <option value="false">Pouze neaktivní</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Načítání...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Žádné kupóny nenalezeny
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Kód</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Sleva
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Platnost
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Použití
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Stav
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{coupon.code}</div>
                    {coupon.description && (
                      <div className="text-sm text-gray-500">
                        {coupon.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{formatDiscount(coupon)}</div>
                    {coupon.minOrderAmount && (
                      <div className="text-sm text-gray-500">
                        Min: {coupon.minOrderAmount} Kč
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      Od: {new Date(coupon.validFrom).toLocaleDateString('cs-CZ')}
                    </div>
                    {coupon.validUntil && (
                      <div>
                        Do: {new Date(coupon.validUntil).toLocaleDateString('cs-CZ')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{getUsageText(coupon)}</td>
                  <td className="px-4 py-3">
                    {coupon.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Aktivní
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        Neaktivní
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        Upravit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        Smazat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
