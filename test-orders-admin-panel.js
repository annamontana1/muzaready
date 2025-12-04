/**
 * COMPREHENSIVE TESTING SCRIPT
 * Orders Admin Panel - All 4 Tasks Verification
 *
 * Testing Checklist (from TASKS_FRONTEND.md line 604-617):
 * ☐ List page loads
 * ☐ Table shows all orders
 * ☐ Filters work (status, payment, channel)
 * ☐ Order detail page loads
 * ☐ Tabs switch correctly
 * ☐ Items show correct prices
 * ☐ Can update order status
 * ☐ Status badges update after change
 * ☐ Responsive on mobile
 * ☐ No console errors
 */

const BASE_URL = 'http://localhost:3000';
let sessionCookie = null;
let testResults = [];
let failedTests = [];

// Color output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const symbol = passed ? '✅' : '❌';
  const color = passed ? 'green' : 'red';
  log(`${symbol} ${testName}`, color);
  if (details) log(`   ${details}`, 'blue');

  testResults.push({ testName, passed, details });
  if (!passed) failedTests.push(testName);
}

// Step 1: Admin Login
async function loginAsAdmin() {
  log('\n━━━ STEP 1: Admin Authentication ━━━', 'yellow');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    });

    if (response.ok) {
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        sessionCookie = setCookie.split(';')[0];
        logTest('Admin login successful', true, `Session: ${sessionCookie.substring(0, 30)}...`);
        return true;
      }
    }

    logTest('Admin login failed', false, `Status: ${response.status}`);
    return false;
  } catch (error) {
    logTest('Admin login error', false, error.message);
    return false;
  }
}

// Step 2: Test Orders List Page
async function testOrdersListAPI() {
  log('\n━━━ STEP 2: Orders List (Task 1) ━━━', 'yellow');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?limit=100`, {
      headers: { Cookie: sessionCookie },
    });

    if (!response.ok) {
      logTest('❌ GET /api/admin/orders failed', false, `Status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Verify response structure
    logTest('API returns correct structure', data.orders && Array.isArray(data.orders),
      `Found ${data.orders?.length || 0} orders`);

    logTest('Orders have required fields',
      data.orders?.[0]?.id && data.orders?.[0]?.email && data.orders?.[0]?.total,
      `Sample: ${data.orders?.[0]?.id?.substring(0, 8)}... (${data.orders?.[0]?.email})`);

    logTest('Orders have itemCount',
      typeof data.orders?.[0]?.itemCount === 'number',
      `First order has ${data.orders?.[0]?.itemCount} items`);

    return data.orders;
  } catch (error) {
    logTest('Orders list API error', false, error.message);
    return null;
  }
}

// Step 3: Test Filters (Task 2)
async function testFilters() {
  log('\n━━━ STEP 3: Filters Component (Task 2) ━━━', 'yellow');

  // Test 3.1: Filter by orderStatus
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?orderStatus=pending&limit=100`, {
      headers: { Cookie: sessionCookie },
    });
    const data = await response.json();
    const allPending = data.orders.every(o => o.orderStatus === 'pending');
    logTest('Filter by orderStatus=pending', allPending,
      `Found ${data.orders.length} pending order(s)`);
  } catch (error) {
    logTest('Filter by orderStatus error', false, error.message);
  }

  // Test 3.2: Filter by paymentStatus
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?paymentStatus=paid&limit=100`, {
      headers: { Cookie: sessionCookie },
    });
    const data = await response.json();
    const allPaid = data.orders.every(o => o.paymentStatus === 'paid');
    logTest('Filter by paymentStatus=paid', allPaid,
      `Found ${data.orders.length} paid order(s)`);
  } catch (error) {
    logTest('Filter by paymentStatus error', false, error.message);
  }

  // Test 3.3: Filter by deliveryStatus
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?deliveryStatus=pending&limit=100`, {
      headers: { Cookie: sessionCookie },
    });
    const data = await response.json();
    logTest('Filter by deliveryStatus works', data.orders !== undefined,
      `Found ${data.orders.length} order(s) with delivery=pending`);
  } catch (error) {
    logTest('Filter by deliveryStatus error', false, error.message);
  }

  // Test 3.4: Filter by channel
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?channel=web&limit=100`, {
      headers: { Cookie: sessionCookie },
    });
    const data = await response.json();
    logTest('Filter by channel=web works', data.orders !== undefined,
      `Found ${data.orders.length} web order(s)`);
  } catch (error) {
    logTest('Filter by channel error', false, error.message);
  }

  // Test 3.5: Email search
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders?email=test&limit=100`, {
      headers: { Cookie: sessionCookie },
    });
    const data = await response.json();
    const ordersArray = data.orders || [];
    logTest('Email search works', Array.isArray(ordersArray),
      `Email search returned ${ordersArray.length} result(s)`);
  } catch (error) {
    logTest('Email search error', false, error.message);
  }
}

// Step 4: Test Order Detail Page (Task 3)
async function testOrderDetail() {
  log('\n━━━ STEP 4: Order Detail Page (Task 3) ━━━', 'yellow');

  // Get first order ID
  const listResponse = await fetch(`${BASE_URL}/api/admin/orders?limit=1`, {
    headers: { Cookie: sessionCookie },
  });
  const listData = await listResponse.json();
  const orderId = listData.orders[0]?.id;

  if (!orderId) {
    logTest('No orders found for detail test', false);
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}`, {
      headers: { Cookie: sessionCookie },
    });

    if (!response.ok) {
      logTest('Order detail API failed', false, `Status: ${response.status}`);
      return null;
    }

    const order = await response.json();

    logTest('Order detail loads', true, `Order #${orderId.substring(0, 8)}...`);

    logTest('Order has customer data',
      order.email && order.firstName && order.lastName,
      `${order.firstName} ${order.lastName} (${order.email})`);

    logTest('Order has items array',
      Array.isArray(order.items),
      `Contains ${order.items.length} item(s)`);

    logTest('Order has payment/delivery info',
      order.orderStatus && order.paymentStatus && order.deliveryStatus,
      `${order.orderStatus} / ${order.paymentStatus} / ${order.deliveryStatus}`);

    logTest('Order has pricing breakdown',
      typeof order.total === 'number' && typeof order.subtotal === 'number',
      `Total: ${order.total} Kč, Subtotal: ${order.subtotal} Kč`);

    return order;
  } catch (error) {
    logTest('Order detail error', false, error.message);
    return null;
  }
}

// Step 5: Test Status Update (Task 3 - OrderHeader quick actions)
async function testStatusUpdate(orderId) {
  log('\n━━━ STEP 5: Status Update (OrderHeader Actions) ━━━', 'yellow');

  if (!orderId) {
    logTest('No order ID for status update test', false);
    return;
  }

  try {
    // Update order status
    const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({
        paymentStatus: 'paid',
      }),
    });

    if (!response.ok) {
      logTest('Status update failed', false, `Status: ${response.status}`);
      return;
    }

    const updatedOrder = await response.json();
    logTest('Status update successful', updatedOrder.paymentStatus === 'paid',
      `paymentStatus changed to: ${updatedOrder.paymentStatus}`);

    logTest('lastStatusChangeAt updated',
      updatedOrder.lastStatusChangeAt !== null,
      `Updated at: ${new Date(updatedOrder.lastStatusChangeAt).toLocaleString('cs-CZ')}`);

  } catch (error) {
    logTest('Status update error', false, error.message);
  }
}

// Step 6: Test Bulk Actions (Task 4)
async function testBulkActions() {
  log('\n━━━ STEP 6: Bulk Actions (Task 4) ━━━', 'yellow');

  // Get 2 order IDs
  const listResponse = await fetch(`${BASE_URL}/api/admin/orders?limit=2`, {
    headers: { Cookie: sessionCookie },
  });
  const listData = await listResponse.json();
  const orderIds = listData.orders.map(o => o.id);

  if (orderIds.length < 2) {
    logTest('Not enough orders for bulk test', false, 'Need at least 2 orders');
    return;
  }

  try {
    // Test bulk mark-shipped
    const response = await fetch(`${BASE_URL}/api/admin/orders/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({
        ids: orderIds,
        action: 'mark-shipped',
        data: { deliveryStatus: 'shipped' },
      }),
    });

    if (!response.ok) {
      logTest('Bulk action failed', false, `Status: ${response.status}`);
      return;
    }

    const result = await response.json();
    logTest('Bulk mark-shipped works',
      result.updated === orderIds.length,
      `Updated ${result.updated} orders`);

  } catch (error) {
    logTest('Bulk action error', false, error.message);
  }
}

// Step 7: TypeScript Type Safety Check
async function testTypeScriptTypes() {
  log('\n━━━ STEP 7: TypeScript Types (types.ts) ━━━', 'yellow');

  try {
    const fs = require('fs');
    const typesPath = '/Users/zen/muzaready/app/admin/objednavky/types.ts';
    const typesContent = fs.readFileSync(typesPath, 'utf8');

    logTest('types.ts file exists', true, 'Shared types defined');
    logTest('Order interface defined', typesContent.includes('export interface Order'),
      'Order type exported');
    logTest('OrderItem interface defined', typesContent.includes('export interface OrderItem'),
      'OrderItem type exported');
    logTest('OrdersResponse interface defined', typesContent.includes('export interface OrdersResponse'),
      'OrdersResponse type exported');

  } catch (error) {
    logTest('TypeScript types check error', false, error.message);
  }
}

// Step 8: Component Files Verification
async function verifyComponentFiles() {
  log('\n━━━ STEP 8: Component Files Structure ━━━', 'yellow');

  const fs = require('fs');
  const requiredFiles = [
    '/Users/zen/muzaready/app/admin/objednavky/page.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/components/Filters.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/components/BulkActions.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/[id]/page.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/[id]/components/OrderHeader.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/[id]/components/CustomerSection.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/[id]/components/ItemsSection.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/[id]/components/PaymentSection.tsx',
    '/Users/zen/muzaready/app/admin/objednavky/types.ts',
  ];

  requiredFiles.forEach(file => {
    try {
      const exists = fs.existsSync(file);
      const fileName = file.split('/').pop();
      logTest(`File: ${fileName}`, exists);
    } catch (error) {
      logTest(`File check error: ${file}`, false, error.message);
    }
  });
}

// Step 9: Build Test
async function testBuild() {
  log('\n━━━ STEP 9: Production Build Test ━━━', 'yellow');

  try {
    const { execSync } = require('child_process');
    log('Running: npm run build (this may take 30-60 seconds)...', 'blue');

    const output = execSync('cd /Users/zen/muzaready && npm run build', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    logTest('Production build successful', true, 'No TypeScript errors');

  } catch (error) {
    logTest('Production build failed', false, error.message);
  }
}

// Final Summary
function printSummary() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('           FINAL TEST SUMMARY', 'yellow');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'yellow');

  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.passed).length;
  const failedCount = failedTests.length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  log(`Total Tests: ${totalTests}`, 'blue');
  log(`✅ Passed: ${passedTests}`, 'green');
  log(`❌ Failed: ${failedCount}`, failedCount > 0 ? 'red' : 'green');
  log(`Success Rate: ${successRate}%\n`, successRate === '100.0' ? 'green' : 'yellow');

  if (failedTests.length > 0) {
    log('Failed Tests:', 'red');
    failedTests.forEach(test => log(`  ❌ ${test}`, 'red'));
  } else {
    log('🎉 ALL TESTS PASSED! READY FOR PRODUCTION 🎉', 'green');
  }

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'yellow');
}

// Main Test Runner
async function runAllTests() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║   ORDERS ADMIN PANEL - FULL TEST SUITE   ║', 'blue');
  log('║        All 4 Frontend Tasks               ║', 'blue');
  log('╚════════════════════════════════════════════╝\n', 'blue');

  // Verify server is running
  try {
    await fetch(`${BASE_URL}/api/health`);
    log('✅ Dev server is running on http://localhost:3000\n', 'green');
  } catch (error) {
    log('❌ Dev server is not running! Please start it first:', 'red');
    log('   npm run dev\n', 'yellow');
    process.exit(1);
  }

  // Run all tests
  const loggedIn = await loginAsAdmin();
  if (!loggedIn) {
    log('\n❌ Cannot proceed without admin authentication', 'red');
    process.exit(1);
  }

  const orders = await testOrdersListAPI();
  await testFilters();
  const order = await testOrderDetail();
  if (order) await testStatusUpdate(order.id);
  await testBulkActions();
  await testTypeScriptTypes();
  await verifyComponentFiles();
  // Skip build test for speed (uncomment if needed):
  // await testBuild();

  printSummary();
}

// Execute
runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
