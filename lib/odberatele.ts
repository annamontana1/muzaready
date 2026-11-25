/**
 * Odběratelé – várky. Čisté výpočty a číselníky (bez databáze), sdílené
 * mezi API, stránkami adminu a PDF.
 *
 * Pravidla (zadání Anny, 2026-11):
 *  - Cena culíku = gramy × (cena za gram + keratinování za gram).
 *  - Zbývá zaplatit = dluh z minula + várky od data (bez vrácených culíků) − platby.
 *  - Ceny a gramy, které Anna zadá, jsou závazné – nic se samo nepřepočítává
 *    z ceníku ani nezaokrouhluje jinak než na haléře.
 */

export const MODULE_VARKY = 'varky';
/**
 * Odběratel odebraný ze stránky Odběratelé (data zůstávají v databázi, jen se
 * nikde neukazují a nepočítají). Hodnoty b2b_partners.module:
 * 'legacy' = archiv starého B2B, 'varky' = Odběratelé, 'skryto' = odebraný.
 */
export const MODULE_SKRYTO = 'skryto';

export const TYPY_ODBERATELE = [
  { key: 'splatky', label: 'Splátky' },
  { key: 'komise', label: 'Komise' },
  { key: 'keratin', label: 'Keratinový' },
] as const;
export type TypOdberatele = (typeof TYPY_ODBERATELE)[number]['key'];

export const DRUHY = [
  'Středoevropské',
  'Panenské',
  'Východoevropské',
  'Platinum',
  'Luxe',
  'Slovanské',
  'Jiné',
] as const;

export const STAVY = [
  { key: 'predano', label: 'předáno' },
  { key: 'zaplaceno', label: 'zaplaceno' },
  { key: 'vraceno', label: 'vráceno' },
  { key: 'skladem', label: 'skladem' },
  { key: 'prodano', label: 'prodáno' },
] as const;
export type StavCuliku = (typeof STAVY)[number]['key'];

export const ZPUSOBY_PLATBY = [
  { key: 'hotove', label: 'hotově' },
  { key: 'kartou', label: 'kartou' },
  { key: 'prevodem', label: 'převodem' },
] as const;

export const TYPY_PLATBY = [
  { key: 'platba', label: 'platba' },
  { key: 'zaloha', label: 'záloha' },
  { key: 'doplatek', label: 'doplatek' },
] as const;

export function labelOf(list: ReadonlyArray<{ key: string; label: string }>, key: string | null | undefined): string {
  return list.find((x) => x.key === key)?.label ?? (key || '');
}

export function isTypOdberatele(v: unknown): v is TypOdberatele {
  return TYPY_ODBERATELE.some((t) => t.key === v);
}

export function isStav(v: unknown): v is StavCuliku {
  return STAVY.some((s) => s.key === v);
}

/** "97,5" / " 1 200 " / 97.5 → číslo; cokoli jiného → 0 */
export function num(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v ?? '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** Zaokrouhlení na haléře (kvůli plovoucí čárce, ne kvůli úpravě ceny). */
export function hal(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Date | ISO string → "YYYY-MM-DD" (datum bez času, v UTC, jak je uložené). */
export function dateKey(d: Date | string | null | undefined): string {
  if (!d) return '';
  if (typeof d === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
  }
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" → Date (půlnoc UTC) nebo null */
export function parseDateKey(s: unknown): Date | null {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "2026-11-05" → "5. 11. 2026" */
export function czDate(d: Date | string | null | undefined): string {
  const k = dateKey(d);
  if (!k) return 'Bez data';
  const [y, m, day] = k.split('-');
  return `${Number(day)}. ${Number(m)}. ${y}`;
}

export function formatKc(n: number): string {
  return `${Math.round(n).toLocaleString('cs-CZ')} Kč`;
}

export interface CulikCeny {
  gramaz: number;
  cenaPerGram: number;
  keratinPerGram?: number | null;
  stav?: string | null;
}

export const cenaVlasy = (r: CulikCeny): number => (r.gramaz || 0) * (r.cenaPerGram || 0);
export const cenaKeratin = (r: CulikCeny): number => (r.gramaz || 0) * (r.keratinPerGram || 0);
/** Cena = gramy × (cena za gram + keratinování za gram) */
export const cenaCelkem = (r: CulikCeny): number => cenaVlasy(r) + cenaKeratin(r);

export const jeVraceno = (r: { stav?: string | null }): boolean => r.stav === 'vraceno';

export interface VarkaSouhrn {
  pocet: number;
  gramy: number;
  vlasy: number;
  keratin: number;
  celkem: number;
  /** celkem bez vrácených culíků – tahle částka jde do dluhu */
  celkemBezVracenych: number;
  /** culíky ve stavu „zaplaceno“ (jen přehled – z dluhu odečítají až zapsané platby) */
  zaplaceno: number;
  /** culíky ve stavu „vráceno“ */
  vraceno: number;
  /** celkem − zaplaceno − vráceno */
  nezaplaceno: number;
}

export function souhrnVarky(items: CulikCeny[]): VarkaSouhrn {
  const s: VarkaSouhrn = {
    pocet: items.length,
    gramy: 0,
    vlasy: 0,
    keratin: 0,
    celkem: 0,
    celkemBezVracenych: 0,
    zaplaceno: 0,
    vraceno: 0,
    nezaplaceno: 0,
  };
  for (const r of items) {
    const cena = cenaCelkem(r);
    s.gramy += r.gramaz || 0;
    s.vlasy += cenaVlasy(r);
    s.keratin += cenaKeratin(r);
    s.celkem += cena;
    if (jeVraceno(r)) s.vraceno += cena;
    else s.celkemBezVracenych += cena;
    if (r.stav === 'zaplaceno') s.zaplaceno += cena;
  }
  s.nezaplaceno = s.celkem - s.zaplaceno - s.vraceno;
  return s;
}

/** Várka se počítá do dluhu, když je nastavené „Várky počítat od“ a várka není starší. */
export function pocitaSeDoDluhu(debtFrom: Date | string | null | undefined, datumVarky: Date | string | null | undefined): boolean {
  const from = dateKey(debtFrom);
  const d = dateKey(datumVarky);
  return !!from && !!d && d >= from;
}

export interface DluhVstup {
  openingDebt: number;
  debtFrom: Date | string | null | undefined;
  varky: Array<{ date: Date | string | null | undefined; items: CulikCeny[] }>;
  platby: Array<{ amount: number }>;
}

export interface Dluh {
  dluhZMinula: number;
  varkyOdData: number;
  zaplaceno: number;
  zbyva: number;
}

/** Zbývá zaplatit = dluh z minula + várky od data (bez vrácených culíků) − platby */
export function spocitejDluh(v: DluhVstup): Dluh {
  const dluhZMinula = v.openingDebt || 0;
  const varkyOdData = v.varky.reduce(
    (a, b) => a + (pocitaSeDoDluhu(v.debtFrom, b.date) ? souhrnVarky(b.items).celkemBezVracenych : 0),
    0
  );
  const zaplaceno = v.platby.reduce((a, p) => a + (p.amount || 0), 0);
  return { dluhZMinula, varkyOdData, zaplaceno, zbyva: dluhZMinula + varkyOdData - zaplaceno };
}

/** "Jaroslav Vlček" → "jaroslav-vlcek" (názvy souborů) */
export function slug(s: string): string {
  return (
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'odberatel'
  );
}

/** "2026-11" → { start, end } (UTC, end je první den dalšího měsíce) */
export function monthRange(month: string): { start: Date; end: Date } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return { start: new Date(Date.UTC(y, mo - 1, 1)), end: new Date(Date.UTC(y, mo, 1)) };
}

// ── Marže ──────────────────────────────────────────────────────────────────

export interface MarzeRadek {
  trzby: number;
  /** tržby položek, u kterých známe náklad – jen z nich se počítá marže */
  trzbySNakladem: number;
  naklady: number;
  marze: number;
  pocet: number;
  chybiNaklad: number;
}

export const prazdnaMarze = (): MarzeRadek => ({ trzby: 0, trzbySNakladem: 0, naklady: 0, marze: 0, pocet: 0, chybiNaklad: 0 });

/** Přičte jednu položku. Bez nákladu (null nebo 0) se do marže nepočítá, jen do tržeb. */
export function pridejDoMarze(r: MarzeRadek, trzba: number, naklad: number | null): void {
  r.pocet += 1;
  r.trzby += trzba;
  if (naklad === null || naklad <= 0) {
    r.chybiNaklad += 1;
    return;
  }
  r.trzbySNakladem += trzba;
  r.naklady += naklad;
  r.marze += trzba - naklad;
}

export function sectiMarze(a: MarzeRadek, b: MarzeRadek): MarzeRadek {
  return {
    trzby: a.trzby + b.trzby,
    trzbySNakladem: a.trzbySNakladem + b.trzbySNakladem,
    naklady: a.naklady + b.naklady,
    marze: a.marze + b.marze,
    pocet: a.pocet + b.pocet,
    chybiNaklad: a.chybiNaklad + b.chybiNaklad,
  };
}

export interface CulikMarze extends CulikCeny {
  nakladPerGram?: number | null;
}

/** Čistá marže culíku = gramy × (cena + keratinování) − gramy × náklad. Vrácené culíky se nepočítají. */
export function pridejCulikDoMarze(r: MarzeRadek, c: CulikMarze): void {
  if (jeVraceno(c)) return;
  const naklad = c.nakladPerGram === null || c.nakladPerGram === undefined ? null : (c.gramaz || 0) * c.nakladPerGram;
  pridejDoMarze(r, cenaCelkem(c), naklad);
}

export interface MarzeMesice {
  mesic: string; // YYYY-MM
  celkem: MarzeRadek;
  odberatele: Array<{ id: string; name: string; marze: MarzeRadek }>;
}

/** Marže odběratelů po měsících podle data várky (předání), od nejnovějšího měsíce. */
export function marzePoMesicich(
  odberatele: Array<{ id: string; name: string; varky: Array<{ date: Date | string | null | undefined; items: CulikMarze[] }> }>
): MarzeMesice[] {
  const mesice = new Map<string, MarzeMesice>();
  for (const o of odberatele) {
    for (const v of o.varky) {
      const mesic = dateKey(v.date).slice(0, 7);
      if (!mesic || v.items.length === 0) continue;
      if (!mesice.has(mesic)) mesice.set(mesic, { mesic, celkem: prazdnaMarze(), odberatele: [] });
      const m = mesice.get(mesic)!;
      let radek = m.odberatele.find((x) => x.id === o.id);
      if (!radek) {
        radek = { id: o.id, name: o.name, marze: prazdnaMarze() };
        m.odberatele.push(radek);
      }
      for (const c of v.items) {
        pridejCulikDoMarze(radek.marze, c);
        pridejCulikDoMarze(m.celkem, c);
      }
    }
  }
  return Array.from(mesice.values()).sort((a, b) => b.mesic.localeCompare(a.mesic));
}
