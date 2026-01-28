/**
 * Script to create admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@muzahair.cz';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.ADMIN_NAME || 'Admin';

  console.log('Creating admin user...');
  console.log('Email:', email);
  console.log('Password:', password);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or update admin user
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
      status: 'active',
      role: 'admin',
    },
    create: {
      email,
      password: hashedPassword,
      name,
      status: 'active',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created/updated:');
  console.log('   Email:', admin.email);
  console.log('   Name:', admin.name);
  console.log('   Role:', admin.role);
  console.log('   Status:', admin.status);
  console.log('\n🔐 Login credentials:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('\n🌐 Login URL: https://muzahair.cz/admin/login');
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
