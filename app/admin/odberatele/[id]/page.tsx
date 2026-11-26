'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import {
  STAVY,
  TYPY_ODBERATELE,
  TYPY_PLATBY,
  ZPUSOBY_PLATBY,
  czDate,
  formatKc,
  num,
  pocetCuliku,
  pocitaSeDoDluhu,
  spocitejDluh,
} from '@/lib/odberatele';
import {
  NovyOdberatelForm,
  OdberatelDetail,
  OdberatelSummary,
  OdberateleTabs,
  STAV_CLS,
  Tile,
  TypBadge,
  api,
  btnCls,
  btnPriCls,
  inputCls,
} from '../ui';

interface PlatbaForm {
  key: string;
  id?: string;
  date: string;
  amount: string;
  method: string;
  type: string;
  note: string;
}

const today = () => new Date().toLocaleDateString('sv-SE');
let keySeq = 0;
const newKey = () => `n${++keySeq}`;

const POPIS: Record<string, string> = {
  keratin: 'U každého culíku se počítá cena vlasů a cena keratinování zvlášť.',
  komise: 'Culíky u odběratele: skladem, prodáno, zaplaceno nebo vráceno.',
  splatky: 'Dluh se splácí postupně, platby se odečítají.',
};

export default function OdberatelPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<OdberatelDetail | null>(null);
  const [list, setList] = useState<OdberatelSummary[]>([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'varky' | 'platby'>('varky');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  // úprava odběratele
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState({ name: '', type: 'keratin', notes: '' });

  // karta Dluh a platby
  const [opening, setOpening] = useState('0');
  const [debtFrom, setDebtFrom] = useState('');
  const [platby, setPlatby] = useState<PlatbaForm[]>([]);
  const [dirty, setDirty] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);

  const fill = useCallback((d: OdberatelDetail) => {
    setDetail(d);
    setEdit({ name: d.name, type: d.type, notes: d.notes || '' });
    setOpening(String(d.openingDebt || 0));
    setDebtFrom(d.debtFrom || '');
    setPlatby(
      d.platby.map((p) => ({
        key: p.id || newKey(),
        id: p.id,
        date: p.date,
        amount: String(p.amount),
        method: p.method,
        type: p.type,
        note: p.note || '',
      }))
    );
    setDirty(false);
  }, []);

  useEffect(() => {
    if (window.location.hash === '#platby') setTab('platby');
  }, []);

  useEffect(() => {
    let alive = true;
    setDetail(null);
    setError('');
    Promise.all([api<OdberatelDetail>(`/api/admin/odberatele/${id}`), api<{ odberatele: OdberatelSummary[] }>('/api/admin/odberatele')])
      .then(([d, l]) => {
        if (!alive) return;
        fill(d);
        setList(l.odberatele);
      })
      .catch((err) => alive && setError(err instanceof Error ? err.message : 'Odběratele se nepodařilo načíst'));
    return () => {
      alive = false;
    };
  }, [id, fill]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const dluh = useMemo(
    () =>
      spocitejDluh({
        openingDebt: num(opening),
        debtFrom,
        varky: (detail?.varky || []).map((v) => ({ date: v.date, items: v.items })),
        platby: platby.map((p) => ({ amount: num(p.amount) })),
      }),
    [opening, debtFrom, platby, detail]
  );

  // culíky označené „zaplaceno“ ve várkách, které jdou do dluhu (bez data „počítat od“ ve všech)
  const zaplaceneCuliky = useMemo(
    () =>
      (detail?.varky || [])
        .filter((v) => !debtFrom || pocitaSeDoDluhu(debtFrom, v.date))
        .reduce((a, v) => a + v.souhrn.zaplaceno, 0),
    [detail, debtFrom]
  );

  function switchTab(t: 'varky' | 'platby') {
    setTab(t);
    window.history.replaceState(null, '', t === 'platby' ? '#platby' : window.location.pathname);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api<OdberatelDetail>(`/api/admin/odberatele/${id}`, { method: 'PUT', body: JSON.stringify(edit) });
      // rozpracované platby nepřepisovat – měníme jen jméno, typ a poznámku
      setDetail(d);
      setList((l) => l.map((o) => (o.id === d.id ? { ...o, name: d.name, type: d.type } : o)));
      setEditing(false);
      showToast('Odběratel uložen', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Změny se nepodařilo uložit', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function addVarka() {
    setBusy(true);
    try {
      const r = await api<{ id: string }>(`/api/admin/odberatele/${id}/varky`, { method: 'POST', body: JSON.stringify({ date: today() }) });
      router.push(`/admin/odberatele/${id}/varka/${r.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Várku se nepodařilo založit', 'error');
      setBusy(false);
    }
  }

  async function saveDluh() {
    if (platby.some((p) => !p.date)) return showToast('U každé platby doplňte datum', 'error');
    setBusy(true);
    try {
      const d = await api<OdberatelDetail>(`/api/admin/odberatele/${id}/dluh`, {
        method: 'PUT',
        body: JSON.stringify({
          openingDebt: num(opening),
          debtFrom,
          platby: platby.map((p) => ({ id: p.id, date: p.date, amount: num(p.amount), method: p.method, type: p.type, note: p.note })),
        }),
      });
      fill(d);
      showToast('Dluh a platby uloženy', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Dluh a platby se nepodařilo uložit', 'error');
    } finally {
      setBusy(false);
    }
  }

  function setPlatba(key: string, patch: Partial<PlatbaForm>) {
    setPlatby((ps) => ps.map((p) => (p.key === key ? { ...p, ...patch } : p)));
    setDirty(true);
  }

  function removePlatba(key: string) {
    if (armed !== key) {
      setArmed(key);
      setTimeout(() => setArmed((a) => (a === key ? null : a)), 3000);
      return;
    }
    setPlatby((ps) => ps.filter((p) => p.key !== key));
    setArmed(null);
    setDirty(true);
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{error}</div>
        <Link href="/admin/odberatele" className="text-sm font-medium text-[#722F37]">← Zpět na odběratele</Link>
      </div>
    );
  }
  if (!detail) return <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10 text-sm text-stone-500">Načítám…</div>;

  const varkyCols = 'lg:grid-cols-[140px_90px_100px_minmax(0,1fr)_140px_140px_16px]';
  const platbaCols = 'lg:grid-cols-[150px_130px_140px_140px_minmax(0,1fr)_auto]';

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-5">
      <div className="text-[13px] text-stone-500 flex flex-wrap items-center gap-1.5">
        <Link href="/admin/odberatele" className="font-medium text-[#722F37]">Odběratelé</Link>
        <span>›</span>
        <span>{detail.name}</span>
      </div>

      <OdberateleTabs odberatele={list} activeId={detail.id} onAdd={() => setAdding(true)} />

      {adding && (
        <NovyOdberatelForm
          onCancel={() => setAdding(false)}
          onError={(m) => showToast(m, 'error')}
          onCreated={(newId) => {
            setAdding(false);
            router.push(`/admin/odberatele/${newId}`);
          }}
        />
      )}

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-stone-800 flex items-center gap-2 flex-wrap">
            {detail.name} <TypBadge type={detail.type} />
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">{POPIS[detail.type] || ''}</p>
          {detail.notes && <p className="text-sm text-stone-600 mt-1">{detail.notes}</p>}
        </div>
        <button onClick={() => setEditing((v) => !v)} className={btnCls}>Upravit odběratele</button>
      </div>

      {editing && (
        <form onSubmit={saveEdit} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 grid gap-3 sm:grid-cols-2 max-w-3xl">
          <label className="flex flex-col gap-1 text-xs text-stone-500">
            Jméno nebo název
            <input className={inputCls} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-stone-500">
            Typ odběratele
            <select className={inputCls} value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value })}>
              {TYPY_ODBERATELE.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-stone-500 sm:col-span-2">
            Poznámka (jen pro vás)
            <input className={inputCls} value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className={btnPriCls}>Uložit</button>
            <button type="button" onClick={() => setEditing(false)} className={btnCls}>Zrušit</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Tile label="Zbývá zaplatit" value={formatKc(dluh.zbyva)} tone="amber" />
        <Tile label="Dluh z minula" value={formatKc(dluh.dluhZMinula)} />
        <Tile label={debtFrom ? `Várky od ${czDate(debtFrom)}` : 'Várky (datum chybí)'} value={formatKc(dluh.varkyOdData)} />
        <Tile label="Zaplaceno" value={formatKc(dluh.zaplaceno)} tone="green" />
      </div>

      {!debtFrom && detail.varky.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm">
          Chybí datum „Várky počítat od“. Dokud ho nenastavíte v záložce Dluh a platby, várky se do dluhu nepočítají.
        </div>
      )}

      {zaplaceneCuliky > dluh.zaplaceno && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm">
          Culíky označené jako zaplacené mají hodnotu {formatKc(zaplaceneCuliky)}, ale zapsané platby jsou jen {formatKc(dluh.zaplaceno)}.
          Z dluhu se odečítají jen platby a zálohy zapsané v záložce Dluh a platby.
        </div>
      )}

      <div className="inline-flex bg-stone-100 rounded-lg p-1 gap-0.5">
        {(['varky', 'platby'] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === t ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {t === 'varky' ? `Várky (${detail.varky.length})` : `Dluh a platby${dirty ? ' •' : ''}`}
          </button>
        ))}
      </div>

      {tab === 'varky' && (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`hidden lg:grid ${varkyCols} gap-3 px-5 py-2.5 text-xs uppercase tracking-wide text-stone-500 bg-stone-50 border-b border-stone-200`}>
              <span>Datum várky</span>
              <span className="text-right">Culíků</span>
              <span className="text-right">Gramů</span>
              <span>Stav culíků</span>
              <span>Do dluhu</span>
              <span className="text-right">Hodnota</span>
              <span />
            </div>
            {detail.varky.length === 0 && <div className="px-5 py-8 text-sm text-stone-500">Zatím žádná várka.</div>}
            {detail.varky.map((v) => {
              const pocty: Record<string, number> = {};
              v.items.forEach((i) => (pocty[i.stav] = (pocty[i.stav] || 0) + 1));
              const chips = STAVY.filter((s) => pocty[s.key]).map((s) => (
                <span key={s.key} className={`inline-block text-xs font-semibold rounded-full px-2 py-0.5 mr-1 mt-0.5 border ${STAV_CLS[s.key]}`}>
                  {pocty[s.key]}× {s.label}
                </span>
              ));
              const inDebt = pocitaSeDoDluhu(debtFrom, v.date);
              return (
                <Link
                  key={v.id}
                  href={`/admin/odberatele/${detail.id}/varka/${v.id}`}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] ${varkyCols} gap-x-3 gap-y-1 items-center px-4 lg:px-5 py-3.5 border-t first:border-t-0 border-stone-200 hover:bg-stone-50`}
                >
                  <span className="font-semibold text-stone-800">Várka {czDate(v.date)}</span>
                  <span className="hidden lg:block text-right tabular-nums">{v.souhrn.pocet}</span>
                  <span className="hidden lg:block text-right tabular-nums">{Math.round(v.souhrn.gramy).toLocaleString('cs-CZ')} g</span>
                  <span className="hidden lg:block">{chips}</span>
                  <span className="hidden lg:block text-sm">
                    {inDebt ? (
                      <span className="inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700">počítá se</span>
                    ) : (
                      <span className="text-stone-400">v dluhu z minula</span>
                    )}
                  </span>
                  <span className="row-span-2 lg:row-span-1 text-right font-bold tabular-nums text-stone-800">
                    {formatKc(v.souhrn.celkem)}
                    {v.souhrn.zaplaceno > 0 && (
                      <small className="block font-normal text-xs text-emerald-700">zaplaceno {formatKc(v.souhrn.zaplaceno)}</small>
                    )}
                    <small className="block lg:hidden font-normal text-xs text-stone-500">{inDebt ? 'počítá se do dluhu' : 'v dluhu z minula'}</small>
                  </span>
                  <span className="lg:hidden text-[13px] text-stone-500">
                    {pocetCuliku(v.souhrn.pocet)} · {Math.round(v.souhrn.gramy).toLocaleString('cs-CZ')} g
                    <span className="block">{chips}</span>
                  </span>
                  <span className="hidden lg:block text-stone-400">›</span>
                </Link>
              );
            })}
          </div>
          <button onClick={addVarka} disabled={busy} className={btnPriCls}>+ Přidat várku</button>
        </>
      )}

      {tab === 'platby' && (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-stone-800 mb-2">Platby</h3>
              {platby.length === 0 && <p className="text-sm text-stone-500 pb-3">Zatím žádná platba.</p>}
              {platby.map((p, i) => (
                <div key={p.key} className="border-t border-stone-200 py-3">
                  <div className={`grid grid-cols-2 ${platbaCols} gap-2 lg:items-end`}>
                    <label className="flex flex-col gap-1 text-xs text-stone-500">
                      Datum
                      <input type="date" className={inputCls} value={p.date} onChange={(e) => setPlatba(p.key, { date: e.target.value })} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-stone-500">
                      Částka (Kč)
                      <input inputMode="decimal" className={`${inputCls} font-semibold border-[#722F37]`} value={p.amount} onChange={(e) => setPlatba(p.key, { amount: e.target.value })} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-stone-500">
                      Způsob
                      <select className={inputCls} value={p.method} onChange={(e) => setPlatba(p.key, { method: e.target.value })}>
                        {!ZPUSOBY_PLATBY.some((m) => m.key === p.method) && <option value={p.method}>{p.method}</option>}
                        {ZPUSOBY_PLATBY.map((m) => (
                          <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-stone-500">
                      Typ
                      <select className={inputCls} value={p.type} onChange={(e) => setPlatba(p.key, { type: e.target.value })}>
                        {TYPY_PLATBY.map((t) => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-stone-500 col-span-2 lg:col-span-1">
                      Poznámka
                      <input className={inputCls} value={p.note} onChange={(e) => setPlatba(p.key, { note: e.target.value })} />
                    </label>
                    <div className="col-span-2 lg:col-span-1 flex items-center justify-between text-[13px] text-stone-500">
                      <span className="lg:hidden">platba {i + 1}</span>
                      <button type="button" onClick={() => removePlatba(p.key)} className="px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg">
                        {armed === p.key ? 'Opravdu smazat?' : 'Smazat'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-3">
                <button
                  type="button"
                  className={btnCls}
                  onClick={() => {
                    setPlatby((ps) => [...ps, { key: newKey(), date: today(), amount: '', method: 'hotove', type: 'platba', note: '' }]);
                    setDirty(true);
                  }}
                >
                  + Přidat platbu
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-stone-800 mb-3">Dluh</h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs text-stone-500">
                  Dluh z minula (Kč)
                  <input inputMode="decimal" className={inputCls} value={opening} onChange={(e) => { setOpening(e.target.value); setDirty(true); }} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-stone-500">
                  Várky počítat od
                  <input type="date" className={inputCls} value={debtFrom} onChange={(e) => { setDebtFrom(e.target.value); setDirty(true); }} />
                </label>
              </div>
              <div className="mt-4 text-[15px] tabular-nums">
                <div className="flex justify-between gap-3 py-1"><span>Dluh z minula</span><b>{formatKc(dluh.dluhZMinula)}</b></div>
                <div className="flex justify-between gap-3 py-1">
                  <span>+ Várky od {debtFrom ? czDate(debtFrom) : '(nastavte datum)'} <span className="text-stone-500">bez vrácených culíků</span></span>
                  <b>{formatKc(dluh.varkyOdData)}</b>
                </div>
                <div className="flex justify-between gap-3 py-1"><span>− Zaplaceno</span><b>{formatKc(dluh.zaplaceno)}</b></div>
                <div className="flex justify-between gap-3 border-t-2 border-[#722F37] mt-2 pt-2.5 text-lg font-bold">
                  <span>Zbývá zaplatit</span><span className="text-[#722F37]">{formatKc(dluh.zbyva)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-stone-50/95 backdrop-blur border-t border-stone-200 -mx-4 px-4 lg:-mx-6 lg:px-6 py-3 flex items-center justify-between gap-3 flex-wrap pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <span className="text-[13px] text-stone-500">{dirty ? 'Neuložené změny' : 'Vše uloženo'}</span>
            <div className="flex gap-2 ml-auto">
              {dirty && <button onClick={() => fill(detail)} className={btnCls}>Zahodit změny</button>}
              <button onClick={saveDluh} disabled={busy || !dirty} className={btnPriCls}>{busy ? 'Ukládám…' : 'Uložit'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
