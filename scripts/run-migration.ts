import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Starting invoice migration...');

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'prisma', 'invoice-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolon and filter out comments and empty lines
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n⚙️  Executing statement ${i + 1}/${statements.length}...`);

      try {
        await prisma.$executeRawUnsafe(statement + ';');
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists') || error.message.includes('IF NOT EXISTS')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Verifying tables...');

    // Verify invoices table exists
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'invoices'
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log('✅ Invoice table created successfully');
    } else {
      console.log('❌ Invoice table not found');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
