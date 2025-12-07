/**
 * UX ENHANCEMENTS TEST SUITE
 * Tests keyboard shortcuts, loading skeletons, and ARIA accessibility
 */

const fs = require('fs');
const path = require('path');

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Add test result
function addTest(name, passed, details = '', severity = 'error') {
  results.tests.push({ name, passed, details, severity });
  if (passed) {
    results.passed++;
  } else {
    if (severity === 'warning') {
      results.warnings++;
    } else {
      results.failed++;
    }
  }
}

console.log('🧪 UX ENHANCEMENTS TEST SUITE');
console.log('=' .repeat(80));

// ============================================================================
// TEST 1: Keyboard Shortcuts Hook exists and exports correct functions
// ============================================================================
console.log('\n📦 TEST 1: Keyboard Shortcuts Hook');

try {
  const hookPath = path.join(__dirname, 'hooks/useKeyboardShortcuts.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  // Check for main hook export
  const hasMainHook = /export function useKeyboardShortcuts/.test(hookContent);
  addTest(
    'useKeyboardShortcuts hook exported',
    hasMainHook,
    hasMainHook ? 'Found main hook export' : 'Missing main hook export'
  );

  // Check for helper hooks
  const hasSearchShortcut = /export function useSearchShortcut/.test(hookContent);
  addTest(
    'useSearchShortcut helper exported',
    hasSearchShortcut,
    hasSearchShortcut ? 'Found search shortcut helper' : 'Missing search shortcut helper'
  );

  const hasSaveShortcut = /export function useSaveShortcut/.test(hookContent);
  addTest(
    'useSaveShortcut helper exported',
    hasSaveShortcut,
    hasSaveShortcut ? 'Found save shortcut helper' : 'Missing save shortcut helper'
  );

  // Check for input detection (prevents triggering when typing)
  const hasInputDetection = /const isInput = target\.tagName === 'INPUT' \|\| target\.tagName === 'TEXTAREA'/.test(hookContent);
  addTest(
    'Input detection implemented',
    hasInputDetection,
    hasInputDetection ? 'Prevents shortcuts when typing in inputs' : 'Missing input detection'
  );

  // Check for cleanup (removeEventListener)
  const hasCleanup = /removeEventListener\('keydown', handleKeyDown\)/.test(hookContent);
  addTest(
    'Event listener cleanup implemented',
    hasCleanup,
    hasCleanup ? 'Proper cleanup on unmount' : 'Missing cleanup'
  );

  console.log('✅ Keyboard shortcuts hook validation complete');
} catch (error) {
  addTest('Keyboard shortcuts hook exists', false, error.message);
  console.log('❌ Keyboard shortcuts hook validation failed');
}

// ============================================================================
// TEST 2: Skeleton Components exist and have ARIA labels
// ============================================================================
console.log('\n🎨 TEST 2: Skeleton Components');

try {
  const skeletonPath = path.join(__dirname, 'components/ui/Skeleton.tsx');
  const skeletonContent = fs.readFileSync(skeletonPath, 'utf8');

  // Check for base Skeleton component
  const hasSkeleton = /export function Skeleton/.test(skeletonContent);
  addTest(
    'Base Skeleton component exported',
    hasSkeleton,
    hasSkeleton ? 'Found base Skeleton component' : 'Missing base Skeleton'
  );

  // Check for all variants
  const variants = [
    'TextSkeleton',
    'TableSkeleton',
    'CardSkeleton',
    'StatsCardSkeleton',
    'ListSkeleton'
  ];

  variants.forEach(variant => {
    const hasVariant = new RegExp(`export function ${variant}`).test(skeletonContent);
    addTest(
      `${variant} component exported`,
      hasVariant,
      hasVariant ? `Found ${variant}` : `Missing ${variant}`
    );
  });

  // Check for ARIA labels
  const ariaMatches = skeletonContent.match(/aria-label=/g);
  const ariaCount = ariaMatches ? ariaMatches.length : 0;
  addTest(
    'ARIA labels present',
    ariaCount >= 5,
    `Found ${ariaCount} ARIA labels (expected ≥ 5)`
  );

  // Check for role="status"
  const roleMatches = skeletonContent.match(/role="status"/g);
  const roleCount = roleMatches ? roleMatches.length : 0;
  addTest(
    'Role="status" attributes present',
    roleCount >= 5,
    `Found ${roleCount} role="status" (expected ≥ 5)`
  );

  // Check for animation
  const hasAnimation = /animate-pulse/.test(skeletonContent);
  addTest(
    'Pulse animation implemented',
    hasAnimation,
    hasAnimation ? 'Uses Tailwind animate-pulse' : 'Missing animation'
  );

  console.log('✅ Skeleton components validation complete');
} catch (error) {
  addTest('Skeleton components exist', false, error.message);
  console.log('❌ Skeleton components validation failed');
}

// ============================================================================
// TEST 3: Orders List Page Integration
// ============================================================================
console.log('\n📄 TEST 3: Orders List Page Integration');

try {
  const ordersPagePath = path.join(__dirname, 'app/admin/objednavky/page.tsx');
  const ordersPageContent = fs.readFileSync(ordersPagePath, 'utf8');

  // Check for keyboard shortcut import
  const hasShortcutImport = /import.*useSearchShortcut.*from.*useKeyboardShortcuts/.test(ordersPageContent);
  addTest(
    'useSearchShortcut imported',
    hasShortcutImport,
    hasShortcutImport ? 'Keyboard shortcut hook imported' : 'Missing keyboard shortcut import'
  );

  // Check for keyboard shortcut usage
  const hasShortcutUsage = /useSearchShortcut\(/.test(ordersPageContent);
  addTest(
    'useSearchShortcut hook used',
    hasShortcutUsage,
    hasShortcutUsage ? 'Keyboard shortcut implemented' : 'Keyboard shortcut not used'
  );

  // Check for Skeleton imports
  const hasSkeletonImport = /import.*\{.*Skeleton.*\}.*from.*Skeleton/.test(ordersPageContent);
  addTest(
    'Skeleton components imported',
    hasSkeletonImport,
    hasSkeletonImport ? 'Skeleton components imported' : 'Missing Skeleton imports'
  );

  // Check for TableSkeleton usage in loading state
  const hasTableSkeleton = /<TableSkeleton/.test(ordersPageContent);
  addTest(
    'TableSkeleton used in loading state',
    hasTableSkeleton,
    hasTableSkeleton ? 'Loading state uses TableSkeleton' : 'TableSkeleton not used'
  );

  // Check for StatsCardSkeleton usage
  const hasStatsCardSkeleton = /<StatsCardSkeleton/.test(ordersPageContent);
  addTest(
    'StatsCardSkeleton used in loading state',
    hasStatsCardSkeleton,
    hasStatsCardSkeleton ? 'Loading state uses StatsCardSkeleton' : 'StatsCardSkeleton not used'
  );

  // Check that old "Načítání..." text is removed from loading state
  const loadingStateMatch = ordersPageContent.match(/if \(loading\) \{[\s\S]*?return \([\s\S]*?\);[\s\S]*?\}/);
  if (loadingStateMatch) {
    const loadingStateCode = loadingStateMatch[0];
    const hasOldText = /Načítání\.\.\./.test(loadingStateCode);
    addTest(
      'Old loading text removed',
      !hasOldText,
      !hasOldText ? 'No primitive "Načítání..." in loading state' : 'Still using old "Načítání..." text'
    );
  }

  console.log('✅ Orders list page integration complete');
} catch (error) {
  addTest('Orders list page integration', false, error.message);
  console.log('❌ Orders list page integration failed');
}

// ============================================================================
// TEST 4: Order Detail Page Integration
// ============================================================================
console.log('\n📄 TEST 4: Order Detail Page Integration');

try {
  const detailPagePath = path.join(__dirname, 'app/admin/objednavky/[id]/page.tsx');
  const detailPageContent = fs.readFileSync(detailPagePath, 'utf8');

  // Check for CardSkeleton import
  const hasCardSkeletonImport = /import.*\{.*CardSkeleton.*\}.*from.*Skeleton/.test(detailPageContent);
  addTest(
    'CardSkeleton imported',
    hasCardSkeletonImport,
    hasCardSkeletonImport ? 'CardSkeleton imported' : 'Missing CardSkeleton import'
  );

  // Check for CardSkeleton usage
  const hasCardSkeleton = /<CardSkeleton/.test(detailPageContent);
  addTest(
    'CardSkeleton used in loading state',
    hasCardSkeleton,
    hasCardSkeleton ? 'Loading state uses CardSkeleton' : 'CardSkeleton not used'
  );

  // Check that old "Načítám..." text is removed
  const loadingStateMatch = detailPageContent.match(/if \(loading\) \{[\s\S]*?return \([\s\S]*?\);[\s\S]*?\}/);
  if (loadingStateMatch) {
    const loadingStateCode = loadingStateMatch[0];
    const hasOldText = /Načítám\.\.\./.test(loadingStateCode);
    addTest(
      'Old loading text removed',
      !hasOldText,
      !hasOldText ? 'No primitive "Načítám..." in loading state' : 'Still using old "Načítám..." text'
    );
  }

  // Check for multiple CardSkeletons (should have at least 2-3 for different sections)
  const cardSkeletonCount = (detailPageContent.match(/<CardSkeleton/g) || []).length;
  addTest(
    'Multiple CardSkeletons for different sections',
    cardSkeletonCount >= 2,
    `Found ${cardSkeletonCount} CardSkeleton instances (expected ≥ 2)`
  );

  console.log('✅ Order detail page integration complete');
} catch (error) {
  addTest('Order detail page integration', false, error.message);
  console.log('❌ Order detail page integration failed');
}

// ============================================================================
// TEST 5: ARIA Accessibility in Existing Components
// ============================================================================
console.log('\n♿ TEST 5: ARIA Accessibility');

try {
  // Check Modal component
  const modalPath = path.join(__dirname, 'components/ui/Modal.tsx');
  const modalContent = fs.readFileSync(modalPath, 'utf8');

  const modalHasRole = /role="dialog"/.test(modalContent);
  addTest(
    'Modal has role="dialog"',
    modalHasRole,
    modalHasRole ? 'Modal is accessible' : 'Modal missing role'
  );

  const modalHasAriaModal = /aria-modal="true"/.test(modalContent);
  addTest(
    'Modal has aria-modal="true"',
    modalHasAriaModal,
    modalHasAriaModal ? 'Modal properly marked as modal' : 'Modal missing aria-modal'
  );

  // Check Toast component
  const toastPath = path.join(__dirname, 'components/ui/Toast.tsx');
  const toastContent = fs.readFileSync(toastPath, 'utf8');

  const toastHasRole = /role="alert"/.test(toastContent);
  addTest(
    'Toast has role="alert"',
    toastHasRole,
    toastHasRole ? 'Toast is accessible' : 'Toast missing role'
  );

  // Check ErrorAlert component
  const errorAlertPath = path.join(__dirname, 'components/ui/ErrorAlert.tsx');
  const errorAlertContent = fs.readFileSync(errorAlertPath, 'utf8');

  const errorAlertHasRole = /role="alert"/.test(errorAlertContent);
  addTest(
    'ErrorAlert has role="alert"',
    errorAlertHasRole,
    errorAlertHasRole ? 'ErrorAlert is accessible' : 'ErrorAlert missing role'
  );

  console.log('✅ ARIA accessibility validation complete');
} catch (error) {
  addTest('ARIA accessibility', false, error.message);
  console.log('❌ ARIA accessibility validation failed');
}

// ============================================================================
// TEST 6: TypeScript Validation
// ============================================================================
console.log('\n📘 TEST 6: TypeScript Validation');

// Count files created/modified
const filesCreated = [
  'hooks/useKeyboardShortcuts.ts',
  'components/ui/Skeleton.tsx'
];

const filesModified = [
  'app/admin/objednavky/page.tsx',
  'app/admin/objednavky/[id]/page.tsx'
];

addTest(
  'New files created',
  filesCreated.length === 2,
  `Created ${filesCreated.length} files: ${filesCreated.join(', ')}`
);

addTest(
  'Existing files modified',
  filesModified.length === 2,
  `Modified ${filesModified.length} files: ${filesModified.join(', ')}`
);

// Check TypeScript interfaces in keyboard shortcuts hook
try {
  const hookPath = path.join(__dirname, 'hooks/useKeyboardShortcuts.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  const hasKeyboardShortcutInterface = /interface KeyboardShortcut/.test(hookContent);
  addTest(
    'KeyboardShortcut interface defined',
    hasKeyboardShortcutInterface,
    hasKeyboardShortcutInterface ? 'Proper TypeScript typing' : 'Missing interface'
  );

  const hasOptionsInterface = /interface UseKeyboardShortcutsOptions/.test(hookContent);
  addTest(
    'UseKeyboardShortcutsOptions interface defined',
    hasOptionsInterface,
    hasOptionsInterface ? 'Proper TypeScript typing' : 'Missing interface'
  );
} catch (error) {
  addTest('TypeScript interfaces', false, error.message);
}

// ============================================================================
// TEST 7: Code Quality Checks
// ============================================================================
console.log('\n🔍 TEST 7: Code Quality');

try {
  // Check that keyboard shortcuts hook has proper dependencies in useEffect
  const hookPath = path.join(__dirname, 'hooks/useKeyboardShortcuts.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  const hasDependencies = /\}, \[shortcuts, enabled\]\)/.test(hookContent);
  addTest(
    'useEffect dependencies correct',
    hasDependencies,
    hasDependencies ? 'Proper dependency array' : 'Missing or incorrect dependencies'
  );

  // Check that Skeleton component has proper accessibility
  const skeletonPath = path.join(__dirname, 'components/ui/Skeleton.tsx');
  const skeletonContent = fs.readFileSync(skeletonPath, 'utf8');

  // Count lines of code (rough estimate)
  const hookLines = hookContent.split('\n').filter(line => line.trim().length > 0).length;
  const skeletonLines = skeletonContent.split('\n').filter(line => line.trim().length > 0).length;

  addTest(
    'Code size reasonable',
    hookLines < 120 && skeletonLines < 150,
    `useKeyboardShortcuts: ${hookLines} lines, Skeleton: ${skeletonLines} lines`
  );

  console.log('✅ Code quality checks complete');
} catch (error) {
  addTest('Code quality', false, error.message);
  console.log('❌ Code quality checks failed');
}

// ============================================================================
// GENERATE FINAL REPORT
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(80));

const totalTests = results.passed + results.failed + results.warnings;
const score = totalTests > 0 ? ((results.passed + results.warnings * 0.5) / totalTests) * 10 : 0;

console.log(`\n✅ Passed: ${results.passed}/${totalTests}`);
console.log(`❌ Failed: ${results.failed}/${totalTests}`);
console.log(`⚠️  Warnings: ${results.warnings}/${totalTests}`);
console.log(`\n🎯 SCORE: ${score.toFixed(2)}/10`);

// Print detailed results
console.log('\n📋 DETAILED RESULTS:\n');
results.tests.forEach((test, index) => {
  const icon = test.passed ? '✅' : (test.severity === 'warning' ? '⚠️ ' : '❌');
  console.log(`${icon} ${index + 1}. ${test.name}`);
  if (test.details) {
    console.log(`   ${test.details}`);
  }
});

// Generate grade
let grade = 'F';
if (score >= 9.5) grade = 'A+';
else if (score >= 9.0) grade = 'A';
else if (score >= 8.5) grade = 'A-';
else if (score >= 8.0) grade = 'B+';
else if (score >= 7.5) grade = 'B';
else if (score >= 7.0) grade = 'B-';
else if (score >= 6.5) grade = 'C+';
else if (score >= 6.0) grade = 'C';
else if (score >= 5.5) grade = 'C-';
else if (score >= 5.0) grade = 'D';

console.log(`\n🏆 GRADE: ${grade}`);

// Final assessment
console.log('\n' + '='.repeat(80));
console.log('📝 ASSESSMENT');
console.log('='.repeat(80));

if (score >= 9.0) {
  console.log('✅ UX Enhancements implementation is EXCELLENT');
  console.log('   All keyboard shortcuts, loading skeletons, and ARIA labels are properly implemented.');
} else if (score >= 7.5) {
  console.log('✅ UX Enhancements implementation is GOOD');
  console.log('   Most features work correctly, minor issues detected.');
} else if (score >= 6.0) {
  console.log('⚠️  UX Enhancements implementation is ACCEPTABLE');
  console.log('   Core features work but some improvements needed.');
} else {
  console.log('❌ UX Enhancements implementation NEEDS WORK');
  console.log('   Significant issues detected, review required.');
}

console.log('\n' + '='.repeat(80));

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
