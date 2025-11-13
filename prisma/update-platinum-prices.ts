import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePlatinumPrices() {
  console.log('📝 Aktualizuji ceny Platinum Edition (nebarvene - shades 8,9,10)...\n');

  // Platinum Edition - Uncolored (nebarvene) - Shades 8, 9, 10
  const newPrices = [
    // Shade 8, 9, 10
    { category: 'nebarvene', tier: 'platinum', lengthCm: 45, pricePerGramCzk: 118.90 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 50, pricePerGramCzk: 134.50 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 55, pricePerGramCzk: 144.90 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 60, pricePerGramCzk: 158.90 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 65, pricePerGramCzk: 174.90 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 70, pricePerGramCzk: 194.90 },
  ];

  for (const price of newPrices) {
    const updated = await prisma.priceMatrix.upsert({
      where: {
        category_tier_lengthCm: {
          category: price.category,
          tier: price.tier,
          lengthCm: price.lengthCm,
        },
      },
      update: {
        pricePerGramCzk: price.pricePerGramCzk,
      },
      create: price,
    });

    console.log(
      `✓ ${price.category} × ${price.tier} × ${price.lengthCm}cm = ${price.pricePerGramCzk} Kč/g`
    );
  }

  console.log(`\n✅ Ceny Platinum Edition aktualizovány!`);
}

updatePlatinumPrices()
  .catch((e) => {
    console.error('❌ Chyba:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
