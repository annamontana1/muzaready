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
    const { dueDateIso } = await request.json(); // e.g. "2026-04-15"
    if (!dueDateIso) return NextResponse.json({ error: 'Chybí datum splatnosti' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    if (!order.fakturoidInvoiceId) return NextResponse.json({ error: 'Objednávka nemá proformu ve Fakturoidu' }, { status: 400 });

    const token = await getToken();

    // Update due_on in Fakturoid
    const fakRes = await fetch(`${FAKTUROID_API_BASE}/invoices/${order.fakturoidInvoiceId}.json`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({ due_on: dueDateIso }),
    });

    if (!fakRes.ok) {
      const text = await fakRes.text();
      console.error('Fakturoid extend error:', fakRes.status, text);
      return NextResponse.json({ error: `Fakturoid: ${fakRes.status} ${text}` }, { status: 500 });
    }

    // Restore order status
    await prisma.order.update({
      where: { id: params.id },
      data: { orderStatus: 'pending', paymentStatus: 'unpaid', updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: `Splatnost prodloužena do ${dueDateIso}` });
  } catch (err: any) {
    console.error('extend-proforma error:', err);
    return NextResponse.json({ error: err.message || 'Chyba' }, { status: 500 });
  }
}
