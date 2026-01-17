import prisma from '@/lib/prisma';

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
  KERATIN: { type: 'PER_GRAM', pricePerGram: 5 }, // 5 Kč per gram
};

export function validateBulkChoice(grams: number, min?: number | null, step?: number | null): boolean {
  if (!min || grams < min) return false;
  if (!step || grams % step !== 0) return false;
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
  lines: Array<{ skuId: string; wantedGrams?: number; ending?: string }>
) {
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
    const category = sku.shade === 'barvene_blond' || sku.shade?.includes('BLONDE') ? 'barvene' : 'nebarvene';

    // Map customer category to tier for price matrix lookup
    const tierMap: Record<string, string> = {
      'STANDARD': 'standard',
      'LUXE': 'luxe',
      'PLATINUM_EDITION': 'platinum',
    };
    const tier = tierMap[sku.customerCategory || 'STANDARD'] || 'standard';

    const matrixKey = `${category}_${tier}_${sku.lengthCm}`;
    const matrixPrice = priceMatrixMap.get(matrixKey);
    if (matrixPrice !== undefined) {
      pricePerGram = matrixPrice;
    }

    let grams = 0;

    if (sku.saleMode === 'PIECE_BY_WEIGHT') {
      if (!sku.weightTotalG || sku.soldOut) {
        throw new Error(`Culík "${sku.name}" již není dostupný`);
      }
      grams = sku.weightTotalG;
    } else {
      // BULK_G
      const wanted = line.wantedGrams ?? 0;
      if (!sku.availableGrams || sku.availableGrams <= 0) {
        throw new Error(`"${sku.name}" nejsou skladem`);
      }
      if (!validateBulkChoice(wanted, sku.minOrderG, sku.stepG)) {
        throw new Error(
          `Zvol množství ≥ ${sku.minOrderG}g a po ${sku.stepG}g kroku`
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

    const lineTotal = pricePerGram * grams;

    // Calculate assembly fee (default to NONE if not specified)
    const ending = line.ending || 'NONE';
    const assemblyFee = calculateAssemblyFee(ending, grams);

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
      snapshotName: sku.name ?? sku.sku,
    };
  });

  const total = detailed.reduce((s, d) => s + d.lineGrandTotal, 0);
  return { items: detailed, total };
}
