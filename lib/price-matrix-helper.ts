/**
 * Price Matrix Helper
 * Centralizovaná funkce pro vyhledávání cen z ceníkové matice
 */

interface PriceMatrixEntry {
  id: string;
  category: string;
  tier: string;
  lengthCm: number;
  pricePerGramCzk: number;
}

/**
 *获取z ceníkové matice cenu za 1g pro danou kombinaci
 */
export async function getPriceFromMatrix(
  category: string,
  tier: string,
  lengthCm: number
): Promise<number | null> {
  try {
    const res = await fetch(`/api/price-matrix?category=${category}&tier=${tier}`);
    if (!res.ok) return null;

    const entries: PriceMatrixEntry[] = await res.json();
    const entry = entries.find((e) => e.lengthCm === lengthCm);

    return entry ? parseFloat(entry.pricePerGramCzk.toString()) : null;
  } catch (error) {
    console.error('Error fetching price from matrix:', error);
    return null;
  }
}

/**
 * Výpočet ceny na základě gramáže a ceny za gram
 */
export function calculatePrice(pricePerGram: number, grams: number): number {
  return Math.round(pricePerGram * grams * 100) / 100;
}

/**
 * Výpočet ceny za VlasyX (BULK)
 * Vezme PPG z matice a vynásobí gramáží + zakončením
 */
export function calculateBulkPrice(
  pricePerGram: number,
  grams: number,
  finishingAddPrice: number = 0
): number {
  const basePrice = calculatePrice(pricePerGram, grams);
  return basePrice + finishingAddPrice;
}

/**
 * Výpočet ceny za Platinum (PIECE)
 * Vezme PPG z matice a vynásobí vahou kusu
 */
export function calculatePlatinumPrice(pricePerGram: number, weightG: number): number {
  return calculatePrice(pricePerGram, weightG);
}

/**
 * Formátování ceny pro zobrazení (Kč)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Unikátní složka pro SKU detekce kolize
 * Pokud existuje SKU, přidej -a, -b, -c...
 */
export function generateUniqueSKU(baseSKU: string, existingSKUs: string[]): string {
  if (!existingSKUs.includes(baseSKU)) {
    return baseSKU;
  }

  let suffix = 'a'.charCodeAt(0);
  let newSKU = `${baseSKU}-${String.fromCharCode(suffix)}`;

  while (existingSKUs.includes(newSKU)) {
    suffix++;
    newSKU = `${baseSKU}-${String.fromCharCode(suffix)}`;
  }

  return newSKU;
}
