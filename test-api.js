const http = require('http');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function makeRequest(method, path, body, sessionCookie) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (sessionCookie) {
      options.headers['Cookie'] = sessionCookie;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  try {
    // 1. Create admin user
    console.log('\n=== Creating Admin User ===');
    const hashedPassword = await bcrypt.hash('test123', 10);
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin@test.com' },
      update: { status: 'active' },
      create: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Test Admin',
        role: 'admin',
        status: 'active',
      },
    });
    console.log('Admin created:', admin.email);

    // 2. Create session cookie
    const sessionData = JSON.stringify({ email: admin.email, token: 'test-token' });
    const sessionCookie = 'admin-session=' + Buffer.from(sessionData).toString('base64');
    console.log('Session cookie created');

    // 3. Test GET /api/admin/orders (without auth)
    console.log('\n=== Test 1: GET /api/admin/orders (no auth) ===');
    let res = await makeRequest('GET', '/api/admin/orders');
    console.log('Status:', res.status);
    console.log('Response:', res.body);

    // 4. Test GET /api/admin/orders (with auth)
    console.log('\n=== Test 2: GET /api/admin/orders (with auth) ===');
    res = await makeRequest('GET', '/api/admin/orders', null, sessionCookie);
    console.log('Status:', res.status);
    console.log('Orders found:', res.body.orders ? res.body.orders.length : 'N/A');

    // 5. Create a test order for other tests
    console.log('\n=== Creating Test Order ===');
    const order = await prisma.order.create({
      data: {
        email: 'customer@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country',
        total: 5000,
        subtotal: 4500,
        shippingCost: 500,
        discountAmount: 0,
        orderStatus: 'draft',
        paymentStatus: 'unpaid',
        deliveryStatus: 'pending',
        paymentMethod: 'stripe',
        deliveryMethod: 'standard',
      },
    });
    console.log('Order created with ID:', order.id);

    // 6. Test GET /api/admin/orders/[id]
    console.log(`\n=== Test 3: GET /api/admin/orders/${order.id} ===`);
    res = await makeRequest('GET', `/api/admin/orders/${order.id}`, null, sessionCookie);
    console.log('Status:', res.status);
    if (res.body.email) console.log('✓ Order fetched successfully');
    else console.log('✗ Failed to fetch order');

    // 7. Test PUT /api/admin/orders/[id]
    console.log(`\n=== Test 4: PUT /api/admin/orders/${order.id} (update status) ===`);
    res = await makeRequest('PUT', `/api/admin/orders/${order.id}`, {
      orderStatus: 'pending',
      paymentStatus: 'paid',
      notesInternal: 'Test note',
    }, sessionCookie);
    console.log('Status:', res.status);
    if (res.body.orderStatus === 'pending' && res.body.paymentStatus === 'paid') {
      console.log('✓ Order updated successfully');
    } else {
      console.log('✗ Order update failed');
    }

    // 8. Test POST /api/admin/orders/[id]/capture-payment
    console.log(`\n=== Test 5: POST /api/admin/orders/${order.id}/capture-payment ===`);
    res = await makeRequest('POST', `/api/admin/orders/${order.id}/capture-payment`, {
      amount: 5000,
    }, sessionCookie);
    console.log('Status:', res.status);
    if (res.status === 200) {
      console.log('✓ Payment captured successfully');
    } else {
      console.log('✗ Payment capture failed');
    }

    // 9. Test POST /api/admin/orders/[id]/shipments
    console.log(`\n=== Test 6: POST /api/admin/orders/${order.id}/shipments ===`);
    res = await makeRequest('POST', `/api/admin/orders/${order.id}/shipments`, {
      carrier: 'dpd',
      trackingNumber: 'DPD123456789',
    }, sessionCookie);
    console.log('Status:', res.status);
    if (res.status === 201) {
      console.log('✓ Shipment created successfully');
      console.log('Message:', res.body.message);
    } else {
      console.log('✗ Shipment creation failed');
    }

    // 10. Test POST /api/admin/orders/bulk
    console.log(`\n=== Test 7: POST /api/admin/orders/bulk (mark-paid) ===`);
    res = await makeRequest('POST', `/api/admin/orders/bulk`, {
      ids: [order.id],
      action: 'mark-paid',
    }, sessionCookie);
    console.log('Status:', res.status);
    if (res.status === 200 && res.body.updated === 1) {
      console.log('✓ Bulk update successful');
    } else {
      console.log('✗ Bulk update failed');
    }

    console.log('\n=== All Tests Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

runTests();
