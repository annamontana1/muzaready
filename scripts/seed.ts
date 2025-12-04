import prisma from '@/lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceMatrix.deleteMany();
  await prisma.sku.deleteMany();
  console.log('✓ Cleared existing data\n');

  // Create Price Matrix entries
  console.log('📊 Creating price matrix entries...');
  const priceMatrixEntries = [
    // Uncolored (nebarvene) - Standard tier
    { category: 'nebarvene', tier: 'standard', lengthCm: 35, pricePerGramCzk: 45.0 },
    { category: 'nebarvene', tier: 'standard', lengthCm: 45, pricePerGramCzk: 65.0 },
    { category: 'nebarvene', tier: 'standard', lengthCm: 60, pricePerGramCzk: 85.0 },
    { category: 'nebarvene', tier: 'standard', lengthCm: 75, pricePerGramCzk: 105.0 },
    { category: 'nebarvene', tier: 'standard', lengthCm: 90, pricePerGramCzk: 125.0 },

    // Uncolored (nebarvene) - Luxe tier
    { category: 'nebarvene', tier: 'luxe', lengthCm: 35, pricePerGramCzk: 55.0 },
    { category: 'nebarvene', tier: 'luxe', lengthCm: 45, pricePerGramCzk: 75.0 },
    { category: 'nebarvene', tier: 'luxe', lengthCm: 60, pricePerGramCzk: 95.0 },
    { category: 'nebarvene', tier: 'luxe', lengthCm: 75, pricePerGramCzk: 115.0 },
    { category: 'nebarvene', tier: 'luxe', lengthCm: 90, pricePerGramCzk: 135.0 },

    // Uncolored (nebarvene) - Platinum tier
    { category: 'nebarvene', tier: 'platinum', lengthCm: 35, pricePerGramCzk: 65.0 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 45, pricePerGramCzk: 85.0 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 60, pricePerGramCzk: 105.0 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 75, pricePerGramCzk: 125.0 },
    { category: 'nebarvene', tier: 'platinum', lengthCm: 90, pricePerGramCzk: 145.0 },

    // Colored (barvene) - Standard tier
    { category: 'barvene', tier: 'standard', lengthCm: 35, pricePerGramCzk: 50.0 },
    { category: 'barvene', tier: 'standard', lengthCm: 45, pricePerGramCzk: 70.0 },
    { category: 'barvene', tier: 'standard', lengthCm: 60, pricePerGramCzk: 90.0 },
    { category: 'barvene', tier: 'standard', lengthCm: 75, pricePerGramCzk: 110.0 },
    { category: 'barvene', tier: 'standard', lengthCm: 90, pricePerGramCzk: 130.0 },

    // Colored (barvene) - Luxe tier
    { category: 'barvene', tier: 'luxe', lengthCm: 35, pricePerGramCzk: 60.0 },
    { category: 'barvene', tier: 'luxe', lengthCm: 45, pricePerGramCzk: 80.0 },
    { category: 'barvene', tier: 'luxe', lengthCm: 60, pricePerGramCzk: 100.0 },
    { category: 'barvene', tier: 'luxe', lengthCm: 75, pricePerGramCzk: 120.0 },
    { category: 'barvene', tier: 'luxe', lengthCm: 90, pricePerGramCzk: 140.0 },

    // Colored (barvene) - Platinum tier
    { category: 'barvene', tier: 'platinum', lengthCm: 35, pricePerGramCzk: 70.0 },
    { category: 'barvene', tier: 'platinum', lengthCm: 45, pricePerGramCzk: 90.0 },
    { category: 'barvene', tier: 'platinum', lengthCm: 60, pricePerGramCzk: 110.0 },
    { category: 'barvene', tier: 'platinum', lengthCm: 75, pricePerGramCzk: 130.0 },
    { category: 'barvene', tier: 'platinum', lengthCm: 90, pricePerGramCzk: 150.0 },
  ];

  await prisma.priceMatrix.createMany({
    data: priceMatrixEntries,
  });
  console.log(`✓ Created ${priceMatrixEntries.length} price matrix entries\n`);

  // Create SKUs
  console.log('📦 Creating SKU items...');
  const skus = [
    // Uncolored PIECE_BY_WEIGHT items (Standard)
    {
      sku: 'STANDARD-VIRGIN-35-45CM',
      name: '45cm Panenské vlasy - Přírodní',
      customerCategory: 'STANDARD' as const,
      shade: 'nebarvene_natural',
      shadeName: 'Přírodní barva',
      lengthCm: 45,
      structure: 'straight',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 65.0,
      weightTotalG: 100,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    // Uncolored BULK_G items (Luxe)
    {
      sku: 'LUXE-VIRGIN-60CM-BULK',
      name: '60cm Luxusní vlasy na míru - Přírodní',
      customerCategory: 'LUXE' as const,
      shade: 'nebarvene_natural',
      shadeName: 'Přírodní barva',
      lengthCm: 60,
      structure: 'straight',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 95.0, // Fallback price
      weightTotalG: null,
      availableGrams: 1000,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    // Colored PIECE_BY_WEIGHT (Platinum)
    {
      sku: 'PLATINUM-BLOND-45-60CM',
      name: '60cm Platinum Edition - Světlá blond',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: 'barvene_blond',
      shadeName: 'Světlá blond',
      lengthCm: 60,
      structure: 'straight',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 110.0,
      weightTotalG: 120,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    // Colored BULK_G (Standard)
    {
      sku: 'STANDARD-BLOND-35-BULK',
      name: '35cm Stříbřitá blond na míru',
      customerCategory: 'STANDARD' as const,
      shade: 'barvene_blond',
      shadeName: 'Stříbřitá blond',
      lengthCm: 35,
      structure: 'wavy',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 50.0, // Fallback price
      weightTotalG: null,
      availableGrams: 500,
      minOrderG: 30,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    // Additional test SKUs
    {
      sku: 'LUXE-VIRGIN-75-BULK',
      name: '75cm Luxusní panenské vlasy',
      customerCategory: 'LUXE' as const,
      shade: 'nebarvene_dark',
      shadeName: 'Tmavě hnědá',
      lengthCm: 75,
      structure: 'straight',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 115.0, // Fallback price
      weightTotalG: null,
      availableGrams: 800,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    {
      sku: 'PLATINUM-BALAYAGE-45-PIECE',
      name: '45cm Platinum - Balayage',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: 'barvene_balayage',
      shadeName: 'Balayage - tmavá/blond',
      lengthCm: 45,
      structure: 'straight',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 90.0,
      weightTotalG: 110,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
    {
      sku: 'STANDARD-CURLY-60-BULK',
      name: '60cm Kudrnaté vlasy Standard',
      customerCategory: 'STANDARD' as const,
      shade: 'nebarvene_natural',
      shadeName: 'Přírodní barva',
      lengthCm: 60,
      structure: 'curly',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 85.0, // Fallback price
      weightTotalG: null,
      availableGrams: 600,
      minOrderG: 40,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
    },
  ];

  const createdSkus = await prisma.sku.createMany({
    data: skus,
  });
  console.log(`✓ Created ${skus.length} SKU items\n`);

  // Create a test order to show the system works
  console.log('📋 Creating test order...');
  const testSku = await prisma.sku.findFirst({
    where: { sku: 'STANDARD-VIRGIN-35-45CM' },
  });

  if (testSku) {
    const order = await prisma.order.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        streetAddress: 'Test Street 123',
        city: 'Prague',
        zipCode: '11000',
        country: 'CZ',
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        deliveryStatus: 'pending',
        subtotal: 6500,
        total: 8500,
        items: {
          create: {
            sku: { connect: { id: testSku.id } },
            saleMode: 'PIECE_BY_WEIGHT',
            grams: 100,
            pricePerGram: 65.0,
            lineTotal: 6500,
            nameSnapshot: testSku.name || testSku.sku,
            ending: 'NONE',
            assemblyFeeType: 'FLAT',
            assemblyFeeCzk: 0,
            assemblyFeeTotal: 0,
          },
        },
      },
    });
    console.log(`✓ Created test order: ${order.id}\n`);
  }

  console.log('✅ Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${priceMatrixEntries.length} price matrix entries`);
  console.log(`   - ${skus.length} SKU items`);
  console.log(`   - Test order created`);
  console.log(
    '\n🚀 You can now:\n   1. Visit http://localhost:3000/katalog to see the catalog\n   2. Add items to cart and test pricing\n'
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
