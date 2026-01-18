import fs from 'fs';
import path from 'path';

const filesToFix = [
  'app/api/admin/stock/movements/route.ts',
  'app/api/reset-admin/route.ts',
  'app/api/list-admins/route.ts',
  'app/api/admin/stock/sell/route.ts',
  'app/api/admin/stock/check-low-stock/route.ts',
  'app/api/admin/skus/route.ts',
  'app/api/admin/seo/generate/route.ts',
  'app/api/admin/reviews/route.ts',
  'app/api/admin/redirects/route.ts',
  'app/api/admin/login-test/route.ts',
  'app/api/admin/faq/route.ts',
  'app/api/admin/debug-login/route.ts',
  'app/api/admin/coupons/route.ts',
  'app/api/admin/content/route.ts',
  'app/api/reviews/route.ts',
  'app/api/orders/lookup/route.ts',
  'app/api/admin/scan-sku/route.ts',
  'app/api/admin/orders/route.ts',
];

let fixedCount = 0;
let alreadyHadCount = 0;

for (const file of filesToFix) {
  const fullPath = path.join(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${file} - NOT FOUND`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');

  // Check if already has dynamic export
  if (content.includes("export const dynamic = 'force-dynamic'") ||
      content.includes('export const dynamic = "force-dynamic"')) {
    console.log(`✅ ${file} - already has dynamic export`);
    alreadyHadCount++;
    continue;
  }

  // Find where to insert (after runtime export or after imports)
  const runtimeMatch = content.match(/export const runtime = ['"]nodejs['"];?\n/);

  if (runtimeMatch && runtimeMatch.index !== undefined) {
    // Insert after runtime export
    const insertPos = runtimeMatch.index + runtimeMatch[0].length;
    content = content.slice(0, insertPos) + "export const dynamic = 'force-dynamic';\n" + content.slice(insertPos);
    console.log(`🔧 ${file} - added dynamic export after runtime`);
  } else {
    // Find last import and insert after it
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, '', "export const dynamic = 'force-dynamic';");
      content = lines.join('\n');
      console.log(`🔧 ${file} - added dynamic export after imports`);
    } else {
      // Insert at the very top
      content = "export const dynamic = 'force-dynamic';\n\n" + content;
      console.log(`🔧 ${file} - added dynamic export at top`);
    }
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  fixedCount++;
}

console.log(`\n✅ Fixed: ${fixedCount} files`);
console.log(`✅ Already had: ${alreadyHadCount} files`);
console.log(`📝 Total: ${fixedCount + alreadyHadCount} files processed`);
