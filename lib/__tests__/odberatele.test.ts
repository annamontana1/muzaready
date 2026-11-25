import { describe, it, expect } from 'vitest';
import {
  cenaCelkem,
  cenaKeratin,
  cenaVlasy,
  czDate,
  dateKey,
  monthRange,
  num,
  parseDateKey,
  pocitaSeDoDluhu,
  slug,
  souhrnVarky,
  spocitejDluh,
} from '../odberatele';

const c = (gramaz: number, cenaPerGram: number, keratinPerGram = 0, stav = 'predano') => ({
  gramaz,
  cenaPerGram,
  keratinPerGram,
  stav,
});

describe('cena culíku', () => {
  it('cena = gramy × (cena za gram + keratinování za gram)', () => {
    const r = c(150, 95, 10);
    expect(cenaVlasy(r)).toBe(14250);
    expect(cenaKeratin(r)).toBe(1500);
    expect(cenaCelkem(r)).toBe(15750);
  });

  it('bez keratinování je cena jen gramy × cena', () => {
    expect(cenaCelkem(c(258, 100))).toBe(25800);
    expect(cenaCelkem({ gramaz: 258, cenaPerGram: 100, keratinPerGram: null })).toBe(25800);
  });
});

describe('souhrn várky', () => {
  it('keratinová várka: vlasy, keratinování a celkem zvlášť', () => {
    const s = souhrnVarky([c(150, 95, 10), c(200, 100, 10)]);
    expect(s).toMatchObject({ pocet: 2, gramy: 350, vlasy: 34250, keratin: 3500, celkem: 37750 });
  });

  it('vrácený culík se počítá do hodnoty várky, ale ne do dluhu', () => {
    const s = souhrnVarky([c(100, 100), c(50, 80, 0, 'vraceno')]);
    expect(s.celkem).toBe(14000);
    expect(s.celkemBezVracenych).toBe(10000);
  });
});

describe('zaplacené culíky ve várce', () => {
  it('rozdělí várku na zaplaceno, vráceno a zbývá', () => {
    const s = souhrnVarky([c(150, 95, 10), c(200, 100, 10, 'zaplaceno'), c(100, 50, 0, 'vraceno')]);
    expect(s.celkem).toBe(42750);
    expect(s.zaplaceno).toBe(22000);
    expect(s.vraceno).toBe(5000);
    expect(s.nezaplaceno).toBe(15750);
  });
});

describe('dluh', () => {
  // čísla z artefaktu „Odběratelé várky“ (Salon Cool, 5. 11. 2026)
  const varka = [c(258, 100), c(168, 97), c(153, 107), c(87, 97), c(228, 100), c(167, 115), c(128, 145), c(200, 150)];

  it('zbývá = dluh z minula + várky od data − platby', () => {
    const d = spocitejDluh({
      openingDebt: 153539,
      debtFrom: '2026-11-05',
      varky: [{ date: '2026-11-05', items: varka }],
      platby: [{ amount: 50000 }],
    });
    expect(d).toEqual({ dluhZMinula: 153539, varkyOdData: 157471, zaplaceno: 50000, zbyva: 261010 });
  });

  it('várka starší než „počítat od“ je už v dluhu z minula', () => {
    const d = spocitejDluh({
      openingDebt: 90000,
      debtFrom: '2026-10-28',
      varky: [
        { date: '2026-07-22', items: [c(443, 90)] },
        { date: '2026-10-28', items: [c(258, 95)] },
      ],
      platby: [{ amount: 20510 }],
    });
    expect(d.varkyOdData).toBe(24510);
    expect(d.zbyva).toBe(94000);
  });

  it('bez data „počítat od“ se várky do dluhu nepočítají', () => {
    const d = spocitejDluh({ openingDebt: 0, debtFrom: null, varky: [{ date: '2026-11-06', items: [c(200, 100, 10)] }], platby: [] });
    expect(d.zbyva).toBe(0);
  });

  it('vrácené culíky dluh nezvyšují', () => {
    const d = spocitejDluh({
      openingDebt: 0,
      debtFrom: '2026-01-01',
      varky: [{ date: '2026-02-01', items: [c(100, 100), c(100, 100, 0, 'vraceno')] }],
      platby: [],
    });
    expect(d.zbyva).toBe(10000);
  });

  it('pocitaSeDoDluhu porovnává jen datum', () => {
    expect(pocitaSeDoDluhu(new Date('2026-11-05T00:00:00.000Z'), '2026-11-05')).toBe(true);
    expect(pocitaSeDoDluhu('2026-11-05', '2026-11-04')).toBe(false);
    expect(pocitaSeDoDluhu('', '2026-11-04')).toBe(false);
  });
});

describe('pomocné funkce', () => {
  it('num čte českou desetinnou čárku', () => {
    expect(num('97,5')).toBe(97.5);
    expect(num(' 1 200 ')).toBe(1200);
    expect(num('abc')).toBe(0);
    expect(num(null)).toBe(0);
  });

  it('datum', () => {
    expect(dateKey(new Date('2026-11-05T00:00:00.000Z'))).toBe('2026-11-05');
    expect(dateKey('2026-11-05T00:00:00.000Z')).toBe('2026-11-05');
    expect(dateKey(null)).toBe('');
    expect(parseDateKey('2026-11-05')?.toISOString()).toBe('2026-11-05T00:00:00.000Z');
    expect(parseDateKey('5.11.2026')).toBeNull();
    expect(czDate('2026-11-05')).toBe('5. 11. 2026');
    expect(czDate('')).toBe('Bez data');
  });

  it('monthRange', () => {
    const r = monthRange('2026-12');
    expect(r?.start.toISOString()).toBe('2026-12-01T00:00:00.000Z');
    expect(r?.end.toISOString()).toBe('2027-01-01T00:00:00.000Z');
    expect(monthRange('2026-13')).toBeNull();
  });

  it('slug', () => {
    expect(slug('Jaroslav Vlček')).toBe('jaroslav-vlcek');
    expect(slug('Said Kate (Káťa)')).toBe('said-kate-kata');
  });
});
