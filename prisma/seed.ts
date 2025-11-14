import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/admin-auth';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceMatrix.deleteMany();
  await prisma.sku.deleteMany();
  await prisma.adminUser.deleteMany();
  console.log('✓ Cleared existing data\n');

  // Create test admin user
  console.log('👤 Creating test admin user...');
  const hashedPassword = await hashPassword('admin123');
  const adminUser = await prisma.adminUser.create({
    data: {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    },
  });
  console.log(`✓ Created admin user: ${adminUser.email}\n`);

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
    // Nebarvené - Standard BULK_G (shade 1 = Černá)
    {
      sku: 'STD-NEB-1-45-BULK',
      name: '45cm Standard - Černá',
      customerCategory: 'STANDARD' as const,
      shade: '1',
      shadeName: 'Černá',
      shadeHex: '#1A1A1A',
      lengthCm: 45,
      structure: 'rovné',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 65,
      weightTotalG: null,
      availableGrams: 1000,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
    // Nebarvené - LUXE BULK_G (shade 3 = Tmavá hnědá)
    {
      sku: 'LUX-NEB-3-60-BULK',
      name: '60cm LUXE - Tmavá hnědá',
      customerCategory: 'LUXE' as const,
      shade: '3',
      shadeName: 'Tmavá hnědá',
      shadeHex: '#4A3728',
      lengthCm: 60,
      structure: 'mírně vlnité',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 95,
      weightTotalG: null,
      availableGrams: 800,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 9,
    },
    // Nebarvené - Platinum PIECE_BY_WEIGHT (shade 1 = Černá, 60cm)
    {
      sku: 'PLAT-NEB-1-60-PIECE',
      name: '60cm Platinum Edition - Černá',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '1',
      shadeName: 'Černá',
      shadeHex: '#1A1A1A',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 105,
      weightTotalG: 120,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
    // Nebarvené - Platinum PIECE_BY_WEIGHT (shade 1 = Černá, 45cm)
    {
      sku: 'PLAT-NEB-1-45-PIECE',
      name: '45cm Platinum Edition - Černá',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '1',
      shadeName: 'Černá',
      shadeHex: '#1A1A1A',
      lengthCm: 45,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 85,
      weightTotalG: 100,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
    // Barvené - Standard BULK_G (shade 7 = Blond)
    {
      sku: 'STD-BAR-7-45-BULK',
      name: '45cm Standard - Blond',
      customerCategory: 'STANDARD' as const,
      shade: '7',
      shadeName: 'Blond',
      shadeHex: '#B39B7A',
      lengthCm: 45,
      structure: 'vlnité',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 70,
      weightTotalG: null,
      availableGrams: 900,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 8,
    },
    // Barvené - LUXE BULK_G (shade 8 = Světlá blond)
    {
      sku: 'LUX-BAR-8-60-BULK',
      name: '60cm LUXE - Světlá blond',
      customerCategory: 'LUXE' as const,
      shade: '8',
      shadeName: 'Světlá blond',
      shadeHex: '#C9B089',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'BULK_G' as const,
      pricePerGramCzk: 100,
      weightTotalG: null,
      availableGrams: 750,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 9,
    },
    // Barvené - Platinum PIECE_BY_WEIGHT (shade 10 = Platinová blond, 60cm)
    {
      sku: 'PLAT-BAR-10-60-PIECE',
      name: '60cm Platinum Edition - Platinová blond',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '10',
      shadeName: 'Platinová blond',
      shadeHex: '#E5D5B7',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 110,
      weightTotalG: 115,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
    // Barvené - Platinum PIECE_BY_WEIGHT (shade 10 = Platinová blond, 45cm)
    {
      sku: 'PLAT-BAR-10-45-PIECE',
      name: '45cm Platinum Edition - Platinová blond',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '10',
      shadeName: 'Platinová blond',
      shadeHex: '#E5D5B7',
      lengthCm: 45,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 90,
      weightTotalG: 95,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
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
        status: 'pending',
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
