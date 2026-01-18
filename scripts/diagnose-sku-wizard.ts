import prisma from '../lib/prisma';

async function diagnose() {
  console.log('🔍 Diagnostika Konfigurátor SKU\n');

  // 1. Check Exchange Rate
  console.log('1️⃣ Exchange Rate:');
  const rate = await prisma.exchangeRate.findFirst({
    where: { id: 'GLOBAL_RATE' },
  });
  if (rate) {
    console.log(`✅ Existuje: ${rate.czk_to_eur} CZK → EUR`);
  } else {
    console.log('❌ Chybí GLOBAL_RATE - nutno přidat!');
  }

  // 2. Check Price Matrix
  console.log('\n2️⃣ Price Matrix záznamy:');
  const matrixCount = await prisma.priceMatrix.count();
  console.log(`📊 Celkem záznamů: ${matrixCount}`);

  if (matrixCount === 0) {
    console.log('❌ Price Matrix je prázdná!');
  } else {
    // Show sample entries
    const samples = await prisma.priceMatrix.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    console.log('📋 Ukázka (poslední 5):');
    samples.forEach((entry) => {
      console.log(
        `  - ${entry.category}/${entry.tier} | Shade ${entry.shadeRangeStart}-${entry.shadeRangeEnd} | ${entry.lengthCm}cm → ${entry.pricePerGramCzk} Kč/g`
      );
    });

    // Check for specific combo: nebarvene/standard/shade 1-4
    console.log('\n🔎 Kontrola pro Nebarvené/Standard/Shade 1-4:');
    const testEntries = await prisma.priceMatrix.findMany({
      where: {
        category: 'nebarvene',
        tier: 'standard',
        shadeRangeStart: 1,
        shadeRangeEnd: 4,
      },
    });
    console.log(`  Nalezeno ${testEntries.length} záznamů pro délky: ${testEntries.map(e => e.lengthCm).join(', ')} cm`);
  }

  // 3. Check existing SKUs
  console.log('\n3️⃣ Existující SKU:');
  const skuCount = await prisma.sku.count();
  console.log(`📦 Celkem SKU: ${skuCount}`);

  if (skuCount > 0) {
    const latestSkus = await prisma.sku.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        sku: true,
        name: true,
        saleMode: true,
        customerCategory: true,
        lengthCm: true,
        createdAt: true,
      },
    });
    console.log('📋 Poslední 3 SKU:');
    latestSkus.forEach((sku) => {
      console.log(`  - ${sku.sku} | ${sku.name} | ${sku.saleMode} | ${sku.customerCategory}`);
    });
  }

  console.log('\n✅ Diagnostika dokončena');
}

diagnose()
  .catch((error) => {
    console.error('❌ Chyba při diagnostice:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
