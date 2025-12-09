const puppeteer = require('puppeteer');
const https = require('https');

async function testProduction() {
  console.log('='.repeat(80));
  console.log('PRODUCTION DEPLOYMENT TEST');
  console.log('='.repeat(80));
  console.log('');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    homepage: { status: 'PENDING', details: [] },
    adminLogin: { status: 'PENDING', details: [] },
    apiHealth: { status: 'PENDING', details: [] },
    apiPing: { status: 'PENDING', details: [] }
  };

  try {
    // TEST 1: Homepage
    console.log('TEST 1: Homepage');
    console.log('-'.repeat(80));

    const page = await browser.newPage();
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push({ type: msg.type(), text });
      console.log(`[Console ${msg.type()}] ${text}`);
    });

    page.on('pageerror', error => {
      errors.push(error.toString());
      console.log(`[Page Error] ${error}`);
    });

    try {
      const response = await page.goto('https://muzaready-iota.vercel.app', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      results.homepage.details.push(`HTTP Status: ${response.status()}`);
      console.log(`HTTP Status: ${response.status()}`);

      // Check for "Application error" text
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasApplicationError = bodyText.includes('Application error');

      results.homepage.details.push(`Has "Application error": ${hasApplicationError}`);
      console.log(`Has "Application error": ${hasApplicationError}`);

      // Take screenshot
      await page.screenshot({ path: '/Users/zen/muzaready/test-homepage.png', fullPage: true });
      results.homepage.details.push('Screenshot saved: test-homepage.png');
      console.log('Screenshot saved: test-homepage.png');

      // Check console errors
      const errorMessages = consoleMessages.filter(m => m.type === 'error');
      results.homepage.details.push(`Console errors: ${errorMessages.length}`);
      console.log(`Console errors: ${errorMessages.length}`);

      if (errorMessages.length > 0) {
        errorMessages.forEach(err => {
          results.homepage.details.push(`  - ${err.text}`);
          console.log(`  - ${err.text}`);
        });
      }

      // Determine pass/fail
      if (response.status() === 200 && !hasApplicationError && errors.length === 0) {
        results.homepage.status = 'PASS';
        console.log('✅ PASS: Homepage loaded successfully');
      } else {
        results.homepage.status = 'FAIL';
        console.log('❌ FAIL: Homepage has issues');
      }

    } catch (error) {
      results.homepage.status = 'FAIL';
      results.homepage.details.push(`Error: ${error.message}`);
      console.log(`❌ FAIL: ${error.message}`);
    }

    console.log('');

    // TEST 2: Admin Login Page
    console.log('TEST 2: Admin Login Page');
    console.log('-'.repeat(80));

    const adminPage = await browser.newPage();
    const adminConsoleMessages = [];
    const adminErrors = [];

    adminPage.on('console', msg => {
      const text = msg.text();
      adminConsoleMessages.push({ type: msg.type(), text });
      console.log(`[Console ${msg.type()}] ${text}`);
    });

    adminPage.on('pageerror', error => {
      adminErrors.push(error.toString());
      console.log(`[Page Error] ${error}`);
    });

    try {
      const response = await adminPage.goto('https://muzaready-iota.vercel.app/admin/login', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      results.adminLogin.details.push(`HTTP Status: ${response.status()}`);
      console.log(`HTTP Status: ${response.status()}`);

      // Check for "Application error" text
      const bodyText = await adminPage.evaluate(() => document.body.innerText);
      const hasApplicationError = bodyText.includes('Application error');

      results.adminLogin.details.push(`Has "Application error": ${hasApplicationError}`);
      console.log(`Has "Application error": ${hasApplicationError}`);

      // Check for login form
      const hasLoginForm = await adminPage.evaluate(() => {
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        return emailInput !== null && passwordInput !== null;
      });

      results.adminLogin.details.push(`Login form visible: ${hasLoginForm}`);
      console.log(`Login form visible: ${hasLoginForm}`);

      // Take screenshot
      await adminPage.screenshot({ path: '/Users/zen/muzaready/test-admin-login.png', fullPage: true });
      results.adminLogin.details.push('Screenshot saved: test-admin-login.png');
      console.log('Screenshot saved: test-admin-login.png');

      // Check console errors
      const errorMessages = adminConsoleMessages.filter(m => m.type === 'error');
      results.adminLogin.details.push(`Console errors: ${errorMessages.length}`);
      console.log(`Console errors: ${errorMessages.length}`);

      if (errorMessages.length > 0) {
        errorMessages.forEach(err => {
          results.adminLogin.details.push(`  - ${err.text}`);
          console.log(`  - ${err.text}`);
        });
      }

      // Determine pass/fail
      if (response.status() === 200 && !hasApplicationError && hasLoginForm) {
        results.adminLogin.status = 'PASS';
        console.log('✅ PASS: Admin login page loaded successfully');
      } else {
        results.adminLogin.status = 'FAIL';
        console.log('❌ FAIL: Admin login page has issues');
      }

    } catch (error) {
      results.adminLogin.status = 'FAIL';
      results.adminLogin.details.push(`Error: ${error.message}`);
      console.log(`❌ FAIL: ${error.message}`);
    }

    await adminPage.close();
    console.log('');

    // TEST 3: API Health Check
    console.log('TEST 3: API Health Check');
    console.log('-'.repeat(80));

    try {
      const response = await fetch('https://muzaready-iota.vercel.app/api/health');
      const status = response.status;

      results.apiHealth.details.push(`HTTP Status: ${status}`);
      console.log(`HTTP Status: ${status}`);

      try {
        const data = await response.text();
        results.apiHealth.details.push(`Response: ${data}`);
        console.log(`Response: ${data}`);

        if (status === 200) {
          results.apiHealth.status = 'PASS';
          console.log('✅ PASS: API health check successful');
        } else {
          results.apiHealth.status = 'FAIL';
          console.log('❌ FAIL: API health check failed');
        }
      } catch (parseError) {
        results.apiHealth.details.push(`Parse error: ${parseError.message}`);
        console.log(`Parse error: ${parseError.message}`);
        results.apiHealth.status = 'FAIL';
        console.log('❌ FAIL: Could not parse response');
      }

    } catch (error) {
      results.apiHealth.status = 'FAIL';
      results.apiHealth.details.push(`Error: ${error.message}`);
      console.log(`❌ FAIL: ${error.message}`);
    }

    console.log('');

    // TEST 4: API Ping (Database Connection)
    console.log('TEST 4: API Ping (Database Connection)');
    console.log('-'.repeat(80));

    try {
      const response = await fetch('https://muzaready-iota.vercel.app/api/ping');
      const status = response.status;

      results.apiPing.details.push(`HTTP Status: ${status}`);
      console.log(`HTTP Status: ${status}`);

      try {
        const data = await response.text();
        results.apiPing.details.push(`Response: ${data}`);
        console.log(`Response: ${data}`);

        // Check if response indicates database connection
        const isDatabaseConnected = data.includes('pong') || data.includes('success') || data.includes('ok');
        results.apiPing.details.push(`Database connected: ${isDatabaseConnected}`);
        console.log(`Database connected: ${isDatabaseConnected}`);

        if (status === 200 && isDatabaseConnected) {
          results.apiPing.status = 'PASS';
          console.log('✅ PASS: Database connection working');
        } else {
          results.apiPing.status = 'FAIL';
          console.log('❌ FAIL: Database connection failed');
        }
      } catch (parseError) {
        results.apiPing.details.push(`Parse error: ${parseError.message}`);
        console.log(`Parse error: ${parseError.message}`);
        results.apiPing.status = 'FAIL';
        console.log('❌ FAIL: Could not parse response');
      }

    } catch (error) {
      results.apiPing.status = 'FAIL';
      results.apiPing.details.push(`Error: ${error.message}`);
      console.log(`❌ FAIL: ${error.message}`);
    }

    console.log('');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }

  // Print final summary
  console.log('='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log('');

  Object.entries(results).forEach(([test, result]) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏸️';
    console.log(`${icon} ${test}: ${result.status}`);
    result.details.forEach(detail => {
      console.log(`   ${detail}`);
    });
    console.log('');
  });

  const allPassed = Object.values(results).every(r => r.status === 'PASS');

  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Deployment is working correctly!');
  } else {
    console.log('⚠️  SOME TESTS FAILED - Review the details above');
  }

  console.log('');
  console.log('='.repeat(80));
}

testProduction().catch(console.error);
