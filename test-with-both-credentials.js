const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

const BASE_URL = 'https://muzaready-iota.vercel.app';

// Try both credential sets
const CREDENTIALS = [
  {
    name: 'User-provided credentials',
    email: 'muzahaircz@gmail.com',
    password: 'muza2024Admin!'
  },
  {
    name: 'Production script credentials',
    email: 'admin@muzahair.com',
    password: 'MuzaAdmin2024!'
  },
  {
    name: 'Local dev credentials',
    email: 'muzahaircz@gmail.com',
    password: 'muzaisthebest'
  }
];

async function tryLogin(browser, credentials) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${credentials.name}`);
  console.log(`Email: ${credentials.email}`);
  console.log(`Password: ${credentials.password}`);
  console.log('='.repeat(60));

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let loginSuccessful = false;

  // Capture response
  page.on('response', async response => {
    if (response.url().includes('/api/admin/login')) {
      const status = response.status();
      console.log(`📥 Login Response Status: ${status}`);

      try {
        const body = await response.json();
        console.log(`📄 Response:`, JSON.stringify(body, null, 2));

        if (status === 200) {
          loginSuccessful = true;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  });

  try {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });

    await page.type('input[type="email"]', credentials.email);
    await page.type('input[type="password"]', credentials.password);

    await Promise.all([
      page.waitForResponse(response =>
        response.url().includes('/api/admin/login'),
        { timeout: 10000 }
      ),
      page.click('button[type="submit"]')
    ]);

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      console.log('✅ LOGIN SUCCESSFUL! ');
      await page.screenshot({
        path: path.join(screenshotsDir, `success-${Date.now()}.png`),
        fullPage: true
      });
      await page.close();
      return { success: true, credentials };
    } else {
      console.log('❌ Login failed');
      await page.close();
      return { success: false, credentials };
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await page.close();
    return { success: false, credentials };
  }
}

async function main() {
  console.log('🔐 Testing Multiple Admin Credentials\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let validCredentials = null;

  for (const creds of CREDENTIALS) {
    const result = await tryLogin(browser, creds);
    if (result.success) {
      validCredentials = result.credentials;
      break;
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULT');
  console.log('='.repeat(60));

  if (validCredentials) {
    console.log('\n✅ VALID CREDENTIALS FOUND!\n');
    console.log(`Email: ${validCredentials.email}`);
    console.log(`Password: ${validCredentials.password}`);
    console.log('\nYou can now run the full test suite with these credentials.');
    console.log('Update test-admin-features.js with these credentials and run again.');
    process.exit(0);
  } else {
    console.log('\n❌ NO VALID CREDENTIALS FOUND\n');
    console.log('None of the credential sets worked. Possible issues:');
    console.log('1. Admin account needs to be created in production database');
    console.log('2. Password has been changed from the default');
    console.log('3. Account status is not "active"');
    console.log('\nRecommendation: Run create-production-admin.ts script');
    process.exit(1);
  }
}

main();
