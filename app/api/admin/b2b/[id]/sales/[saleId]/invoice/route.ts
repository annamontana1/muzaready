import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/b2b/[id]/sales/[saleId]/invoice
 * Zpětné vygenerování Fakturoid faktury pro existující B2B prodej.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; saleId: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id, saleId } = await params;

    if (!isFakturoidConfigured()) {
      return NextResponse.json({ error: 'Fakturoid není nakonfigurován (chybí API klíče)' }, { status: 500 });
    }

    const sale = await prisma.b2bSale.findUnique({
      where: { id: saleId },
      include: { items: { include: { b2bItem: true } }, partner: true },
    });

    if (!sale || sale.partnerId !== id) {
      return NextResponse.json({ error: 'Prodej nenalezen' }, { status: 404 });
    }

    const result = await createInvoiceFromOrder({
      orderId: sale.id,
      customerName: sale.partner.name,
      customerEmail: sale.partner.email || undefined,
      customerIco: sale.partner.ico || undefined,
      items: sale.items.map((si) => ({
        name: `${si.b2bItem.druh} ${si.b2bItem.barva} ${si.b2bItem.delkaCm} cm`,
        quantity: 1,
        unitPrice: si.amount,
        unit: 'ks',
      })),
      paymentMethod: 'bank_transfer',
      isPaid: false,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Chyba při vytváření faktury' }, { status: 500 });
    }

    // Uložit fakturoid ID a číslo faktury
    await prisma.b2bSale.update({
      where: { id: saleId },
      data: {
        fakturoidId: String(result.invoiceId),
        invoiceNumber: result.invoiceNumber || null,
        invoiceType: 'fakturoid',
      },
    });

    // Záznam do historie
    await prisma.b2bEvent.create({
      data: {
        partnerId: id,
        type: 'invoice_generated',
        description: `Faktura ${result.invoiceNumber || ''} vygenerována zpětně pro prodej ze dne ${new Date(sale.saleDate).toLocaleDateString('cs-CZ')}`,
        data: JSON.stringify({ saleId, invoiceId: result.invoiceId, invoiceNumber: result.invoiceNumber }),
        createdBy: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      invoiceNumber: result.invoiceNumber,
      invoiceId: result.invoiceId,
      message: `Faktura ${result.invoiceNumber || ''} byla vytvořena${sale.partner.email ? ` a odeslána na ${sale.partner.email}` : ''}`,
    });
  } catch (error: any) {
    console.error('B2B invoice generate error:', error);
    return NextResponse.json({ error: error.message || 'Chyba při generování faktury' }, { status: 500 });
  }
}
