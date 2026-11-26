-- Odběratel, jehož prodeje se počítají v Objednávkách (tržby a marže tam).
-- V Odběratelích zůstává jen kvůli evidenci dluhu a splátek – do marže
-- odběratelů ani do součtu B2B plateb na dashboardu se nepočítá.
-- Čistě aditivní sloupec s výchozí hodnotou false.
ALTER TABLE public.b2b_partners
  ADD COLUMN IF NOT EXISTS "vObjednavkach" BOOLEAN NOT NULL DEFAULT false;
