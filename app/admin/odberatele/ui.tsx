'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TYPY_ODBERATELE, labelOf } from '@/lib/odberatele';

export interface OdberatelSummary {
  id: string;
  name: string;
  type: string;
  vObjednavkach?: boolean;
  pocetVarek: number;
  posledniVarka: string;
  zaplaceno: number;
  zbyva: number;
}

export interface Culik {
  id?: string;
  druh: string;
  barva: string;
  delkaCm: number;
  gramaz: number;
  cenaPerGram: number;
  keratinPerGram: number;
  nakladPerGram: number | null;
  stav: string;
  notes: string | null;
}

export interface Varka {
  id: string;
  date: string;
  pocitaSe: boolean;
  souhrn: { pocet: number; gramy: number; vlasy: number; keratin: number; celkem: number; celkemBezVracenych: number; zaplaceno: number; vraceno: number; nezaplaceno: number };
  items: Culik[];
}

export interface Platba {
  id?: string;
  date: string;
  amount: number;
  method: string;
  type: string;
  note: string | null;
}

export interface OdberatelDetail {
  id: string;
  name: string;
  type: string;
  notes: string | null;
  vObjednavkach: boolean;
  openingDebt: number;
  debtFrom: string;
  dluh: { dluhZMinula: number; varkyOdData: number; zaplaceno: number; zbyva: number };
  varky: Varka[];
  platby: Platba[];
}

export const inputCls =
  'w-full min-w-0 px-2.5 py-2 border border-stone-300 rounded-lg text-[15px] text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]';
export const btnCls =
  'px-4 py-2 border border-stone-300 bg-white text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50';
export const btnPriCls =
  'px-4 py-2 bg-[#722F37] text-white text-sm font-medium rounded-lg hover:bg-[#5a252c] transition-colors disabled:opacity-50';

const TYP_BADGE: Record<string, string> = {
  splatky: 'bg-sky-50 text-sky-700',
  komise: 'bg-amber-50 text-amber-700',
  keratin: 'bg-[#722F37]/10 text-[#722F37]',
};

export function TypBadge({ type }: { type: string }) {
  return (
    <span className={`inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap ${TYP_BADGE[type] || 'bg-stone-100 text-stone-600'}`}>
      {labelOf(TYPY_ODBERATELE, type)}
    </span>
  );
}

/** Odběratel, jehož prodeje se počítají v Objednávkách – tady jen evidence dluhu. */
export function VObjednavkachBadge() {
  return (
    <span
      title="Tržby a marže se počítají v Objednávkách. Tady se vede jen dluh a splátky."
      className="inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap bg-stone-100 text-stone-600"
    >
      počítá se v Objednávkách
    </span>
  );
}

export const STAV_CLS: Record<string, string> = {
  predano: 'bg-amber-50 text-amber-700 border-amber-200',
  zaplaceno: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  vraceno: 'bg-stone-100 text-stone-500 border-stone-200',
  skladem: 'bg-sky-50 text-sky-700 border-sky-200',
  prodano: 'bg-[#722F37]/10 text-[#722F37] border-[#722F37]/20',
};

export function Tile({ label, value, tone }: { label: string; value: string; tone?: 'amber' | 'green' | 'brand' }) {
  const color = tone === 'amber' ? 'text-amber-600' : tone === 'green' ? 'text-emerald-600' : tone === 'brand' ? 'text-[#722F37]' : 'text-stone-800';
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 min-w-0">
      <div className="text-xs sm:text-sm text-stone-500">{label}</div>
      <div className={`text-[15px] sm:text-xl font-bold mt-1 tabular-nums whitespace-nowrap ${color}`}>{value}</div>
    </div>
  );
}

/** Záložky odběratelů – stejné na detailu odběratele i na stránce várky. */
export function OdberateleTabs({ odberatele, activeId, onAdd }: { odberatele: OdberatelSummary[]; activeId?: string; onAdd?: () => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap [scrollbar-width:none]">
      {odberatele.map((o) => (
        <Link
          key={o.id}
          href={`/admin/odberatele/${o.id}`}
          className={`flex-none px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
            o.id === activeId ? 'bg-[#722F37] border-[#722F37] text-white' : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          {o.name}
        </Link>
      ))}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex-none px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-dashed border-stone-300 text-stone-500 hover:bg-white"
        >
          + Přidat odběratele
        </button>
      )}
    </div>
  );
}

export function NovyOdberatelForm({ onCreated, onCancel, onError }: { onCreated: (id: string) => void; onCancel: () => void; onError: (msg: string) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('keratin');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return onError('Doplňte jméno odběratele');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/odberatele', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Odběratele se nepodařilo založit');
      onCreated(json.id);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Odběratele se nepodařilo založit');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 space-y-3 max-w-xl">
      <h3 className="text-base font-semibold text-stone-800">Nový odběratel</h3>
      <label className="flex flex-col gap-1 text-xs text-stone-500">
        Jméno nebo název
        <input autoFocus className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Salon Krása" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-stone-500">
        Typ odběratele
        <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="keratin">Keratinový (vlasy + keratinování)</option>
          <option value="splatky">Splátky</option>
          <option value="komise">Komise</option>
        </select>
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={btnPriCls}>{saving ? 'Ukládám…' : 'Přidat'}</button>
        <button type="button" onClick={onCancel} className={btnCls}>Zrušit</button>
      </div>
    </form>
  );
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init.headers || {}) } : init?.headers,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Něco se nepovedlo');
  return json as T;
}
