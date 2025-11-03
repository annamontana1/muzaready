/**
 * Acceptance tests for product search
 */

import { searchProducts } from '../lib/product-search';
import { mockProducts } from '../lib/mock-products';

interface TestCase {
  query: string;
  expectedCondition: (results: ReturnType<typeof searchProducts>) => boolean;
  description: string;
}

const testCases: TestCase[] = [
  {
    query: 'standard',
    description: 'Should return products with tier=standard',
    expectedCondition: (results) => {
      return results.products.every(p => p.tier_normalized === 'standard') &&
             results.totalCount > 0;
    },
  },
  {
    query: 'standart', // typo
    description: 'Should handle "standart" typo as synonym for "standard"',
    expectedCondition: (results) => {
      return results.products.every(p => p.tier_normalized === 'standard') &&
             results.totalCount > 0;
    },
  },
  {
    query: 'luxe 50 cm rovne',
    description: 'Should return luxe products with length=50cm and structure=rovné',
    expectedCondition: (results) => {
      return results.products.every(p => {
        const hasLuxe = p.tier_normalized === 'luxe';
        const has50cm = p.variants.some(v => v.length_cm === 50);
        const hasRovne = p.variants.some(v => v.structure === 'rovné');
        return hasLuxe && has50cm && hasRovne;
      }) && results.totalCount > 0;
    },
  },
  {
    query: 'platinum',
    description: 'Should return products with tier=platinum',
    expectedCondition: (results) => {
      return results.products.every(p => p.tier_normalized === 'platinum') &&
             results.totalCount > 0;
    },
  },
  {
    query: 'platinum edition 60',
    description: 'Should return platinum products with length=60cm',
    expectedCondition: (results) => {
      return results.products.every(p => {
        const hasPlatinum = p.tier_normalized === 'platinum';
        const has60cm = p.variants.some(v => v.length_cm === 60);
        return hasPlatinum && has60cm;
      }) && results.totalCount > 0;
    },
  },
  {
    query: 'lux', // synonym
    description: 'Should handle "lux" as synonym for "luxe"',
    expectedCondition: (results) => {
      return results.products.every(p => p.tier_normalized === 'luxe') &&
             results.totalCount > 0;
    },
  },
];

console.log('🧪 Running Product Search Acceptance Tests\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}/${testCases.length}: ${testCase.description}`);
  console.log(`Query: "${testCase.query}"`);

  const results = searchProducts(mockProducts, testCase.query);

  console.log(`Found: ${results.totalCount} products`);
  console.log(`Parsed tier: ${results.query.tier || 'none'}`);
  console.log(`Parsed length: ${results.query.length || 'none'}`);
  console.log(`Parsed structure: ${results.query.structure || 'none'}`);

  const success = testCase.expectedCondition(results);

  if (success) {
    console.log('✅ PASS');
    passed++;
  } else {
    console.log('❌ FAIL');
    failed++;
    if (results.products.length > 0) {
      console.log(`Sample product: ${results.products[0].name}`);
      console.log(`  Tier: ${results.products[0].tier_normalized}`);
      console.log(`  Variants: ${results.products[0].variants.length}`);
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed.');
  process.exit(1);
}
