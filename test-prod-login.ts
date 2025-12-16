/**
 * Test production login
 */

async function testLogin() {
  console.log('🧪 Testing production login...\n');

  const url = 'https://muzaready-iota.vercel.app/api/admin/login';
  const credentials = {
    email: 'admin@muzahair.cz',
    password: 'admin123'
  };

  console.log(`URL: ${url}`);
  console.log(`Email: ${credentials.email}`);
  console.log(`Password: ${credentials.password}\n`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log(`HTTP Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('\nResponse body:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
    } else {
      console.log('\n❌ LOGIN FAILED');
      console.log('Error:', data.error || 'Unknown error');
    }

  } catch (error) {
    console.error('\n💥 Request failed:', error);
  }
}

testLogin();
