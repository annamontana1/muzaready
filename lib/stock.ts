import prisma from '@/lib/prisma';

// Assembly fee configuration by EndingOption
// Format: { type: 'FLAT' | 'PER_GRAM', pricePerGram: int (for PER_GRAM) or price: int (for FLAT) }
export const ASSEMBLY_FEE_CONFIG: Record<string, { type: 'FLAT' | 'PER_GRAM'; price?: number; pricePerGram?: number }> = {
  NONE: { type: 'FLAT', price: 0 },
  KERATIN: { type: 'PER_GRAM', pricePerGram: 5 }, // 5 Kč per gram
  PASKY: { type: 'FLAT', price: 200 }, // 200 Kč flat fee
  TRESSY: { type: 'FLAT', price: 150 }, // 150 Kč flat fee
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

export async function quoteCartLines(
  lines: Array<{ skuId: string; wantedGrams?: number; ending?: string }>
) {
  const skuIds = lines.map((l) => l.skuId);
  const skus = await prisma.sku.findMany({
    where: { id: { in: skuIds } },
  });

  const detailed = lines.map((line) => {
    const sku = skus.find((s) => s.id === line.skuId);
    if (!sku) throw new Error('SKU nenalezeno');

    const pricePerGram = sku.pricePerGramCzk;
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
