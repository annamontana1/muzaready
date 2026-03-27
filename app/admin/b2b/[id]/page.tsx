'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types
interface B2bItem {
  id: string;
  shipmentId: string;
  druh: string;
  barva: string;
  delkaCm: number;
  gramaz: number;
  cenaPerGram: number;
  celkem: number;
  stav: string;
  notes: string | null;
}

interface B2bShipment {
  id: string;
  date: string;
  notes: string | null;
  items: B2bItem[];
}

interface B2bPayment {
  id: string;
  date: string;
  amount: number;
  method: string;
  note: string | null;
  createdAt: string;
}

interface B2bPartnerDetail {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  ico: string | null;
  address: string | null;
  notes: string | null;
  shipments: B2bShipment[];
  payments: B2bPayment[];
  stats: {
    totalValue: number;
    totalGrams: number;
    totalPaid: number;
    outstanding: number;
    returnedValue: number;
    itemsCount: number;
  };
}

const STATUS_OPTIONS: { value: string; label: string; bg: string; text: string }[] = [
  { value: 'skladem', label: 'Skladem', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'prodano', label: 'Prodáno', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { value: 'vraceni', label: 'Vrácení', bg: 'bg-amber-100', text: 'text-amber-700' },
  { value: 'zaplaceno', label: 'Zaplaceno', bg: 'bg-purple-100', text: 'text-purple-700' },
];

const PAYMENT_METHODS = [
  { value: 'airbank', label: 'Airbank' },
  { value: 'hotovost', label: 'Hotovost' },
  { value: 'jiny', label: 'Jiný' },
];

function StatusBadge({ stav }: { stav: string }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === stav) || STATUS_OPTIONS[0];
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${opt.bg} ${opt.text}`}>
      {opt.label}
    </span>
  );
}

function formatCzk(val: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(val);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ');
}

export default function B2bPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<B2bPartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedShipments, setExpandedShipments] = useState<Set<string>>(new Set());
  const [editingPartner, setEditingPartner] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', contactName: '', email: '', phone: '', ico: '', address: '', notes: '' });

  // Payment form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '', method: 'airbank', note: '' });
  const [savingPayment, setSavingPayment] = useState(false);

  // Import
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const fetchPartner = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/b2b/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data);
        setEditForm({
          name: data.name || '',
          contactName: data.contactName || '',
          email: data.email || '',
          phone: data.phone || '',
          ico: data.ico || '',
          address: data.address || '',
          notes: data.notes || '',
        });
      }
    } catch (err) {
      console.error('Chyba:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  const toggleShipment = (shipmentId: string) => {
    setExpandedShipments((prev) => {
      const next = new Set(prev);
      if (next.has(shipmentId)) next.delete(shipmentId);
      else next.add(shipmentId);
      return next;
    });
  };

  const handleItemStatusChange = async (itemId: string, newStav: string, shipmentPartnerId: string) => {
    try {
      const res = await fetch(`/api/admin/b2b/${shipmentPartnerId}/shipments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, stav: newStav }),
      });
      if (res.ok) {
        fetchPartner();
      }
    } catch (err) {
      console.error('Chyba při změně stavu:', err);
    }
  };

  const handleSavePartner = async () => {
    try {
      const res = await fetch(`/api/admin/b2b/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingPartner(false);
        fetchPartner();
      }
    } catch (err) {
      console.error('Chyba:', err);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: paymentForm.date,
          amount: parseFloat(paymentForm.amount),
          method: paymentForm.method,
          note: paymentForm.note || null,
        }),
      });
      if (res.ok) {
        setShowPaymentForm(false);
        setPaymentForm({ date: new Date().toISOString().split('T')[0], amount: '', method: 'airbank', note: '' });
        fetchPartner();
      }
    } catch (err) {
      console.error('Chyba:', err);
    } finally {
      setSavingPayment(false);
    }
  };

  const exportToExcel = async () => {
    // Dynamically load xlsx library
    const XLSX = (await import('xlsx')).default;
    const wb = XLSX.utils.book_new();

    // Sheet 1: All items from all shipments
    const allItems = partner.shipments.flatMap((s) =>
      s.items.map((item) => ({
        'Zásilka': formatDate(s.date),
        'Druh': item.druh,
        'Barva': item.barva,
        'Délka (cm)': item.delkaCm,
        'Gramáž (g)': item.gramaz,
        'Cena/g': item.cenaPerGram,
        'Celkem (Kč)': item.celkem,
        'Stav': STATUS_OPTIONS.find((o) => o.value === item.stav)?.label || item.stav,
        'Poznámka': item.notes || '',
      }))
    );
    const wsItems = XLSX.utils.json_to_sheet(allItems);
    XLSX.utils.book_append_sheet(wb, wsItems, 'Položky');

    // Sheet 2: Payments
    const paymentRows = partner.payments.map((p) => ({
      'Datum': formatDate(p.date),
      'Částka (Kč)': p.amount,
      'Způsob': PAYMENT_METHODS.find((m) => m.value === p.method)?.label || p.method,
      'Poznámka': p.note || '',
    }));
    const wsPayments = XLSX.utils.json_to_sheet(paymentRows);
    XLSX.utils.book_append_sheet(wb, wsPayments, 'Platby');

    // Sheet 3: Summary
    const summary = [
      { 'Ukazatel': 'Celkem odesláno', 'Hodnota': partner.stats.totalValue },
      { 'Ukazatel': 'Zaplaceno', 'Hodnota': partner.stats.totalPaid },
      { 'Ukazatel': 'Zbývá zaplatit', 'Hodnota': partner.stats.outstanding },
      { 'Ukazatel': 'Vráceno', 'Hodnota': partner.stats.returnedValue },
      { 'Ukazatel': 'Celkem gramů', 'Hodnota': partner.stats.totalGrams },
      { 'Ukazatel': 'Počet položek', 'Hodnota': partner.stats.itemsCount },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Souhrn');

    // Download
    const fileName = `${partner.name.replace(/\s+/g, '_')}_komise_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleImportExcel = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/admin/b2b/${id}/import`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImportResult(`Importováno ${data.shipments?.length || 0} zásilek`);
        fetchPartner();
      } else {
        setImportResult(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setImportResult('Chyba při importu');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12 text-center text-stone-400">
        Načítám detail partnera...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12 text-center text-stone-400">
        Partner nenalezen.{' '}
        <Link href="/admin/b2b" className="text-[#722F37] hover:underline">
          Zpět na seznam
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumb + Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/admin/b2b" className="hover:text-[#722F37]">
            B2B Komise
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">{partner.name}</span>
        </div>
        <button
          onClick={() => exportToExcel()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          📥 Stáhnout Excel
        </button>
      </div>

      {/* ===== SECTION 1: Partner Info Card ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Informace o partnerovi</h2>
          <button
            onClick={() => setEditingPartner(!editingPartner)}
            className="text-sm text-[#722F37] hover:underline"
          >
            {editingPartner ? 'Zrušit' : 'Upravit'}
          </button>
        </div>

        {editingPartner ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Název</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Kontaktní osoba</label>
              <input
                type="text"
                value={editForm.contactName}
                onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Telefon</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">IČO</label>
              <input
                type="text"
                value={editForm.ico}
                onChange={(e) => setEditForm({ ...editForm, ico: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Adresa</label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Poznámky</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <button
                onClick={handleSavePartner}
                className="px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors"
              >
                Uložit změny
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Název</div>
              <div className="text-sm font-medium text-stone-800">{partner.name}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Kontaktní osoba</div>
              <div className="text-sm text-stone-600">{partner.contactName || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">IČO</div>
              <div className="text-sm text-stone-600">{partner.ico || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Email</div>
              <div className="text-sm text-stone-600">{partner.email || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Telefon</div>
              <div className="text-sm text-stone-600">{partner.phone || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Adresa</div>
              <div className="text-sm text-stone-600">{partner.address || '—'}</div>
            </div>
            {partner.notes && (
              <div className="md:col-span-3">
                <div className="text-xs text-stone-400 uppercase mb-1">Poznámky</div>
                <div className="text-sm text-stone-600">{partner.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Celkem odesláno</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{formatCzk(partner.stats.totalValue)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Zaplaceno</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">{formatCzk(partner.stats.totalPaid)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Zbývá zaplatit</div>
            <div className={`text-lg font-bold mt-0.5 ${partner.stats.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatCzk(partner.stats.outstanding)}
            </div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Celkem gramů</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{partner.stats.totalGrams.toLocaleString('cs-CZ')} g</div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 2 & 3: Zásilky (Shipments) with expandable items ===== */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-800">Zásilky</h2>
          <p className="text-sm text-stone-400 mt-0.5">
            {partner.shipments.length} zásilek, {partner.stats.itemsCount} položek celkem
          </p>
        </div>

        {partner.shipments.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-sm">
            Zatím žádné zásilky. Importujte data z Excelu nebo přidejte ručně.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {partner.shipments.map((shipment) => {
              const isExpanded = expandedShipments.has(shipment.id);
              const totalGrams = shipment.items.reduce((s, i) => s + i.gramaz, 0);
              const totalCzk = shipment.items.reduce((s, i) => s + i.celkem, 0);
              const statusCounts = shipment.items.reduce<Record<string, number>>((acc, i) => {
                acc[i.stav] = (acc[i.stav] || 0) + 1;
                return acc;
              }, {});

              return (
                <div key={shipment.id}>
                  {/* Shipment header row */}
                  <button
                    onClick={() => toggleShipment(shipment.id)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors text-left"
                  >
                    <svg
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-stone-800">{formatDate(shipment.date)}</span>
                        {shipment.notes && (
                          <span className="text-xs text-stone-400 truncate">{shipment.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm shrink-0">
                      <span className="text-stone-500">{shipment.items.length} ks</span>
                      <span className="text-stone-500">{Math.round(totalGrams)} g</span>
                      <span className="font-medium text-stone-800">{formatCzk(totalCzk)}</span>
                      <div className="flex gap-1">
                        {Object.entries(statusCounts).map(([stav, count]) => (
                          <span key={stav} className="text-xs">
                            <StatusBadge stav={stav} /> {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Expanded items table */}
                  {isExpanded && (
                    <div className="px-6 pb-4">
                      <div className="overflow-x-auto rounded-lg border border-stone-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                              <th className="text-left px-3 py-2 font-medium text-stone-500">Druh</th>
                              <th className="text-left px-3 py-2 font-medium text-stone-500">Barva</th>
                              <th className="text-right px-3 py-2 font-medium text-stone-500">Délka (cm)</th>
                              <th className="text-right px-3 py-2 font-medium text-stone-500">Gramáž (g)</th>
                              <th className="text-right px-3 py-2 font-medium text-stone-500">Kč/g</th>
                              <th className="text-right px-3 py-2 font-medium text-stone-500">Celkem</th>
                              <th className="text-center px-3 py-2 font-medium text-stone-500">Stav</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {shipment.items.map((item) => (
                              <tr key={item.id} className="hover:bg-stone-50">
                                <td className="px-3 py-2 text-stone-700">{item.druh}</td>
                                <td className="px-3 py-2 text-stone-700">{item.barva}</td>
                                <td className="px-3 py-2 text-right text-stone-600">{item.delkaCm}</td>
                                <td className="px-3 py-2 text-right text-stone-600">{item.gramaz}</td>
                                <td className="px-3 py-2 text-right text-stone-600">{item.cenaPerGram} Kč</td>
                                <td className="px-3 py-2 text-right font-medium text-stone-800">
                                  {formatCzk(item.celkem)}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <select
                                    value={item.stav}
                                    onChange={(e) => handleItemStatusChange(item.id, e.target.value, id)}
                                    className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 ${
                                      STATUS_OPTIONS.find((s) => s.value === item.stav)?.bg || 'bg-stone-100'
                                    } ${STATUS_OPTIONS.find((s) => s.value === item.stav)?.text || 'text-stone-700'}`}
                                  >
                                    {STATUS_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-stone-50 border-t border-stone-200">
                              <td colSpan={3} className="px-3 py-2 font-medium text-stone-600">
                                Celkem
                              </td>
                              <td className="px-3 py-2 text-right font-medium text-stone-800">
                                {Math.round(totalGrams)} g
                              </td>
                              <td className="px-3 py-2"></td>
                              <td className="px-3 py-2 text-right font-bold text-stone-800">
                                {formatCzk(totalCzk)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== SECTION 4: Splátky (Payments) ===== */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Splátky</h2>
            <p className="text-sm text-stone-400 mt-0.5">
              Celkem zaplaceno: <span className="font-medium text-emerald-600">{formatCzk(partner.stats.totalPaid)}</span>
              {' | '}
              Zbývá: <span className={`font-medium ${partner.stats.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{formatCzk(partner.stats.outstanding)}</span>
            </p>
          </div>
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="px-3 py-1.5 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors"
          >
            + Přidat splátku
          </button>
        </div>

        {/* Inline payment form */}
        {showPaymentForm && (
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
            <form onSubmit={handleAddPayment} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Datum</label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Částka (Kč)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="5000"
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Způsob</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-stone-500 mb-1">Poznámka</label>
                <input
                  type="text"
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  placeholder="Volitelná poznámka"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
                />
              </div>
              <button
                type="submit"
                disabled={savingPayment}
                className="px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors disabled:opacity-50"
              >
                {savingPayment ? 'Ukládám...' : 'Uložit'}
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 text-stone-500 text-sm hover:bg-stone-200 rounded-lg transition-colors"
              >
                Zrušit
              </button>
            </form>
          </div>
        )}

        {partner.payments.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-sm">Zatím žádné splátky.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Datum</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-500">Částka</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Způsob</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Poznámka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {partner.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-stone-700">{formatDate(payment.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatCzk(payment.amount)}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {PAYMENT_METHODS.find((m) => m.value === payment.method)?.label || payment.method}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{payment.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-stone-50 border-t border-stone-200">
                  <td className="px-4 py-3 font-medium text-stone-600">Celkem zaplaceno</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                    {formatCzk(partner.stats.totalPaid)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ===== SECTION 5: Import z Excelu ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">Import z Excelu</h2>
        <p className="text-sm text-stone-400 mb-4">
          Nahrajte Excel soubor (.xlsx). Každý list bude importován jako jedna zásilka, řádky jako položky.
        </p>
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls"
              className="sr-only"
              disabled={importing}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportExcel(file);
                e.target.value = '';
              }}
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {importing ? 'Importuji...' : 'Nahrát Excel soubor'}
            </span>
          </label>
          {importResult && (
            <span className={`text-sm ${importResult.startsWith('Chyba') ? 'text-red-600' : 'text-emerald-600'}`}>
              {importResult}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
