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

  it('přehled dluhu: dluh z minula, tato várka, platby a tučně zbývá doplatit', () => {
    const html = sestavStrany(
      varka({
        odberatel: 'Salon Cool',
        keratinovy: false,
        datum: '2026-11-05',
        dluh: {
          dluhZMinula: 153539,
          tatoVarka: 157471,
          dalsiVarky: 0,
          debtFrom: '2026-11-05',
          platby: [{ date: '2026-11-05', amount: 50000, method: 'hotove', type: 'platba' }],
          zbyva: 261010,
        },
      }),
      '25. 11. 2026'
    ).join('');
    expect(html).toContain('Přehled dluhu');
    expect(html).toContain('Platba 5. 11. 2026');
    expect(html).toContain('hotově');
    expect(html).toContain('Zbývá doplatit celkem');
    expect(html).toContain('261 010 Kč');
    expect(html).not.toContain('Další várky');
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
