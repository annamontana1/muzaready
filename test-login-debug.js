const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function testLogin() {
  console.log('🔍 Testing Admin Login - Debug Mode\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Capture all requests
  page.on('request', request => {
    if (request.url().includes('/api/admin/login')) {
      console.log('📤 LOGIN REQUEST:', {
        url: request.url(),
        method: request.method(),
        postData: request.postData()
      });
    }
  });

  // Capture all responses
  page.on('response', async response => {
    if (response.url().includes('/api/admin/login')) {
      console.log('📥 LOGIN RESPONSE:', {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });

      try {
        const responseBody = await response.json();
        console.log('📄 Response body:', JSON.stringify(responseBody, null, 2));
      } catch (e) {
        console.log('❌ Could not parse response as JSON');
      }
    }
  });

  try {
    console.log('🌐 Navigating to login page...');
    await page.goto('https://muzaready-iota.vercel.app/admin/login', {
      waitUntil: 'networkidle2'
    });

    await page.screenshot({
      path: path.join(screenshotsDir, 'debug-01-login-page.png'),
      fullPage: true
    });

    console.log('✅ Login page loaded');

    // Check what's on the page
    const pageText = await page.evaluate(() => document.body.textContent);
    console.log('\n📄 Page contains:', pageText.substring(0, 200) + '...');

    // Try login with provided credentials
    console.log('\n🔐 Attempting login...');
    console.log('   Email: muzahaircz@gmail.com');
    console.log('   Password: muza2024Admin!');

    await page.type('input[type="email"]', 'muzahaircz@gmail.com');
    await page.type('input[type="password"]', 'muza2024Admin!');

    await page.screenshot({
      path: path.join(screenshotsDir, 'debug-02-form-filled.png'),
      fullPage: true
    });

    // Click login button and wait
    await Promise.all([
      page.waitForResponse(response =>
        response.url().includes('/api/admin/login'),
        { timeout: 10000 }
      ),
      page.click('button[type="submit"]')
    ]);

    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(screenshotsDir, 'debug-03-after-login.png'),
      fullPage: true
    });

    // Check for error messages
    const errorMessage = await page.evaluate(() => {
      const errorDiv = document.querySelector('[class*="error"], [class*="alert"]');
      return errorDiv ? errorDiv.textContent : null;
    });

    if (errorMessage) {
      console.log('\n❌ Error message on page:', errorMessage);
    }

    // Check current URL
    const currentUrl = page.url();
    console.log('\n📍 Current URL:', currentUrl);

    if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      return true;
    } else {
      console.log('\n❌ LOGIN FAILED - Still on login page or error');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    await page.screenshot({
      path: path.join(screenshotsDir, 'debug-error.png'),
      fullPage: true
    });
    return false;
  } finally {
    await browser.close();
  }
}

testLogin().then(success => {
  process.exit(success ? 0 : 1);
});
