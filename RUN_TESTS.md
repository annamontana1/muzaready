# How to Run Admin Feature Tests

## Prerequisites
- Node.js installed
- Puppeteer dependencies installed (`npm install`)
- Valid admin credentials

## Quick Start

### Option 1: Run Full Test Suite
```bash
node test-admin-features.js
```

This will:
- Test all 7 admin features automatically
- Take screenshots at each step
- Generate detailed pass/fail report
- Save screenshots to `test-screenshots/` directory

### Option 2: Run Debug Login Test
```bash
node test-login-debug.js
```

This will:
- Test only the login functionality
- Show detailed request/response data
- Capture network traffic
- Helpful for debugging authentication issues

## Update Credentials

If you need to use different credentials, edit the test file:

**File:** `test-admin-features.js`

```javascript
// Line 10-11
const ADMIN_EMAIL = 'your-email@example.com';
const ADMIN_PASSWORD = 'your-password-here';
```

**File:** `test-login-debug.js`

```javascript
// Line 53-54
await page.type('input[type="email"]', 'your-email@example.com');
await page.type('input[type="password"]', 'your-password-here');
```

## View Results

### Screenshots
All screenshots are saved in:
```
/Users/zen/muzaready/test-screenshots/
```

### Test Report
After running tests, check the console output for:
- ✅ PASSED TESTS
- ❌ FAILED TESTS
- ⚠️ WARNINGS
- 🔴 CONSOLE ERRORS
- 🌐 NETWORK ERRORS
- 📈 Pass Rate

## Troubleshooting

### Issue: Login fails with 401
**Solution:** Verify admin credentials are correct
```bash
# Check admin users in database
npx tsx check-admins-simple.ts
```

### Issue: Page loads but elements not found
**Solution:** Check screenshots in `test-screenshots/` to see what's actually on the page

### Issue: Timeout errors
**Solution:** Increase timeout in test file (currently 15000ms)

## Test Coverage

The automated test suite covers:

1. ✅ Admin login functionality
2. ✅ Dashboard access after login
3. ✅ Orders page loading
4. ✅ Order details page
5. ✅ Payment tab sections (Invoice, Payment & Delivery)
6. ✅ Delivery method editing dropdown
7. ✅ Payment method editing dropdown
8. ✅ Invoice section functionality

## Manual Testing Alternative

If automated tests don't work, follow the checklist in:
```
ADMIN_TEST_REPORT.md
```

Section: "Manual Testing Checklist"
