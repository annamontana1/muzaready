import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🚀 Creating admin account...');

    const passwordHash = '$2b$10$jRPQhgEkZGfsrupS4ce20e7vXdp14X2EJQ/mj6ub0zO9GqrpTo1MS';

    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: 'muzahaircz@gmail.com' }
    });

    if (existing) {
      console.log('⚠️ Admin user already exists, updating password...');
      await prisma.adminUser.update({
        where: { email: 'muzahaircz@gmail.com' },
        data: {
          password: passwordHash,
          status: 'active',
          role: 'admin'
        }
      });
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('📝 Creating new admin user...');
      await prisma.adminUser.create({
        data: {
          name: 'Muza Admin',
          email: 'muzahaircz@gmail.com',
          password: passwordHash,
          role: 'admin',
          status: 'active'
        }
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin credentials:');
    console.log('   Email: muzahaircz@gmail.com');
    console.log('   Password: muza2024Admin!');
    console.log('\n🔗 Login at: https://muzaready-iota.vercel.app/admin/login');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
