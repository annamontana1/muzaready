import prisma from '../lib/prisma';

async function check() {
  console.log('🔍 Kontrola cen pro Barvené vlasy\n');

  // Check for barvene/standard
  const barveneStandard = await prisma.priceMatrix.findMany({
    where: {
      category: 'barvene',
      tier: 'standard',
    },
    orderBy: { lengthCm: 'asc' },
  });

  console.log(`📊 Barvené/Standard: ${barveneStandard.length} záznamů`);
  if (barveneStandard.length > 0) {
    console.log('Délky:', barveneStandard.map(e => `${e.lengthCm}cm`).join(', '));
    console.log('Shade ranges:', [...new Set(barveneStandard.map(e => `${e.shadeRangeStart}-${e.shadeRangeEnd}`))].join(', '));
  } else {
    console.log('❌ CHYBÍ ceny pro Barvené/Standard!');
  }

  // Check for barvene/luxe
  const barveneLuxe = await prisma.priceMatrix.findMany({
    where: {
      category: 'barvene',
      tier: 'luxe',
    },
  });

  console.log(`\n📊 Barvené/LUXE: ${barveneLuxe.length} záznamů`);

  // Check nebarvene for comparison
  const nebarveneStandard = await prisma.priceMatrix.findMany({
    where: {
      category: 'nebarvene',
      tier: 'standard',
    },
  });

  console.log(`\n📊 Nebarvené/Standard: ${nebarveneStandard.length} záznamů (pro srovnání)`);
}

check()
  .catch((error) => {
    console.error('❌ Chyba:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
