import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const FAKTUROID_SLUG = 'annazvinchuk1';
const FAKTUROID_CLIENT_ID = process.env.FAKTUROID_CLIENT_ID || '';
const FAKTUROID_CLIENT_SECRET = process.env.FAKTUROID_CLIENT_SECRET || '';
const FAKTUROID_API_BASE = `https://app.fakturoid.cz/api/v3/accounts/${FAKTUROID_SLUG}`;
const FAKTUROID_TOKEN_URL = 'https://app.fakturoid.cz/api/v3/oauth/token';
const USER_AGENT = 'MuzaHair E-shop (muzahaircz@gmail.com)';

async function getToken() {
  const creds = Buffer.from(`${FAKTUROID_CLIENT_ID}:${FAKTUROID_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(FAKTUROID_TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': USER_AGENT },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });

    // Restore order in DB
    await prisma.order.update({
      where: { id: params.id },
      data: { orderStatus: 'pending', paymentStatus: 'unpaid', updatedAt: new Date() },
    });

    // Send proforma email via Fakturoid if invoice exists
    if (order.fakturoidInvoiceId && order.email) {
      try {
        const token = await getToken();
        await fetch(`${FAKTUROID_API_BASE}/invoices/${order.fakturoidInvoiceId}/deliver.json`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': USER_AGENT,
          },
          body: JSON.stringify({ email: order.email }),
        });
      } catch (emailErr) {
        console.error('Fakturoid deliver error (non-fatal):', emailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Objednávka obnovena a proforma odeslána na email ✓' });
  } catch (err: any) {
    console.error('restore order error:', err);
    return NextResponse.json({ error: err.message || 'Chyba' }, { status: 500 });
  }
}
