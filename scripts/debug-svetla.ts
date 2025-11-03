import { mockProducts } from '../lib/mock-products';
import { searchProducts } from '../lib/product-search';
import { HAIR_COLORS } from '../types/product';

console.log('Testing "světlá blond" query\n');

// Check which shade names contain "světlá"
console.log('Shade names containing "světlá":');
Object.entries(HAIR_COLORS).forEach(([code, color]) => {
  const normalized = color.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('svetla')) {
    console.log(`  Shade ${code}: ${color.name}`);
  }
});

console.log('\nSearching for "světlá blond"...\n');

const result = searchProducts(mockProducts, 'světlá blond', { limit: 1000 });

console.log(`Total found: ${result.totalCount}`);
console.log(`Query parsed:`, {
  shadeCode: result.query.shadeCode,
  shadesByName: result.query.shadesByName,
  shadesByFamily: result.query.shadesByFamily,
  cleanedQuery: result.query.cleanedQuery,
});

const shades = new Set<number>();
result.products.forEach(p => p.variants.forEach(v => shades.add(v.shade)));

console.log(`Shades found: [${Array.from(shades).sort((a,b) => a-b).join(', ')}]`);

console.log('\nProduct breakdown by shade:');
[6, 7, 8, 9, 10].forEach(shade => {
  const count = result.products.filter(p => p.variants.some(v => v.shade === shade)).length;
  if (count > 0) {
    console.log(`  Shade ${shade}: ${count} products`);
  }
});
