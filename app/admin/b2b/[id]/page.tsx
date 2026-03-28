'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  soldAt: string | null;
  returnedAt: string | null;
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

interface B2bSaleItem {
  id: string;
  b2bItemId: string;
  amount: number;
  b2bItem: B2bItem;
}

interface B2bSale {
  id: string;
  saleDate: string;
  totalAmount: number;
  invoiceType: string;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  fakturoidId: string | null;
  emailSent: boolean;
  emailSentAt: string | null;
  notes: string | null;
  createdAt: string;
  items: B2bSaleItem[];
}

interface B2bReturnItem {
  id: string;
  b2bItemId: string;
  b2bItem: B2bItem;
}

interface B2bReturnRecord {
  id: string;
  returnDate: string;
  reason: string | null;
  confirmedAt: string | null;
  emailSent: boolean;
  notes: string | null;
  createdAt: string;
  items: B2bReturnItem[];
}

interface B2bEvent {
  id: string;
  type: string;
  description: string;
  data: any;
  createdAt: string;
  createdBy: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  skladem: { label: 'Skladem', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  prodano: { label: 'Prodáno', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  vraceni: { label: 'Vrácení', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  zaplaceno: { label: 'Zaplaceno', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
};

const EVENT_TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  shipment_sent: { icon: '📦', color: 'text-blue-600' },
  items_sold: { icon: '💰', color: 'text-emerald-600' },
  items_returned: { icon: '↩️', color: 'text-amber-600' },
  invoice_generated: { icon: '🧾', color: 'text-indigo-600' },
  email_sent: { icon: '✉️', color: 'text-sky-600' },
  payment_received: { icon: '💳', color: 'text-purple-600' },
  status_change: { icon: '🔄', color: 'text-gray-600' },
};

function formatCzk(val: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(val);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ');
}

function StatusBadge({ stav }: { stav: string }) {
  const cfg = STATUS_CONFIG[stav] || STATUS_CONFIG.skladem;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

interface SaleModalProps {
  partnerId: string;
  selectedItems: B2bItem[];
  onClose: () => void;
  onSuccess: () => void;
}

function SaleModal({ partnerId, selectedItems, onClose, onSuccess }: SaleModalProps) {
  const [invoiceType, setInvoiceType] = useState<'fakturoid' | 'uctenka' | 'zadna'>('zadna');
  const [sendEmail, setSendEmail] = useState(false);
  const [notes, setNotes] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = selectedItems.reduce((sum, i) => sum + i.celkem, 0);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/b2b/${partnerId}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems.map((i) => ({ b2bItemId: i.id, amount: i.celkem })),
          invoiceType,
          sendEmail,
          notes,
          saleDate,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Chyba při ukládání');
      }
      const data = await res.json();
      if (invoiceType === 'uctenka' && data.receiptHtml) {
        const blob = new Blob([data.receiptHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Zapsat prodej</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Items */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Prodávané položky ({selectedItems.length})</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2">
                  <span className="text-gray-700">{item.druh} {item.barva} {item.delkaCm} cm, {item.gramaz} g</span>
                  <span className="font-medium text-gray-900">{formatCzk(item.celkem)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Celkem</span>
              <span className="text-lg font-bold" style={{ color: '#722F37' }}>{formatCzk(totalAmount)}</span>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum prodeje</label>
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
            />
          </div>

          {/* Invoice type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ dokladu</label>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
            >
              <option value="zadna">Bez dokladu</option>
              <option value="uctenka">Jednoduchá účtenka (HTML)</option>
              <option value="fakturoid">Fakturoid faktura</option>
            </select>
          </div>

          {/* Send email */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded accent-[#722F37]"
            />
            <span className="text-sm text-gray-700">Odeslat email partnerovi</span>
          </label>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 resize-none"
              placeholder="Volitelná poznámka k prodeji..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: '#722F37' }}
          >
            {saving ? 'Ukládám…' : 'Potvrdit prodej'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReturnModalProps {
  partnerId: string;
  selectedItems: B2bItem[];
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnModal({ partnerId, selectedItems, onClose, onSuccess }: ReturnModalProps) {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!confirmed) {
      setError('Musíte potvrdit přijetí vrácených položek.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/b2b/${partnerId}/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems.map((i) => i.id),
          returnDate,
          reason,
          sendEmail,
          notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Chyba při ukládání');
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Zapsat vrácení</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Items */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Vracené položky ({selectedItems.length})</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2">
                  <span className="text-gray-700">{item.druh} {item.barva} {item.delkaCm} cm, {item.gramaz} g</span>
                  <StatusBadge stav={item.stav} />
                </div>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum vrácení</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Důvod vrácení</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 resize-none"
              placeholder="Proč jsou položky vraceny?"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 resize-none"
              placeholder="Volitelná interní poznámka..."
            />
          </div>

          {/* Send email */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded accent-[#722F37]"
            />
            <span className="text-sm text-gray-700">Odeslat potvrzení emailem partnerovi</span>
          </label>

          {/* Confirm */}
          <label className="flex items-center gap-2 cursor-pointer bg-amber-50 rounded-lg p-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-600"
            />
            <span className="text-sm font-medium text-amber-800">Potvrzuji přijetí vrácených položek</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-50 bg-amber-600 hover:bg-amber-700"
          >
            {saving ? 'Ukládám…' : 'Potvrdit vrácení'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabKey = 'prehled' | 'zasoby' | 'prodeje' | 'vraceni' | 'historie' | 'platby';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'prehled', label: 'Přehled' },
  { key: 'zasoby', label: 'Zásoby' },
  { key: 'prodeje', label: 'Prodeje' },
  { key: 'vraceni', label: 'Vrácení' },
  { key: 'historie', label: 'Historie' },
  { key: 'platby', label: 'Platby' },
];

const PAYMENT_METHODS = [
  { value: 'airbank', label: 'Airbank' },
  { value: 'hotovost', label: 'Hotovost' },
  { value: 'jiny', label: 'Jiný' },
];

export default function B2bPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<B2bPartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('prehled');

  // Inventory tab
  const [stavFilter, setStavFilter] = useState<string>('all');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Sales data
  const [sales, setSales] = useState<B2bSale[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  // Returns data
  const [returns, setReturns] = useState<B2bReturnRecord[]>([]);
  const [returnsLoading, setReturnsLoading] = useState(false);

  // Events data
  const [events, setEvents] = useState<B2bEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Payment form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'airbank',
    note: '',
  });
  const [savingPayment, setSavingPayment] = useState(false);

  const fetchPartner = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/b2b/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data);
      }
    } catch (err) {
      console.error('Fetch partner error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSales = useCallback(async () => {
    setSalesLoading(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/sales`);
      if (res.ok) setSales(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setSalesLoading(false);
    }
  }, [id]);

  const fetchReturns = useCallback(async () => {
    setReturnsLoading(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/returns`);
      if (res.ok) setReturns(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setReturnsLoading(false);
    }
  }, [id]);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/events`);
      if (res.ok) setEvents(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setEventsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  useEffect(() => {
    if (activeTab === 'prodeje') fetchSales();
    if (activeTab === 'vraceni') fetchReturns();
    if (activeTab === 'historie') fetchEvents();
  }, [activeTab, fetchSales, fetchReturns, fetchEvents]);

  // Flatten all items from all shipments
  const allItems: B2bItem[] = partner?.shipments.flatMap((s) => s.items) ?? [];

  const filteredItems = stavFilter === 'all' ? allItems : allItems.filter((i) => i.stav === stavFilter);

  const selectedItems = allItems.filter((i) => selectedItemIds.has(i.id));

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItemIds.size === filteredItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(filteredItems.map((i) => i.id)));
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
      console.error(err);
    } finally {
      setSavingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#722F37] rounded-full animate-spin" />
          Načítám…
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Partner nenalezen.</p>
        <Link href="/admin/b2b" className="text-sm underline text-[#722F37]">Zpět na seznam</Link>
      </div>
    );
  }

  const { stats } = partner;

  // Stats computed from partner data
  const soldItems = allItems.filter((i) => i.stav === 'prodano');
  const returnedItems = allItems.filter((i) => i.stav === 'vraceni');
  const inStockItems = allItems.filter((i) => i.stav === 'skladem');
  const soldValue = soldItems.reduce((s, i) => s + i.celkem, 0);
  const returnedValue = returnedItems.reduce((s, i) => s + i.celkem, 0);
  const inStockValue = inStockItems.reduce((s, i) => s + i.celkem, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/admin/b2b" className="text-sm text-gray-400 hover:text-gray-600">← B2B Partneři</Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                {partner.ico && <span>IČO: {partner.ico}</span>}
                {partner.contactName && <span>Kontakt: {partner.contactName}</span>}
                {partner.email && <a href={`mailto:${partner.email}`} className="hover:text-[#722F37]">{partner.email}</a>}
                {partner.phone && <span>{partner.phone}</span>}
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={
                    partner.type === 'komise'
                      ? { background: '#fef3c7', color: '#92400e' }
                      : { background: '#ede9fe', color: '#5b21b6' }
                  }
                >
                  {partner.type === 'komise' ? 'Komisní prodej' : 'Splátkový prodej'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`/api/admin/b2b/${id}/send-contract`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                📄 Smlouva
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-6xl mx-auto flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#722F37] text-[#722F37]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* ── PŘEHLED ── */}
        {activeTab === 'prehled' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="V komisi celkem"
                value={formatCzk(stats.totalValue)}
                sub={`${allItems.length} ks`}
                color="blue"
              />
              <StatCard
                label="Prodáno"
                value={formatCzk(soldValue)}
                sub={`${soldItems.length} ks`}
                color="green"
              />
              <StatCard
                label="Vráceno"
                value={formatCzk(returnedValue)}
                sub={`${returnedItems.length} ks`}
                color="amber"
              />
              <StatCard
                label="K zaplacení"
                value={formatCzk(Math.max(0, soldValue - stats.totalPaid))}
                sub={`Zaplaceno: ${formatCzk(stats.totalPaid)}`}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Partner info */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Informace o partnerovi</h3>
                <dl className="space-y-2 text-sm">
                  {partner.address && (
                    <div className="flex gap-2"><dt className="text-gray-500 w-24">Adresa:</dt><dd className="text-gray-800">{partner.address}</dd></div>
                  )}
                  {partner.notes && (
                    <div className="flex gap-2"><dt className="text-gray-500 w-24">Poznámky:</dt><dd className="text-gray-800">{partner.notes}</dd></div>
                  )}
                </dl>
              </div>

              {/* Stock summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Stav zásoby</h3>
                <div className="space-y-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const count = allItems.filter((i) => i.stav === key).length;
                    const val = allItems.filter((i) => i.stav === key).reduce((s, i) => s + i.celkem, 0);
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className="text-gray-600">{cfg.label}</span>
                        </div>
                        <div className="flex gap-4 text-gray-700">
                          <span>{count} ks</span>
                          <span className="w-24 text-right">{formatCzk(val)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ZÁSOBY ── */}
        {activeTab === 'zasoby' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {['all', 'skladem', 'prodano', 'vraceni', 'zaplaceno'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStavFilter(s); setSelectedItemIds(new Set()); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      stavFilter === s
                        ? 'border-[#722F37] bg-[#722F37] text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {s === 'all' ? 'Vše' : STATUS_CONFIG[s]?.label ?? s}
                    <span className="ml-1 opacity-70">
                      ({s === 'all' ? allItems.length : allItems.filter((i) => i.stav === s).length})
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {selectedItemIds.size > 0 && (
                  <>
                    {selectedItems.every((i) => i.stav === 'skladem') && (
                      <button
                        onClick={() => setShowSaleModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#722F37' }}
                      >
                        💰 Označit jako prodáno ({selectedItemIds.size})
                      </button>
                    )}
                    {selectedItems.every((i) => i.stav === 'skladem' || i.stav === 'prodano') && (
                      <button
                        onClick={() => setShowReturnModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium"
                      >
                        ↩ Označit jako vráceno ({selectedItemIds.size})
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedItemIds(new Set())}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Zrušit výběr
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={filteredItems.length > 0 && selectedItemIds.size === filteredItems.length}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded accent-[#722F37]"
                      />
                    </th>
                    <th className="px-4 py-3">Druh / Barva</th>
                    <th className="px-4 py-3">Délka</th>
                    <th className="px-4 py-3">Gramáž</th>
                    <th className="px-4 py-3 text-right">Cena</th>
                    <th className="px-4 py-3">Stav</th>
                    <th className="px-4 py-3 text-gray-400">Zásilka</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Žádné položky</td>
                    </tr>
                  )}
                  {filteredItems.map((item) => {
                    const shipment = partner.shipments.find((s) => s.id === item.shipmentId);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors ${selectedItemIds.has(item.id) ? 'bg-[#722F37]/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItemIds.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 rounded accent-[#722F37]"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.druh} — {item.barva}</td>
                        <td className="px-4 py-3 text-gray-600">{item.delkaCm} cm</td>
                        <td className="px-4 py-3 text-gray-600">{item.gramaz} g</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCzk(item.celkem)}</td>
                        <td className="px-4 py-3"><StatusBadge stav={item.stav} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {shipment ? formatDate(shipment.date) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODEJE ── */}
        {activeTab === 'prodeje' && (
          <div className="space-y-4">
            {salesLoading ? (
              <LoadingSpinner />
            ) : sales.length === 0 ? (
              <EmptyState message="Žádné prodeje" />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Položky</th>
                      <th className="px-4 py-3 text-right">Celkem</th>
                      <th className="px-4 py-3">Doklad</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{formatDate(sale.saleDate)}</td>
                        <td className="px-4 py-3 text-gray-600">{sale.items.length} ks</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCzk(sale.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            sale.invoiceType === 'fakturoid' ? 'bg-indigo-100 text-indigo-700' :
                            sale.invoiceType === 'uctenka' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {sale.invoiceType === 'fakturoid' ? 'Fakturoid' :
                             sale.invoiceType === 'uctenka' ? 'Účtenka' : 'Bez dokladu'}
                          </span>
                          {sale.invoiceNumber && (
                            <span className="ml-1 text-xs text-gray-400">#{sale.invoiceNumber}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {sale.emailSent ? (
                            <span className="text-xs text-emerald-600">✓ Odesláno</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {sale.invoiceUrl && (
                            <a
                              href={sale.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#722F37] underline"
                            >
                              Stáhnout
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── VRÁCENÍ ── */}
        {activeTab === 'vraceni' && (
          <div className="space-y-4">
            {returnsLoading ? (
              <LoadingSpinner />
            ) : returns.length === 0 ? (
              <EmptyState message="Žádná vrácení" />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Položky</th>
                      <th className="px-4 py-3">Důvod</th>
                      <th className="px-4 py-3">Potvrzeno</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {returns.map((ret) => (
                      <tr key={ret.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{formatDate(ret.returnDate)}</td>
                        <td className="px-4 py-3 text-gray-600">{ret.items.length} ks</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{ret.reason || '—'}</td>
                        <td className="px-4 py-3">
                          {ret.confirmedAt ? (
                            <span className="text-xs text-emerald-600">✓ {formatDate(ret.confirmedAt)}</span>
                          ) : (
                            <span className="text-xs text-amber-600">Čeká</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {ret.emailSent ? (
                            <span className="text-xs text-emerald-600">✓ Odesláno</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORIE ── */}
        {activeTab === 'historie' && (
          <div className="space-y-4">
            {eventsLoading ? (
              <LoadingSpinner />
            ) : events.length === 0 ? (
              <EmptyState message="Žádné události" />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {events.map((event) => {
                  const cfg = EVENT_TYPE_CONFIG[event.type] || { icon: '•', color: 'text-gray-500' };
                  return (
                    <div key={event.id} className="px-5 py-4 flex items-start gap-4">
                      <div className="mt-0.5 text-lg w-6 text-center">{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${cfg.color}`}>{event.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(event.createdAt).toLocaleString('cs-CZ')} · {event.createdBy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PLATBY ── */}
        {activeTab === 'platby' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Celkem zaplaceno: <strong className="text-gray-800">{formatCzk(stats.totalPaid)}</strong>
                <span className="ml-4">K zaplacení: <strong style={{ color: '#722F37' }}>{formatCzk(Math.max(0, soldValue - stats.totalPaid))}</strong></span>
              </div>
              <button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white font-medium"
                style={{ backgroundColor: '#722F37' }}
              >
                + Přidat platbu
              </button>
            </div>

            {showPaymentForm && (
              <form onSubmit={handleAddPayment} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Nová platba</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Částka (CZK)</label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      required
                      min="0"
                      step="1"
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Způsob platby</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Poznámka</label>
                    <input
                      type="text"
                      value={paymentForm.note}
                      onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                      placeholder="Volitelná poznámka"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    Zrušit
                  </button>
                  <button type="submit" disabled={savingPayment} className="px-5 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#722F37' }}>
                    {savingPayment ? 'Ukládám…' : 'Uložit platbu'}
                  </button>
                </div>
              </form>
            )}

            {partner.payments.length === 0 ? (
              <EmptyState message="Žádné platby" />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3 text-right">Částka</th>
                      <th className="px-4 py-3">Způsob</th>
                      <th className="px-4 py-3">Poznámka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {partner.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{formatDate(p.date)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-700">{formatCzk(p.amount)}</td>
                        <td className="px-4 py-3 text-gray-600 capitalize">{p.method}</td>
                        <td className="px-4 py-3 text-gray-500">{p.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showSaleModal && (
        <SaleModal
          partnerId={id}
          selectedItems={selectedItems}
          onClose={() => setShowSaleModal(false)}
          onSuccess={() => {
            setShowSaleModal(false);
            setSelectedItemIds(new Set());
            fetchPartner();
            if (activeTab === 'prodeje') fetchSales();
          }}
        />
      )}

      {showReturnModal && (
        <ReturnModal
          partnerId={id}
          selectedItems={selectedItems}
          onClose={() => setShowReturnModal(false)}
          onSuccess={() => {
            setShowReturnModal(false);
            setSelectedItemIds(new Set());
            fetchPartner();
            if (activeTab === 'vraceni') fetchReturns();
          }}
        />
      )}
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: 'blue' | 'green' | 'amber' | 'purple' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs opacity-60 mt-0.5">{sub}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12 text-gray-400">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-[#722F37] rounded-full animate-spin mr-2" />
      Načítám…
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400 text-sm">
      {message}
    </div>
  );
}
