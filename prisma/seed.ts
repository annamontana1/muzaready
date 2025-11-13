import prisma from '@/lib/prisma';

async function main() {
  // Smaž stará data
  await prisma.stockMovement.deleteMany();
  await prisma.sku.deleteMany();

  console.log('🌱 Seeduji testovací SKU...\n');

  // ═══════════════════════════════════════════════════════════
  // PLATINUM - PIECE_BY_WEIGHT (jednotlivé kusy)
  // ═══════════════════════════════════════════════════════════
  const platinum1 = await prisma.sku.create({
    data: {
      sku: 'PLT-BLONDE-60CM-124G',
      name: 'Platinum Blonde 60cm',
      customerCategory: 'PLATINUM_EDITION',
      shade: 'BLONDE',
      shadeName: 'Platinum Blonde',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT',
      pricePerGramCzk: 45,
      weightTotalG: 124,
      soldOut: false,
      inStock: true,
      inStockSince: new Date(),
      isListed: true,
      listingPriority: 1,
    },
  });

  const platinum2 = await prisma.sku.create({
    data: {
      sku: 'PLT-BROWN-65CM-150G',
      name: 'Platinum Brown 65cm',
      customerCategory: 'PLATINUM_EDITION',
      shade: 'BROWN',
      shadeName: 'Chestnut Brown',
      lengthCm: 65,
      structure: 'vlnité',
      saleMode: 'PIECE_BY_WEIGHT',
      pricePerGramCzk: 48,
      weightTotalG: 150,
      soldOut: false,
      inStock: true,
      inStockSince: new Date(),
      isListed: true,
      listingPriority: 2,
    },
  });

  // ═══════════════════════════════════════════════════════════
  // STANDARD - BULK_G (sypané gramy, min 50g, krok 10g)
  // ═══════════════════════════════════════════════════════════
  const standard1 = await prisma.sku.create({
    data: {
      sku: 'STD-BLACK-STRAIGHT-60CM',
      name: 'STANDARD Černá Rovná 60cm',
      customerCategory: 'STANDARD',
      shade: 'BLACK',
      shadeName: 'Pure Black',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'BULK_G',
      pricePerGramCzk: 18,
      availableGrams: 1500,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      inStockSince: new Date(),
      isListed: true,
      listingPriority: 3,
    },
  });

  const standard2 = await prisma.sku.create({
    data: {
      sku: 'STD-BROWN-WAVE-50CM',
      name: 'STANDARD Hnědá Vlnité 50cm',
      customerCategory: 'STANDARD',
      shade: 'BROWN',
      shadeName: 'Warm Brown',
      lengthCm: 50,
      structure: 'vlnité',
      saleMode: 'BULK_G',
      pricePerGramCzk: 20,
      availableGrams: 2000,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      inStockSince: new Date(),
      isListed: true,
      listingPriority: 4,
    },
  });

  // ═══════════════════════════════════════════════════════════
  // LUXE - BULK_G (sypané gramy, min 50g, krok 10g, vyšší cena)
  // ═══════════════════════════════════════════════════════════
  const luxe1 = await prisma.sku.create({
    data: {
      sku: 'LUX-CURLY-RED-55CM',
      name: 'LUXE Červená Kudrnatá 55cm',
      customerCategory: 'LUXE',
      shade: 'RED',
      shadeName: 'Deep Red',
      lengthCm: 55,
      structure: 'kudrnatá',
      saleMode: 'BULK_G',
      pricePerGramCzk: 28,
      availableGrams: 1200,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      inStockSince: new Date(),
      isListed: true,
      listingPriority: 5,
    },
  });

  // ═══════════════════════════════════════════════════════════
  // Vyprodaný kus (demo pro inStock=false)
  // ═══════════════════════════════════════════════════════════
  const soldOut = await prisma.sku.create({
    data: {
      sku: 'PLT-BLONDE-SOLD',
      name: 'Platinum Blonde (vyprodáno)',
      customerCategory: 'PLATINUM_EDITION',
      shade: 'BLONDE',
      shadeName: 'Platinum',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT',
      pricePerGramCzk: 45,
      weightTotalG: 130,
      soldOut: true,
      inStock: false,
      isListed: false,
    },
  });

  console.log('✅ Seed data vytvořeno:\n');
  console.log('PLATINUM (jednotlivé kusy):');
  console.log(`  - ${platinum1.sku}: ${platinum1.weightTotalG}g @ ${platinum1.pricePerGramCzk} Kč/g = ${platinum1.weightTotalG * platinum1.pricePerGramCzk} Kč`);
  console.log(`  - ${platinum2.sku}: ${platinum2.weightTotalG}g @ ${platinum2.pricePerGramCzk} Kč/g = ${platinum2.weightTotalG * platinum2.pricePerGramCzk} Kč`);
  console.log('\nSTANDARD (sypané gramy):');
  console.log(`  - ${standard1.sku}: ${standard1.availableGrams}g na skladě @ ${standard1.pricePerGramCzk} Kč/g (min ${standard1.minOrderG}g, krok ${standard1.stepG}g)`);
  console.log(`  - ${standard2.sku}: ${standard2.availableGrams}g na skladě @ ${standard2.pricePerGramCzk} Kč/g (min ${standard2.minOrderG}g, krok ${standard2.stepG}g)`);
  console.log('\nLUXE (sypané gramy):');
  console.log(`  - ${luxe1.sku}: ${luxe1.availableGrams}g na skladě @ ${luxe1.pricePerGramCzk} Kč/g (min ${luxe1.minOrderG}g, krok ${luxe1.stepG}g)`);
  console.log('\nVyprodáno (demo):');
  console.log(`  - ${soldOut.sku}: soldOut=true, inStock=false`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
