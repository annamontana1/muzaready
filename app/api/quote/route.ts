import { NextRequest, NextResponse } from 'next/server';
import { quoteCartLines } from '@/lib/stock';

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

    // Use the quoteCartLines function
    const quote = await quoteCartLines(lines);

    return NextResponse.json(quote, { status: 200 });
  } catch (error: any) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: error.message || 'Chyba při kalkulaci ceny' },
      { status: 400 }
    );
  }
}
