-- =============================================================================
-- Customers (CRM) — zákazníci zadaní v adminu (Instagram, showroom, telefon)
-- muzahair.cz / Supabase project bcbqrhkoosopmtrryrcy
-- =============================================================================
--
-- Proč: dosud se zákazníci odvozovali jen z e-mailů v objednávkách. Klient bez
-- e-mailu (typicky z Instagramu) se uložil na prodejna@muzahair.cz a nešel
-- dohledat. Tabulka drží kontakt i bez e-mailu a objednávky se na ni vážou.
--
-- Čistě aditivní: nová tabulka + nový nullable sloupec orders."customerId".
-- Stávající řádky objednávek se nemění.
-- SERVER-ONLY tabulka: RLS zapnuté, žádná anon policy. Přístup jen přes Prisma
-- (role postgres) — Supabase role (anon, authenticated, service_role) na ni
-- práva nemají, viz lib/customers.ts.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "firstName"       TEXT NOT NULL DEFAULT '',
  "lastName"        TEXT NOT NULL DEFAULT '',
  email             TEXT,
  phone             TEXT,
  "instagramHandle" TEXT,
  "companyName"     TEXT,
  ico               TEXT,
  dic               TEXT,
  street            TEXT,
  city              TEXT,
  "zipCode"         TEXT,
  country           TEXT NOT NULL DEFAULT 'CZ',
  note              TEXT,
  source            TEXT NOT NULL DEFAULT 'admin', -- instagram | store | web | admin
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- E-mail a IG jméno se ukládají malými písmeny (viz lib/customers.ts)
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_key
  ON public.customers (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS customers_instagram_idx
  ON public.customers ("instagramHandle") WHERE "instagramHandle" IS NOT NULL;
CREATE INDEX IF NOT EXISTS customers_phone_idx
  ON public.customers (phone) WHERE phone IS NOT NULL;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS "customerId" TEXT
  REFERENCES public.customers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS orders_customer_id_idx
  ON public.orders ("customerId") WHERE "customerId" IS NOT NULL;
