import prisma from '../lib/prisma';

async function checkDatabase() {
  console.log('🔍 Kontrola databáze...\n');

  // Celkový počet SKU
  const totalSkus = await prisma.sku.count();
  console.log(`📦 Celkový počet SKU: ${totalSkus}`);

  // SKU s isListed = true
  const listedSkus = await prisma.sku.count({
    where: { isListed: true },
  });
  console.log(`✅ SKU s isListed=true: ${listedSkus}`);

  // SKU s inStock = true
  const inStockSkus = await prisma.sku.count({
    where: { inStock: true },
  });
  console.log(`📥 SKU s inStock=true: ${inStockSkus}`);

  // SKU s oběma podmínkami (co se zobrazí v katalogu)
  const catalogSkus = await prisma.sku.count({
    where: {
      isListed: true,
      inStock: true,
    },
  });
  console.log(`🛍️  SKU pro katalog (isListed=true AND inStock=true): ${catalogSkus}\n`);

  // Rozdělení podle kategorie
  console.log('📊 Rozdělení podle customerCategory:');
  const byCategory = await prisma.sku.groupBy({
    by: ['customerCategory'],
    where: {
      isListed: true,
      inStock: true,
    },
    _count: true,
  });
  byCategory.forEach((item) => {
    console.log(`   ${item.customerCategory || 'NULL'}: ${item._count}`);
  });

  // Rozdělení podle saleMode
  console.log('\n📊 Rozdělení podle saleMode:');
  const bySaleMode = await prisma.sku.groupBy({
    by: ['saleMode'],
    where: {
      isListed: true,
      inStock: true,
    },
    _count: true,
  });
  bySaleMode.forEach((item) => {
    console.log(`   ${item.saleMode}: ${item._count}`);
  });

  // Ukázka několika SKU
  console.log('\n📋 Ukázka SKU (prvních 5):');
  const sampleSkus = await prisma.sku.findMany({
    where: {
      isListed: true,
      inStock: true,
    },
    take: 5,
    select: {
      id: true,
      sku: true,
      name: true,
      customerCategory: true,
      shade: true,
      shadeName: true,
      lengthCm: true,
      structure: true,
      saleMode: true,
      pricePerGramCzk: true,
      isListed: true,
      inStock: true,
      availableGrams: true,
      weightTotalG: true,
    },
  });

  sampleSkus.forEach((sku, index) => {
    console.log(`\n   ${index + 1}. SKU: ${sku.sku}`);
    console.log(`      Název: ${sku.name || 'N/A'}`);
    console.log(`      Kategorie: ${sku.customerCategory || 'NULL'}`);
    console.log(`      Odstín: ${sku.shade || 'N/A'} (${sku.shadeName || 'N/A'})`);
    console.log(`      Délka: ${sku.lengthCm || 'N/A'} cm`);
    console.log(`      Struktura: ${sku.structure || 'N/A'}`);
    console.log(`      SaleMode: ${sku.saleMode}`);
    console.log(`      Cena/g: ${sku.pricePerGramCzk} Kč`);
    if (sku.saleMode === 'BULK_G') {
      console.log(`      Dostupné gramy: ${sku.availableGrams || 0}g`);
    } else {
      console.log(`      Váha kusu: ${sku.weightTotalG || 0}g`);
    }
  });

  // Kontrola podle shade (pro kategorii)
  console.log('\n📊 Rozdělení podle shade (pro kategorii):');
  const byShade = await prisma.sku.groupBy({
    by: ['shade'],
    where: {
      isListed: true,
      inStock: true,
    },
    _count: true,
  });
  byShade.forEach((item) => {
    console.log(`   Shade ${item.shade || 'NULL'}: ${item._count}`);
  });

  console.log('\n✅ Kontrola dokončena!');
}

checkDatabase()
  .catch((e) => {
    console.error('❌ Chyba:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

