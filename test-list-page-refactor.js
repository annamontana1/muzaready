#!/usr/bin/env node

/**
 * TESTER: List Page Refactor - Comprehensive Test Suite
 *
 * Tests:
 * 1. Code Structure Tests (imports, hooks, no manual fetching)
 * 2. React Query Integration Tests
 * 3. Pagination Tests
 * 4. Filtering Tests
 * 5. Sorting Tests
 * 6. Bulk Actions Tests
 * 7. Selection Tests
 * 8. TypeScript Tests
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, fn) {
    try {
      fn();
      this.passed++;
      this.tests.push({ name, status: 'PASS' });
      console.log(`${colors.green}✓${colors.reset} ${name}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ name, status: 'FAIL', error: error.message });
      console.log(`${colors.red}✗${colors.reset} ${name}`);
      console.log(`  ${colors.red}${error.message}${colors.reset}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
  }

  assertContains(content, substring, message) {
    if (!content.includes(substring)) {
      throw new Error(`${message}\n  Expected to contain: "${substring}"`);
    }
  }

  assertNotContains(content, substring, message) {
    if (content.includes(substring)) {
      throw new Error(`${message}\n  Should NOT contain: "${substring}"`);
    }
  }

  assertMatches(content, regex, message) {
    if (!regex.test(content)) {
      throw new Error(`${message}\n  Expected to match: ${regex}`);
    }
  }

  summary() {
    const total = this.passed + this.failed;
    const passRate = ((this.passed / total) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`${colors.green}Passed: ${this.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.failed}${colors.reset}`);
    console.log(`Pass Rate: ${passRate}%`);

    if (this.failed === 0) {
      console.log(`\n${colors.green}🎉 ALL TESTS PASSED!${colors.reset}`);
    } else {
      console.log(`\n${colors.red}❌ SOME TESTS FAILED${colors.reset}`);
    }

    // Score calculation
    const score = parseFloat(passRate) / 10;
    console.log(`\n${colors.cyan}Score: ${score.toFixed(2)}/10${colors.reset}`);

    return {
      total,
      passed: this.passed,
      failed: this.failed,
      passRate: parseFloat(passRate),
      score,
    };
  }
}

// ============================================================================
// MAIN TEST EXECUTION
// ============================================================================

console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}  LIST PAGE REFACTOR - TEST SUITE${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);

const runner = new TestRunner();

// Read source files
const listPagePath = path.join(__dirname, 'app/admin/objednavky/page.tsx');
const queryHooksPath = path.join(__dirname, 'lib/queries/orders.ts');

let listPageContent = '';
let queryHooksContent = '';

try {
  listPageContent = fs.readFileSync(listPagePath, 'utf8');
  queryHooksContent = fs.readFileSync(queryHooksPath, 'utf8');
} catch (error) {
  console.error(`${colors.red}Error reading files: ${error.message}${colors.reset}`);
  process.exit(1);
}

// ============================================================================
// CATEGORY 1: Code Structure Tests
// ============================================================================

console.log(`${colors.blue}▶ Category 1: Code Structure Tests${colors.reset}`);

runner.test('1.1 - Imports useOrders and useBulkAction from lib/queries/orders', () => {
  runner.assertMatches(
    listPageContent,
    /import\s+{\s*useOrders,\s*useBulkAction\s*}\s+from\s+['"]@\/lib\/queries\/orders['"]/,
    'Should import useOrders and useBulkAction'
  );
});

runner.test('1.2 - No longer imports useEffect or useCallback', () => {
  runner.assertNotContains(
    listPageContent,
    'useEffect',
    'Should NOT import useEffect (React Query handles this)'
  );
  runner.assertNotContains(
    listPageContent,
    'useCallback',
    'Should NOT import useCallback (no manual fetchOrders)'
  );
});

runner.test('1.3 - No longer imports OrdersResponse type', () => {
  const importMatch = listPageContent.match(/import\s+{\s*([^}]+)\s*}\s+from\s+['"]\.\/types['"]/);
  if (importMatch) {
    const imports = importMatch[1].split(',').map(i => i.trim());
    runner.assert(
      !imports.includes('OrdersResponse'),
      'Should NOT import OrdersResponse (React Query provides this)'
    );
  }
});

runner.test('1.4 - No useState for orders array', () => {
  runner.assertNotContains(
    listPageContent,
    'useState<Order[]>([]);',
    'Should NOT have useState for orders (from React Query)'
  );
});

runner.test('1.5 - No useState for loading boolean', () => {
  runner.assertNotContains(
    listPageContent,
    'useState<boolean>(true)',
    'Should NOT have useState for loading (from React Query isLoading)'
  );
});

runner.test('1.6 - No useState for totalItems', () => {
  runner.assertNotContains(
    listPageContent,
    'setTotalItems',
    'Should NOT have setTotalItems (derived from React Query data)'
  );
});

runner.test('1.7 - No fetchOrders callback', () => {
  runner.assertNotContains(
    listPageContent,
    'const fetchOrders',
    'Should NOT have fetchOrders callback'
  );
});

runner.test('1.8 - No useEffect hook', () => {
  runner.assertNotContains(
    listPageContent,
    'useEffect',
    'Should NOT have useEffect (React Query auto-refetches)'
  );
});

// ============================================================================
// CATEGORY 2: React Query Integration Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 2: React Query Integration Tests${colors.reset}`);

runner.test('2.1 - Calls useOrders() hook', () => {
  runner.assertContains(
    listPageContent,
    'useOrders(',
    'Should call useOrders() hook'
  );
});

runner.test('2.2 - Destructures data and isLoading from useOrders', () => {
  runner.assertMatches(
    listPageContent,
    /const\s+{\s*data,\s*isLoading\s*}\s*=\s*useOrders\(/,
    'Should destructure { data, isLoading } from useOrders'
  );
});

runner.test('2.3 - Passes limit to useOrders', () => {
  runner.assertMatches(
    listPageContent,
    /limit:\s*itemsPerPage/,
    'Should pass limit: itemsPerPage to useOrders'
  );
});

runner.test('2.4 - Passes offset to useOrders', () => {
  runner.assertMatches(
    listPageContent,
    /offset:\s*\(currentPage\s*-\s*1\)\s*\*\s*itemsPerPage/,
    'Should pass offset calculated from currentPage and itemsPerPage'
  );
});

runner.test('2.5 - Passes filters to useOrders', () => {
  runner.assertContains(
    listPageContent,
    'orderStatus: filters.orderStatus',
    'Should pass orderStatus filter'
  );
  runner.assertContains(
    listPageContent,
    'paymentStatus: filters.paymentStatus',
    'Should pass paymentStatus filter'
  );
  runner.assertContains(
    listPageContent,
    'deliveryStatus: filters.deliveryStatus',
    'Should pass deliveryStatus filter'
  );
});

runner.test('2.6 - Passes sort to useOrders', () => {
  runner.assertMatches(
    listPageContent,
    /sort:\s*sortField\s*\?\s*\(sortDirection\s*===\s*['"]desc['"]/,
    'Should pass sort parameter based on sortField and sortDirection'
  );
});

runner.test('2.7 - Derives orders from data?.orders', () => {
  runner.assertMatches(
    listPageContent,
    /const\s+orders\s*=\s*data\?\.orders\s*\|\|\s*\[\]/,
    'Should derive orders from data?.orders || []'
  );
});

runner.test('2.8 - Derives totalItems from data?.total', () => {
  runner.assertMatches(
    listPageContent,
    /const\s+totalItems\s*=\s*data\?\.total\s*\|\|\s*0/,
    'Should derive totalItems from data?.total || 0'
  );
});

runner.test('2.9 - Calls useBulkAction() hook', () => {
  runner.assertContains(
    listPageContent,
    'useBulkAction(',
    'Should call useBulkAction() hook'
  );
});

runner.test('2.10 - Uses isLoading instead of loading variable', () => {
  runner.assertContains(
    listPageContent,
    'if (isLoading)',
    'Should check isLoading from React Query'
  );
});

// ============================================================================
// CATEGORY 3: Handler Tests (No Manual Fetching)
// ============================================================================

console.log(`\n${colors.blue}▶ Category 3: Handler Tests${colors.reset}`);

runner.test('3.1 - handleFilterChange does NOT call fetchOrders', () => {
  const handlerMatch = listPageContent.match(/handleFilterChange[\s\S]*?};/);
  if (handlerMatch) {
    runner.assertNotContains(
      handlerMatch[0],
      'fetchOrders',
      'handleFilterChange should NOT call fetchOrders'
    );
  } else {
    throw new Error('handleFilterChange not found');
  }
});

runner.test('3.2 - handleFilterChange has comment about React Query auto-refetch', () => {
  runner.assertContains(
    listPageContent,
    'React Query auto-refetches',
    'Should have comment explaining React Query auto-refetch'
  );
});

runner.test('3.3 - executeBulkAction uses bulkActionMutation.mutateAsync', () => {
  runner.assertContains(
    listPageContent,
    'bulkActionMutation.mutateAsync',
    'Should use bulkActionMutation.mutateAsync'
  );
});

runner.test('3.4 - executeBulkAction passes action and orderIds', () => {
  const executeBulkMatch = listPageContent.match(/executeBulkAction[\s\S]*?};/);
  if (executeBulkMatch) {
    runner.assertContains(
      executeBulkMatch[0],
      'action: pendingAction.action',
      'Should pass action to mutation'
    );
    runner.assertContains(
      executeBulkMatch[0],
      'orderIds: selectedIds',
      'Should pass orderIds to mutation'
    );
  } else {
    throw new Error('executeBulkAction not found');
  }
});

runner.test('3.5 - executeBulkAction does NOT call fetchOrders', () => {
  const executeBulkMatch = listPageContent.match(/executeBulkAction[\s\S]*?};/);
  if (executeBulkMatch) {
    runner.assertNotContains(
      executeBulkMatch[0],
      'fetchOrders',
      'executeBulkAction should NOT call fetchOrders (auto cache invalidation)'
    );
  } else {
    throw new Error('executeBulkAction not found');
  }
});

runner.test('3.6 - executeBulkAction has comment about auto cache invalidation', () => {
  const executeBulkMatch = listPageContent.match(/executeBulkAction[\s\S]*?};/);
  if (executeBulkMatch) {
    runner.assertContains(
      executeBulkMatch[0],
      'auto',
      'Should have comment about automatic cache invalidation'
    );
  } else {
    throw new Error('executeBulkAction not found');
  }
});

// ============================================================================
// CATEGORY 4: Stats Calculation Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 4: Stats Calculation Tests${colors.reset}`);

runner.test('4.1 - Stats calculated from orders array', () => {
  runner.assertContains(
    listPageContent,
    'const stats = {',
    'Should have stats calculation'
  );
});

runner.test('4.2 - Stats has totalRevenue calculation', () => {
  runner.assertMatches(
    listPageContent,
    /totalRevenue:\s*orders\.reduce\(\(sum,\s*order\)\s*=>\s*sum\s*\+\s*order\.total,\s*0\)/,
    'Should calculate totalRevenue from orders'
  );
});

runner.test('4.3 - Stats has pendingCount calculation', () => {
  runner.assertContains(
    listPageContent,
    'pendingCount: orders.filter(',
    'Should calculate pendingCount from orders'
  );
});

runner.test('4.4 - Stats has paidCount calculation', () => {
  runner.assertContains(
    listPageContent,
    'paidCount: orders.filter(',
    'Should calculate paidCount from orders'
  );
});

runner.test('4.5 - Stats has shippedCount calculation', () => {
  runner.assertContains(
    listPageContent,
    'shippedCount: orders.filter(',
    'Should calculate shippedCount from orders'
  );
});

runner.test('4.6 - Stats has comment acknowledging per-page limitation', () => {
  runner.assertMatches(
    listPageContent,
    /acknowledged limitation.*per-page/i,
    'Should have comment acknowledging stats are per-page, not global'
  );
});

// ============================================================================
// CATEGORY 5: Preserved Functionality Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 5: Preserved Functionality Tests${colors.reset}`);

runner.test('5.1 - Still has Filters component', () => {
  runner.assertContains(
    listPageContent,
    '<Filters onFilter={handleFilterChange}',
    'Should still have Filters component'
  );
});

runner.test('5.2 - Still has BulkActions component', () => {
  runner.assertContains(
    listPageContent,
    '<BulkActions',
    'Should still have BulkActions component'
  );
});

runner.test('5.3 - Still has Pagination component', () => {
  runner.assertContains(
    listPageContent,
    '<Pagination',
    'Should still have Pagination component'
  );
});

runner.test('5.4 - Still has CSV export logic', () => {
  runner.assertContains(
    listPageContent,
    'exportToCSV',
    'Should still have CSV export function'
  );
});

runner.test('5.5 - Still has selection state (selectedIds)', () => {
  runner.assertContains(
    listPageContent,
    'const [selectedIds, setSelectedIds] = useState<string[]>([]);',
    'Should still have selectedIds state'
  );
});

runner.test('5.6 - Still has confirmation dialog', () => {
  runner.assertContains(
    listPageContent,
    '<ConfirmDialog',
    'Should still have ConfirmDialog component'
  );
});

runner.test('5.7 - Still has keyboard shortcut (useSearchShortcut)', () => {
  runner.assertContains(
    listPageContent,
    'useSearchShortcut',
    'Should still have keyboard shortcut'
  );
});

runner.test('5.8 - Still has helper functions (getStatusColor, getStatusLabel, formatPrice)', () => {
  runner.assertContains(
    listPageContent,
    'getStatusColor',
    'Should still have getStatusColor'
  );
  runner.assertContains(
    listPageContent,
    'getStatusLabel',
    'Should still have getStatusLabel'
  );
  runner.assertContains(
    listPageContent,
    'formatPrice',
    'Should still have formatPrice'
  );
});

// ============================================================================
// CATEGORY 6: TypeScript Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 6: TypeScript Tests${colors.reset}`);

runner.test('6.1 - File is TypeScript (.tsx extension)', () => {
  runner.assert(
    listPagePath.endsWith('.tsx'),
    'File should have .tsx extension'
  );
});

runner.test('6.2 - Has "use client" directive', () => {
  runner.assertContains(
    listPageContent,
    "'use client'",
    "Should have 'use client' directive for Next.js 14"
  );
});

runner.test('6.3 - Filter state uses FilterState type', () => {
  runner.assertContains(
    listPageContent,
    'useState<FilterState>',
    'Should use FilterState type for filters'
  );
});

runner.test('6.4 - Pagination uses number type', () => {
  runner.assertContains(
    listPageContent,
    'useState<number>',
    'Should use number type for pagination'
  );
});

// ============================================================================
// CATEGORY 7: Query Hooks Library Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 7: Query Hooks Library Tests${colors.reset}`);

runner.test('7.1 - useOrders hook exists in lib/queries/orders.ts', () => {
  runner.assertContains(
    queryHooksContent,
    'export function useOrders(',
    'useOrders hook should be exported'
  );
});

runner.test('7.2 - useOrders accepts OrderListParams', () => {
  runner.assertContains(
    queryHooksContent,
    'params: OrderListParams',
    'useOrders should accept OrderListParams'
  );
});

runner.test('7.3 - useOrders uses query keys factory', () => {
  runner.assertContains(
    queryHooksContent,
    'queryKey: orderKeys.list(params)',
    'useOrders should use orderKeys.list()'
  );
});

runner.test('7.4 - useOrders has placeholderData for smooth transitions', () => {
  runner.assertContains(
    queryHooksContent,
    'placeholderData',
    'useOrders should have placeholderData to prevent flashing'
  );
});

runner.test('7.5 - useBulkAction exists in lib/queries/orders.ts', () => {
  runner.assertContains(
    queryHooksContent,
    'export function useBulkAction(',
    'useBulkAction hook should be exported'
  );
});

runner.test('7.6 - useBulkAction invalidates all order lists', () => {
  const bulkActionMatch = queryHooksContent.match(/export function useBulkAction[\s\S]*?^}/m);
  if (bulkActionMatch) {
    runner.assertContains(
      bulkActionMatch[0],
      'orderKeys.lists()',
      'useBulkAction should invalidate all lists'
    );
  } else {
    throw new Error('useBulkAction not found');
  }
});

runner.test('7.7 - useBulkAction invalidates all order details', () => {
  const bulkActionMatch = queryHooksContent.match(/export function useBulkAction[\s\S]*?^}/m);
  if (bulkActionMatch) {
    runner.assertContains(
      bulkActionMatch[0],
      'orderKeys.details()',
      'useBulkAction should invalidate all details'
    );
  } else {
    throw new Error('useBulkAction not found');
  }
});

// ============================================================================
// CATEGORY 8: Code Reduction Tests
// ============================================================================

console.log(`\n${colors.blue}▶ Category 8: Code Reduction Tests${colors.reset}`);

runner.test('8.1 - File is less than 552 lines (original size)', () => {
  const lineCount = listPageContent.split('\n').length;
  runner.assert(
    lineCount < 552,
    `File should be less than 552 lines (actual: ${lineCount})`
  );
});

runner.test('8.2 - File is approximately 450-500 lines', () => {
  const lineCount = listPageContent.split('\n').length;
  runner.assert(
    lineCount >= 450 && lineCount <= 510,
    `File should be between 450-510 lines (actual: ${lineCount})`
  );
});

runner.test('8.3 - Reduced useState hooks (from 11 to ~7)', () => {
  const useStateCount = (listPageContent.match(/useState</g) || []).length;
  runner.assert(
    useStateCount >= 6 && useStateCount <= 8,
    `Should have 6-8 useState hooks (actual: ${useStateCount})`
  );
});

// ============================================================================
// TEST SUMMARY
// ============================================================================

const results = runner.summary();

// Write results to file
const reportPath = path.join(__dirname, 'LIST_PAGE_TEST_RESULTS.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  results,
  tests: runner.tests,
  files: {
    listPage: listPagePath,
    queryHooks: queryHooksPath,
  },
  metrics: {
    originalLines: 552,
    newLines: listPageContent.split('\n').length,
    reduction: 552 - listPageContent.split('\n').length,
    reductionPercent: ((552 - listPageContent.split('\n').length) / 552 * 100).toFixed(1) + '%',
  }
}, null, 2));

console.log(`\n${colors.cyan}Test results saved to: ${reportPath}${colors.reset}`);

process.exit(results.failed > 0 ? 1 : 0);
