-- Invoice Migration SQL
-- Run this in Supabase SQL Editor to create Invoice table and add billing fields to Order

-- 1. Add new columns to Order table for billing
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "companyName" TEXT,
  ADD COLUMN IF NOT EXISTS "ico" TEXT,
  ADD COLUMN IF NOT EXISTS "dic" TEXT,
  ADD COLUMN IF NOT EXISTS "billingStreet" TEXT,
  ADD COLUMN IF NOT EXISTS "billingCity" TEXT,
  ADD COLUMN IF NOT EXISTS "billingZipCode" TEXT,
  ADD COLUMN IF NOT EXISTS "billingCountry" TEXT;

-- 2. Create Invoice table
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "invoiceNumber" TEXT NOT NULL UNIQUE,
  "orderId" TEXT NOT NULL UNIQUE,

  -- Supplier info
  "supplierName" TEXT NOT NULL DEFAULT 'Mùza Hair s.r.o.',
  "supplierStreet" TEXT,
  "supplierCity" TEXT,
  "supplierZipCode" TEXT,
  "supplierCountry" TEXT NOT NULL DEFAULT 'CZ',
  "supplierIco" TEXT,
  "supplierDic" TEXT,
  "supplierEmail" TEXT,
  "supplierPhone" TEXT,

  -- Customer info
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT,
  "customerStreet" TEXT NOT NULL,
  "customerCity" TEXT NOT NULL,
  "customerZipCode" TEXT NOT NULL,
  "customerCountry" TEXT NOT NULL,
  "customerIco" TEXT,
  "customerDic" TEXT,

  -- Amounts
  "subtotal" DOUBLE PRECISION NOT NULL,
  "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 21.0,
  "vatAmount" DOUBLE PRECISION NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,

  -- Payment info
  "paymentMethod" TEXT,
  "variableSymbol" TEXT,
  "bankAccount" TEXT,
  "iban" TEXT,
  "swift" TEXT,

  -- Dates
  "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueDate" TIMESTAMP(3),
  "taxDate" TIMESTAMP(3),
  "paidDate" TIMESTAMP(3),

  -- Status
  "status" TEXT NOT NULL DEFAULT 'draft',

  -- PDF
  "pdfUrl" TEXT,
  "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,

  -- Timestamps
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key
  CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Create index on invoiceNumber for fast lookups
CREATE INDEX IF NOT EXISTS "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- 4. Create index on orderId for joins
CREATE INDEX IF NOT EXISTS "invoices_orderId_idx" ON "invoices"("orderId");

-- 5. Update trigger for updatedAt
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_invoices_updated_at_trigger
BEFORE UPDATE ON "invoices"
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();
