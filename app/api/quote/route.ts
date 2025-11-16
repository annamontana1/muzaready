import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { quoteCartLines } from '@/lib/stock';
import { prisma } from '@/lib/prisma';
import { priceCalculator } from '@/lib/price-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lines, isB2B } = body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: 'Chybí pole "lines" se SKU položkami' },
        { status: 400 }
      );
    }

    // Use the quoteCartLines function
    const quote = await quoteCartLines(lines);

    // Apply B2B discount if applicable
    let discountedQuote: any = quote;
    if (isB2B && typeof quote.total === 'number') {
      const discountPercent = priceCalculator.getB2BDiscountPercent();
      const discountedTotal = priceCalculator.applyB2BDiscount(quote.total, true);

      discountedQuote = {
        ...quote,
        total: discountedTotal,
        discount_percent: discountPercent,
      };

      if (quote.items && Array.isArray(quote.items)) {
        discountedQuote.items = quote.items.map((item: any) => ({
          ...item,
          original_lineGrandTotal: item.lineGrandTotal,
          lineGrandTotal: priceCalculator.applyB2BDiscount(item.lineGrandTotal, true),
        }));
      }
    }

    return NextResponse.json(discountedQuote, { status: 200 });
  } catch (error: any) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: error.message || 'Chyba při kalkulaci ceny' },
      { status: 400 }
    );
  }
}
