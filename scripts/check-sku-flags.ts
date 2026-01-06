import prisma from '../lib/prisma';

async function checkSkuFlags() {
  try {
    console.log('Fetching SKUs...\n');

    const totalSkus = await prisma.sku.count();
    const listedSkus = await prisma.sku.count({ where: { isListed: true } });
    const inStockSkus = await prisma.sku.count({ where: { inStock: true } });
    const listedAndInStock = await prisma.sku.count({
      where: {
        isListed: true,
        inStock: true
      }
    });

    console.log('=== SKU FLAGS STATISTICS ===');
    console.log(`Total SKUs: ${totalSkus}`);
    console.log(`Listed (isListed=true): ${listedSkus}`);
    console.log(`In Stock (inStock=true): ${inStockSkus}`);
    console.log(`Listed AND In Stock: ${listedAndInStock}`);
    console.log();

    if (listedAndInStock === 0) {
      console.log('⚠️  NO SKUs are both LISTED and IN STOCK!');
      console.log('This is why catalog shows "Žádné produkty nenalezeny"\n');

      // Show details of first 5 SKUs
      const sampleSkus = await prisma.sku.findMany({
        take: 5,
        select: {
          sku: true,
          name: true,
          isListed: true,
          inStock: true,
          soldOut: true,
          availableGrams: true,
        },
      });

      console.log('Sample SKUs:');
      sampleSkus.forEach((sku, i) => {
        console.log(`\n${i + 1}. ${sku.sku}`);
        console.log(`   Name: ${sku.name || 'NULL'}`);
        console.log(`   isListed: ${sku.isListed}`);
        console.log(`   inStock: ${sku.inStock}`);
        console.log(`   soldOut: ${sku.soldOut}`);
        console.log(`   availableGrams: ${sku.availableGrams}`);
      });

      console.log('\n💡 FIX: Update SKUs to set isListed=true and inStock=true');
      console.log('   Run: UPDATE "Sku" SET "isListed" = true, "inStock" = true WHERE "availableGrams" > 0;');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSkuFlags();
