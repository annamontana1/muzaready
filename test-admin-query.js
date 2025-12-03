const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testQuery() {
  try {
    console.log('Testing Prisma query for admin user...');

    const admin = await prisma.adminUser.findUnique({
      where: { email: 'muzahaircz@gmail.com' }
    });

    if (admin) {
      console.log('✅ Admin user found!');
      console.log('ID:', admin.id);
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Status:', admin.status);
      console.log('Password hash:', admin.password);
      console.log('\n✅ Prisma can read from the database correctly!');
    } else {
      console.log('❌ Admin user NOT found in database');
    }
  } catch (error) {
    console.error('❌ Error querying database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
