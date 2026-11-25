'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import {
  DRUHY,
  STAVY,
  cenaCelkem,
  cenaKeratin,
  cenaVlasy,
  czDate,
  formatKc,
  num,
  pocitaSeDoDluhu,
  souhrnVarky,
  spocitejDluh,
} from '@/lib/odberatele';
import { OdberatelDetail, STAV_CLS, Tile, TypBadge, api, btnCls, btnPriCls, inputCls } from '../../../ui';
import { stahniPdfVarky } from '../../../pdf';

/** Řádek formuláře – čísla držíme jako text, aby šlo psát „97,5“. */
interface Row {
  key: string;
  id?: string;
  druh: string;
  barva: string;
  delkaCm: string;
  gramaz: string;
  cenaPerGram: string;
  keratinPerGram: string;
  nakladPerGram: string;
  stav: string;
  notes: string;
}

let keySeq = 0;
const newKey = () => `n${++keySeq}`;
const str = (n: number | null | undefined) => (n === null || n === undefined ? '' : String(n));

const calc = (r: Row) => ({
  gramaz: num(r.gramaz),
  cenaPerGram: num(r.cenaPerGram),
  keratinPerGram: num(r.keratinPerGram),
  stav: r.stav,
});

function swatch(barva: string): string {
  const b = barva.toLowerCase();
  if (b.includes('blond')) return '#E9D08F';
  if (b.includes('svět')) return '#D2AE72';
  if (b.includes('hněd')) return '#6E4B34';
  if (b.includes('tmav') || b.includes('čern')) return '#3E2A20';
  if (b.includes('zrz') || b.includes('měď')) return '#B5532E';
  return '#C8B8A0';
}

function F({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1 min-w-0 text-xs text-stone-500 ${className}`}>
      <span className="xl:sr-only">{label}</span>
      {children}
    </label>
  );
}

const numCls = `${inputCls} xl:text-right xl:px-2 xl:py-1.5 xl:text-sm`;
const txtCls = `${inputCls} xl:px-2 xl:py-1.5 xl:text-sm`;
const outCls = `${inputCls} bg-stone-50 border-stone-200 tabular-nums xl:text-right xl:px-2 xl:py-1.5 xl:text-sm`;

export default function VarkaPage() {
  const { id, varkaId } = useParams<{ id: string; varkaId: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<OdberatelDetail | null>(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showCosts, setShowCosts] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);

  const fill = useCallback(
    (d: OdberatelDetail) => {
      const v = d.varky.find((x) => x.id === varkaId);
      if (!v) {
        setError('Várka nenalezena');
        return;
      }
      setDetail(d);
      setDate(v.date);
      setRows(
        v.items.map((i) => ({
          key: i.id || newKey(),
          id: i.id,
          druh: i.druh,
          barva: i.barva,
          delkaCm: str(i.delkaCm),
          gramaz: str(i.gramaz),
          cenaPerGram: str(i.cenaPerGram),
          keratinPerGram: str(i.keratinPerGram),
          nakladPerGram: str(i.nakladPerGram),
          stav: i.stav,
          notes: i.notes || '',
        }))
      );
      setDirty(false);
    },
    [varkaId]
  );

  useEffect(() => {
    let alive = true;
    api<OdberatelDetail>(`/api/admin/odberatele/${id}`)
      .then((d) => alive && fill(d))
      .catch((err) => alive && setError(err instanceof Error ? err.message : 'Várku se nepodařilo načíst'));
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

  const keratinovy = detail?.type === 'keratin';
  const souhrn = useMemo(() => souhrnVarky(rows.map(calc)), [rows]);
  const pocitaSe = pocitaSeDoDluhu(detail?.debtFrom, date);

  function setRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setDirty(true);
  }

  function addRow() {
    const last = rows[rows.length - 1];
    setRows((rs) => [
      ...rs,
      {
        key: newKey(),
        druh: last?.druh || 'Platinum',
        barva: '',
        delkaCm: '',
        gramaz: '',
        cenaPerGram: '',
        keratinPerGram: keratinovy ? last?.keratinPerGram || '' : '0',
        nakladPerGram: '',
        stav: 'predano',
        notes: '',
      },
    ]);
    setDirty(true);
  }

  function arm(key: string, action: () => void) {
    if (armed !== key) {
      setArmed(key);
      setTimeout(() => setArmed((a) => (a === key ? null : a)), 3000);
      return;
    }
    setArmed(null);
    action();
  }

  async function save(): Promise<boolean> {
    if (!date) {
      showToast('Doplňte datum várky', 'error');
      return false;
    }
    setBusy(true);
    try {
      const d = await api<OdberatelDetail>(`/api/admin/odberatele/${id}/varky/${varkaId}`, {
        method: 'PUT',
        body: JSON.stringify({
          date,
          items: rows.map((r) => ({
            id: r.id,
            druh: r.druh,
            barva: r.barva,
            delkaCm: num(r.delkaCm),
            gramaz: num(r.gramaz),
            cenaPerGram: num(r.cenaPerGram),
            keratinPerGram: num(r.keratinPerGram),
            nakladPerGram: r.nakladPerGram.trim() === '' ? null : num(r.nakladPerGram),
            stav: r.stav,
            notes: r.notes,
          })),
        }),
      });
      fill(d);
      showToast('Várka uložena', 'success');
      return true;
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Várku se nepodařilo uložit', 'error');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function removeVarka() {
    setBusy(true);
    try {
      await api(`/api/admin/odberatele/${id}/varky/${varkaId}`, { method: 'DELETE' });
      setDirty(false);
      router.push(`/admin/odberatele/${id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Várku se nepodařilo smazat', 'error');
      setBusy(false);
    }
  }

  async function pdf() {
    if (!detail) return;
    setBusy(true);
    try {
      // PDF vzniká z cen na obrazovce; do dluhu se bere tato várka tak, jak je teď vyplněná
      const culiky = rows.map((r) => ({
        druh: r.druh,
        barva: r.barva,
        delkaCm: num(r.delkaCm),
        gramaz: num(r.gramaz),
        cenaPerGram: num(r.cenaPerGram),
        keratinPerGram: keratinovy ? num(r.keratinPerGram) : 0,
        stav: r.stav,
        notes: r.notes,
      }));
      const varky = detail.varky.map((v) => (v.id === varkaId ? { date, items: culiky } : { date: v.date, items: v.items }));
      const d = spocitejDluh({ openingDebt: detail.openingDebt, debtFrom: detail.debtFrom, varky, platby: detail.platby });
      const tatoVarka = pocitaSe ? souhrnVarky(culiky).celkemBezVracenych : 0;
      const maDluh = !!detail.debtFrom || detail.openingDebt !== 0 || detail.platby.length > 0;
      await stahniPdfVarky({
        odberatel: detail.name,
        keratinovy,
        datum: date,
        culiky,
        dluh: maDluh
          ? {
              dluhZMinula: d.dluhZMinula,
              tatoVarka,
              dalsiVarky: d.varkyOdData - tatoVarka,
              debtFrom: detail.debtFrom,
              platby: detail.platby.map((p) => ({ date: p.date, amount: p.amount, method: p.method, type: p.type })),
              zbyva: d.zbyva,
            }
          : null,
      });
    } catch (err) {
      console.error('PDF error:', err);
      showToast('PDF se nepodařilo vytvořit', 'error');
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{error}</div>
        <Link href={`/admin/odberatele/${id}`} className="text-sm font-medium text-[#722F37]">← Zpět na odběratele</Link>
      </div>
    );
  }
  if (!detail) return <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10 text-sm text-stone-500">Načítám…</div>;

  // sloupce tabulky na desktopu (pořadí = pořadí prvků v řádku)
  const cols = ['34px', '132px', 'minmax(110px,1.3fr)', '64px', '74px', '78px'];
  const heads = ['#', 'Druh', 'Barva / popis', 'Délka cm', 'Gramáž g', 'Cena Kč/g'];
  if (keratinovy) {
    cols.push('86px');
    heads.push('Keratin. Kč/g');
  }
  if (showCosts) {
    cols.push('84px');
    heads.push('Náklad Kč/g');
  }
  if (keratinovy) {
    cols.push('96px', '96px');
    heads.push('Cena vlasy', 'Cena keratin.');
  }
  cols.push('104px', '124px', 'minmax(90px,1.1fr)', '72px');
  heads.push('Celkem', 'Stav', 'Poznámka', '');
  const gridVars = { ['--cols' as string]: cols.join(' ') } as React.CSSProperties;

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-5">
      <div className="text-[13px] text-stone-500 flex flex-wrap items-center gap-1.5">
        <Link href="/admin/odberatele" className="font-medium text-[#722F37]">Odběratelé</Link>
        <span>›</span>
        <Link href={`/admin/odberatele/${id}`} className="font-medium text-[#722F37]">{detail.name}</Link>
        <span>›</span>
        <span>Várka {czDate(date)}</span>
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-stone-800 flex items-center gap-2 flex-wrap">
            Várka {czDate(date)} <TypBadge type={detail.type} />
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            {pocitaSe
              ? `Počítá se do dluhu (várky od ${czDate(detail.debtFrom)}).`
              : detail.debtFrom
              ? 'Je starší než datum „Várky počítat od“, je už v dluhu z minula.'
              : 'Do dluhu se zatím nepočítá, chybí datum „Várky počítat od“.'}
          </p>
        </div>
        <label className="flex flex-col gap-1 text-xs text-stone-500 w-[170px]">
          Datum várky
          <input type="date" className={inputCls} value={date} onChange={(e) => { setDate(e.target.value); setDirty(true); }} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Tile label="Culíků" value={String(souhrn.pocet)} />
        <Tile label="Celkem gramů" value={`${Math.round(souhrn.gramy).toLocaleString('cs-CZ')} g`} />
        <Tile label="Hodnota várky" value={formatKc(souhrn.celkem)} tone="brand" />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="w-[18px] h-[18px] accent-[#722F37]" checked={showCosts} onChange={(e) => setShowCosts(e.target.checked)} />
        Zobrazit náklad Kč/g (interní, v PDF nikdy není)
      </label>

      <div className="flex flex-col gap-2.5 xl:gap-0 xl:bg-white xl:rounded-xl xl:shadow-sm xl:overflow-hidden" style={gridVars}>
        <div className="hidden xl:grid xl:[grid-template-columns:var(--cols)] gap-2 px-3.5 py-2.5 text-[11px] uppercase tracking-wide text-stone-500 bg-stone-50 border-b border-stone-200 items-end">
          {heads.map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm xl:shadow-none px-4 py-8 text-sm text-stone-500">
            Várka je zatím prázdná. Přidejte první culík.
          </div>
        )}

        {rows.map((r, i) => {
          const c = calc(r);
          return (
            <div key={r.key} className="bg-white rounded-xl shadow-sm p-3 xl:rounded-none xl:shadow-none xl:px-3.5 xl:py-2 xl:border-t xl:first:border-t-0 border-stone-200">
              <div className="grid grid-cols-3 gap-2 items-end xl:items-center xl:[grid-template-columns:var(--cols)]">
                <span className="col-span-2 xl:col-span-1 self-center flex items-center gap-2 text-sm font-semibold text-stone-800 xl:font-medium xl:text-stone-500">
                  <span className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-stone-300 flex-none" style={{ background: swatch(r.barva) }} />
                  <span><span className="xl:hidden">Culík </span>{i + 1}</span>
                </span>
                <F label="Druh" className="order-2 xl:order-none">
                  <select className={txtCls} value={r.druh} onChange={(e) => setRow(r.key, { druh: e.target.value })}>
                    {!DRUHY.includes(r.druh as (typeof DRUHY)[number]) && <option value={r.druh}>{r.druh}</option>}
                    {DRUHY.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </F>
                <F label="Barva / popis" className="order-1 col-span-2 xl:order-none xl:col-span-1">
                  <input className={txtCls} value={r.barva} onChange={(e) => setRow(r.key, { barva: e.target.value })} />
                </F>
                <F label="Délka (cm)" className="order-3 xl:order-none">
                  <input inputMode="decimal" className={numCls} value={r.delkaCm} onChange={(e) => setRow(r.key, { delkaCm: e.target.value })} />
                </F>
                <F label="Gramáž (g)" className="order-4 xl:order-none">
                  <input inputMode="decimal" className={numCls} value={r.gramaz} onChange={(e) => setRow(r.key, { gramaz: e.target.value })} />
                </F>
                <F label="Cena Kč/g" className="order-5 xl:order-none">
                  <input inputMode="decimal" className={`${numCls} font-semibold border-[#722F37]`} value={r.cenaPerGram} onChange={(e) => setRow(r.key, { cenaPerGram: e.target.value })} />
                </F>
                {keratinovy && (
                  <F label="Keratin. Kč/g" className="order-7 xl:order-none">
                    <input inputMode="decimal" className={`${numCls} font-semibold border-[#722F37]`} value={r.keratinPerGram} onChange={(e) => setRow(r.key, { keratinPerGram: e.target.value })} />
                  </F>
                )}
                {showCosts && (
                  <F label="Náklad Kč/g" className="order-8 xl:order-none">
                    <input inputMode="decimal" placeholder="–" className={numCls} value={r.nakladPerGram} onChange={(e) => setRow(r.key, { nakladPerGram: e.target.value })} />
                  </F>
                )}
                {keratinovy && (
                  <>
                    <F label="Cena vlasy" className="order-9 xl:order-none">
                      <input readOnly tabIndex={-1} className={outCls} value={formatKc(cenaVlasy(c))} />
                    </F>
                    <F label="Cena keratin." className="order-10 xl:order-none">
                      <input readOnly tabIndex={-1} className={outCls} value={formatKc(cenaKeratin(c))} />
                    </F>
                  </>
                )}
                <F label={keratinovy ? 'Celkem' : 'Cena celkem'} className={`order-11 xl:order-none ${keratinovy ? '' : 'col-span-2 xl:col-span-1'}`}>
                  <input readOnly tabIndex={-1} className={`${outCls} font-semibold`} value={formatKc(cenaCelkem(c))} />
                </F>
                <F label="Stav" className="order-6 xl:order-none">
                  <select className={`${txtCls} font-semibold ${STAV_CLS[r.stav] || ''}`} value={r.stav} onChange={(e) => setRow(r.key, { stav: e.target.value })}>
                    {!STAVY.some((s) => s.key === r.stav) && <option value={r.stav}>{r.stav}</option>}
                    {STAVY.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </F>
                <F label="Poznámka" className="order-12 col-span-3 xl:order-none xl:col-span-1">
                  <input className={txtCls} value={r.notes} onChange={(e) => setRow(r.key, { notes: e.target.value })} />
                </F>
                <button
                  type="button"
                  onClick={() => arm(`r-${r.key}`, () => { setRows((rs) => rs.filter((x) => x.key !== r.key)); setDirty(true); })}
                  className="justify-self-end px-2 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg whitespace-nowrap"
                >
                  {armed === `r-${r.key}` ? 'Opravdu?' : 'Smazat'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button type="button" onClick={addRow} className={btnCls}>+ Přidat culík</button>
        <button
          type="button"
          onClick={() => arm('varka', removeVarka)}
          disabled={busy}
          className="px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg ml-auto"
        >
          {armed === 'varka' ? 'Opravdu smazat celou várku?' : 'Smazat várku'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 max-w-lg text-[15px] tabular-nums">
        <h3 className="text-base font-semibold text-stone-800 mb-2">Souhrn várky</h3>
        {keratinovy && (
          <>
            <div className="flex justify-between gap-3 py-1"><span>Cena za vlasy</span><b>{formatKc(souhrn.vlasy)}</b></div>
            <div className="flex justify-between gap-3 py-1"><span>Cena za keratinování</span><b>{formatKc(souhrn.keratin)}</b></div>
          </>
        )}
        <div className={`flex justify-between gap-3 text-lg font-bold ${keratinovy ? 'border-t-2 border-[#722F37] mt-2 pt-2.5' : 'py-1'}`}>
          <span>Celkem za várku</span><span className="text-[#722F37]">{formatKc(souhrn.celkem)}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-stone-200">
          <div className="flex justify-between gap-3 py-1"><span>Zaplacené culíky</span><b className="text-emerald-700">− {formatKc(souhrn.zaplaceno)}</b></div>
          {souhrn.vraceno > 0 && (
            <div className="flex justify-between gap-3 py-1"><span>Vrácené culíky</span><b className="text-stone-500">− {formatKc(souhrn.vraceno)}</b></div>
          )}
          <div className="flex justify-between gap-3 py-1 text-base font-bold">
            <span>Zbývá za tuto várku</span><span className="text-amber-600">{formatKc(souhrn.nezaplaceno)}</span>
          </div>
        </div>
        <p className="text-[13px] text-stone-500 mt-3">
          Počítá se podle stavu culíků. Z celkového dluhu odběratele se částka odečte, až když zapíšete platbu nebo zálohu.{' '}
          <Link href={`/admin/odberatele/${id}#platby`} className="font-semibold text-[#722F37] underline whitespace-nowrap">
            Zapsat platbu nebo zálohu
          </Link>
        </p>
      </div>

      <div className="sticky bottom-0 bg-stone-50/95 backdrop-blur border-t border-stone-200 -mx-4 px-4 lg:-mx-6 lg:px-6 py-3 flex items-center justify-between gap-3 flex-wrap pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <span className="text-[13px] text-stone-500">
          {dirty ? 'Neuložené změny' : 'Vše uloženo'}
          <span className="hidden sm:inline"> · cena = gramy × (cena za gram{keratinovy ? ' + keratinování za gram' : ''})</span>
        </span>
        <div className="flex gap-2 ml-auto">
          {dirty && <button onClick={() => fill(detail)} className={btnCls}>Zahodit změny</button>}
          <button onClick={pdf} disabled={busy || rows.length === 0} className={btnCls}>PDF pro odběratele</button>
          <button onClick={save} disabled={busy || !dirty} className={btnPriCls}>{busy ? 'Pracuji…' : 'Uložit'}</button>
        </div>
      </div>
    </div>
  );
}
