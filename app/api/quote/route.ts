import { NextRequest, NextResponse } from 'next/server';
import { quoteCartLines } from '@/lib/stock';
import { isWholesaleSession, WHOLESALE_DISCOUNT_PERCENT } from '@/lib/session-user';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lines } = body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: 'Chybí pole "lines" se SKU položkami' },
        { status: 400 }
      );
    }

    // Velkoobchodní sleva podle přihlášeného účtu (ne podle toho, co pošle prohlížeč)
    const wholesale = await isWholesaleSession();
    const quote = await quoteCartLines(lines, { wholesaleDiscountPercent: wholesale ? WHOLESALE_DISCOUNT_PERCENT : 0 });

    return NextResponse.json(quote, { status: 200 });
  } catch (error: any) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: error.message || 'Chyba při kalkulaci ceny' },
      { status: 400 }
    );
  }
}