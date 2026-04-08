import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Hezký název zakončení pro fakturu */
function endingLabel(ending: string | null): string {
  switch (ending) {
    case 'MICRO_KERATIN':    return 'Mikrokeratin';
    case 'STANDARD_KERATIN': return 'Standart keratin';
    case 'PASKY_KERATINU':   return 'Pásky keratinu';
    case 'WEFT':             return 'Weft (tresy)';
    case 'TAPES':            return 'Tapes / Nano tapes';
    default:                 return '';
  }
}

/**
 * POST /api/admin/orders/[id]/resend-invoice
 * Vytvoří fakturu ve Fakturoid s položkami gramáž + cena/g
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { sku: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    if (!isFakturoidConfigured()) {
      return NextResponse.json({ error: 'Fakturoid není nakonfigurován' }, { status: 500 });
    }

    // ── Sestavení položek faktury ──────────────────────────────────────────
    const invoiceItems: { name: string; quantity: number; unitPrice: number; unit: string }[] = [];

    if (order.items.length > 0) {
      for (const item of order.items) {
        // Název: nameSnapshot nebo sku.name, doplníme odstín
        const baseName =
          (item.nameSnapshot && item.nameSnapshot !== 'undefined')
            ? item.nameSnapshot
            : item.sku?.name || 'Vlasy k prodloužení';

        const shadePart = item.sku?.shadeName
          ? ` — odstín ${item.sku.shadeName}`
          : '';

        const ending = endingLabel(item.ending);

        const itemName = `${baseName}${shadePart}`.trim();

        // Vlasy: quantity = gramy, unit = g, unitPrice = cena/g
        invoiceItems.push({
          name: itemName,
          quantity: item.grams,
          unitPrice: Number(item.pricePerGram) || 0,
          unit: 'g',
        });

        // Výroba zakončení jako samostatná položka (pokud je)
        if (ending && item.assemblyFeeTotal && Number(item.assemblyFeeTotal) > 0) {
          invoiceItems.push({
            name: `Výroba — ${ending}`,
            quantity: item.grams,
            unitPrice: Number(item.assemblyFeeCzk) || 0,
            unit: 'g',
          });
        }
      }
    } else {
      // Fallback — žádné položky v DB
      invoiceItems.push({
        name: `Objednávka č. ${order.orderNumber}`,
        quantity: 1,
        unitPrice: Number(order.total),
        unit: 'ks',
      });
    }

    const isInstagram = order.channel === 'instagram';

    const result = await createInvoiceFromOrder({
      orderId: String(order.orderNumber), // číslo objednávky, ne UUID
      customerName: `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim() || 'Zákazník',
      customerEmail: order.email ?? undefined,
      customerPhone: order.phone ?? undefined,
      customerStreet: order.streetAddress ?? undefined,
      customerCity: order.city ?? undefined,
      customerZip: order.zipCode ?? undefined,
      items: invoiceItems,
      shippingPrice: Number(order.shippingCost) || 0,
      shippingName: 'Doprava',
      paymentMethod: order.paymentMethod ?? 'bank_transfer',
      isPaid: order.paymentStatus === 'paid',
      proforma: isInstagram,
    });

    if (result.success) {
      await prisma.order.update({
        where: { id },
        data: {
          fakturoidInvoiceId: result.invoiceId ? String(result.invoiceId) : undefined,
          fakturoidIsProforma: isInstagram,
          fakturoidInvoiceUrl: result.invoiceUrl ?? undefined,
          fakturoidInvoiceNum: result.invoiceNumber ?? undefined,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Faktura ${result.invoiceNumber || ''} byla vytvořena a odeslána na ${order.email}`,
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
        invoiceUrl: result.invoiceUrl,
      });
    } else {
      return NextResponse.json({ error: result.error || 'Nepodařilo se vytvořit fakturu' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Resend invoice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
