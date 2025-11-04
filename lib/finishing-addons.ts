/**
 * Finishing Options / Zakončení
 * Dostupné metody zakončení pro všechny produkty
 */

export interface FinishingAddon {
  code: string;
  label: string;
  price_add: number;
}

/**
 * Defaultní příplatky za zakončení (v Kč)
 * Tyto ceny se přičítají k základní ceně produktu
 */
export const FINISHING_ADDONS: FinishingAddon[] = [
  {
    code: 'raw',
    label: 'Surový cop',
    price_add: 0,
  },
  {
    code: 'ker',
    label: 'Keratin',
    price_add: 500,
  },
  {
    code: 'mker',
    label: 'Mikro-keratin',
    price_add: 800,
  },
  {
    code: 'tape',
    label: 'Tape-in (nano tapes)',
    price_add: 400,
  },
  {
    code: 'weft',
    label: 'Vlasové tresy (sewing weft)',
    price_add: 600,
  },
];
