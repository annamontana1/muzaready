import prisma from '../lib/prisma';

async function checkProducts() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    console.log('Fetching products...');
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });

    console.log('\n=== PRODUCTS IN DATABASE ===');
    console.log('Total count:', products.length);

    if (products.length === 0) {
      console.log('\n⚠️  NO PRODUCTS FOUND IN DATABASE!');
      console.log('This is why the e-shop shows "Žádné produkty nenalezeny"');
    } else {
      console.log('\nProducts:');
      products.forEach((product, i) => {
        console.log(`\n${i + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Tier: ${product.tier}`);
        console.log(`   Base price: ${product.base_price_per_100g_45cm} Kč/100g`);
        console.log(`   Variants: ${product.variants.length}`);
      });
    }

    // Check SKUs as well
    console.log('\n=== SKUS IN DATABASE ===');
    const skus = await prisma.sku.findMany({
      take: 10,
    });
    console.log('Total SKUs:', await prisma.sku.count());
    console.log('First 10 SKUs:', skus.map(s => s.sku).join(', '));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
