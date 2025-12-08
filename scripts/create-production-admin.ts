import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/admin-auth';

// Use production database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function createProductionAdmin() {
  console.log('🔐 Creating admin user for PRODUCTION database...\n');

  const email = 'admin@muzahair.com';
  const password = 'MuzaAdmin2024!';  // Change this to a secure password!

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', email);
      console.log('If you want to reset the password, delete the user first.');
      return;
    }

    // Create new admin
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.adminUser.create({
      data: {
        name: 'Mùza Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🌐 Login at: https://muzaready-iota.vercel.app/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createProductionAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
