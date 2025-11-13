import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Price data in Kč per 100g for each category/tier/length combination
const priceData = {
  standard: {
    nebarvene: {
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
      45: 6490,
      50: 6990,
      55: 7490,
      60: 8490,
      65: 9490,
      70: 9990,
      75: 10490,
      80: 11490,
    },
  },
  luxe: {
    nebarvene: {
      45: 7490,
      50: 8490,
      55: 9490,
      60: 9990,
      65: 10490,
      70: 10990,
      75: 11490,
      80: 12490,
    },
    barvene: {
      45: 8490,
      50: 8990,
      55: 9790,
      60: 10490,
      65: 10990,
      70: 11990,
      75: 12490,
      80: 12990,
    },
  },
  platinum: {
    nebarvene: {
      45: 8890,
      50: 10890,
      55: 11890,
      60: 12890,
      65: 13890,
      70: 14890,
      75: 15490,
      80: 16490,
    },
    barvene: {
      45: 9490,
      50: 11490,
      55: 12490,
      60: 13490,
      65: 14490,
      70: 15490,
      75: 15890,
      80: 16890,
    },
  },
};

async function seedPrices() {
  console.log('🔄 Vymazávám starou ceníkovou matici...');
  await prisma.priceMatrix.deleteMany();

  console.log('📝 Vkládám nové ceny...\n');

  const entries = [];

  for (const [tier, categories] of Object.entries(priceData)) {
    for (const [category, lengths] of Object.entries(categories)) {
      for (const [lengthCm, pricePerGramCzk] of Object.entries(lengths)) {
        // Convert price from per-100g to per-gram (divide by 100)
        const ppg = pricePerGramCzk / 100;

        entries.push({
          category,
          tier,
          lengthCm: parseInt(lengthCm),
          pricePerGramCzk: ppg,
        });

        console.log(
          `✓ ${category.toUpperCase()} × ${tier.toUpperCase()} × ${lengthCm}cm = ${ppg.toFixed(2)} Kč/g (${pricePerGramCzk} Kč/100g)`
        );
      }
    }
  }

  // Bulk create all entries
  await prisma.priceMatrix.createMany({
    data: entries,
    skipDuplicates: true,
  });

  console.log(`\n✅ Ceník naplněn! Celkem ${entries.length} cen`);
}

seedPrices()
  .catch((e) => {
    console.error('❌ Chyba při naplňování ceníku:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
