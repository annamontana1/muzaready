import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/nahled/[id]
 * Veřejný endpoint — vrátí data dokladu/faktury bez autentizace.
 * ID je CUID (kryptograficky náhodný) → bezpečné sdílet.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || id.length < 10) {
    return NextResponse.json({ error: 'Neplatné ID' }, { status: 400 });
  }

  // Zkusit najít Order
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { sku: { select: { shade: true, structure: true } } } },
    },
  }).catch(() => null);

  if (order) {
    return NextResponse.json({
      type: 'order',
      id: order.id,
      createdAt: order.createdAt,
      firstName: order.firstName,
      lastName: order.lastName,
      companyName: order.companyName,
      ico: order.ico,
      email: order.email !== 'prodejna@muzahair.cz' ? order.email : null,
      phone: order.phone,
      paymentMethod: order.paymentMethod,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discountAmount: Number(order.discountAmount),
      channel: order.channel,
      items: order.items.map((item) => ({
        id: item.id,
        nameSnapshot: item.nameSnapshot,
        grams: item.grams,
        pricePerGram: Number(item.pricePerGram),
        lineTotal: Number(item.lineTotal),
        ending: item.ending,
        assemblyFeeTotal: Number(item.assemblyFeeTotal || 0),
      })),
    });
  }

  // Zkusit najít B2bSale
  const sale = await prisma.b2bSale.findUnique({
    where: { id },
    include: {
      partner: { select: { name: true, ico: true, email: true, address: true } },
      items: { include: { b2bItem: true } },
    },
  }).catch(() => null);

  if (sale) {
    return NextResponse.json({
      type: 'b2b_sale',
      id: sale.id,
      createdAt: sale.saleDate,
      partnerName: sale.partner.name,
      partnerIco: sale.partner.ico,
      partnerEmail: sale.partner.email,
      partnerAddress: sale.partner.address,
      totalAmount: Number(sale.totalAmount),
      invoiceType: sale.invoiceType,
      invoiceNumber: sale.invoiceNumber,
      notes: sale.notes,
      items: sale.items.map((si) => ({
        id: si.id,
        druh: si.b2bItem.druh,
        barva: si.b2bItem.barva,
        delkaCm: si.b2bItem.delkaCm,
        gramaz: si.b2bItem.gramaz,
        amount: Number(si.amount),
      })),
    });
  }

  return NextResponse.json({ error: 'Doklad nenalezen' }, { status: 404 });
}
