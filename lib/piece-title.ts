// Jednotný název culíku pro katalog, detail, košík i objednávky.
// Kusy s kódem končícím na -C04 dostanou název „Culík C04 · odstín 10“
// (čísla C01, C02… se opakují v různých odstínech, proto je v názvu i odstín).
export function pieceCode(code?: string | null): string | null {
  const m = (code || '').match(/-(c\d+)$/i);
  return m ? m[1].toUpperCase() : null;
}

export function pieceTitle(p: { sku?: string | null; id?: string | null; shade?: string | number | null; name?: string | null }): string {
  const code = pieceCode(p.sku) || pieceCode(p.id);
  if (code) {
    const shade = p.shade != null && String(p.shade).trim() !== '' ? ` · odstín ${parseInt(String(p.shade), 10)}` : '';
    return `Culík ${code}${shade}`;
  }
  return (p.name || '').split(' · ')[0] || 'Culík';
}
