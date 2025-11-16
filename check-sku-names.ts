import prisma from '@/lib/prisma';

async function checkSkuNames() {
  try {
    const bulkSkus = await prisma.sku.findMany({
      where: {
        OR: [
          { customerCategory: 'STANDARD' },
          { customerCategory: 'LUXE' }
        ]
      },
      select: {
        id: true,
        sku: true,
        name: true,
        lengthCm: true,
        shade: true,
        customerCategory: true,
      },
      take: 10
    });

    console.log('\n=== BULK SKU Names (First 10) ===\n');
    bulkSkus.forEach(sku => {
      console.log(`SKU: ${sku.sku}`);
      console.log(`Category: ${sku.customerCategory}`);
      console.log(`Name: "${sku.name}"`);
      console.log(`Length: ${sku.lengthCm}cm, Shade: ${sku.shade}\n`);
    });

    console.log(`Total BULK SKUs: ${await prisma.sku.count({
      where: {
        OR: [
          { customerCategory: 'STANDARD' },
          { customerCategory: 'LUXE' }
        ]
      }
    })}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSkuNames();
