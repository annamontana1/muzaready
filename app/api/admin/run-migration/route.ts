import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/run-migration
 * Run Invoice table migration
 *
 * IMPORTANT: This is a one-time migration endpoint
 * Delete this file after successful migration
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    console.log('🚀 Starting invoice migration...');

    // 1. Add billing columns to Order table
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Order"
        ADD COLUMN IF NOT EXISTS "companyName" TEXT,
        ADD COLUMN IF NOT EXISTS "ico" TEXT,
        ADD COLUMN IF NOT EXISTS "dic" TEXT,
        ADD COLUMN IF NOT EXISTS "billingStreet" TEXT,
        ADD COLUMN IF NOT EXISTS "billingCity" TEXT,
        ADD COLUMN IF NOT EXISTS "billingZipCode" TEXT,
        ADD COLUMN IF NOT EXISTS "billingCountry" TEXT;
    `);
    console.log('✅ Order table updated');

    // 2. Create Invoice table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "invoices" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "invoiceNumber" TEXT NOT NULL UNIQUE,
        "orderId" TEXT NOT NULL UNIQUE,

        "supplierName" TEXT NOT NULL DEFAULT 'Mùza Hair s.r.o.',
        "supplierStreet" TEXT,
        "supplierCity" TEXT,
        "supplierZipCode" TEXT,
        "supplierCountry" TEXT NOT NULL DEFAULT 'CZ',
        "supplierIco" TEXT,
        "supplierDic" TEXT,
        "supplierEmail" TEXT,
        "supplierPhone" TEXT,

        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT,
        "customerStreet" TEXT NOT NULL,
        "customerCity" TEXT NOT NULL,
        "customerZipCode" TEXT NOT NULL,
        "customerCountry" TEXT NOT NULL,
        "customerIco" TEXT,
        "customerDic" TEXT,

        "subtotal" DOUBLE PRECISION NOT NULL,
        "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 21.0,
        "vatAmount" DOUBLE PRECISION NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,

        "paymentMethod" TEXT,
        "variableSymbol" TEXT,
        "bankAccount" TEXT,
        "iban" TEXT,
        "swift" TEXT,

        "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "dueDate" TIMESTAMP(3),
        "taxDate" TIMESTAMP(3),
        "paidDate" TIMESTAMP(3),

        "status" TEXT NOT NULL DEFAULT 'draft',

        "pdfUrl" TEXT,
        "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,

        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log('✅ Invoice table created');

    // 3. Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "invoices_orderId_idx" ON "invoices"("orderId");
    `);
    console.log('✅ Indexes created');

    // 4. Create update trigger
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_invoices_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS update_invoices_updated_at_trigger ON "invoices";
      CREATE TRIGGER update_invoices_updated_at_trigger
      BEFORE UPDATE ON "invoices"
      FOR EACH ROW
      EXECUTE FUNCTION update_invoices_updated_at();
    `);
    console.log('✅ Trigger created');

    // Verify
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'invoices'
    `;

    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Migration completed successfully! Invoice table and billing fields created.',
        steps: [
          '✅ Added billing columns to Order table',
          '✅ Created Invoice table',
          '✅ Created indexes',
          '✅ Created update trigger',
        ],
      });
    } else {
      throw new Error('Invoice table verification failed');
    }

  } catch (error: any) {
    console.error('Migration error:', error);

    // Check if error is "already exists"
    if (error.message && (error.message.includes('already exists') || error.message.includes('duplicate'))) {
      return NextResponse.json({
        success: true,
        message: 'Migration already completed (tables already exist)',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
