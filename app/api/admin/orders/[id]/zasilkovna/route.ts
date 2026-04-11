import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getPacketLabel } from '@/lib/zasilkovna';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders/[id]/zasilkovna?barcode=XXXXX
 * Returns PDF štítek pro tisk z Zásilkovny
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const barcode = request.nextUrl.searchParams.get('barcode');
  const packetId = request.nextUrl.searchParams.get('packetId');

  if (!barcode && !packetId) {
    return NextResponse.json({ error: 'barcode nebo packetId je povinný' }, { status: 400 });
  }

  // barcode je obvykle "Z1234567890" — potřebujeme číselnou část
  const id = packetId
    ? parseInt(packetId, 10)
    : parseInt((barcode || '').replace(/\D/g, ''), 10);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Neplatné ID zásilky' }, { status: 400 });
  }

  const pdfBuffer = await getPacketLabel(id);

  if (!pdfBuffer) {
    return NextResponse.json({ error: 'Nepodařilo se načíst štítek ze Zásilkovny' }, { status: 502 });
  }

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="stitek-${barcode || id}.pdf"`,
    },
  });
}
