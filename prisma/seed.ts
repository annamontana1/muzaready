import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create admin user
  const adminUser = await prisma.adminUser.create({
    data: {
      name: 'Admin',
      email: 'admin@muzahair.cz',
      password: 'amobenecanto8A', // In production, this should be hashed!
      role: 'admin',
      status: 'active',
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create sample products with variants
  const products = [
    {
      name: 'Nebarvené - Standard',
      category: 'nebarvene',
      tier: 'Standard',
      base_price_per_100g_45cm: 890,
      set_id: null,
      variants: [
        { name: '45cm', price: 890 },
        { name: '60cm', price: 1190 },
        { name: '65cm', price: 1290 },
      ],
    },
    {
      name: 'Barvené - LUXE',
      category: 'barvene',
      tier: 'LUXE',
      base_price_per_100g_45cm: 1290,
      set_id: null,
      variants: [
        { name: '45cm', price: 1290 },
        { name: '60cm', price: 1690 },
        { name: '65cm', price: 1890 },
      ],
    },
    {
      name: 'Platinum - Luxury Edition',
      category: 'premium',
      tier: 'Platinum edition',
      base_price_per_100g_45cm: 2490,
      set_id: null,
      variants: [
        { name: '45cm', price: 2490 },
        { name: '60cm', price: 3190 },
        { name: '65cm', price: 3490 },
      ],
    },
    {
      name: 'Clip-in Extension - Standard',
      category: 'clipin',
      tier: 'Standard',
      base_price_per_100g_45cm: 690,
      set_id: null,
      variants: [
        { name: '35cm', price: 690 },
        { name: '45cm', price: 890 },
      ],
    },
    {
      name: 'Ombre Hair - LUXE',
      category: 'ombre',
      tier: 'LUXE',
      base_price_per_100g_45cm: 1490,
      set_id: null,
      variants: [
        { name: '45cm', price: 1490 },
        { name: '60cm', price: 1990 },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, ...product } = productData;
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        variants: {
          create: variants,
        },
      },
    });
    console.log(`✅ Product created: ${createdProduct.name}`);
  }

  // Create sample orders
  const orders = [
    {
      email: 'customer1@example.com',
      status: 'delivered',
      total: 2890,
      items: [
        { productId: '', quantity: 1, price: 890, variant: '45cm' },
        { productId: '', quantity: 2, price: 1000, variant: '60cm' },
      ],
    },
    {
      email: 'customer2@example.com',
      status: 'pending',
      total: 1290,
      items: [
        { productId: '', quantity: 1, price: 1290, variant: '45cm' },
      ],
    },
  ];

  // Get first product for orders
  const firstProduct = await prisma.product.findFirst();

  if (firstProduct) {
    for (const orderData of orders) {
      const { items, ...order } = orderData;
      const createdOrder = await prisma.order.create({
        data: {
          ...order,
          items: {
            create: items.map((item) => ({
              ...item,
              productId: firstProduct.id,
            })),
          },
        },
      });
      console.log(`✅ Order created: ${createdOrder.id}`);
    }
  }

  console.log('✨ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
