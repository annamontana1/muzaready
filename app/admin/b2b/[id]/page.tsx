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
  type: 'komise' | 'splatky';
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
  { value: 'prodano', label: 'Prodano', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { value: 'vraceni', label: 'Vraceni', bg: 'bg-amber-100', text: 'text-amber-700' },
  { value: 'zaplaceno', label: 'Zaplaceno', bg: 'bg-purple-100', text: 'text-purple-700' },
];

const PAYMENT_METHODS = [
  { value: 'airbank', label: 'Airbank' },
  { value: 'hotovost', label: 'Hotovost' },
  { value: 'jiny', label: 'Jiny' },
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

// Simple inline toast fallback
function showToast(msg: string, _type: 'success' | 'error') {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast(msg, _type);
  } else {
    alert(msg);
  }
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

  // Manual shipment form
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [shipmentDate, setShipmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [shipmentNotes, setShipmentNotes] = useState('');
  const [manualItems, setManualItems] = useState<Array<{
    druh: string; barva: string; delkaCm: string; gramaz: string; cenaPerGram: string; notes: string;
  }>>([{ druh: '', barva: '', delkaCm: '', gramaz: '', cenaPerGram: '', notes: '' }]);
  const [savingShipment, setSavingShipment] = useState(false);

  // Contract email sending
  const [sendingContract, setSendingContract] = useState(false);

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
      console.error('Chyba pri zmene stavu:', err);
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
    if (!partner) return;
    const XLSX = (await import('xlsx')).default;
    const wb = XLSX.utils.book_new();

    const allItems = partner.shipments.flatMap((s) =>
      s.items.map((item) => ({
        'Zasilka': formatDate(s.date),
        'Druh': item.druh,
        'Barva': item.barva,
        'Delka (cm)': item.delkaCm,
        'Gramaz (g)': item.gramaz,
        'Cena/g': item.cenaPerGram,
        'Celkem (Kc)': item.celkem,
        'Stav': STATUS_OPTIONS.find((o) => o.value === item.stav)?.label || item.stav,
        'Poznamka': item.notes || '',
      }))
    );
    const wsItems = XLSX.utils.json_to_sheet(allItems);
    XLSX.utils.book_append_sheet(wb, wsItems, 'Polozky');

    const paymentRows = partner.payments.map((p) => ({
      'Datum': formatDate(p.date),
      'Castka (Kc)': p.amount,
      'Zpusob': PAYMENT_METHODS.find((m) => m.value === p.method)?.label || p.method,
      'Poznamka': p.note || '',
    }));
    const wsPayments = XLSX.utils.json_to_sheet(paymentRows);
    XLSX.utils.book_append_sheet(wb, wsPayments, 'Platby');

    const summary = [
      { 'Ukazatel': 'Celkem odeslano', 'Hodnota': partner.stats.totalValue },
      { 'Ukazatel': 'Zaplaceno', 'Hodnota': partner.stats.totalPaid },
      { 'Ukazatel': 'Zbyva zaplatit', 'Hodnota': partner.stats.outstanding },
      { 'Ukazatel': 'Vraceno', 'Hodnota': partner.stats.returnedValue },
      { 'Ukazatel': 'Celkem gramu', 'Hodnota': partner.stats.totalGrams },
      { 'Ukazatel': 'Pocet polozek', 'Hodnota': partner.stats.itemsCount },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Souhrn');

    const fileName = `${partner.name.replace(/\s+/g, '_')}_${partnerType}_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
        setImportResult(`Importovano ${data.shipments?.length || 0} zasilek`);
        fetchPartner();
      } else {
        setImportResult(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setImportResult('Chyba pri importu');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleSendContract = async () => {
    if (!partner?.email) {
      showToast('Partner nema zadany email', 'error');
      return;
    }
    setSendingContract(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/send-contract`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('Smlouva odeslana na email', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Chyba pri odesilani', 'error');
      }
    } catch {
      showToast('Chyba pri odesilani smlouvy', 'error');
    } finally {
      setSendingContract(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12 text-center text-stone-400">
        Nacitam detail partnera...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12 text-center text-stone-400">
        Partner nenalezen.{' '}
        <Link href="/admin/b2b" className="text-[#722F37] hover:underline">
          Zpet na seznam
        </Link>
      </div>
    );
  }

  const partnerType = partner.type || 'komise';
  const allItems = partner.shipments.flatMap((s) => s.items);

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Breadcrumb + Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/admin/b2b" className="hover:text-[#722F37]">
            B2B Partneri
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">{partner.name}</span>
          <span className={`ml-2 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
            partnerType === 'komise' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {partnerType === 'komise' ? 'Komise' : 'Splatky'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {partnerType === 'komise' && (
            <>
              <Link
                href={`/admin/b2b/${id}/smlouva`}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors"
              >
                Generovat komisni smlouvu
              </Link>
              <button
                onClick={handleSendContract}
                disabled={sendingContract || !partner.email}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {sendingContract ? 'Odesilam...' : 'Odeslat smlouvu na email'}
              </button>
            </>
          )}
          <button
            onClick={() => exportToExcel()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Stahnout Excel
          </button>
        </div>
      </div>

      {/* ===== SECTION 1: Partner Info Card ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Informace o partnerovi</h2>
          <button
            onClick={() => setEditingPartner(!editingPartner)}
            className="text-sm text-[#722F37] hover:underline"
          >
            {editingPartner ? 'Zrusit' : 'Upravit'}
          </button>
        </div>

        {editingPartner ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nazev</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Kontaktni osoba</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-1">ICO</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-1">Poznamky</label>
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
                Ulozit zmeny
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Nazev</div>
              <div className="text-sm font-medium text-stone-800">{partner.name}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">Kontaktni osoba</div>
              <div className="text-sm text-stone-600">{partner.contactName || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase mb-1">ICO</div>
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
                <div className="text-xs text-stone-400 uppercase mb-1">Poznamky</div>
                <div className="text-sm text-stone-600">{partner.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">{partnerType === 'komise' ? 'Celkem odeslano' : 'Celkem prodano'}</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{formatCzk(partner.stats.totalValue)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Zaplaceno</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">{formatCzk(partner.stats.totalPaid)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Zbyva zaplatit</div>
            <div className={`text-lg font-bold mt-0.5 ${partner.stats.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatCzk(partner.stats.outstanding)}
            </div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400">Celkem gramu</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{partner.stats.totalGrams.toLocaleString('cs-CZ')} g</div>
          </div>
        </div>
      </div>

      {/* ===== COMMISSION MODE: Komisni zbozi ===== */}
      {partnerType === 'komise' && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">Komisni zbozi</h2>
              <p className="text-sm text-stone-400 mt-0.5">
                {partner.shipments.length} zasilek, {partner.stats.itemsCount} polozek celkem
              </p>
            </div>
            <button
              onClick={() => setShowAddShipment(!showAddShipment)}
              className="px-4 py-2 bg-[#722F37] hover:bg-[#5a252c] text-white text-sm font-medium rounded-lg transition-colors"
            >
              {showAddShipment ? 'Zavrit' : '+ Pridat zasilku'}
            </button>
          </div>

          {/* Manual add shipment form */}
          {showAddShipment && (
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Datum zasilky</label>
                  <input
                    type="date"
                    value={shipmentDate}
                    onChange={(e) => setShipmentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Poznamka k zasilce</label>
                  <input
                    type="text"
                    value={shipmentNotes}
                    onChange={(e) => setShipmentNotes(e.target.value)}
                    placeholder="Napr. 2. dodavka pro salon"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Polozky</label>
                <div className="space-y-2">
                  {manualItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" value={item.druh} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], druh: e.target.value }; setManualItems(updated); }} placeholder="Druh" className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      <input type="text" value={item.barva} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], barva: e.target.value }; setManualItems(updated); }} placeholder="Barva" className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      <input type="number" value={item.delkaCm} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], delkaCm: e.target.value }; setManualItems(updated); }} placeholder="Delka cm" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      <input type="number" value={item.gramaz} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], gramaz: e.target.value }; setManualItems(updated); }} placeholder="Gramaz" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      <input type="number" step="0.1" value={item.cenaPerGram} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], cenaPerGram: e.target.value }; setManualItems(updated); }} placeholder="Kc/g" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      <div className="w-24 text-sm font-medium text-stone-700 text-right">
                        {item.gramaz && item.cenaPerGram ? `${Math.round(Number(item.gramaz) * Number(item.cenaPerGram)).toLocaleString('cs-CZ')} Kc` : '—'}
                      </div>
                      <input type="text" value={item.notes} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], notes: e.target.value }; setManualItems(updated); }} placeholder="Pozn." className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                      {manualItems.length > 1 && (
                        <button onClick={() => setManualItems(manualItems.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 text-lg">x</button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => setManualItems([...manualItems, { druh: '', barva: '', delkaCm: '', gramaz: '', cenaPerGram: '', notes: '' }])} className="mt-2 text-sm text-[#722F37] hover:underline">
                  + Pridat dalsi polozku
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <div className="text-sm text-stone-600">
                  Celkem: <span className="font-bold text-stone-800">
                    {manualItems.reduce((sum, it) => sum + (Number(it.gramaz) || 0) * (Number(it.cenaPerGram) || 0), 0).toLocaleString('cs-CZ')} Kc
                  </span>
                  {' '}({manualItems.reduce((sum, it) => sum + (Number(it.gramaz) || 0), 0)} g)
                </div>
                <button
                  onClick={async () => {
                    const validItems = manualItems.filter((it) => it.druh && it.gramaz && it.cenaPerGram);
                    if (validItems.length === 0) { showToast('Vyplnte alespon jednu polozku', 'error'); return; }
                    setSavingShipment(true);
                    try {
                      const res = await fetch(`/api/admin/b2b/${id}/shipments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          date: shipmentDate,
                          notes: shipmentNotes || null,
                          items: validItems.map((it) => ({
                            druh: it.druh, barva: it.barva || '', delkaCm: Number(it.delkaCm) || 0, gramaz: Number(it.gramaz),
                            cenaPerGram: Number(it.cenaPerGram), celkem: Math.round(Number(it.gramaz) * Number(it.cenaPerGram)), stav: 'skladem', notes: it.notes || null,
                          })),
                        }),
                      });
                      if (!res.ok) throw new Error('Chyba pri ukladani');
                      showToast('Zasilka pridana', 'success');
                      setShowAddShipment(false);
                      setManualItems([{ druh: '', barva: '', delkaCm: '', gramaz: '', cenaPerGram: '', notes: '' }]);
                      setShipmentNotes('');
                      fetchPartner();
                    } catch {
                      showToast('Nepodarilo se ulozit zasilku', 'error');
                    } finally {
                      setSavingShipment(false);
                    }
                  }}
                  disabled={savingShipment}
                  className="px-5 py-2 bg-[#722F37] hover:bg-[#5a252c] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {savingShipment ? 'Ukladam...' : 'Ulozit zasilku'}
                </button>
              </div>
            </div>
          )}

          {partner.shipments.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">
              Zatim zadne zasilky. Importujte data z Excelu nebo pridejte rucne.
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
                    <button onClick={() => toggleShipment(shipment.id)} className="w-full px-6 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors text-left">
                      <svg className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-stone-800">{formatDate(shipment.date)}</span>
                          {shipment.notes && <span className="text-xs text-stone-400 truncate">{shipment.notes}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <span className="text-stone-500">{shipment.items.length} ks</span>
                        <span className="text-stone-500">{Math.round(totalGrams)} g</span>
                        <span className="font-medium text-stone-800">{formatCzk(totalCzk)}</span>
                        <div className="flex gap-1">
                          {Object.entries(statusCounts).map(([stav, count]) => (
                            <span key={stav} className="text-xs"><StatusBadge stav={stav} /> {count}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                    <div className="px-6 -mt-3 mb-1 flex justify-end">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm(`Opravdu smazat zasilku z ${formatDate(shipment.date)}? Tato akce je nevratna.`)) return;
                          try {
                            const res = await fetch(`/api/admin/b2b/${id}/shipments/${shipment.id}`, { method: 'DELETE' });
                            if (!res.ok) throw new Error('Chyba pri mazani');
                            fetchPartner();
                            showToast('Zasilka smazana', 'success');
                          } catch {
                            showToast('Nepodarilo se smazat zasilku', 'error');
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        Smazat zasilku
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-4">
                        <div className="overflow-x-auto rounded-lg border border-stone-200">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="text-left px-3 py-2 font-medium text-stone-500">Druh</th>
                                <th className="text-left px-3 py-2 font-medium text-stone-500">Barva</th>
                                <th className="text-right px-3 py-2 font-medium text-stone-500">Delka (cm)</th>
                                <th className="text-right px-3 py-2 font-medium text-stone-500">Gramaz (g)</th>
                                <th className="text-right px-3 py-2 font-medium text-stone-500">Kc/g</th>
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
                                  <td className="px-3 py-2 text-right text-stone-600">{item.cenaPerGram} Kc</td>
                                  <td className="px-3 py-2 text-right font-medium text-stone-800">{formatCzk(item.celkem)}</td>
                                  <td className="px-3 py-2 text-center">
                                    <select
                                      value={item.stav}
                                      onChange={(e) => handleItemStatusChange(item.id, e.target.value, id)}
                                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 ${
                                        STATUS_OPTIONS.find((s) => s.value === item.stav)?.bg || 'bg-stone-100'
                                      } ${STATUS_OPTIONS.find((s) => s.value === item.stav)?.text || 'text-stone-700'}`}
                                    >
                                      {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-stone-50 border-t border-stone-200">
                                <td colSpan={3} className="px-3 py-2 font-medium text-stone-600">Celkem</td>
                                <td className="px-3 py-2 text-right font-medium text-stone-800">{Math.round(totalGrams)} g</td>
                                <td className="px-3 py-2"></td>
                                <td className="px-3 py-2 text-right font-bold text-stone-800">{formatCzk(totalCzk)}</td>
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
      )}

      {/* ===== INSTALLMENT MODE: Prodane zbozi ===== */}
      {partnerType === 'splatky' && (
        <>
          {/* Sold items */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-stone-800">Prodane zbozi</h2>
                <p className="text-sm text-stone-400 mt-0.5">
                  {allItems.length} polozek, celkova hodnota: {formatCzk(partner.stats.totalValue)}
                </p>
              </div>
              <button
                onClick={() => setShowAddShipment(!showAddShipment)}
                className="px-4 py-2 bg-[#722F37] hover:bg-[#5a252c] text-white text-sm font-medium rounded-lg transition-colors"
              >
                {showAddShipment ? 'Zavrit' : '+ Pridat zbozi'}
              </button>
            </div>

            {/* Reuse the same add shipment form */}
            {showAddShipment && (
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Datum prodeje</label>
                    <input type="date" value={shipmentDate} onChange={(e) => setShipmentDate(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Poznamka</label>
                    <input type="text" value={shipmentNotes} onChange={(e) => setShipmentNotes(e.target.value)} placeholder="Poznamka k prodeji" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Polozky</label>
                  <div className="space-y-2">
                    {manualItems.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={item.druh} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], druh: e.target.value }; setManualItems(updated); }} placeholder="Druh" className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                        <input type="text" value={item.barva} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], barva: e.target.value }; setManualItems(updated); }} placeholder="Barva" className="w-28 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                        <input type="number" value={item.delkaCm} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], delkaCm: e.target.value }; setManualItems(updated); }} placeholder="Delka cm" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                        <input type="number" value={item.gramaz} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], gramaz: e.target.value }; setManualItems(updated); }} placeholder="Gramaz" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                        <input type="number" step="0.1" value={item.cenaPerGram} onChange={(e) => { const updated = [...manualItems]; updated[idx] = { ...updated[idx], cenaPerGram: e.target.value }; setManualItems(updated); }} placeholder="Kc/g" className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20" />
                        <div className="w-24 text-sm font-medium text-stone-700 text-right">
                          {item.gramaz && item.cenaPerGram ? `${Math.round(Number(item.gramaz) * Number(item.cenaPerGram)).toLocaleString('cs-CZ')} Kc` : '—'}
                        </div>
                        {manualItems.length > 1 && (
                          <button onClick={() => setManualItems(manualItems.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 text-lg">x</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setManualItems([...manualItems, { druh: '', barva: '', delkaCm: '', gramaz: '', cenaPerGram: '', notes: '' }])} className="mt-2 text-sm text-[#722F37] hover:underline">
                    + Pridat dalsi polozku
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <div className="text-sm text-stone-600">
                    Celkem: <span className="font-bold text-stone-800">{manualItems.reduce((sum, it) => sum + (Number(it.gramaz) || 0) * (Number(it.cenaPerGram) || 0), 0).toLocaleString('cs-CZ')} Kc</span>
                  </div>
                  <button
                    onClick={async () => {
                      const validItems = manualItems.filter((it) => it.druh && it.gramaz && it.cenaPerGram);
                      if (validItems.length === 0) { showToast('Vyplnte alespon jednu polozku', 'error'); return; }
                      setSavingShipment(true);
                      try {
                        const res = await fetch(`/api/admin/b2b/${id}/shipments`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            date: shipmentDate, notes: shipmentNotes || null,
                            items: validItems.map((it) => ({
                              druh: it.druh, barva: it.barva || '', delkaCm: Number(it.delkaCm) || 0, gramaz: Number(it.gramaz),
                              cenaPerGram: Number(it.cenaPerGram), celkem: Math.round(Number(it.gramaz) * Number(it.cenaPerGram)), stav: 'prodano', notes: it.notes || null,
                            })),
                          }),
                        });
                        if (!res.ok) throw new Error('Chyba');
                        showToast('Zbozi pridano', 'success');
                        setShowAddShipment(false);
                        setManualItems([{ druh: '', barva: '', delkaCm: '', gramaz: '', cenaPerGram: '', notes: '' }]);
                        setShipmentNotes('');
                        fetchPartner();
                      } catch {
                        showToast('Nepodarilo se ulozit', 'error');
                      } finally {
                        setSavingShipment(false);
                      }
                    }}
                    disabled={savingShipment}
                    className="px-5 py-2 bg-[#722F37] hover:bg-[#5a252c] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {savingShipment ? 'Ukladam...' : 'Ulozit'}
                  </button>
                </div>
              </div>
            )}

            {allItems.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">Zatim zadne prodane zbozi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="text-left px-4 py-3 font-medium text-stone-500">Druh</th>
                      <th className="text-left px-4 py-3 font-medium text-stone-500">Barva</th>
                      <th className="text-right px-4 py-3 font-medium text-stone-500">Delka (cm)</th>
                      <th className="text-right px-4 py-3 font-medium text-stone-500">Gramaz (g)</th>
                      <th className="text-right px-4 py-3 font-medium text-stone-500">Kc/g</th>
                      <th className="text-right px-4 py-3 font-medium text-stone-500">Celkem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {allItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 text-stone-700">{item.druh}</td>
                        <td className="px-4 py-3 text-stone-700">{item.barva}</td>
                        <td className="px-4 py-3 text-right text-stone-600">{item.delkaCm}</td>
                        <td className="px-4 py-3 text-right text-stone-600">{item.gramaz}</td>
                        <td className="px-4 py-3 text-right text-stone-600">{item.cenaPerGram} Kc</td>
                        <td className="px-4 py-3 text-right font-medium text-stone-800">{formatCzk(item.celkem)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-stone-50 border-t border-stone-200">
                      <td colSpan={5} className="px-4 py-3 font-medium text-stone-600 text-right">Celkem:</td>
                      <td className="px-4 py-3 text-right font-bold text-stone-800">{formatCzk(partner.stats.totalValue)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Splatkovy kalendar */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-800">Splatkovy kalendar</h2>
              <div className="flex flex-wrap gap-6 mt-3">
                <div>
                  <div className="text-xs text-stone-400">Celkem</div>
                  <div className="text-lg font-bold text-stone-800">{formatCzk(partner.stats.totalValue)}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">Zaplaceno</div>
                  <div className="text-lg font-bold text-emerald-600">{formatCzk(partner.stats.totalPaid)}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">Zbyva</div>
                  <div className={`text-lg font-bold ${partner.stats.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {formatCzk(partner.stats.outstanding)}
                  </div>
                </div>
                {partner.payments.length > 0 && partner.stats.outstanding > 0 && (
                  <div>
                    <div className="text-xs text-stone-400">Dalsi splatka</div>
                    <div className="text-lg font-bold text-blue-600">
                      {(() => {
                        const lastPayment = partner.payments[0];
                        const lastDate = new Date(lastPayment.date);
                        const nextDate = new Date(lastDate);
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        return nextDate.toLocaleDateString('cs-CZ');
                      })()}
                    </div>
                  </div>
                )}
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-stone-200 rounded-full h-2.5">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, partner.stats.totalValue > 0 ? (partner.stats.totalPaid / partner.stats.totalValue) * 100 : 0)}%` }}
                  />
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  {partner.stats.totalValue > 0 ? Math.round((partner.stats.totalPaid / partner.stats.totalValue) * 100) : 0}% splaceno
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== Platby / Splatky section (both modes) ===== */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">{partnerType === 'komise' ? 'Platby' : 'Splatky'}</h2>
            <p className="text-sm text-stone-400 mt-0.5">
              Celkem zaplaceno: <span className="font-medium text-emerald-600">{formatCzk(partner.stats.totalPaid)}</span>
              {' | '}
              Zbyva: <span className={`font-medium ${partner.stats.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{formatCzk(partner.stats.outstanding)}</span>
            </p>
          </div>
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="px-3 py-1.5 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors"
          >
            + Pridat {partnerType === 'komise' ? 'platbu' : 'splatku'}
          </button>
        </div>

        {showPaymentForm && (
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
            <form onSubmit={handleAddPayment} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Datum</label>
                <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Castka (Kc)</label>
                <input type="number" required min="1" step="1" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="5000" className="px-3 py-2 border border-stone-300 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Zpusob</label>
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]">
                  {PAYMENT_METHODS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-stone-500 mb-1">Poznamka</label>
                <input type="text" value={paymentForm.note} onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })} placeholder="Volitelna poznamka" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]" />
              </div>
              <button type="submit" disabled={savingPayment} className="px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors disabled:opacity-50">
                {savingPayment ? 'Ukladam...' : 'Ulozit'}
              </button>
              <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 text-stone-500 text-sm hover:bg-stone-200 rounded-lg transition-colors">
                Zrusit
              </button>
            </form>
          </div>
        )}

        {partner.payments.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-sm">Zatim zadne {partnerType === 'komise' ? 'platby' : 'splatky'}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Datum</th>
                  <th className="text-right px-4 py-3 font-medium text-stone-500">Castka</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Zpusob</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Poznamka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {partner.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-stone-700">{formatDate(payment.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatCzk(payment.amount)}</td>
                    <td className="px-4 py-3 text-stone-600">{PAYMENT_METHODS.find((m) => m.value === payment.method)?.label || payment.method}</td>
                    <td className="px-4 py-3 text-stone-500">{payment.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-stone-50 border-t border-stone-200">
                  <td className="px-4 py-3 font-medium text-stone-600">Celkem zaplaceno</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatCzk(partner.stats.totalPaid)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ===== Import z Excelu (both modes) ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">Import z Excelu</h2>
        <p className="text-sm text-stone-400 mb-4">
          Nahrajte Excel soubor (.xlsx). Kazdy list bude importovan jako jedna zasilka, radky jako polozky.
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
              {importing ? 'Importuji...' : 'Nahrat Excel soubor'}
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
