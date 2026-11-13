import { describe, expect, it } from 'vitest';
import { buildInvoiceLines, customerEmailOf } from '../order-invoice';

const sum = (lines: { quantity: number; unitPrice: number }[]) =>
  lines.reduce((total, l) => total + l.quantity * l.unitPrice, 0);

function item(over: Partial<Parameters<typeof buildInvoiceLines>[0]['items'][number]> = {}) {
  return {
    nameSnapshot: 'Luxe – #5 rovne 50cm',
    grams: 100,
    pricePerGram: 93,
    lineTotal: 9300,
    ending: 'NONE',
    assemblyFeeCzk: 0,
    assemblyFeeTotal: 0,
    sku: null,
    ...over,
  };
}

describe('buildInvoiceLines', () => {
  it('účtuje vlasy jako gramy × Kč/g', () => {
    const lines = buildInvoiceLines({
      orderNumber: 1, subtotal: 9300, total: 9300, discountAmount: 0, items: [item()],
    });
    expect(lines).toEqual([{ name: 'Luxe – #5 rovne 50cm', quantity: 100, unitPrice: 93, unit: 'g' }]);
  });

  it('prodej z adminu: výroba zakončení je samostatný řádek a součet sedí na mezisoučet', () => {
    // POS ukládá lineTotal včetně zakončení: 100 g × (93 + 10)
    const lines = buildInvoiceLines({
      orderNumber: 1, subtotal: 10300, total: 10300, discountAmount: 0,
      items: [item({ lineTotal: 10300, ending: 'KERATIN', assemblyFeeCzk: 10, assemblyFeeTotal: 1000 })],
    });
    expect(lines).toHaveLength(2);
    expect(lines[1]).toEqual({ name: 'Výroba — Keratin', quantity: 100, unitPrice: 10, unit: 'g' });
    expect(sum(lines)).toBe(10300);
  });

  it('web objednávka: lineTotal je bez zakončení, součet sedí na mezisoučet', () => {
    const lines = buildInvoiceLines({
      orderNumber: 1, subtotal: 14300, total: 14300, discountAmount: 0,
      items: [item({ lineTotal: 9300, ending: 'WEFT', assemblyFeeCzk: 50, assemblyFeeTotal: 5000 })],
    });
    expect(sum(lines)).toBe(14300);
  });

  it('necelá cena za gram (84,9 Kč/g): řádek za celkovou cenu, faktura sedí na korunu', () => {
    // 120 g × 84,9 = 10 188; v DB je pricePerGram zaokrouhlené na 85
    const lines = buildInvoiceLines({
      orderNumber: 1, subtotal: 10188, total: 10188, discountAmount: 0,
      items: [item({ grams: 120, pricePerGram: 85, lineTotal: 10188 })],
    });
    expect(lines).toEqual([{ name: 'Luxe – #5 rovne 50cm — 120 g', quantity: 1, unitPrice: 10188, unit: 'ks' }]);
  });

  it('sleva je záporný řádek: součet = mezisoučet − sleva', () => {
    const lines = buildInvoiceLines({
      orderNumber: 1, subtotal: 9300, total: 8459, discountAmount: 930,
      items: [item()],
    });
    expect(sum(lines)).toBe(9300 - 930);
  });

  it('objednávka bez položek: jedna souhrnná řádka', () => {
    const lines = buildInvoiceLines({ orderNumber: 77, subtotal: 5000, total: 5089, discountAmount: 0, items: [] });
    expect(lines).toEqual([{ name: 'Objednávka č. 77', quantity: 1, unitPrice: 5000, unit: 'ks' }]);
  });
});

describe('customerEmailOf', () => {
  it('adresa prodejny není e-mail zákazníka', () => {
    expect(customerEmailOf({ email: 'prodejna@muzahair.cz' })).toBeUndefined();
    expect(customerEmailOf({ email: '' })).toBeUndefined();
    expect(customerEmailOf({ email: 'jana@example.cz' })).toBe('jana@example.cz');
  });
});
