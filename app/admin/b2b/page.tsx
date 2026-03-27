'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface B2bPartnerSummary {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  ico: string | null;
  totalValue: number;
  totalGrams: number;
  totalPaid: number;
  outstanding: number;
  shipmentsCount: number;
  itemsCount: number;
  status: 'active' | 'settled';
  createdAt: string;
}

export default function B2bPartnersPage() {
  const [partners, setPartners] = useState<B2bPartnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    ico: '',
    address: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/b2b');
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error('Chyba při načítání partnerů:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });
      if (res.ok) {
        setShowNewForm(false);
        setNewPartner({ name: '', contactName: '', email: '', phone: '', ico: '', address: '', notes: '' });
        fetchPartners();
      }
    } catch (err) {
      console.error('Chyba při vytváření partnera:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatCzk = (val: number) =>
    new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(val);

  const totalStats = partners.reduce(
    (acc, p) => ({
      value: acc.value + p.totalValue,
      paid: acc.paid + p.totalPaid,
      outstanding: acc.outstanding + p.outstanding,
      grams: acc.grams + p.totalGrams,
    }),
    { value: 0, paid: 0, outstanding: 0, grams: 0 }
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">B2B Komisní prodej</h2>
          <p className="text-sm text-stone-500">Správa partnerů a komisního zboží</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors"
        >
          + Nový partner
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-stone-500">Celkem odesláno</div>
          <div className="text-xl font-bold text-stone-800 mt-1">{formatCzk(totalStats.value)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-stone-500">Zaplaceno</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatCzk(totalStats.paid)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-stone-500">Zbývá zaplatit</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatCzk(totalStats.outstanding)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-sm text-stone-500">Celkem gramů</div>
          <div className="text-xl font-bold text-stone-800 mt-1">{totalStats.grams.toLocaleString('cs-CZ')} g</div>
        </div>
      </div>

      {/* New partner form */}
      {showNewForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Nový B2B partner</h3>
          <form onSubmit={handleCreatePartner} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Název salónu / partnera *</label>
              <input
                type="text"
                required
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                placeholder="Salón Krása"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Kontaktní osoba</label>
              <input
                type="text"
                value={newPartner.contactName}
                onChange={(e) => setNewPartner({ ...newPartner, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                placeholder="Jana Nováková"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={newPartner.email}
                onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Telefon</label>
              <input
                type="text"
                value={newPartner.phone}
                onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">IČO</label>
              <input
                type="text"
                value={newPartner.ico}
                onChange={(e) => setNewPartner({ ...newPartner, ico: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Adresa</label>
              <input
                type="text"
                value={newPartner.address}
                onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Poznámky</label>
              <textarea
                value={newPartner.notes}
                onChange={(e) => setNewPartner({ ...newPartner, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors disabled:opacity-50"
              >
                {saving ? 'Ukládám...' : 'Vytvořit partnera'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-100 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partners list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400">Načítám partnery...</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-stone-400 mb-2">Zatím žádní B2B partneři</div>
            <button
              onClick={() => setShowNewForm(true)}
              className="text-[#722F37] text-sm font-medium hover:underline"
            >
              Přidat prvního partnera
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Partner</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Kontakt</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Celkem Kč</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Gramů</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Zaplaceno</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Dluh</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Stav</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Zásilek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/b2b/${partner.id}`}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/b2b/${partner.id}`} className="font-medium text-stone-800 hover:text-[#722F37]">
                        {partner.name}
                      </Link>
                      {partner.ico && <div className="text-xs text-stone-400 mt-0.5">IČO: {partner.ico}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-stone-600">{partner.contactName || '—'}</div>
                      {partner.phone && <div className="text-xs text-stone-400">{partner.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-800">{formatCzk(partner.totalValue)}</td>
                    <td className="px-4 py-3 text-right text-sm text-stone-600">{partner.totalGrams.toLocaleString('cs-CZ')} g</td>
                    <td className="px-4 py-3 text-right text-sm text-emerald-600 font-medium">{formatCzk(partner.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      <span className={partner.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {formatCzk(partner.outstanding)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          partner.status === 'settled'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {partner.status === 'settled' ? 'Vyrovnáno' : 'Aktivní'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-stone-500">{partner.shipmentsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
