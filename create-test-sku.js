const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestSKUs() {
  try {
    console.log('Creating test SKUs...');

    // Test VlasyX (BULK_G) - uncolored
    const vlasyxBulk = await prisma.sku.create({
      data: {
        sku: 'VLASYX-BULK-001',
        name: 'Test VlasyX - Nebarvené 50cm Standard',
        shade: '2',
        shadeName: 'Light Brown',
        structure: 'rovné',
        lengthCm: 50,
        customerCategory: 'STANDARD',
        saleMode: 'BULK_G',
        pricePerGramCzk: 18.50,
        availableGrams: 500,
        minOrderG: 10,
        stepG: 5,
        isListed: true,
        listingPriority: 1,
        inStock: true,
      },
    });

    console.log('✅ Created VlasyX (BULK_G) SKU:', vlasyxBulk.sku);

    // Test Platinum (PIECE_BY_WEIGHT) - colored
    const platinumPiece = await prisma.sku.create({
      data: {
        sku: 'PLATINUM-PIECE-001',
        name: 'Test Platinum - Barvené 50cm Luxe',
        shade: '6',
        shadeName: 'Medium Brown',
        structure: 'rovné',
        lengthCm: 50,
        customerCategory: 'LUXE',
        saleMode: 'PIECE_BY_WEIGHT',
        pricePerGramCzk: 31.00,
        weightTotalG: 100,
        isListed: true,
        listingPriority: 2,
        inStock: true,
      },
    });

    console.log('✅ Created Platinum (PIECE_BY_WEIGHT) SKU:', platinumPiece.sku);

    console.log('\n✅ Test SKUs created successfully!');
    console.log('\nYou can now:');
    console.log('1. Log in to admin at http://localhost:3000/admin/login');
    console.log('2. View these products in "Sklad (SKU)" section');
    console.log('3. Navigate to shop and add these items to cart');
    console.log('4. Complete a test purchase with test@example.com / testpassword123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestSKUs();
