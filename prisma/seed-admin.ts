import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin users...\n');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create default admin user
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@muzahair.cz' },
    update: {
      password: hashedPassword, // Update password in case it changed
      status: 'active',
    },
    create: {
      name: 'Administrator',
      email: 'admin@muzahair.cz',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    },
  });

  console.log('✅ Admin user created/updated:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Password: admin123 (change this in production!)\n`);

  // Create manager user (optional)
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.adminUser.upsert({
    where: { email: 'manager@muzahair.cz' },
    update: {
      password: managerPassword,
      status: 'active',
    },
    create: {
      name: 'Manager',
      email: 'manager@muzahair.cz',
      password: managerPassword,
      role: 'manager',
      status: 'active',
    },
  });

  console.log('✅ Manager user created/updated:');
  console.log(`   Email: ${manager.email}`);
  console.log(`   Name: ${manager.name}`);
  console.log(`   Role: ${manager.role}`);
  console.log(`   Password: manager123 (change this in production!)\n`);

  console.log('🎉 Admin seeding completed!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

