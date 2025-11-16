import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Base price per 100g for standard configuration
// These will be adjusted for different tiers and shade ranges
const basePrices = {
  nebarvene: {
    40: 4490,
    45: 5190,
    50: 5490,
    55: 6490,
    60: 7490,
    65: 8490,
    70: 8990,
    75: 9490,
    80: 10490,
  },
  barvene: {
    40: 5490,
    45: 6490,
    50: 6990,
    55: 7490,
    60: 8490,
    65: 9490,
    70: 9990,
    75: 10490,
    80: 11490,
  },
};

// Tier multipliers
const tierMultipliers = {
  standard: 1.0,
  luxe: 1.45,
  platinum: 1.75,
};

// Shade range definitions (matching UI)
const shadeRanges = [
  { label: '1-4', start: 1, end: 4 },
  { label: '5-7', start: 5, end: 7 },
  { label: '8-10', start: 8, end: 10 },
  { label: '5-10', start: 5, end: 10 },
];

async function seedCompletePriceMatrix() {
  console.log('🔄 Vymazávám starou ceníkovou matici...');
  await prisma.priceMatrix.deleteMany();

  console.log('📝 Generuji kompletní ceníkovou matici...\n');

  const entries = [];

  for (const category of ['nebarvene', 'barvene']) {
    const categoryPrices = basePrices[category as keyof typeof basePrices];

    for (const [tier, multiplier] of Object.entries(tierMultipliers)) {
      for (const shadeRange of shadeRanges) {
        for (const [lengthStr, basePricePer100g] of Object.entries(categoryPrices)) {
          const lengthCm = parseInt(lengthStr);

          // Apply tier multiplier and convert to per-gram
          const adjustedPricePer100g = basePricePer100g * multiplier;
          const pricePerGramCzk = adjustedPricePer100g / 100;

          entries.push({
            category,
            tier,
            shadeRangeStart: shadeRange.start,
            shadeRangeEnd: shadeRange.end,
            lengthCm,
            pricePerGramCzk: parseFloat(pricePerGramCzk.toFixed(2)),
          });
        }
      }
    }
  }

  console.log(`📊 Vytvářím ${entries.length} cenových záznamů...`);

  // Create all entries
  const created = await prisma.priceMatrix.createMany({
    data: entries,
    skipDuplicates: true,
  });

  console.log(`\n✅ Ceník naplněn! Celkem ${created.count} cen`);
  console.log(`\n📋 Struktura:`);
  console.log(`   • Kategorie: 2 (Nebarvené, Barvené)`);
  console.log(`   • Linky: 3 (Standard, LUXE, Platinum)`);
  console.log(`   • Odstíny: 4 (1-4, 5-7, 8-10, 5-10)`);
  console.log(`   • Délky: 9 (40, 45, 50, 55, 60, 65, 70, 75, 80 cm)`);
  console.log(`   • Celkem kombinací: 2 × 3 × 4 × 9 = ${2 * 3 * 4 * 9}`);
}

seedCompletePriceMatrix()
  .catch((e) => {
    console.error('❌ Chyba při naplňování ceníku:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
