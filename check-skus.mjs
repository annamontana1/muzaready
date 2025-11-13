import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const skus = await prisma.sku.findMany({
    take: 10,
    select: {
      id: true,
      sku: true,
      name: true,
      isListed: true,
      inStock: true,
      soldOut: true,
    },
  });

  console.log('SKUs in database:', skus);
  console.log('Total count:', skus.length);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
