import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function fixProductsFromSkus() {
  console.log('🔍 Checking Products and SKUs...\n');

  try {
    // Count existing data
    const productCount = await prisma.product.count();
    const skuCount = await prisma.sku.count();

    console.log(`📦 Products: ${productCount}`);
    console.log(`📦 SKUs: ${skuCount}\n`);

    if (productCount > 0) {
      console.log('✅ Products already exist! No need to create them.');
      return;
    }

    if (skuCount === 0) {
      console.log('⚠️  No SKUs found. Please run the seed script first.');
      return;
    }

    console.log('🔧 Creating Products from existing SKUs...\n');

    // Get all SKUs grouped by name pattern
    const skus = await prisma.sku.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        shade: true,
        shadeName: true,
        lengthCm: true,
        customerCategory: true,
        pricePerGramCzk: true,
      },
    });

    // Group SKUs by category and tier to create Products
    const productGroups = new Map<string, typeof skus>();

    for (const sku of skus) {
      // Extract category and tier from SKU code
      // Format: "STD-NEB-1-45-BULK" or "LUX-BAR-7-60-BULK"
      const [tier, category] = sku.sku.split('-');

      const key = `${tier}-${category}-${sku.lengthCm}cm-${sku.shade}`;

      if (!productGroups.has(key)) {
        productGroups.set(key, []);
      }
      productGroups.get(key)!.push(sku);
    }

    console.log(`📊 Found ${productGroups.size} unique product groups\n`);

    // Create Products
    let createdCount = 0;
    const skuUpdates: Array<{ skuId: string; productId: string }> = [];

    for (const [key, groupSkus] of productGroups) {
      const firstSku = groupSkus[0];
      const [tierCode, categoryCode] = firstSku.sku.split('-');

      // Map tier codes
      const tierMap: Record<string, string> = {
        'STD': 'standard',
        'LUX': 'luxe',
        'PLAT': 'platinum',
      };

      // Map category codes
      const categoryMap: Record<string, string> = {
        'NEB': 'nebarvene',
        'BAR': 'barvene',
      };

      const tier = tierMap[tierCode] || 'standard';
      const category = categoryMap[categoryCode] || 'nebarvene';

      // Create product name
      const productName = firstSku.name ||
        `${firstSku.lengthCm}cm ${tier.toUpperCase()} - ${firstSku.shadeName || 'odstín ' + firstSku.shade}`;

      // Create Product
      const product = await prisma.product.create({
        data: {
          name: productName,
          category,
          tier,
          base_price_per_100g_45cm: firstSku.pricePerGramCzk || 70,
        },
      });

      console.log(`✅ Created: ${product.name}`);
      createdCount++;

      // Store SKU update mappings
      for (const sku of groupSkus) {
        skuUpdates.push({
          skuId: sku.id,
          productId: product.id,
        });
      }
    }

    console.log(`\n✅ Created ${createdCount} Products\n`);

    // Update SKUs with productId
    console.log('🔗 Linking SKUs to Products...\n');

    for (const update of skuUpdates) {
      await prisma.sku.update({
        where: { id: update.skuId },
        data: { productId: update.productId },
      });
    }

    console.log(`✅ Linked ${skuUpdates.length} SKUs to Products\n`);

    // Verify
    const finalProductCount = await prisma.product.count();
    const linkedSkuCount = await prisma.sku.count({
      where: { productId: { not: null } },
    });

    console.log('📊 Final Status:');
    console.log(`   Products: ${finalProductCount}`);
    console.log(`   SKUs linked: ${linkedSkuCount}/${skuCount}`);
    console.log('\n✅ Done! Products and SKUs are now connected.');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixProductsFromSkus();
