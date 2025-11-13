import prisma from '@/lib/prisma';

export function validateBulkChoice(grams: number, min?: number | null, step?: number | null): boolean {
  if (!min || grams < min) return false;
  if (!step || grams % step !== 0) return false;
  return true;
}

export async function quoteCartLines(
  lines: Array<{ skuId: string; wantedGrams?: number }>
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
    return {
      sku,
      grams,
      pricePerGram,
      lineTotal,
      snapshotName: sku.name ?? sku.sku,
    };
  });

  const total = detailed.reduce((s, d) => s + d.lineTotal, 0);
  return { items: detailed, total };
}
