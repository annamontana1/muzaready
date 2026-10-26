// QR platba (formát SPAYD, čtou ho české mobilní banky) pro platbu převodem předem.
// Používá ji stránka po objednávce i potvrzovací e-mail.

/** České číslo účtu (předčíslí-číslo/kód banky) → IBAN */
export function czIban(account: string): string | null {
  const m = account.replace(/\s/g, '').match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!m) return null;
  const bban = m[3] + (m[1] || '').padStart(6, '0') + m[2].padStart(10, '0');
  // kontrolní číslice: BBAN + "CZ00" (C=12, Z=35), mod 97
  let rest = 0;
  for (const ch of bban + '123500') rest = (rest * 10 + Number(ch)) % 97;
  return `CZ${String(98 - rest).padStart(2, '0')}${bban}`;
}

/** IBAN z nastavení, jinak spočítaný z čísla účtu */
export function resolveIban(account: string | null, iban: string | null): string | null {
  return iban?.replace(/\s/g, '') || (account ? czIban(account) : null);
}

/** Variabilní symbol = číslo objednávky (jen číslice, max. 10) */
export const variableSymbol = (orderNumber: number | string) => String(orderNumber).replace(/\D/g, '').slice(0, 10);

export function spaydString(iban: string, amount: number, vs: string): string {
  return `SPD*1.0*ACC:${iban}*AM:${amount.toFixed(2)}*CC:CZK*X-VS:${vs}*MSG:MUZA HAIR OBJEDNAVKA ${vs}`;
}
