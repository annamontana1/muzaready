import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function checkAdmins() {
  console.log('🔍 Checking admin users in PRODUCTION database...\n');

  try {
    const admins = await prisma.adminUser.findMany();

    if (admins.length === 0) {
      console.log('❌ NO ADMIN USERS FOUND in production database!');
      console.log('\nℹ️  This is why login fails with 500 error.');
      console.log('\n💡 Solution: Run the create-production-admin.ts script');
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin) => {
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   👤 Name: ${admin.name}`);
        console.log(`   🎭 Role: ${admin.role}`);
        console.log(`   ⚡ Status: ${admin.status}`);
        console.log('   ---');
      });
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('\nℹ️  Check DATABASE_URL in environment variables');
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
