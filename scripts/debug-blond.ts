import { mockProducts } from '../lib/mock-products';
import { searchProducts } from '../lib/product-search';

console.log('Testing "blond" query\n');

// Check products with shades 6-10
[6, 7, 8, 9, 10].forEach(shade => {
  const products = mockProducts.filter(p => p.variants.some(v => v.shade === shade));
  console.log(`Shade ${shade}: ${products.length} products`);
});

console.log('\nSearching for "blond"...\n');

const result = searchProducts(mockProducts, 'blond', { limit: 1000 });

console.log(`Total found: ${result.totalCount}`);
console.log(`Query parsed:`, {
  shadeCode: result.query.shadeCode,
  shadesByName: result.query.shadesByName,
  shadesByFamily: result.query.shadesByFamily,
  cleanedQuery: result.query.cleanedQuery,
});

const shades = new Set<number>();
result.products.forEach(p => p.variants.forEach(v => shades.add(v.shade)));

console.log(`Shades found in results: [${Array.from(shades).sort((a,b) => a-b).join(', ')}]`);

console.log('\nProduct breakdown by shade in results:');
[6, 7, 8, 9, 10].forEach(shade => {
  const count = result.products.filter(p => p.variants.some(v => v.shade === shade)).length;
  console.log(`  Shade ${shade}: ${count} products`);
});
