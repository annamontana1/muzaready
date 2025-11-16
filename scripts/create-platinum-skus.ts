import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CZK_TO_EUR = 1 / 25.5;

const getShadeRange = (shade: number) => {
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
};

const SKUS = [
  {
    sku: 'PLAT-DEMO-1-60-168',
    name: '60 cm · Platinum · odstín #1 · 168 g',
    customerCategory: 'PLATINUM_EDITION' as const,
    shade: '1',
    shadeName: 'Černá',
    shadeHex: '#1A1A1A',
    lengthCm: 60,
    structure: 'rovné',
    saleMode: 'PIECE_BY_WEIGHT' as const,
    pricePerGramCzk: 120,
    weightTotalG: 168,
    weightGrams: 168,
    inStock: true,
    soldOut: false,
    isListed: true,
    listingPriority: 15,
  },
  {
    sku: 'PLAT-DEMO-6-55-155',
    name: '55 cm · Platinum · odstín #6 · 155 g',
    customerCategory: 'PLATINUM_EDITION' as const,
    shade: '6',
    shadeName: 'Medová blond',
    shadeHex: '#C6A065',
    lengthCm: 55,
    structure: 'rovné',
    saleMode: 'PIECE_BY_WEIGHT' as const,
    pricePerGramCzk: 130,
    weightTotalG: 155,
    weightGrams: 155,
    inStock: true,
    soldOut: false,
    isListed: true,
    listingPriority: 14,
  },
  {
    sku: 'PLAT-DEMO-9-50-140',
    name: '50 cm · Platinum · odstín #9 · 140 g',
    customerCategory: 'PLATINUM_EDITION' as const,
    shade: '9',
    shadeName: 'Perleťová blond',
    shadeHex: '#E3C9A8',
    lengthCm: 50,
    structure: 'rovné',
    saleMode: 'PIECE_BY_WEIGHT' as const,
    pricePerGramCzk: 135,
    weightTotalG: 140,
    weightGrams: 140,
    inStock: false,
    soldOut: true,
    isListed: true,
    listingPriority: 13,
  },
];

async function main() {
  console.log('🔄 Creating demo Platinum SKUs…');
  for (const data of SKUS) {
    const shade = Number(data.shade);
    const range = getShadeRange(shade);
    const pricePerGramEur = Number((data.pricePerGramCzk * CZK_TO_EUR).toFixed(3));
    const priceCzkTotal = Number((data.pricePerGramCzk * data.weightGrams).toFixed(2));
    const priceEurTotal = Number((priceCzkTotal * CZK_TO_EUR).toFixed(2));

    await prisma.sku.upsert({
      where: { sku: data.sku },
      update: {
        ...data,
        shadeRangeStart: range.start,
        shadeRangeEnd: range.end,
        pricePerGramEur,
        priceCzkTotal,
        priceEurTotal,
      },
      create: {
        ...data,
        shadeRangeStart: range.start,
        shadeRangeEnd: range.end,
        pricePerGramEur,
        priceCzkTotal,
        priceEurTotal,
      },
    });
    console.log(`✓ ${data.sku}`);
  }

  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
