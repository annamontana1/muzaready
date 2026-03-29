'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

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
  vraceni: { label: 'Vráceno', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  vraceno: { label: 'Vráceno', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
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

// ── Upravit profil partnera ─────────────────────────────────────────────────
function EditPartnerModal({ partner, onClose, onSuccess }: { partner: B2bPartnerDetail; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [name, setName] = useState(partner.name);
  const [contactName, setContactName] = useState(partner.contactName ?? '');
  const [email, setEmail] = useState(partner.email ?? '');
  const [phone, setPhone] = useState(partner.phone ?? '');
  const [ico, setIco] = useState(partner.ico ?? '');
  const [address, setAddress] = useState(partner.address ?? '');
  const [notes, setNotes] = useState(partner.notes ?? '');
  const [type, setType] = useState<'komise' | 'splatky'>(partner.type);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) { showToast('Vyplňte název partnera', 'error'); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/b2b/${partner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contactName, email, phone, ico, address, notes, type }),
    });
    setSaving(false);
    if (res.ok) { showToast('Profil uložen ✓', 'success'); onSuccess(); }
    else { const d = await res.json(); showToast(d.error || 'Chyba při ukládání', 'error'); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Upravit profil partnera</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Název / Jméno *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kontaktní osoba</label>
              <input value={contactName} onChange={e => setContactName(e.target.value)}
                placeholder="Jméno příjmení"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Typ spolupráce</label>
              <select value={type} onChange={e => setType(e.target.value as 'komise' | 'splatky')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="komise">Komisní prodej</option>
                <option value="splatky">Splátkový prodej</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="partner@email.cz"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+420 xxx xxx xxx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">IČO</label>
              <input value={ico} onChange={e => setIco(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="12345678" inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Adresa</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Ulice č.p., PSČ Město"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Poznámky (interní)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Interní poznámky…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50">Zrušit</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-4 py-2.5 bg-[#722F37] text-white rounded-lg text-sm font-semibold hover:bg-[#5a252c] disabled:opacity-50">
              {saving ? 'Ukládám…' : '✓ Uložit profil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upravit položku zásoby ──────────────────────────────────────────────────
function EditItemModal({ partnerId, item, onClose, onSuccess }: { partnerId: string; item: B2bItem; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [druh, setDruh] = useState(item.druh);
  const [barva, setBarva] = useState(item.barva);
  const [delkaCm, setDelkaCm] = useState(item.delkaCm);
  const [gramaz, setGramaz] = useState(item.gramaz);
  const [cenaPerGram, setCenaPerGram] = useState(Number(item.cenaPerGram));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/b2b/${partnerId}/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ druh, barva, delkaCm, gramaz, cenaPerGram }),
    });
    setSaving(false);
    if (res.ok) { showToast('Položka upravena ✓', 'success'); onSuccess(); }
    else { const d = await res.json(); showToast(d.error || 'Chyba', 'error'); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Upravit položku</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Druh</label>
              <input value={druh} onChange={e => setDruh(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Barva / odstín</label>
              <input value={barva} onChange={e => setBarva(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Délka (cm)</label>
              <input type="number" value={delkaCm} onChange={e => setDelkaCm(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gramáž (g)</label>
              <input type="number" value={gramaz} onChange={e => setGramaz(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cena / g (Kč)</label>
              <input type="number" value={cenaPerGram} onChange={e => setCenaPerGram(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <div className="bg-stone-50 rounded-lg px-3 py-2 text-sm w-full border border-stone-200">
                <span className="text-stone-500 text-xs block">Celkem</span>
                <span className="font-bold text-[#722F37]">{Math.round(gramaz * cenaPerGram).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50">Zrušit</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-[#722F37] text-white rounded-lg text-sm font-semibold hover:bg-[#5a252c] disabled:opacity-50">
              {saving ? 'Ukládám…' : '✓ Uložit změny'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Přidat zásilku ──────────────────────────────────────────────────────────
interface ShipmentItem { druh: string; barva: string; delkaCm: number; gramaz: number; cenaPerGram: number; }

function ShipmentModal({ partnerId, onClose, onSuccess }: { partnerId: string; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const emptyItem = (): ShipmentItem => ({ druh: '', barva: '', delkaCm: 50, gramaz: 100, cenaPerGram: 0 });
  const [items, setItems] = useState<ShipmentItem[]>([emptyItem()]);

  function updateItem(idx: number, field: keyof ShipmentItem, value: string | number) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  }

  async function handleSave() {
    if (items.some(it => !it.druh || it.cenaPerGram <= 0)) {
      showToast('Vyplňte druh a cenu u všech položek', 'error'); return;
    }
    setSaving(true);
    const res = await fetch(`/api/admin/b2b/${partnerId}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, notes, items: items.map(it => ({ ...it, celkem: Math.round(it.gramaz * it.cenaPerGram) })) }),
    });
    setSaving(false);
    if (res.ok) { showToast('Zásilka přidána ✓', 'success'); onSuccess(); }
    else { const d = await res.json(); showToast(d.error || 'Chyba', 'error'); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">+ Přidat zásilku do komise</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Datum zásilky</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Poznámka (volitelné)</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Např. jarní kolekce"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-gray-600">Položky</label>
              <button onClick={() => setItems(prev => [...prev, emptyItem()])}
                className="text-xs text-[#722F37] hover:underline font-medium">+ Přidat položku</button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 items-end bg-stone-50 rounded-lg p-3 border border-stone-200">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Druh *</label>
                    <input value={item.druh} onChange={e => updateItem(idx, 'druh', e.target.value)}
                      placeholder="Platinum, Standard…"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Barva/odstín</label>
                    <input value={item.barva} onChange={e => updateItem(idx, 'barva', e.target.value)}
                      placeholder="#6"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Délka (cm)</label>
                    <input type="number" value={item.delkaCm} onChange={e => updateItem(idx, 'delkaCm', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Gramáž (g)</label>
                    <input type="number" value={item.gramaz} onChange={e => updateItem(idx, 'gramaz', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Kč/g *</label>
                    <div className="flex gap-1 items-center">
                      <input type="number" value={item.cenaPerGram || ''} onChange={e => updateItem(idx, 'cenaPerGram', Number(e.target.value))}
                        placeholder="95"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                      {items.length > 1 && (
                        <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0">×</button>
                      )}
                    </div>
                    {item.gramaz > 0 && item.cenaPerGram > 0 && (
                      <p className="text-xs text-green-700 mt-0.5 font-medium">= {Math.round(item.gramaz * item.cenaPerGram).toLocaleString('cs-CZ')} Kč</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg px-4 py-3 flex justify-between items-center text-sm border border-stone-200">
            <span className="text-stone-600 font-medium">Celková hodnota zásilky:</span>
            <span className="text-lg font-bold text-[#722F37]">
              {items.reduce((s, it) => s + Math.round(it.gramaz * it.cenaPerGram), 0).toLocaleString('cs-CZ')} Kč
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50">
              Zrušit
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-4 py-2.5 bg-[#722F37] text-white rounded-lg text-sm font-semibold hover:bg-[#5a252c] disabled:opacity-50">
              {saving ? 'Ukládám…' : '📦 Uložit zásilku'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SaleModalProps {
  partnerId: string;
  selectedItems: B2bItem[];
  onClose: () => void;
  onSuccess: () => void;
}

function SaleModal({ partnerId, selectedItems, onClose, onSuccess }: SaleModalProps) {
  const { showToast } = useToast();
  const [invoiceType, setInvoiceType] = useState<'fakturoid' | 'uctenka' | 'zadna' | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [notes, setNotes] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedSaleId, setSavedSaleId] = useState<string | null>(null);
  const [savedInvoiceUrl, setSavedInvoiceUrl] = useState<string | null>(null);

  const totalAmount = selectedItems.reduce((sum, i) => sum + i.celkem, 0);

  function handleTypeSelect(type: 'fakturoid' | 'uctenka') {
    setInvoiceType(type);
    if (type === 'fakturoid') setSendEmail(true);
  }

  const handleSubmit = async () => {
    if (!invoiceType) { setError('Vyberte typ dokladu'); return; }
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
      onSuccess();
      setSavedSaleId(data.sale?.id || data.id || null);
      setSavedInvoiceUrl(data.sale?.invoiceUrl || null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen po uložení ──────────────────────────────────────────────
  if (savedSaleId) {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.muzahair.cz'}/nahled/${savedSaleId}`;
    const waText = `Dobrý den, zde je přehled Vašeho prodeje Muzahair.cz:\n${shareUrl}`;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center space-y-5">
          <div className="text-5xl">✅</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Prodej zaznamenán</h2>
            <p className="text-stone-500 text-sm">{selectedItems.length} ks · {formatCzk(totalAmount)}</p>
            {sendEmail && <p className="text-green-600 text-xs mt-1">📧 Email odeslán partnerovi</p>}
          </div>

          <div className="space-y-3">
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">Doklad</p>
            {/* Náhled — Fakturoid PDF nebo interní stránka */}
            {savedInvoiceUrl ? (
              <a
                href={savedInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#722F37] text-white rounded-xl font-semibold hover:bg-[#5a252c] transition-colors"
              >
                👁 Náhled faktury (PDF)
              </a>
            ) : (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#722F37] text-white rounded-xl font-semibold hover:bg-[#5a252c] transition-colors"
              >
                👁 Náhled dokladu
              </a>
            )}
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              📱 Odeslat přes WhatsApp
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Odkaz zkopírován!', 'success'); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
            >
              🔗 Kopírovat odkaz na doklad
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm text-stone-500 hover:text-stone-700 underline"
          >
            Zavřít
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Zapsat prodej</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">

          {/* Položky */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Prodávané položky ({selectedItems.length})</p>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-700">{item.druh} {item.barva} {item.delkaCm} cm, {item.gramaz} g</span>
                  <span className="font-semibold text-gray-900">{formatCzk(item.celkem)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-700">Celkem</span>
              <span className="text-xl font-bold" style={{ color: '#722F37' }}>{formatCzk(totalAmount)}</span>
            </div>
          </div>

          {/* Datum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum prodeje</label>
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30"
            />
          </div>

          {/* ── Hlavní výběr: 2 velká tlačítka ── */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Chce partner fakturu?</p>
            <div className="grid grid-cols-2 gap-3">

              {/* S fakturou */}
              <button
                type="button"
                onClick={() => handleTypeSelect('fakturoid')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  invoiceType === 'fakturoid'
                    ? 'border-[#722F37] bg-[#722F37]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">🧾</span>
                <span className={`font-semibold text-sm ${invoiceType === 'fakturoid' ? 'text-[#722F37]' : 'text-gray-800'}`}>
                  ANO — s fakturou
                </span>
                <span className="text-xs text-gray-500 text-center leading-snug">
                  Oficiální faktura přes Fakturoid, automaticky odeslána emailem
                </span>
              </button>

              {/* Bez faktury */}
              <button
                type="button"
                onClick={() => handleTypeSelect('uctenka')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  invoiceType === 'uctenka'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">📋</span>
                <span className={`font-semibold text-sm ${invoiceType === 'uctenka' ? 'text-blue-700' : 'text-gray-800'}`}>
                  NE — bez faktury
                </span>
                <span className="text-xs text-gray-500 text-center leading-snug">
                  Jen interní seznam prodaného zboží (účtenka)
                </span>
              </button>
            </div>

            {/* Popis vybraného */}
            {invoiceType === 'fakturoid' && (
              <div className="mt-3 bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg px-3 py-2 text-xs text-[#722F37]">
                ✅ Fakturoid faktura bude vytvořena a odeslána partnerovi emailem
              </div>
            )}
            {invoiceType === 'uctenka' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
                📋 Vygeneruje se jednoduchý přehled prodeje — otevře se v novém okně
              </div>
            )}
          </div>

          {/* Email checkbox — viditelné vždy, ale pro fakturoid předzaškrtnuto */}
          {invoiceType && (
            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-lg px-4 py-3">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded accent-[#722F37]"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Odeslat email partnerovi</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {invoiceType === 'fakturoid'
                    ? 'Email s fakturou bude odeslán automaticky'
                    : 'Přehled prodeje bude zaslán na email partnera'}
                </p>
              </div>
            </label>
          )}

          {/* Poznámka */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka <span className="text-gray-400 font-normal">(nepovinné)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 resize-none"
              placeholder="Např. platba v hotovosti, doručeno osobně…"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !invoiceType}
            className="px-6 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#722F37' }}
          >
            {saving ? 'Ukládám…' : '✅ Potvrdit prodej'}
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

// Add 'vraceno' alias support alongside existing 'vraceni'
const STAV_VRACENO_VALUES = ['vraceni', 'vraceno'] as const;

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
  const { showToast } = useToast();
  const [partner, setPartner] = useState<B2bPartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('prehled');

  // Inventory tab
  const [stavFilter, setStavFilter] = useState<string>('all');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [editingItem, setEditingItem] = useState<B2bItem | null>(null);
  const [showEditPartner, setShowEditPartner] = useState(false);

  // Sales data
  const [sales, setSales] = useState<B2bSale[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  async function deleteItem(itemId: string) {
    if (!confirm('Smazat tuto položku ze zásoby?')) return;
    const res = await fetch(`/api/admin/b2b/${id}/items/${itemId}`, { method: 'DELETE' });
    if (res.ok) { showToast('Položka smazána', 'success'); fetchPartner(); }
    else showToast('Chyba při mazání', 'error');
  }

  async function deleteSale(saleId: string) {
    if (!confirm('Smazat tento prodej? Položky se vrátí do zásoby (stav: Skladem).')) return;
    const res = await fetch(`/api/admin/b2b/${id}/sales/${saleId}`, { method: 'DELETE' });
    if (res.ok) { showToast('Prodej smazán, položky obnoveny', 'success'); fetchSales(); fetchPartner(); }
    else showToast('Chyba při mazání prodeje', 'error');
  }

  async function generateInvoiceForSale(saleId: string) {
    setGeneratingInvoice(saleId);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/sales/${saleId}/invoice`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Faktura byla vytvořena', 'success');
        fetchSales();
      } else {
        showToast(data.error || 'Nepodařilo se vytvořit fakturu', 'error');
      }
    } catch {
      showToast('Chyba při generování faktury', 'error');
    } finally {
      setGeneratingInvoice(null);
    }
  }

  // Bulk return (quick inline, no modal)
  const [bulkReturnLoading, setBulkReturnLoading] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string | null>(null);

  const handleBulkReturn = async () => {
    if (selectedItemIds.size === 0) return;
    setBulkReturnLoading(true);
    setReturnSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/b2b/${id}/items/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: Array.from(selectedItemIds) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba při vrácení');
      const msg = `Vráceno ${data.returned} položek${partner?.email ? ', potvrzení odesláno emailem' : ''}`;
      setReturnSuccessMsg(msg);
      showToast(`✅ ${msg}`, 'success');
      setSelectedItemIds(new Set());
      fetchPartner();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Chyba při vrácení';
      showToast(message, 'error');
    } finally {
      setBulkReturnLoading(false);
    }
  };

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

  const filteredItems = stavFilter === 'all'
    ? allItems
    : stavFilter === 'vraceni'
      ? allItems.filter((i) => STAV_VRACENO_VALUES.includes(i.stav as typeof STAV_VRACENO_VALUES[number]))
      : allItems.filter((i) => i.stav === stavFilter);

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
  const returnedItems = allItems.filter((i) => STAV_VRACENO_VALUES.includes(i.stav as typeof STAV_VRACENO_VALUES[number]));
  const inStockItems = allItems.filter((i) => i.stav === 'skladem');
  const soldValue = soldItems.reduce((s, i) => s + i.celkem, 0);
  const returnedValue = returnedItems.reduce((s, i) => s + i.celkem, 0);
  const totalGiven = allItems.reduce((s, i) => s + i.celkem, 0);
  const inStockValue = inStockItems.reduce((s, i) => s + i.celkem, 0);
  const soldGrams = soldItems.reduce((s, i) => s + i.gramaz, 0);
  const returnedGrams = returnedItems.reduce((s, i) => s + i.gramaz, 0);
  const inStockGrams = inStockItems.reduce((s, i) => s + i.gramaz, 0);
  const totalGrams = allItems.reduce((s, i) => s + i.gramaz, 0);

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
              <button
                onClick={() => setShowEditPartner(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                ✏️ Upravit profil
              </button>
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
                label="Celkem dáno"
                value={formatCzk(totalGiven)}
                sub={`${totalGrams} g celkem`}
                color="gray"
              />
              {partner.type === 'komise' ? (
                <>
                  <StatCard
                    label="Zůstatek skladem"
                    value={formatCzk(inStockValue)}
                    sub={`${inStockGrams} g u ní`}
                    color="blue"
                  />
                  <StatCard
                    label="Vráceno"
                    value={formatCzk(returnedValue)}
                    sub={`${returnedGrams} g vráceno`}
                    color="amber"
                  />
                  <StatCard
                    label="K zaplacení"
                    value={formatCzk(Math.max(0, soldValue - stats.totalPaid))}
                    sub={`Prodáno: ${formatCzk(soldValue)} · Zaplaceno: ${formatCzk(stats.totalPaid)}`}
                    color="purple"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    label="Zaplaceno"
                    value={formatCzk(stats.totalPaid)}
                    sub={`z ${formatCzk(totalGiven - returnedValue)}`}
                    color="green"
                  />
                  <StatCard
                    label="Vráceno"
                    value={formatCzk(returnedValue)}
                    sub={`${returnedGrams} g vráceno`}
                    color="amber"
                  />
                  <StatCard
                    label="K zaplacení"
                    value={formatCzk(Math.max(0, totalGiven - returnedValue - stats.totalPaid))}
                    sub={`Celkem dáno − vráceno − zaplaceno`}
                    color="purple"
                  />
                </>
              )}
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
                      ({s === 'all'
                        ? allItems.length
                        : s === 'vraceni'
                          ? allItems.filter((i) => STAV_VRACENO_VALUES.includes(i.stav as typeof STAV_VRACENO_VALUES[number])).length
                          : allItems.filter((i) => i.stav === s).length})
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-stone-700 text-white font-medium hover:bg-stone-800 transition-colors"
                >
                  + Přidat zásilku
                </button>
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
                      <>
                        <button
                          onClick={handleBulkReturn}
                          disabled={bulkReturnLoading}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                          {bulkReturnLoading ? '⏳ Vracím…' : `🔄 Označit jako vráceno (${selectedItemIds.size})`}
                        </button>
                        <button
                          onClick={() => setShowReturnModal(true)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
                        >
                          ↩ Vrátit s detaily
                        </button>
                      </>
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

            {/* Bulk return success message */}
            {returnSuccessMsg && (
              <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
                <span>✅ {returnSuccessMsg}</span>
                <button onClick={() => setReturnSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 text-lg leading-none">×</button>
              </div>
            )}

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
                    <th className="px-4 py-3 w-20"></th>
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
                    const isReturned = STAV_VRACENO_VALUES.includes(item.stav as typeof STAV_VRACENO_VALUES[number]);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedItemIds.has(item.id) ? 'bg-[#722F37]/5' : isReturned ? 'opacity-60' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItemIds.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 rounded accent-[#722F37]"
                          />
                        </td>
                        <td className={`px-4 py-3 font-medium ${isReturned ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {item.druh} — {item.barva}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{item.delkaCm} cm</td>
                        <td className="px-4 py-3 text-gray-500">{item.gramaz} g</td>
                        <td className={`px-4 py-3 text-right font-medium ${isReturned ? 'text-gray-400' : 'text-gray-800'}`}>
                          {formatCzk(item.celkem)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <StatusBadge stav={item.stav} />
                            {isReturned && item.returnedAt && (
                              <span className="text-xs text-gray-400">{formatDate(item.returnedAt)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {shipment ? formatDate(shipment.date) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setEditingItem(item)} title="Upravit"
                              className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">✏️</button>
                            <button onClick={() => deleteItem(item.id)} title="Smazat"
                              className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors">🗑️</button>
                          </div>
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
                          <div className="flex items-center gap-2">
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
                            {/* Tlačítko pro zpětné vygenerování faktury */}
                            {sale.invoiceType !== 'fakturoid' && (
                              <button
                                onClick={() => generateInvoiceForSale(sale.id)}
                                disabled={generatingInvoice === sale.id}
                                className="text-xs px-2 py-1 rounded bg-[#722F37] text-white hover:bg-[#5a252c] disabled:opacity-50 transition-colors whitespace-nowrap"
                                title="Vygenerovat Fakturoid fakturu"
                              >
                                {generatingInvoice === sale.id ? '⏳' : '🧾 Faktura'}
                              </button>
                            )}
                            {sale.invoiceType === 'fakturoid' && sale.fakturoidId && (
                              <span className="text-xs text-emerald-600 font-medium">✓ #{sale.invoiceNumber || sale.fakturoidId}</span>
                            )}
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/nahled/${sale.id}`;
                                const text = `Dobrý den, zde je přehled prodeje Muzahair.cz:\n${url}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                              }}
                              className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors whitespace-nowrap"
                              title="Sdílet přes WhatsApp"
                            >
                              📱 WA
                            </button>
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/nahled/${sale.id}`;
                                navigator.clipboard.writeText(url).then(() => showToast('Odkaz zkopírován!', 'success'));
                              }}
                              className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors whitespace-nowrap"
                              title="Kopírovat odkaz"
                            >
                              🔗
                            </button>
                            <button
                              onClick={() => deleteSale(sale.id)}
                              className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
                              title="Smazat prodej"
                            >
                              🗑️
                            </button>
                          </div>
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

      {showEditPartner && partner && (
        <EditPartnerModal
          partner={partner}
          onClose={() => setShowEditPartner(false)}
          onSuccess={() => { setShowEditPartner(false); fetchPartner(); }}
        />
      )}

      {editingItem && (
        <EditItemModal
          partnerId={id}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => { setEditingItem(null); fetchPartner(); }}
        />
      )}

      {showShipmentModal && (
        <ShipmentModal
          partnerId={id}
          onClose={() => setShowShipmentModal(false)}
          onSuccess={() => {
            setShowShipmentModal(false);
            fetchPartner();
          }}
        />
      )}
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: 'blue' | 'green' | 'amber' | 'purple' | 'gray' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
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
