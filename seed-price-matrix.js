const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPriceMatrix() {
  try {
    console.log('Seeding price matrix entries...');

    // First, ensure exchange rate exists
    const exchangeRate = await prisma.exchangeRate.upsert({
      where: { id: 'GLOBAL_RATE' },
      update: {},
      create: {
        id: 'GLOBAL_RATE',
        czk_to_eur: 1 / 25.5, // 1 EUR = 25.5 CZK
        description: 'Global EUR to CZK exchange rate',
      },
    });
    console.log('✅ Exchange rate set: 1 EUR =', (1 / parseFloat(exchangeRate.czk_to_eur)).toFixed(2), 'CZK');

    // Sample pricing data for different categories/tiers
    // Categories: 'nebarvene' (uncolored) | 'barvene' (colored)
    // Tiers: 'standard' | 'luxe' | 'platinum'
    // Lengths: 40, 45, 50, 55, 60, 65, 70, 75, 80 cm
    const lengths = [40, 45, 50, 55, 60, 65, 70, 75, 80];
    const pricingData = [];

    // Function to calculate price based on length and base price
    const calculatePrice = (basePrice, lengthCm) => {
      // Prices increase slightly with length
      const baseLengthFactor = lengthCm / 40;
      return Math.round(basePrice * baseLengthFactor * 100) / 100;
    };

    // Generate all combinations - covering all tiers for both categories
    // Shade ranges match component options: 1-4, 5-7, 8-10, 5-10
    const combinations = [
      // Nebarvené (uncolored) hair
      { category: 'nebarvene', tier: 'standard', shadeStart: 1, shadeEnd: 4, basePrice: 15 },
      { category: 'nebarvene', tier: 'standard', shadeStart: 5, shadeEnd: 7, basePrice: 17 },
      { category: 'nebarvene', tier: 'standard', shadeStart: 8, shadeEnd: 10, basePrice: 18 },
      { category: 'nebarvene', tier: 'standard', shadeStart: 5, shadeEnd: 10, basePrice: 18 },
      { category: 'nebarvene', tier: 'luxe', shadeStart: 1, shadeEnd: 4, basePrice: 20 },
      { category: 'nebarvene', tier: 'luxe', shadeStart: 5, shadeEnd: 7, basePrice: 22 },
      { category: 'nebarvene', tier: 'luxe', shadeStart: 8, shadeEnd: 10, basePrice: 23 },
      { category: 'nebarvene', tier: 'luxe', shadeStart: 5, shadeEnd: 10, basePrice: 24 },
      { category: 'nebarvene', tier: 'platinum', shadeStart: 1, shadeEnd: 4, basePrice: 25 },
      { category: 'nebarvene', tier: 'platinum', shadeStart: 5, shadeEnd: 7, basePrice: 27 },
      { category: 'nebarvene', tier: 'platinum', shadeStart: 8, shadeEnd: 10, basePrice: 28 },
      { category: 'nebarvene', tier: 'platinum', shadeStart: 5, shadeEnd: 10, basePrice: 30 },
      // Barvené (colored) hair
      { category: 'barvene', tier: 'standard', shadeStart: 1, shadeEnd: 4, basePrice: 18 },
      { category: 'barvene', tier: 'standard', shadeStart: 5, shadeEnd: 7, basePrice: 20 },
      { category: 'barvene', tier: 'standard', shadeStart: 8, shadeEnd: 10, basePrice: 21 },
      { category: 'barvene', tier: 'standard', shadeStart: 5, shadeEnd: 10, basePrice: 22 },
      { category: 'barvene', tier: 'luxe', shadeStart: 1, shadeEnd: 4, basePrice: 28 },
      { category: 'barvene', tier: 'luxe', shadeStart: 5, shadeEnd: 7, basePrice: 30 },
      { category: 'barvene', tier: 'luxe', shadeStart: 8, shadeEnd: 10, basePrice: 31 },
      { category: 'barvene', tier: 'luxe', shadeStart: 5, shadeEnd: 10, basePrice: 32 },
      { category: 'barvene', tier: 'platinum', shadeStart: 1, shadeEnd: 4, basePrice: 35 },
      { category: 'barvene', tier: 'platinum', shadeStart: 5, shadeEnd: 7, basePrice: 37 },
      { category: 'barvene', tier: 'platinum', shadeStart: 8, shadeEnd: 10, basePrice: 38 },
      { category: 'barvene', tier: 'platinum', shadeStart: 5, shadeEnd: 10, basePrice: 40 },
    ];

    // Create all entries for each combination
    for (const combo of combinations) {
      for (const lengthCm of lengths) {
        pricingData.push({
          category: combo.category,
          tier: combo.tier,
          shadeRangeStart: combo.shadeStart,
          shadeRangeEnd: combo.shadeEnd,
          lengthCm: lengthCm,
          pricePerGramCzk: calculatePrice(combo.basePrice, lengthCm),
        });
      }
    }

    const czkToEur = parseFloat(exchangeRate.czk_to_eur);

    // Upsert all entries
    let created = 0;
    let updated = 0;

    for (const entry of pricingData) {
      const result = await prisma.priceMatrix.upsert({
        where: {
          category_tier_shadeRangeStart_shadeRangeEnd_lengthCm: {
            category: entry.category,
            tier: entry.tier,
            shadeRangeStart: entry.shadeRangeStart,
            shadeRangeEnd: entry.shadeRangeEnd,
            lengthCm: entry.lengthCm,
          },
        },
        update: {
          pricePerGramCzk: entry.pricePerGramCzk,
          pricePerGramEur: Number((entry.pricePerGramCzk * czkToEur).toFixed(3)),
        },
        create: {
          ...entry,
          pricePerGramEur: Number((entry.pricePerGramCzk * czkToEur).toFixed(3)),
        },
      });

      // Check if it was created or updated (simple heuristic)
      if (result.createdAt === result.updatedAt) {
        created++;
      } else {
        updated++;
      }
    }

    console.log(`✅ Price matrix seeded successfully!`);
    console.log(`   Created: ${created} new entries`);
    console.log(`   Updated: ${updated} existing entries`);
    console.log(`   Total: ${pricingData.length} entries`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedPriceMatrix();
