import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing login locally...\n');

    const email = 'muzahaircz@gmail.com';
    const password = 'muza2024Admin!';

    // Find admin user
    console.log('1. Finding admin user...');
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      status: admin.status
    });

    // Check status
    console.log('\n2. Checking status...');
    if (admin.status !== 'active') {
      console.log('❌ Admin is not active:', admin.status);
      return;
    }
    console.log('✅ Admin is active');

    // Verify password
    console.log('\n3. Verifying password...');
    console.log('   Password hash in DB:', admin.password);
    console.log('   Password to check:', password);

    const passwordValid = await bcrypt.compare(password, admin.password);
    console.log('   bcrypt.compare result:', passwordValid);

    if (!passwordValid) {
      console.log('❌ Password is invalid');

      // Try hashing the password and comparing
      console.log('\n4. Testing password hash generation...');
      const newHash = await bcrypt.hash(password, 10);
      console.log('   New hash generated:', newHash);
      const testCompare = await bcrypt.compare(password, newHash);
      console.log('   Test compare with new hash:', testCompare);

      return;
    }

    console.log('✅ Password is valid');
    console.log('\n🎉 Login would succeed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
