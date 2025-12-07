import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test orders...');

  // Get first SKU
  const sku = await prisma.sku.findFirst();
  if (!sku) {
    console.log('No SKU found, skipping order creation');
    return;
  }

  // Create 3 test orders
  const order1 = await prisma.order.create({
    data: {
      email: 'customer1@example.com',
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '+420123456789',
      streetAddress: 'Hlavní 123',
      city: 'Praha',
      zipCode: '11000',
      country: 'CZ',
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryStatus: 'pending',
      channel: 'web',
      paymentMethod: 'CARD',
      deliveryMethod: 'COURIER',
      subtotal: 6500,
      shippingCost: 150,
      discountAmount: 0,
      total: 6650,
      tags: JSON.stringify(['test', 'customer1']),
      riskScore: 10,
      items: {
        create: {
          skuId: sku.id,
          saleMode: 'BULK_G',
          grams: 100,
          pricePerGram: 65,
          lineTotal: 6500,
          nameSnapshot: sku.name,
          ending: 'NONE',
          assemblyFeeType: 'FLAT',
          assemblyFeeCzk: 0,
          assemblyFeeTotal: 0,
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      email: 'customer2@example.com',
      firstName: 'Jana',
      lastName: 'Svobodová',
      phone: '+420987654321',
      streetAddress: 'Vedlejší 456',
      city: 'Brno',
      zipCode: '60200',
      country: 'CZ',
      orderStatus: 'paid',
      paymentStatus: 'paid',
      deliveryStatus: 'shipped',
      channel: 'ig_dm',
      paymentMethod: 'BANK_TRANSFER',
      deliveryMethod: 'PICKUP',
      subtotal: 3900,
      shippingCost: 0,
      discountAmount: 200,
      total: 3700,
      tags: JSON.stringify(['vip', 'instagram']),
      riskScore: 5,
      notesInternal: 'VIP customer - priority shipping',
      items: {
        create: {
          skuId: sku.id,
          saleMode: 'BULK_G',
          grams: 60,
          pricePerGram: 65,
          lineTotal: 3900,
          nameSnapshot: sku.name,
          ending: 'NONE',
          assemblyFeeType: 'FLAT',
          assemblyFeeCzk: 0,
          assemblyFeeTotal: 0,
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      email: 'customer3@example.com',
      firstName: 'Petr',
      lastName: 'Dvořák',
      phone: '+420555111222',
      streetAddress: 'Okružní 789',
      city: 'Ostrava',
      zipCode: '70200',
      country: 'CZ',
      orderStatus: 'draft',
      paymentStatus: 'unpaid',
      deliveryStatus: 'pending',
      channel: 'pos',
      paymentMethod: 'CASH',
      deliveryMethod: 'COURIER',
      subtotal: 13000,
      shippingCost: 200,
      discountAmount: 500,
      total: 12700,
      tags: JSON.stringify(['pos', 'walk-in']),
      riskScore: 0,
      notesCustomer: 'Please call before delivery',
      items: {
        create: {
          skuId: sku.id,
          saleMode: 'BULK_G',
          grams: 200,
          pricePerGram: 65,
          lineTotal: 13000,
          nameSnapshot: sku.name,
          ending: 'NONE',
          assemblyFeeType: 'FLAT',
          assemblyFeeCzk: 0,
          assemblyFeeTotal: 0,
        },
      },
    },
  });

  console.log('Created orders:', [order1.id, order2.id, order3.id]);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
