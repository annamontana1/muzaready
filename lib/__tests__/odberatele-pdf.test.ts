import { describe, it, expect } from 'vitest';
import { sestavStrany, PdfVarka } from '../../app/admin/odberatele/pdf';

const culik = (over: Record<string, unknown> = {}) => ({
  druh: 'Platinum',
  barva: 'Blond',
  delkaCm: 55,
  gramaz: 150,
  cenaPerGram: 95,
  keratinPerGram: 10,
  stav: 'predano',
  notes: '',
  ...over,
});

const varka = (over: Partial<PdfVarka> = {}): PdfVarka => ({
  odberatel: 'Jaroslav Vlček',
  keratinovy: true,
  datum: '2026-11-06',
  culiky: [culik(), culik({ delkaCm: 70, gramaz: 200, cenaPerGram: 100 })],
  dluh: null,
  ...over,
});

describe('PDF várky pro odběratele', () => {
  it('keratinová várka rozepíše vlasy, keratinování a celkem', () => {
    const html = sestavStrany(varka(), '25. 11. 2026').join('');
    expect(html).toContain('Várka vlasů – Jaroslav Vlček');
    expect(html).toContain('Předáno 6. 11. 2026');
    expect(html).toContain('14 250 Kč'); // vlasy 150 × 95
    expect(html).toContain('1 500 Kč'); // keratinování 150 × 10
    expect(html).toContain('37 750 Kč'); // celkem za várku
  });

  it('náklad se do PDF nedostane, ani když ho někdo pošle navíc', () => {
    const html = sestavStrany(varka({ culiky: [culik({ nakladPerGram: 61.37 }) as any] }), '25. 11. 2026').join('');
    expect(html).not.toContain('61');
    expect(html.toLowerCase()).not.toContain('náklad');
    expect(html.toLowerCase()).not.toContain('marž');
  });

  it('přehled dluhu: várky zvlášť, dluh celkem, platby, zaplaceno celkem a zbývá doplatit', () => {
    const html = sestavStrany(
      varka({
        odberatel: 'Zuzka',
        keratinovy: false,
        datum: '2026-11-24',
        dluh: {
          dluhZMinula: 90000,
          debtFrom: '2026-10-28',
          varky: [
            { date: '2026-11-24', castka: 4760, tato: true },
            { date: '2026-10-28', castka: 24510, tato: false },
          ],
          tatoVMinulem: false,
          platby: [
            { date: '2026-11-24', amount: 24000, method: 'prevodem', type: 'platba' },
            { date: '2026-11-08', amount: 20510, method: 'prevodem', type: 'zaloha' },
          ],
          zbyva: 74760,
        },
      }),
      '26. 11. 2026'
    ).join('');
    expect(html).toContain('Přehled dluhu');
    expect(html).toContain('před 28. 10. 2026');
    // várky od nejstarší, tato várka označená
    expect(html.indexOf('Várka 28. 10. 2026')).toBeLessThan(html.indexOf('Várka 24. 11. 2026'));
    expect(html).toContain('tato várka');
    expect(html).toContain('Dluh celkem');
    expect(html).toContain('119\u00a0270 Kč'); // 90 000 + 24 510 + 4 760
    expect(html).toContain('Platba 8. 11. 2026');
    expect(html).toContain('záloha, převodem');
    expect(html).toContain('Zaplaceno celkem');
    expect(html).toContain('− 44\u00a0510 Kč');
    expect(html).toContain('Zbývá doplatit celkem');
    expect(html).toContain('74\u00a0760 Kč');
    expect(html).not.toContain('započtená v dluhu z minula');
  });

  it('starší várka: v přehledu není jako položka, jen poznámka, že je v dluhu z minula', () => {
    const html = sestavStrany(
      varka({
        keratinovy: false,
        datum: '2026-07-22',
        dluh: { dluhZMinula: 90000, debtFrom: '2026-10-28', varky: [{ date: '2026-10-28', castka: 24510, tato: false }], tatoVMinulem: true, platby: [], zbyva: 114510 },
      }),
      '26. 11. 2026'
    ).join('');
    expect(html).toContain('Várka z 22. 7. 2026 je už započtená v dluhu z minula.');
    expect(html).not.toContain('tato várka');
    expect(html).toContain('zatím žádná platba');
  });

  it('počet culíků se skloňuje', () => {
    expect(sestavStrany(varka({ culiky: [culik()] }), 'x').join('')).toContain('Celkem 1 culík<');
    expect(sestavStrany(varka(), 'x').join('')).toContain('Celkem 2 culíky<');
  });

  it('dlouhá várka se rozdělí na strany a součet je jen na poslední', () => {
    const strany = sestavStrany(varka({ culiky: Array.from({ length: 40 }, () => culik()) }), '25. 11. 2026');
    expect(strany.length).toBe(3);
    expect(strany[0]).not.toContain('Celkem 40 culíků');
    expect(strany[2]).toContain('Celkem 40 culíků');
  });

  it('text od Anny se escapuje', () => {
    const html = sestavStrany(varka({ culiky: [culik({ barva: '<b>x</b>', notes: '"a"' })] }), '25. 11. 2026').join('');
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).not.toContain('<b>x</b>');
  });
});
