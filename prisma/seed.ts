import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/admin-auth';

const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const EUR_TO_CZK = 25.5;
const CZK_TO_EUR = 1 / EUR_TO_CZK;

type ShadeRange = {
  start: number;
  end: number;
};

type PriceMatrixConfig = {
  category: 'nebarvene' | 'barvene';
  tier: 'standard' | 'luxe' | 'platinum';
  ranges: Array<ShadeRange & { base: number; step: number }>;
};

const priceMatrixConfig: PriceMatrixConfig[] = [
  {
    category: 'nebarvene',
    tier: 'standard',
    ranges: [{ start: 1, end: 4, base: 60, step: 2 }],
  },
  {
    category: 'nebarvene',
    tier: 'luxe',
    ranges: [
      { start: 1, end: 4, base: 70, step: 2.5 },
      { start: 5, end: 7, base: 75, step: 2.5 },
    ],
  },
  {
    category: 'nebarvene',
    tier: 'platinum',
    ranges: [
      { start: 1, end: 4, base: 80, step: 3 },
      { start: 5, end: 7, base: 85, step: 3 },
      { start: 8, end: 10, base: 90, step: 3 },
    ],
  },
  {
    category: 'barvene',
    tier: 'standard',
    ranges: [{ start: 5, end: 10, base: 65, step: 2 }],
  },
  {
    category: 'barvene',
    tier: 'luxe',
    ranges: [{ start: 5, end: 10, base: 75, step: 2.5 }],
  },
  {
    category: 'barvene',
    tier: 'platinum',
    ranges: [{ start: 5, end: 10, base: 85, step: 3 }],
  },
];

const getShadeRangeForShade = (shadeNumber: number): ShadeRange => {
  if (shadeNumber <= 4) {
    return { start: 1, end: 4 };
  }
  if (shadeNumber <= 7) {
    return { start: 5, end: 7 };
  }
  return { start: 8, end: 10 };
};

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.exchangeRate.deleteMany();
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
  const priceMatrixEntries = priceMatrixConfig.flatMap(({ category, tier, ranges }) => {
    return ranges.flatMap(({ start, end, base, step }) =>
      LENGTHS.map((length, index) => {
        const priceCzk = Number((base + step * index).toFixed(2));
        return {
          category,
          tier,
          shadeRangeStart: start,
          shadeRangeEnd: end,
          lengthCm: length,
          pricePerGramCzk: priceCzk,
          pricePerGramEur: Number((priceCzk * CZK_TO_EUR).toFixed(3)),
        };
      })
    );
  });

  await prisma.priceMatrix.createMany({
    data: priceMatrixEntries,
  });
  console.log(`✓ Created ${priceMatrixEntries.length} price matrix entries\n`);

  // Seed exchange rate
  console.log('💱 Setting initial exchange rate...');
  const exchangeRate = await prisma.exchangeRate.create({
    data: {
      id: 'GLOBAL_RATE',
      czk_to_eur: CZK_TO_EUR,
      description: '1 EUR = 25.5 CZK',
      updatedBy: 'seed-script',
    },
  });
  const rateValue = Number(exchangeRate.czk_to_eur);
  console.log(`✓ Exchange rate set: 1 EUR = ${(1 / rateValue).toFixed(2)} CZK\n`);

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
      weightGrams: null,
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
      weightGrams: null,
      availableGrams: 800,
      minOrderG: 50,
      stepG: 10,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 9,
    },
    // Platinum test SKUs (VlasyY)
    {
      sku: 'PLAT-NEB-1-60-168',
      name: '60 cm · Platinum · odstín #1 · 168 g',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '1',
      shadeName: 'Černá',
      shadeHex: '#1A1A1A',
      lengthCm: 60,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 105,
      weightTotalG: 168,
      weightGrams: 168,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
    {
      sku: 'PLAT-BAR-6-55-155',
      name: '55 cm · Platinum · odstín #6 · 155 g',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '6',
      shadeName: 'Medová blond',
      shadeHex: '#C6A065',
      lengthCm: 55,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 115,
      weightTotalG: 155,
      weightGrams: 155,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 9,
    },
    {
      sku: 'PLAT-BAR-9-50-140',
      name: '50 cm · Platinum · odstín #9 · 140 g',
      customerCategory: 'PLATINUM_EDITION' as const,
      shade: '9',
      shadeName: 'Perleťová blond',
      shadeHex: '#E3C9A8',
      lengthCm: 50,
      structure: 'rovné',
      saleMode: 'PIECE_BY_WEIGHT' as const,
      pricePerGramCzk: 120,
      weightTotalG: 140,
      weightGrams: 140,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: false,
      soldOut: true,
      isListed: true,
      listingPriority: 8,
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
      weightGrams: null,
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
      weightGrams: null,
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
      weightGrams: 115,
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
      pricePerGramCzk: 95,
      weightTotalG: 95,
      weightGrams: 95,
      availableGrams: null,
      minOrderG: null,
      stepG: null,
      inStock: true,
      soldOut: false,
      isListed: true,
      listingPriority: 10,
    },
  ].map((sku) => {
    const shadeNumber = Number(sku.shade);
    const { start, end } = getShadeRangeForShade(shadeNumber);
    const pricePerGramEur = sku.pricePerGramCzk
      ? Number((sku.pricePerGramCzk * CZK_TO_EUR).toFixed(3))
      : null;
    const priceCzkTotal =
      sku.saleMode === 'PIECE_BY_WEIGHT' && sku.weightGrams
        ? Number((sku.pricePerGramCzk * sku.weightGrams).toFixed(2))
        : null;
    const priceEurTotal = priceCzkTotal
      ? Number((priceCzkTotal * CZK_TO_EUR).toFixed(2))
      : null;

    return {
      ...sku,
      shadeRangeStart: start,
      shadeRangeEnd: end,
      pricePerGramEur,
      priceCzkTotal,
      priceEurTotal,
    };
  });

  await prisma.sku.createMany({
    data: skus,
  });
  console.log(`✓ Created ${skus.length} SKU items\n`);

  // Create a test order to show the system works
  console.log('📋 Creating test order...');
  const testSku = await prisma.sku.findFirst({
    where: { sku: 'STD-NEB-1-45-BULK' },
  });

  if (testSku) {
    const pricePerGram = testSku.pricePerGramCzk || 65;
    const grams = 100;
    const order = await prisma.order.create({
      data: {
        email: 'test@example.com',
        status: 'pending',
        total: grams * pricePerGram,
        items: {
          create: {
            sku: { connect: { id: testSku.id } },
            saleMode: 'BULK_G',
            grams,
            pricePerGram,
            lineTotal: grams * pricePerGram,
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
  console.log('   - 1 exchange rate entry');
  console.log(`   - ${skus.length} SKU items`);
  console.log(`   - Test order ${testSku ? 'created' : 'skipped (SKU missing)'}`);
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
