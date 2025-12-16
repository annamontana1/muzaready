async function testLogin() {
  const url = 'https://muzaready-bahy.vercel.app/api/admin/login';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@muzahair.cz',
        password: 'admin123'
      }),
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('Response:', text.substring(0, 500));

    if (response.ok) {
      console.log('\n✅ LOGIN WORKS!');
    } else {
      console.log('\n❌ LOGIN FAILED');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
