import prisma from '@/lib/prisma';
import { GRAM_STEP, MATRIX_TIER, PIECE_DEFAULT_GRAMS, PIECE_MAX_GRAMS, PIECE_MIN_GRAMS, matrixCategory, pieceGramsLeft, soldByGrams, validPieceGrams } from '@/lib/sale-rule';

// Shade name map (mirrors HAIR_COLORS in types/product.ts)
const SHADE_NAMES: Record<number, string> = {
  1: 'Černá', 2: 'Velmi tmavá hnědá', 3: 'Tmavá hnědá', 4: 'Hnědá',
  5: 'Světlá hnědá', 6: 'Tmavá blond', 7: 'Blond', 8: 'Světlá blond',
  9: 'Velmi světlá blond', 10: 'Platinová blond',
};
const TIER_LABELS: Record<string, string> = {
  LUXE: 'LUXE', STANDARD: 'Standard', PLATINUM_EDITION: 'Platinum Edition',
  BABY_SHADES: 'Baby Shades',
};

/**
 * Returns a clean display name for a SKU.
 * Guards against null, empty string, and the literal string "undefined"
 * that can end up in the DB when JS coerces undefined → string.
 */
export function buildSkuDisplayName(sku: {
  name: string | null;
  sku: string;
  customerCategory?: string | null;
  shade?: string | null;
}): string {
  if (sku.name && sku.name !== 'undefined' && sku.name.trim() !== '') {
    return sku.name;
  }
  const shadeNum = parseInt(sku.shade || '', 10);
  const tierLabel = TIER_LABELS[sku.customerCategory || ''] || 'Standard';
  const shadeName = Number.isFinite(shadeNum) ? (SHADE_NAMES[shadeNum] || `#${shadeNum}`) : '';
  return shadeName ? `${tierLabel} – ${shadeName}` : (sku.sku || 'Vlasy k prodloužení');
}

interface PriceMatrixEntry {
  id: string;
  category: string;
  tier: string;
  lengthCm: number;
  pricePerGramCzk: number | string;
}

// Assembly fee configuration by EndingOption
// Format: { type: 'FLAT' | 'PER_GRAM', pricePerGram: int (for PER_GRAM) or price: int (for FLAT) }
export const ASSEMBLY_FEE_CONFIG: Record<string, { type: 'FLAT' | 'PER_GRAM'; price?: number; pricePerGram?: number }> = {
  NONE: { type: 'FLAT', price: 0 },
  MICRO_KERATIN: { type: 'PER_GRAM', pricePerGram: 15 },    // Mikrokeratin — 1 500 Kč/100g
  STANDARD_KERATIN: { type: 'PER_GRAM', pricePerGram: 15 }, // Keratin — 1 500 Kč/100g
  PASKY_KERATINU: { type: 'PER_GRAM', pricePerGram: 15 },   // Keratinové pásky — 1 500 Kč/100g
  WEFT: { type: 'PER_GRAM', pricePerGram: 60 },             // Weft — 6 000 Kč/100g
  TAPES: { type: 'PER_GRAM', pricePerGram: 40 },            // Tapes — 4 000 Kč/100g
};

export function validateBulkChoice(grams: number, min?: number | null, step?: number | null): boolean {
  const effectiveMin = min || 50;   // default: minimum 50g
  const effectiveStep = step || 10; // default: 10g steps
  if (grams < effectiveMin) return false;
  if (grams % effectiveStep !== 0) return false;
  return true;
}

export function calculateAssemblyFee(
  endingOption: string,
  grams: number
): { assemblyFeeType: string; assemblyFeeCzk: number; assemblyFeeTotal: number } {
  const config = ASSEMBLY_FEE_CONFIG[endingOption] || ASSEMBLY_FEE_CONFIG['NONE'];

  if (config.type === 'FLAT') {
    const assemblyFeeCzk = config.price || 0;
    return {
      assemblyFeeType: 'FLAT',
      assemblyFeeCzk,
      assemblyFeeTotal: assemblyFeeCzk,
    };
  } else {
    const assemblyFeeCzk = config.pricePerGram || 0;
    const assemblyFeeTotal = assemblyFeeCzk * grams;
    return {
      assemblyFeeType: 'PER_GRAM',
      assemblyFeeCzk,
      assemblyFeeTotal,
    };
  }
}

async function getPriceMatrixLookup(): Promise<Map<string, number>> {
  const entries = await prisma.priceMatrix.findMany();
  const map = new Map<string, number>();

  for (const entry of entries) {
    const key = `${entry.category}_${entry.tier}_${entry.lengthCm}`;
    let price: number;

    if (typeof entry.pricePerGramCzk === 'string') {
      price = parseFloat(entry.pricePerGramCzk);
    } else if (typeof entry.pricePerGramCzk === 'number') {
      price = entry.pricePerGramCzk;
    } else {
      // Handle Decimal type from Prisma
      price = parseFloat(entry.pricePerGramCzk.toString());
    }

    map.set(key, price);
  }

  return map;
}

export async function quoteCartLines(
  lines: Array<{ skuId: string; wantedGrams?: number; ending?: string; selectedLength?: number }>,
  opts: { wholesaleDiscountPercent?: number } = {}
) {
  // Velkoobchod: cena za gram vlasů i zakončení se sníží o slevu, ať sedí všechny součty
  const factor = 1 - (opts.wholesaleDiscountPercent ?? 0) / 100;
  const discounted = (n: number) => (factor === 1 ? n : Math.round(n * factor * 100) / 100);
  const skuIds = lines.map((l) => l.skuId);
  const skus = await prisma.sku.findMany({
    where: { id: { in: skuIds } },
  });

  // Load price matrix
  const priceMatrixMap = await getPriceMatrixLookup();

  const detailed = lines.map((line) => {
    const sku = skus.find((s) => s.id === line.skuId);
    if (!sku) throw new Error('SKU nenalezeno');

    // Determine price from matrix or fall back to SKU price
    let pricePerGram = sku.pricePerGramCzk;

    // Try to look up price from matrix
    // Kus: barvené/nebarvené podle isDyed (středoevropské/panenské); zásoba na gramy podle odstínu
    const category = matrixCategory(sku);
    const tier = MATRIX_TIER[sku.customerCategory || 'STANDARD'] || 'standard';

    // Use selectedLength from the line if provided (configurator choice), else fall back to SKU's own length
    const lookupLength = line.selectedLength ?? sku.lengthCm;
    const matrixKey = `${category}_${tier}_${lookupLength}`;
    const matrixPrice = priceMatrixMap.get(matrixKey);
    if (matrixPrice) {
      pricePerGram = matrixPrice;
    }

    let grams = 0;

    if (sku.saleMode === 'PIECE_BY_WEIGHT') {
      if (sku.soldOut) {
        throw new Error(`Culík "${sku.name}" již není dostupný`);
      }
      if (soldByGrams(sku)) {
        // Po gramech: 50–300 g po 10 g, délka z ceníku; sklad se nekontroluje (lib/sale-rule.ts)
        const wanted = line.wantedGrams ?? PIECE_DEFAULT_GRAMS;
        if (!validPieceGrams(wanted)) {
          throw new Error(`Zvolte ${PIECE_MIN_GRAMS}–${PIECE_MAX_GRAMS} g po ${GRAM_STEP} g`);
        }
        grams = wanted;
      } else {
        // Baby Shades: vždy celý culík
        grams = pieceGramsLeft(sku);
        if (!grams) throw new Error(`Culík "${sku.name}" nemá zadanou hmotnost`);
      }
    } else {
      // BULK_G
      const wanted = line.wantedGrams ?? 0;
      if (!sku.availableGrams || sku.availableGrams <= 0) {
        throw new Error(`"${sku.name}" nejsou skladem`);
      }
      if (!validateBulkChoice(wanted, sku.minOrderG, sku.stepG)) {
        const effectiveMin = sku.minOrderG || 50;
        const effectiveStep = sku.stepG || 10;
        throw new Error(
          `Zvol množství ≥ ${effectiveMin}g a po ${effectiveStep}g kroku`
        );
      }
      if (wanted > sku.availableGrams) {
        throw new Error(
          `Máme jen ${sku.availableGrams}g, ale chceš ${wanted}g`
        );
      }
      grams = wanted;
    }

    if (pricePerGram == null) {
      throw new Error('Chybí cena v matice pro vybraný produkt');
    }

    pricePerGram = discounted(Number(pricePerGram));
    const lineTotal = pricePerGram * grams;

    // Calculate assembly fee (default to NONE if not specified)
    const ending = line.ending || 'NONE';
    const baseFee = calculateAssemblyFee(ending, grams);
    const assemblyFeeCzk = discounted(baseFee.assemblyFeeCzk);
    const assemblyFee = {
      ...baseFee,
      assemblyFeeCzk,
      assemblyFeeTotal: baseFee.assemblyFeeType === 'PER_GRAM' ? assemblyFeeCzk * grams : discounted(baseFee.assemblyFeeTotal),
    };

    return {
      sku,
      grams,
      pricePerGram,
      lineTotal,
      ending,
      assemblyFeeType: assemblyFee.assemblyFeeType,
      assemblyFeeCzk: assemblyFee.assemblyFeeCzk,
      assemblyFeeTotal: assemblyFee.assemblyFeeTotal,
      lineGrandTotal: lineTotal + assemblyFee.assemblyFeeTotal,
      // Délka zvolená v konfigurátoru se musí v objednávce objevit, i když SKU má jinou základní délku
      snapshotName: line.selectedLength && line.selectedLength !== sku.lengthCm
        ? `${buildSkuDisplayName(sku)} · délka ${line.selectedLength} cm`
        : buildSkuDisplayName(sku),
    };
  });

  const total = detailed.reduce((s, d) => s + d.lineGrandTotal, 0);
  return { items: detailed, total, wholesaleDiscountPercent: opts.wholesaleDiscountPercent ?? 0 };
}
