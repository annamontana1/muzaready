-- GoPay Payment ID Migration
-- Run this in Supabase SQL Editor to add gopayPaymentId column to orders table

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "gopayPaymentId" TEXT;

-- Index for fast lookup by GoPay payment ID (used in webhook)
CREATE INDEX IF NOT EXISTS "orders_gopayPaymentId_idx" ON "orders"("gopayPaymentId");
