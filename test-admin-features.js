const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Test configuration
const BASE_URL = 'https://muzaready-iota.vercel.app';
const ADMIN_EMAIL = 'muzahaircz@gmail.com';
const ADMIN_PASSWORD = 'muza2024Admin!';

// Test results storage
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  consoleErrors: [],
  networkErrors: []
};

// Helper function to take screenshot
async function takeScreenshot(page, name) {
  const filename = `${Date.now()}-${name}.png`;
  const filepath = path.join(screenshotsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

// Helper function to wait and check for element
async function checkElement(page, selector, description) {
  try {
    await page.waitForSelector(selector, { timeout: 10000 });
    console.log(`✅ Found: ${description}`);
    return true;
  } catch (error) {
    console.log(`❌ Not found: ${description}`);
    return false;
  }
}

// Helper function to get text content
async function getText(page, selector) {
  try {
    const element = await page.$(selector);
    if (element) {
      return await page.evaluate(el => el.textContent, element);
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Admin Features Test Suite\n');
  console.log('=' .repeat(60));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`🔴 Console Error: ${text}`);
      testResults.consoleErrors.push(text);
    }
  });

  // Capture network errors
  page.on('response', response => {
    if (response.status() >= 400) {
      const error = `${response.status()} - ${response.url()}`;
      console.log(`🌐 Network Error: ${error}`);
      testResults.networkErrors.push(error);
    }
  });

  try {
    // TEST 1: Login to Admin Panel
    console.log('\n📋 TEST 1: Admin Login');
    console.log('-'.repeat(60));

    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01-login-page');

    // Fill login form
    const emailInput = await checkElement(page, 'input[type="email"], input[name="email"]', 'Email input field');
    const passwordInput = await checkElement(page, 'input[type="password"], input[name="password"]', 'Password input field');

    if (emailInput && passwordInput) {
      await page.type('input[type="email"], input[name="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"], input[name="password"]', ADMIN_PASSWORD);

      await takeScreenshot(page, '02-login-filled');

      // Click login button
      const loginButtonSelectors = [
        'button[type="submit"]',
        'button:has-text("Přihlásit se")',
        'button:has-text("Login")',
        'button[class*="submit"]'
      ];

      let loginClicked = false;
      for (const selector of loginButtonSelectors) {
        try {
          await page.click(selector);
          loginClicked = true;
          console.log(`✅ Clicked login button: ${selector}`);
          break;
        } catch (e) {
          // Try next selector
        }
      }

      if (!loginClicked) {
        // Try finding button by text content
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginBtn = buttons.find(btn =>
            btn.textContent.includes('Přihlásit') ||
            btn.textContent.includes('Login')
          );
          if (loginBtn) loginBtn.click();
        });
      }

      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      await takeScreenshot(page, '03-after-login');

      if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
        testResults.passed.push('✅ TEST 1 PASSED: Admin login successful');
        console.log('✅ Login successful - redirected to admin dashboard');
      } else {
        testResults.failed.push('❌ TEST 1 FAILED: Login did not redirect to admin dashboard');
        console.log('❌ Login failed or incorrect redirect');
      }
    } else {
      testResults.failed.push('❌ TEST 1 FAILED: Login form elements not found');
    }

    // TEST 2: Orders Page
    console.log('\n📋 TEST 2: Orders Page');
    console.log('-'.repeat(60));

    await page.goto(`${BASE_URL}/admin/objednavky`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000); // Wait for content to load
    await takeScreenshot(page, '04-orders-page');

    // Check for application error
    const pageContent = await page.content();
    const hasApplicationError = pageContent.toLowerCase().includes('application error');

    if (hasApplicationError) {
      testResults.failed.push('❌ TEST 2 FAILED: Orders page shows "Application error"');
      console.log('❌ Application error detected on orders page');
    } else {
      console.log('✅ No application error detected');

      // Check for orders list elements
      const hasOrdersList = await checkElement(page, 'table, [class*="order"], [class*="list"]', 'Orders list');

      if (hasOrdersList) {
        testResults.passed.push('✅ TEST 2 PASSED: Orders page loads without errors');
        console.log('✅ Orders page loaded successfully');
      } else {
        testResults.warnings.push('⚠️ TEST 2 WARNING: Orders page loaded but list not found');
        console.log('⚠️ Orders page loaded but list structure unclear');
      }
    }

    // TEST 3: Order Details Page
    console.log('\n📋 TEST 3: Order Details Page');
    console.log('-'.repeat(60));

    // Try to navigate to specific order or click first order
    let orderDetailsUrl = `${BASE_URL}/admin/objednavky/test-order-1765216851.558210`;

    try {
      await page.goto(orderDetailsUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
      console.log('⚠️ Test order not found, trying to click first order in list');
      await page.goto(`${BASE_URL}/admin/objednavky`, { waitUntil: 'networkidle2' });

      // Try to click first order
      const firstOrderSelectors = [
        'table tr[data-order] a',
        'table tbody tr:first-child a',
        '[class*="order-row"]:first-child a',
        'a[href*="/admin/objednavky/"]'
      ];

      for (const selector of firstOrderSelectors) {
        try {
          await page.click(selector);
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
          break;
        } catch (e) {
          // Try next selector
        }
      }
    }

    await page.waitForTimeout(2000);
    await takeScreenshot(page, '05-order-details');

    const orderPageContent = await page.content();
    const hasOrderError = orderPageContent.toLowerCase().includes('application error');

    if (hasOrderError) {
      testResults.failed.push('❌ TEST 3 FAILED: Order details page shows error');
      console.log('❌ Order details page has errors');
    } else {
      console.log('✅ Order details page loaded without errors');

      // Check for tabs
      const tabs = ['Zákazník', 'Položky', 'Platba', 'Zásilky', 'Metadata'];
      const foundTabs = [];

      for (const tab of tabs) {
        const hasTab = orderPageContent.includes(tab);
        if (hasTab) {
          foundTabs.push(tab);
          console.log(`✅ Found tab: ${tab}`);
        } else {
          console.log(`❌ Missing tab: ${tab}`);
        }
      }

      if (foundTabs.length >= 3) {
        testResults.passed.push(`✅ TEST 3 PASSED: Order details page loaded with ${foundTabs.length}/5 tabs`);
      } else {
        testResults.failed.push('❌ TEST 3 FAILED: Order details page missing critical tabs');
      }
    }

    // TEST 4: Payment Tab - CRITICAL TEST
    console.log('\n📋 TEST 4: Payment Tab (CRITICAL)');
    console.log('-'.repeat(60));

    // Click on Platba tab
    const platbaTabSelectors = [
      'button:has-text("Platba")',
      '[role="tab"]:has-text("Platba")',
      'a:has-text("Platba")',
      '*[class*="tab"]:has-text("Platba")'
    ];

    let tabClicked = false;
    for (const selector of platbaTabSelectors) {
      try {
        await page.click(selector);
        tabClicked = true;
        console.log(`✅ Clicked Platba tab`);
        break;
      } catch (e) {
        // Try next selector
      }
    }

    if (!tabClicked) {
      // Try finding by text content
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, [role="tab"], a'));
        const platbaTab = elements.find(el => el.textContent.trim() === 'Platba');
        if (platbaTab) platbaTab.click();
      });
    }

    await page.waitForTimeout(1500);
    await takeScreenshot(page, '06-payment-tab');

    const paymentTabContent = await page.content();

    // Check for critical sections
    const hasFaktura = paymentTabContent.includes('Faktura');
    const hasPlatbaADoprava = paymentTabContent.includes('Platba a doprava') ||
                               paymentTabContent.includes('Platba') && paymentTabContent.includes('Doprava');
    const hasUpravitButton = paymentTabContent.includes('Upravit');

    console.log(`📊 Payment Tab Analysis:`);
    console.log(`   - Faktura section: ${hasFaktura ? '✅' : '❌'}`);
    console.log(`   - Platba a doprava section: ${hasPlatbaADoprava ? '✅' : '❌'}`);
    console.log(`   - Upravit buttons: ${hasUpravitButton ? '✅' : '❌'}`);

    const criticalElementsFound = hasFaktura && hasPlatbaADoprava && hasUpravitButton;

    if (criticalElementsFound) {
      testResults.passed.push('✅ TEST 4 PASSED: Payment tab shows all critical sections');
      console.log('✅ All critical elements found in Payment tab');
    } else {
      const missing = [];
      if (!hasFaktura) missing.push('Faktura section');
      if (!hasPlatbaADoprava) missing.push('Platba a doprava section');
      if (!hasUpravitButton) missing.push('Upravit buttons');

      testResults.failed.push(`❌ TEST 4 FAILED: Payment tab missing: ${missing.join(', ')}`);
      console.log(`❌ Missing elements: ${missing.join(', ')}`);
    }

    // TEST 5: Delivery Method Options
    console.log('\n📋 TEST 5: Delivery Method Edit');
    console.log('-'.repeat(60));

    // Find and click Upravit button for delivery method
    const deliveryEditClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const upravitButtons = buttons.filter(btn => btn.textContent.includes('Upravit'));

      // Try to find the delivery method edit button (usually second one or near "Doprava")
      for (let btn of upravitButtons) {
        const parent = btn.closest('div, section');
        if (parent && (parent.textContent.includes('Doprava') || parent.textContent.includes('Způsob dopravy'))) {
          btn.click();
          return true;
        }
      }

      // Fallback: click first Upravit button
      if (upravitButtons.length > 0) {
        upravitButtons[0].click();
        return true;
      }

      return false;
    });

    await page.waitForTimeout(1000);
    await takeScreenshot(page, '07-delivery-edit-dropdown');

    if (deliveryEditClicked) {
      const dropdownContent = await page.content();

      const deliveryOptions = [
        'Standardní',
        'Express',
        'Zásilkovna',
        'GLS',
        'Kuriér',
        'Osobní odběr'
      ];

      const foundDeliveryOptions = [];
      for (const option of deliveryOptions) {
        if (dropdownContent.includes(option)) {
          foundDeliveryOptions.push(option);
          console.log(`✅ Found delivery option: ${option}`);
        }
      }

      if (foundDeliveryOptions.length >= 4) {
        testResults.passed.push(`✅ TEST 5 PASSED: Delivery method dropdown shows ${foundDeliveryOptions.length}/6 options`);
      } else {
        testResults.warnings.push(`⚠️ TEST 5 WARNING: Only ${foundDeliveryOptions.length}/6 delivery options found`);
      }

      // Click Zrušit to close
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cancelBtn = buttons.find(btn => btn.textContent.includes('Zrušit'));
        if (cancelBtn) cancelBtn.click();
      });

      await page.waitForTimeout(500);
    } else {
      testResults.failed.push('❌ TEST 5 FAILED: Could not open delivery method dropdown');
    }

    // TEST 6: Payment Method Options
    console.log('\n📋 TEST 6: Payment Method Edit');
    console.log('-'.repeat(60));

    // Find and click Upravit button for payment method
    const paymentEditClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const upravitButtons = buttons.filter(btn => btn.textContent.includes('Upravit'));

      // Try to find the payment method edit button (near "Platba" or "Způsob platby")
      for (let btn of upravitButtons) {
        const parent = btn.closest('div, section');
        if (parent && (parent.textContent.includes('Způsob platby') || parent.textContent.includes('Platební'))) {
          btn.click();
          return true;
        }
      }

      // Fallback: click last Upravit button (often payment is listed after delivery)
      if (upravitButtons.length > 1) {
        upravitButtons[upravitButtons.length - 1].click();
        return true;
      }

      return false;
    });

    await page.waitForTimeout(1000);
    await takeScreenshot(page, '08-payment-edit-dropdown');

    if (paymentEditClicked) {
      const paymentDropdownContent = await page.content();

      const paymentOptions = [
        'GoPay',
        'Karta',
        'Hotovost',
        'Bankovní převod'
      ];

      const foundPaymentOptions = [];
      for (const option of paymentOptions) {
        if (paymentDropdownContent.includes(option)) {
          foundPaymentOptions.push(option);
          console.log(`✅ Found payment option: ${option}`);
        }
      }

      if (foundPaymentOptions.length >= 3) {
        testResults.passed.push(`✅ TEST 6 PASSED: Payment method dropdown shows ${foundPaymentOptions.length}/4 options`);
      } else {
        testResults.warnings.push(`⚠️ TEST 6 WARNING: Only ${foundPaymentOptions.length}/4 payment options found`);
      }

      // Click Zrušit to close
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cancelBtn = buttons.find(btn => btn.textContent.includes('Zrušit'));
        if (cancelBtn) cancelBtn.click();
      });

      await page.waitForTimeout(500);
    } else {
      testResults.failed.push('❌ TEST 6 FAILED: Could not open payment method dropdown');
    }

    // TEST 7: Invoice Section
    console.log('\n📋 TEST 7: Invoice Section');
    console.log('-'.repeat(60));

    await takeScreenshot(page, '09-invoice-section-final');

    const finalContent = await page.content();

    const hasFakturaHeading = finalContent.includes('Faktura');
    const hasGenerateButton = finalContent.includes('Vygenerovat fakturu');
    const hasInvoiceNumber = /FV\d{6}/.test(finalContent) || /Invoice.*\d+/.test(finalContent);

    console.log(`📊 Invoice Section Analysis:`);
    console.log(`   - Faktura heading: ${hasFakturaHeading ? '✅' : '❌'}`);
    console.log(`   - Generate invoice button: ${hasGenerateButton ? '✅' : '❌'}`);
    console.log(`   - Existing invoice: ${hasInvoiceNumber ? '✅' : '❌'}`);

    if (hasFakturaHeading && (hasGenerateButton || hasInvoiceNumber)) {
      testResults.passed.push('✅ TEST 7 PASSED: Invoice section is functional');
    } else if (hasFakturaHeading) {
      testResults.warnings.push('⚠️ TEST 7 WARNING: Invoice section exists but functionality unclear');
    } else {
      testResults.failed.push('❌ TEST 7 FAILED: Invoice section not found');
    }

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
    testResults.failed.push(`❌ CRITICAL ERROR: ${error.message}`);
    await takeScreenshot(page, 'error-state');
  } finally {
    await browser.close();
  }

  // Print Final Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST REPORT');
  console.log('='.repeat(60));

  console.log('\n✅ PASSED TESTS:');
  if (testResults.passed.length === 0) {
    console.log('   None');
  } else {
    testResults.passed.forEach(test => console.log(`   ${test}`));
  }

  console.log('\n❌ FAILED TESTS:');
  if (testResults.failed.length === 0) {
    console.log('   None');
  } else {
    testResults.failed.forEach(test => console.log(`   ${test}`));
  }

  console.log('\n⚠️  WARNINGS:');
  if (testResults.warnings.length === 0) {
    console.log('   None');
  } else {
    testResults.warnings.forEach(warning => console.log(`   ${warning}`));
  }

  console.log('\n🔴 CONSOLE ERRORS:');
  if (testResults.consoleErrors.length === 0) {
    console.log('   None');
  } else {
    testResults.consoleErrors.slice(0, 10).forEach(error => console.log(`   ${error}`));
    if (testResults.consoleErrors.length > 10) {
      console.log(`   ... and ${testResults.consoleErrors.length - 10} more`);
    }
  }

  console.log('\n🌐 NETWORK ERRORS:');
  if (testResults.networkErrors.length === 0) {
    console.log('   None');
  } else {
    testResults.networkErrors.slice(0, 10).forEach(error => console.log(`   ${error}`));
    if (testResults.networkErrors.length > 10) {
      console.log(`   ... and ${testResults.networkErrors.length - 10} more`);
    }
  }

  console.log('\n📸 Screenshots saved in: ' + screenshotsDir);

  const passRate = (testResults.passed.length / (testResults.passed.length + testResults.failed.length) * 100).toFixed(1);
  console.log(`\n📈 Pass Rate: ${passRate}%`);
  console.log('='.repeat(60));

  process.exit(testResults.failed.length > 0 ? 1 : 0);
}

runTests();
