import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * POST /api/invoices/generate — ZRUŠENO (410 Gone)
 *
 * Interní generátor PDF faktur počítal DPH 21 %. Prodávající je neplátce DPH,
 * takže takový doklad se vystavovat nesmí. Jediným zdrojem dokladů je Fakturoid:
 *   POST /api/admin/orders/[id]/resend-invoice  (lib/order-invoice.ts)
 *
 * Staré řádky v tabulce `invoices` zůstávají beze změny.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Interní generátor faktur byl zrušen (počítal DPH, prodávající je neplátce). ' +
        'Fakturu vystavte ve Fakturoidu — detail objednávky, záložka „Faktura“.',
      replacement: '/api/admin/orders/[id]/resend-invoice',
    },
    { status: 410 }
  );
}
