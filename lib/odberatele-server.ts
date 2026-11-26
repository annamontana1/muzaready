/**
 * Odběratelé – várky: serverová část (Prisma). Všechny dotazy i zápisy jsou
 * omezené na partnery s module = 'varky', takže se nikdy nedotknou starého
 * komisního modulu (archiv).
 */
import prisma from '@/lib/prisma';
import {
  MODULE_VARKY,
  cenaCelkem,
  dateKey,
  hal,
  isStav,
  num,
  pocitaSeDoDluhu,
  souhrnVarky,
  spocitejDluh,
} from '@/lib/odberatele';

export const partnerInclude = {
  shipments: { include: { items: { orderBy: [{ sortOrder: 'asc' as const }, { id: 'asc' as const }] } } },
  payments: { orderBy: [{ date: 'asc' as const }, { createdAt: 'asc' as const }] },
};

export async function findOdberatel(id: string) {
  return prisma.b2bPartner.findFirst({ where: { id, module: MODULE_VARKY }, include: partnerInclude });
}

export type OdberatelRow = NonNullable<Awaited<ReturnType<typeof findOdberatel>>>;

function serializeVarka(p: OdberatelRow, s: OdberatelRow['shipments'][number]) {
  return {
    id: s.id,
    date: dateKey(s.date),
    notes: s.notes,
    pocitaSe: pocitaSeDoDluhu(p.debtFrom, s.date),
    souhrn: souhrnVarky(s.items),
    items: s.items.map((i) => ({
      id: i.id,
      druh: i.druh,
      barva: i.barva,
      delkaCm: i.delkaCm,
      gramaz: i.gramaz,
      cenaPerGram: i.cenaPerGram,
      keratinPerGram: i.keratinPerGram,
      nakladPerGram: i.nakladPerGram,
      stav: i.stav,
      notes: i.notes,
    })),
  };
}

export function dluhOf(p: OdberatelRow) {
  return spocitejDluh({
    openingDebt: p.openingDebt,
    debtFrom: p.debtFrom,
    varky: p.shipments.map((s) => ({ date: s.date, items: s.items })),
    platby: p.payments,
  });
}

/** Várky seřazené od nejnovější. */
export function sortedShipments(p: OdberatelRow) {
  return [...p.shipments].sort((a, b) => b.date.getTime() - a.date.getTime() || b.createdAt.getTime() - a.createdAt.getTime());
}

export function serializeOdberatel(p: OdberatelRow) {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    notes: p.notes,
    vObjednavkach: p.vObjednavkach,
    openingDebt: p.openingDebt,
    debtFrom: dateKey(p.debtFrom),
    dluh: dluhOf(p),
    varky: sortedShipments(p).map((s) => serializeVarka(p, s)),
    platby: p.payments.map((x) => ({
      id: x.id,
      date: dateKey(x.date),
      amount: x.amount,
      method: x.method,
      type: x.type,
      note: x.note,
    })),
  };
}

export function serializeSummary(p: OdberatelRow) {
  const sorted = sortedShipments(p);
  const d = dluhOf(p);
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    vObjednavkach: p.vObjednavkach,
    pocetVarek: p.shipments.length,
    posledniVarka: sorted.length ? dateKey(sorted[0].date) : '',
    zaplaceno: d.zaplaceno,
    zbyva: d.zbyva,
  };
}

const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const nonNeg = (v: unknown) => Math.max(0, num(v));

/** Vyčistí culík z formuláře. Ceny a gramy se berou tak, jak je Anna zadala. */
export function cleanItem(raw: any, keratinovy: boolean, sortOrder: number) {
  const gramaz = nonNeg(raw?.gramaz);
  const cenaPerGram = nonNeg(raw?.cenaPerGram);
  const keratinPerGram = keratinovy ? nonNeg(raw?.keratinPerGram) : 0;
  const nakladRaw = raw?.nakladPerGram;
  const nakladPerGram = nakladRaw === null || nakladRaw === undefined || String(nakladRaw).trim() === '' ? null : nonNeg(nakladRaw);
  return {
    druh: text(raw?.druh, 60) || 'Jiné',
    barva: text(raw?.barva, 200),
    delkaCm: nonNeg(raw?.delkaCm),
    gramaz,
    cenaPerGram,
    keratinPerGram,
    nakladPerGram,
    celkem: hal(cenaCelkem({ gramaz, cenaPerGram, keratinPerGram })),
    stav: isStav(raw?.stav) ? raw.stav : 'predano',
    notes: text(raw?.notes, 500) || null,
    sortOrder,
  };
}

/** Aktuální měsíc v Praze, "YYYY-MM". */
export function currentMonthPrague(now = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(now).slice(0, 7);
}
