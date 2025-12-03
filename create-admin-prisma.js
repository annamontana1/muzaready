const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user via Prisma...');

    // Check if already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: 'muzahaircz@gmail.com' }
    });

    if (existing) {
      console.log('❌ Admin already exists:', existing);
      return;
    }

    const hashedPassword = await bcryptjs.hash('muzaisthebest', 10);

    const admin = await prisma.adminUser.create({
      data: {
        email: 'muzahaircz@gmail.com',
        name: 'Muza Admin',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Password hash:', admin.password);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
