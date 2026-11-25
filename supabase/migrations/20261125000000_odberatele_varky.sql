-- =============================================================================
-- Odběratelé – várky (nová B2B stránka v adminu)
-- muzahair.cz / Supabase project bcbqrhkoosopmtrryrcy
-- =============================================================================
--
-- Čistě aditivní: jen nové sloupce s výchozí hodnotou. Žádný stávající řádek
-- se nemaže ani nepřepisuje.
--
-- b2b_partners.module rozlišuje starý komisní modul ('legacy' = archiv, výchozí
-- pro všechny dosavadní řádky) od nové stránky Odběratelé ('varky').
-- Díky výchozí hodnotě není potřeba na staré partnery sahat UPDATEm.
--
-- Tabulky zůstávají server-only (RLS zapnuté, žádná policy) – přístup jen přes
-- Prisma v /api/admin/*.
-- =============================================================================

ALTER TABLE public.b2b_partners
  ADD COLUMN IF NOT EXISTS "module"      TEXT NOT NULL DEFAULT 'legacy',  -- legacy | varky
  ADD COLUMN IF NOT EXISTS "openingDebt" DOUBLE PRECISION NOT NULL DEFAULT 0, -- Dluh z minula
  ADD COLUMN IF NOT EXISTS "debtFrom"    TIMESTAMP(3),                    -- Várky počítat od
  ADD COLUMN IF NOT EXISTS "sortOrder"   INTEGER NOT NULL DEFAULT 0;      -- pořadí záložek

ALTER TABLE public.b2b_items
  ADD COLUMN IF NOT EXISTS "keratinPerGram" DOUBLE PRECISION NOT NULL DEFAULT 0, -- keratinování Kč/g
  ADD COLUMN IF NOT EXISTS "nakladPerGram"  DOUBLE PRECISION,              -- interní náklad Kč/g (nikdy v PDF)
  ADD COLUMN IF NOT EXISTS "sortOrder"      INTEGER NOT NULL DEFAULT 0;    -- pořadí culíků ve várce

ALTER TABLE public.b2b_payments
  ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'platba';          -- platba | zaloha | doplatek

CREATE INDEX IF NOT EXISTS b2b_partners_module_idx ON public.b2b_partners ("module");
