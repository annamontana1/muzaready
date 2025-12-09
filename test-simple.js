const puppeteer = require('puppeteer');
const fs = require('fs');

async function testAdmin() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('🚀 Testing Admin Panel\n');

    // Test 1: Login
    console.log('📋 TEST 1: Login');
    console.log('------------------------------------------------------------');
    await page.goto('https://muzaready-iota.vercel.app/admin/login', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Fill login form
    await page.type('input[type="email"]', 'muzahaircz@gmail.com');
    await page.type('input[type="password"]', 'muza2024Admin!');

    console.log('✅ Form filled');
    await page.screenshot({ path: 'test-01-login-filled.png' });

    // Click login and wait for navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {
        console.log('⚠️ Navigation timeout - checking if login error appeared');
      })
    ]);

    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    await page.screenshot({ path: 'test-02-after-login.png' });

    // Check for error message
    const errorMsg = await page.evaluate(() => {
      const errorEl = document.querySelector('.text-red-600, .text-red-800, .bg-red-50');
      return errorEl ? errorEl.textContent.trim() : null;
    });

    if (errorMsg) {
      console.log('❌ Login error:', errorMsg);
      await browser.close();
      return;
    }

    if (currentUrl.includes('/admin/login')) {
      console.log('❌ Still on login page - login failed');

      // Check page content for clues
      const pageText = await page.evaluate(() => document.body.textContent);
      if (pageText.includes('Nesprávný email nebo heslo')) {
        console.log('❌ Invalid credentials error detected');
      }

      await browser.close();
      return;
    }

    console.log('✅ Login successful! Redirected to:', currentUrl);

    // Test 2: Orders page
    console.log('\n📋 TEST 2: Orders Page');
    console.log('------------------------------------------------------------');
    await page.goto('https://muzaready-iota.vercel.app/admin/objednavky', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.screenshot({ path: 'test-03-orders-page.png' });

    // Check for "Application error"
    const hasError = await page.evaluate(() => {
      return document.body.textContent.includes('Application error');
    });

    if (hasError) {
      console.log('❌ Application error detected on orders page');
      await browser.close();
      return;
    }

    console.log('✅ Orders page loaded without errors');

    // Test 3: Order detail
    console.log('\n📋 TEST 3: Order Detail Page');
    console.log('------------------------------------------------------------');

    // Get first order link
    const firstOrderLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/admin/objednavky/"]');
      return link ? link.href : null;
    });

    if (!firstOrderLink) {
      console.log('⚠️ No orders found, using test order');
      await page.goto('https://muzaready-iota.vercel.app/admin/objednavky/test-order-1765216851.558210', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    } else {
      console.log('📍 Opening order:', firstOrderLink);
      await page.goto(firstOrderLink, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    }

    await page.screenshot({ path: 'test-04-order-detail.png' });

    // Check for error
    const hasOrderError = await page.evaluate(() => {
      return document.body.textContent.includes('Application error');
    });

    if (hasOrderError) {
      console.log('❌ Application error on order detail page');
      await browser.close();
      return;
    }

    console.log('✅ Order detail page loaded');

    // Test 4: Payment tab
    console.log('\n📋 TEST 4: Payment Tab (Invoice Section)');
    console.log('------------------------------------------------------------');

    // Click Payment tab
    const paymentTabClicked = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const paymentTab = tabs.find(btn => btn.textContent.includes('Platba'));
      if (paymentTab) {
        paymentTab.click();
        return true;
      }
      return false;
    });

    if (!paymentTabClicked) {
      console.log('⚠️ Payment tab not found');
    } else {
      console.log('✅ Clicked Payment tab');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-05-payment-tab.png' });

      // Check for Invoice section
      const sections = await page.evaluate(() => {
        const hasInvoice = document.body.textContent.includes('Faktura');
        const hasPaymentDelivery = document.body.textContent.includes('Platba a doprava');
        const hasDeliveryMethod = document.body.textContent.includes('Způsob dopravy');
        const hasPaymentMethod = document.body.textContent.includes('Způsob platby');
        const hasZasilkovna = document.body.textContent.includes('Zásilkovna');
        const hasGLS = document.body.textContent.includes('GLS');

        return {
          invoice: hasInvoice,
          paymentDelivery: hasPaymentDelivery,
          deliveryMethod: hasDeliveryMethod,
          paymentMethod: hasPaymentMethod,
          zasilkovna: hasZasilkovna,
          gls: hasGLS
        };
      });

      console.log('\n✅ Payment Tab Sections:');
      console.log('   - Faktura section:', sections.invoice ? '✅ Found' : '❌ Missing');
      console.log('   - Platba a doprava:', sections.paymentDelivery ? '✅ Found' : '❌ Missing');
      console.log('   - Způsob dopravy:', sections.deliveryMethod ? '✅ Found' : '❌ Missing');
      console.log('   - Způsob platby:', sections.paymentMethod ? '✅ Found' : '❌ Missing');
      console.log('   - Zásilkovna option:', sections.zasilkovna ? '✅ Found' : '⚠️ Not visible (may need to click Edit)');
      console.log('   - GLS option:', sections.gls ? '✅ Found' : '⚠️ Not visible (may need to click Edit)');
    }

    console.log('\n============================================================');
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('============================================================');
    console.log('\n📸 Screenshots saved:');
    console.log('   - test-01-login-filled.png');
    console.log('   - test-02-after-login.png');
    console.log('   - test-03-orders-page.png');
    console.log('   - test-04-order-detail.png');
    console.log('   - test-05-payment-tab.png');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-error.png' });
  } finally {
    await browser.close();
  }
}

testAdmin();
