import prisma from './lib/prisma';

async function checkAdmins() {
  console.log('🔍 Checking admin users in database...\n');

  try {
    const admins = await prisma.adminUser.findMany();

    if (admins.length === 0) {
      console.log('❌ NO ADMIN USERS FOUND!');
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
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
