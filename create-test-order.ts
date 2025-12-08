import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Načti .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Vytvoř Prisma client s explicitním DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🛒 Vytváření test objednávek...\n');

  // Najdi první dostupný SKU
  const sku = await prisma.sku.findFirst({
    where: { inStock: true },
  });

  if (!sku) {
    console.log('❌ Nenalezen žádný SKU na skladě. Spusť nejdřív seed:');
    console.log('   npm run seed');
    return;
  }

  console.log(`✅ Používám SKU: ${sku.sku} (${sku.name || 'Bez názvu'})\n`);

  // Vytvoř několik test objednávek s různými statusy
  const orders = [
    {
      email: 'test-pending@example.com',
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '+420123456789',
      streetAddress: 'Hlavní 123',
      city: 'Praha',
      zipCode: '11000',
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryStatus: 'pending',
      channel: 'web',
      paymentMethod: 'gopay',
      deliveryMethod: 'standard',
      subtotal: 6500,
      shippingCost: 150,
      discountAmount: 0,
      total: 6650,
      tags: JSON.stringify(['test', 'pending']),
      riskScore: 10,
      notesInternal: 'Test objednávka - čeká na platbu',
    },
    {
      email: 'test-paid@example.com',
      firstName: 'Jana',
      lastName: 'Svobodová',
      phone: '+420987654321',
      streetAddress: 'Vedlejší 456',
      city: 'Brno',
      zipCode: '60200',
      orderStatus: 'paid',
      paymentStatus: 'paid',
      deliveryStatus: 'pending',
      channel: 'web',
      paymentMethod: 'bank_transfer',
      deliveryMethod: 'express',
      subtotal: 3900,
      shippingCost: 200,
      discountAmount: 0,
      total: 4100,
      tags: JSON.stringify(['test', 'paid']),
      riskScore: 5,
      notesInternal: 'Test objednávka - zaplaceno, čeká na odeslání',
      paidAt: new Date(),
    },
    {
      email: 'test-shipped@example.com',
      firstName: 'Petr',
      lastName: 'Dvořák',
      phone: '+420555111222',
      streetAddress: 'Okružní 789',
      city: 'Ostrava',
      zipCode: '70200',
      orderStatus: 'processing',
      paymentStatus: 'paid',
      deliveryStatus: 'shipped',
      channel: 'ig_dm',
      paymentMethod: 'gopay',
      deliveryMethod: 'standard',
      subtotal: 13000,
      shippingCost: 150,
      discountAmount: 500,
      total: 12650,
      tags: JSON.stringify(['test', 'shipped', 'vip']),
      riskScore: 0,
      notesInternal: 'Test objednávka - odesláno',
      notesCustomer: 'Odesláno dopravcem',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dny zpět
      shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 den zpět
      trackingNumber: 'TEST123456789',
    },
    {
      email: 'test-draft@example.com',
      firstName: 'Marie',
      lastName: 'Procházková',
      phone: '+420777888999',
      streetAddress: 'Náměstí 1',
      city: 'Plzeň',
      zipCode: '30100',
      orderStatus: 'draft',
      paymentStatus: 'unpaid',
      deliveryStatus: 'pending',
      channel: 'pos',
      paymentMethod: 'cash',
      deliveryMethod: 'pickup',
      subtotal: 2600,
      shippingCost: 0,
      discountAmount: 0,
      total: 2600,
      tags: JSON.stringify(['test', 'draft', 'pos']),
      riskScore: 0,
      notesInternal: 'Test objednávka - draft (neúplná)',
    },
  ];

  const createdOrders = [];

  for (const orderData of orders) {
    try {
      const order = await prisma.order.create({
        data: {
          ...orderData,
          country: 'CZ',
          items: {
            create: {
              skuId: sku.id,
              saleMode: 'BULK_G',
              grams: orderData.subtotal / (sku.pricePerGramCzk || 65),
              pricePerGram: sku.pricePerGramCzk || 65,
              lineTotal: orderData.subtotal,
              nameSnapshot: sku.name || sku.sku,
              ending: 'NONE',
              assemblyFeeType: 'FLAT',
              assemblyFeeCzk: 0,
              assemblyFeeTotal: 0,
            },
          },
        },
      });
      createdOrders.push(order);
      console.log(`✅ Vytvořeno: ${order.email} - ${order.orderStatus}/${order.paymentStatus}/${order.deliveryStatus}`);
    } catch (error: any) {
      console.error(`❌ Chyba při vytváření objednávky ${orderData.email}:`, error.message);
    }
  }

  console.log(`\n🎉 Vytvořeno ${createdOrders.length} test objednávek!`);
  console.log('\n📋 Můžeš je vidět v admin panelu:');
  console.log('   http://localhost:3000/admin/objednavky');
  console.log('\n📊 Různé statusy pro testování:');
  console.log('   - pending/unpaid/pending - čeká na platbu');
  console.log('   - paid/paid/pending - zaplaceno, čeká na odeslání');
  console.log('   - processing/paid/shipped - odesláno');
  console.log('   - draft/unpaid/pending - draft objednávka');
}

main()
  .catch((e) => {
    console.error('❌ Chyba:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

