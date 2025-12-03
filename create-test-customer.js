const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestCustomer() {
  try {
    console.log('Creating test customer user...');

    // Check if already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existing) {
      console.log('✅ Customer already exists:', existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash('testpassword123', 10);

    const customer = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'Customer',
        password: hashedPassword,
        phone: '123456789',
        streetAddress: 'Test Street 123',
        city: 'Prague',
        zipCode: '11000',
        country: 'Czech Republic'
      }
    });

    console.log('✅ Test customer created successfully!');
    console.log('Email:', customer.email);
    console.log('Name:', customer.firstName, customer.lastName);
    console.log('ID:', customer.id);
    console.log('\nLogin credentials:');
    console.log('Email: test@example.com');
    console.log('Password: testpassword123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestCustomer();
