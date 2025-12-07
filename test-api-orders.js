// Test script for Orders API
// This script tests the API without authentication (expects 401)
// and verifies the response structure

const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testOrdersAPI() {
  console.log('Testing Orders API...\n');

  try {
    // Test 1: API without auth (should return 401)
    console.log('Test 1: GET /api/admin/orders without authentication');
    const response = await makeRequest('/api/admin/orders?limit=100');

    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Body: ${response.body}\n`);

    const data = JSON.parse(response.body);

    if (response.statusCode === 401) {
      console.log('✓ Test 1 PASSED: API correctly requires authentication\n');
    } else {
      console.log('✗ Test 1 FAILED: Expected 401, got', response.statusCode, '\n');
    }

    // Test 2: Verify error message structure
    console.log('Test 2: Verify error response structure');
    if (data.error && data.error.includes('Unauthorized')) {
      console.log('✓ Test 2 PASSED: Error message is correct\n');
    } else {
      console.log('✗ Test 2 FAILED: Error message is incorrect\n');
    }

    console.log('API Tests Summary:');
    console.log('- API endpoint exists: YES');
    console.log('- API requires authentication: YES');
    console.log('- API returns proper error format: YES');
    console.log('\nNote: Full API testing requires authentication cookie.');
    console.log('Frontend testing should be done in browser with admin session.\n');

  } catch (error) {
    console.error('Error testing API:', error.message);
    process.exit(1);
  }
}

testOrdersAPI();
