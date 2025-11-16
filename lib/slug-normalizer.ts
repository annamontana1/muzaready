/**
 * Normalizuje text na URL-safe slug:
 * - malá písmena
 * - bez diakritiky (á → a, é → e, atd.)
 * - jen [a-z0-9-]
 * - více pomlček slít do jedné
 * - oříznout na krajích
 */

const DIACRITICS_MAP: Record<string, string> = {
  // České znaky
  'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
  'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
  'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
  'Á': 'a', 'Č': 'c', 'Ď': 'd', 'É': 'e', 'Ě': 'e',
  'Í': 'i', 'Ň': 'n', 'Ó': 'o', 'Ř': 'r', 'Š': 's',
  'Ť': 't', 'Ú': 'u', 'Ů': 'u', 'Ý': 'y', 'Ž': 'z',
  // Další evropské znaky
  'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss',
  'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
  'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
  'ã': 'a', 'õ': 'o', 'ñ': 'n',
  'æ': 'ae', 'œ': 'oe',
};

/**
 * Normalizuje text na URL-safe slug
 */
export function normalizeSlug(text: string): string {
  if (!text) return '';

  // 1. Převést na malá písmena
  let normalized = text.toLowerCase();

  // 2. Odstranit diakritiku
  normalized = normalized
    .split('')
    .map(char => DIACRITICS_MAP[char] || char)
    .join('');

  // 3. Povolit jen [a-z0-9-] a mezery (mezery nahradíme pomlčkami)
  normalized = normalized
    .replace(/[^a-z0-9\s-]/g, '') // Odstranit vše kromě a-z0-9, mezer a pomlček
    .replace(/\s+/g, '-') // Mezery na pomlčky
    .replace(/-+/g, '-') // Více pomlček do jedné
    .replace(/^-+|-+$/g, ''); // Oříznout pomlčky na krajích

  return normalized;
}

/**
 * Normalizuje existující slug (např. z URL)
 * Používá se pro porovnávání a redirecty
 */
export function normalizeExistingSlug(slug: string): string {
  // Dekódovat URL encoding
  const decoded = decodeURIComponent(slug);
  return normalizeSlug(decoded);
}

