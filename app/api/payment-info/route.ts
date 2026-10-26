import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Platební údaje pro převod hned po objednávce (platí se vždy předem).
// Účet se zadává v adminu (Nastavení); záložně z proměnných pro faktury.
export async function GET() {
  let account: string | null = null;
  let iban: string | null = null;
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'main' }, select: { bankAccount: true, bankIban: true } });
    account = s?.bankAccount?.trim() || null;
    iban = s?.bankIban?.trim() || null;
  } catch {
    // bez nastavení vrátíme jen zálohu z proměnných
  }
  account = account || process.env.INVOICE_BANK_ACCOUNT || null;
  iban = iban || process.env.INVOICE_IBAN || null;
  return NextResponse.json({ account, iban });
}
