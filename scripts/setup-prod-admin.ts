/**
 * Setup Production Admin User
 * This script creates admin@muzahair.cz in the production database
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🔧 Setting up production admin user...\n');

  // Use DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable not set');
    console.log('\nUsage:');
    console.log('DATABASE_URL="postgresql://..." npx tsx scripts/setup-prod-admin.ts');
    process.exit(1);
  }

  console.log('✓ DATABASE_URL found');
  console.log(`  Connection: ${databaseUrl.split('@')[1]?.split('/')[0] || 'hidden'}\n`);

  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  try {
    // Check if admin user already exists
    console.log('🔍 Checking for existing admin user...');
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: 'admin@muzahair.cz' },
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log(`  Name: ${existingAdmin.name}`);
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Role: ${existingAdmin.role}`);
      console.log(`  Status: ${existingAdmin.status}`);
      console.log(`  Created: ${existingAdmin.createdAt}`);

      // Ask if we should update password
      console.log('\n⚠️  Admin user exists. Updating password to: admin123');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await prisma.adminUser.update({
        where: { email: 'admin@muzahair.cz' },
        data: {
          password: hashedPassword,
          status: 'active',
        },
      });

      console.log('✅ Password updated successfully!');
    } else {
      // Create new admin user
      console.log('❌ No admin user found. Creating new one...\n');

      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = await prisma.adminUser.create({
        data: {
          name: 'Admin',
          email: 'admin@muzahair.cz',
          password: hashedPassword,
          role: 'admin',
          status: 'active',
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log(`  ID: ${admin.id}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
    }

    console.log('\n📋 Login credentials:');
    console.log('  URL: https://muzaready-iota.vercel.app/admin/login');
    console.log('  Email: admin@muzahair.cz');
    console.log('  Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change password after first login!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
