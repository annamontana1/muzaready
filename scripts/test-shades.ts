/**
 * Acceptance tests for shade search (odstíny 1-10)
 */

import { searchProducts } from '../lib/product-search';
import { mockProducts } from '../lib/mock-products';
import { HAIR_COLORS } from '../types/product';

interface TestCase {
  query: string;
  expectedShades: number[];
  description: string;
}

const testCases: TestCase[] = [
  {
    query: '8',
    expectedShades: [8],
    description: 'Should find shade code 8 by number',
  },
  {
    query: 'světlá blond',
    expectedShades: [8],
    description: 'Should find shade 8 by Czech name',
  },
  {
    query: 'pískováš',
    expectedShades: [9],
    description: 'Should find shade 9 by synonym "písková"',
  },
  {
    query: 'platinová',
    expectedShades: [10],
    description: 'Should find shade 10 by "platinová"',
  },
  {
    query: 'platinum',
    expectedShades: [10],
    description: 'Should find shade 10 by EN synonym "platinum"',
  },
  {
    query: 'blond',
    expectedShades: [6, 7, 8, 9, 10],
    description: 'Should find all blond shades (6-10) by family',
  },
  {
    query: 'hnědá',
    expectedShades: [2, 3, 4, 5],
    description: 'Should find all brown shades (2-5) by family',
  },
  {
    query: 'champagne',
    expectedShades: [9],
    description: 'Should find shade 9 by EN synonym "champagne"',
  },
  {
    query: 'cerna',
    expectedShades: [1],
    description: 'Should handle "cerna" without diacritics',
  },
  {
    query: 'champagne blond',
    expectedShades: [6, 7, 8, 9, 10], // "blond" family + "champagne" synonym for 9
    description: 'Should find blond family (6-10) for "champagne blond"',
  },
];

console.log('🎨 Running Shade Search Acceptance Tests\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}/${testCases.length}: ${testCase.description}`);
  console.log(`Query: "${testCase.query}"`);

  const results = searchProducts(mockProducts, testCase.query, { limit: 1000 });

  console.log(`Found: ${results.totalCount} products`);
  console.log(`Parsed shade code: ${results.query.shadeCode || 'none'}`);
  console.log(`Parsed shades by name: [${results.query.shadesByName.join(', ')}]`);
  console.log(`Parsed shades by family: [${results.query.shadesByFamily.join(', ')}]`);

  // Get unique shades from results
  const foundShades = new Set<number>();
  results.products.forEach(product => {
    product.variants.forEach(variant => {
      foundShades.add(variant.shade);
    });
  });

  const foundShadesArray = Array.from(foundShades).sort((a, b) => a - b);
  console.log(`Found shades in results: [${foundShadesArray.join(', ')}]`);

  // Check if all expected shades are present
  const allExpectedFound = testCase.expectedShades.every(expectedShade =>
    foundShadesArray.includes(expectedShade)
  );

  // Check that we only found expected shades (no extra)
  const onlyExpectedFound = foundShadesArray.every(foundShade =>
    testCase.expectedShades.includes(foundShade)
  );

  const success = allExpectedFound && onlyExpectedFound && results.totalCount > 0;

  if (success) {
    console.log('✅ PASS');
    passed++;
  } else {
    console.log('❌ FAIL');
    failed++;
    if (!allExpectedFound) {
      const missing = testCase.expectedShades.filter(s => !foundShadesArray.includes(s));
      console.log(`  Missing shades: [${missing.join(', ')}]`);
    }
    if (!onlyExpectedFound) {
      const extra = foundShadesArray.filter(s => !testCase.expectedShades.includes(s));
      console.log(`  Extra shades: [${extra.join(', ')}]`);
    }
    if (results.totalCount === 0) {
      console.log(`  No products found!`);
    }

    // Show sample product names for debugging
    if (results.products.length > 0) {
      console.log(`  Sample products:`);
      results.products.slice(0, 3).forEach(p => {
        const shades = Array.from(new Set(p.variants.map(v => v.shade)));
        console.log(`    - ${p.name} (shades: ${shades.join(', ')})`);
      });
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

// Display HAIR_COLORS reference
console.log('\n📚 Reference: HAIR_COLORS');
Object.entries(HAIR_COLORS).forEach(([code, color]) => {
  console.log(`  ${code} - ${color.name}`);
  console.log(`     Synonyms: ${color.synonyms.slice(0, 3).join(', ')}...`);
});

if (failed === 0) {
  console.log('\n🎉 All shade tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed.');
  process.exit(1);
}
