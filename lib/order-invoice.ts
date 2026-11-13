/**
 * Faktura a úhrada objednávky — jedno místo pro celý flow:
 *
 *   1. createFakturoidInvoiceForOrder — vystaví fakturu ve Fakturoidu z položek
 *      objednávky a pošle ji zákazníkovi.
 *   2. settleOrderPaid — zavolá se, když je objednávka zaplacená (odškrtnutí
 *      v adminu NEBO spárovaná platba z Fakturoidu). Zapíše úhradu do Fakturoidu
 *      a pošle zákazníkovi jedno potvrzení platby s odkazem na doklad.
 *
 * Prodávající je neplátce DPH — jediným zdrojem dokladů je Fakturoid.
 */
import prisma from '@/lib/prisma';
import {
  convertProformaToInvoice,
  createInvoiceFromOrder,
  getInvoice,
  isFakturoidConfigured,
  markInvoicePaid,
} from '@/lib/fakturoid';

/** Splatnost faktury při platbě převodem (dny). Po ní se objednávka stornuje. */
export const BANK_TRANSFER_DUE_DAYS = 3;

/** Objednávky bez e-mailu se ukládají na adresu prodejny — tam se doklady neposílají. */
export const STORE_EMAIL = 'prodejna@muzahair.cz';

export function customerEmailOf(order: { email?: string | null }): string | undefined {
  const email = (order.email || '').trim();
  if (!email || email.toLowerCase() === STORE_EMAIL) return undefined;
  return email;
}

function endingLabel(ending: string | null): string {
  switch (ending) {
    case 'KERATIN':        return 'Keratin';
    case 'MIKROKERATIN':   return 'Mikrokeratin';
    case 'PASKY_KERATINU': return 'Pásky keratinu';
    case 'WEFT':           return 'Weft (tresy)';
    case 'TAPES':          return 'Tapes / Nano tapes';
    default:               return '';
  }
}

const DELIVERY_LABELS: Record<string, string> = {
  zasilkovna: 'Zásilkovna',
  dpd: 'DPD',
  gls: 'GLS',
  ppl: 'PPL',
  ceska_posta: 'Česká pošta',
  osobni: 'Osobní odběr',
  personal: 'Osobní odběr',
  pickup: 'Osobní odběr',
};

export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

interface InvoiceLineSource {
  orderNumber: number;
  subtotal: number;
  total: number;
  discountAmount: number;
  items: Array<{
    nameSnapshot: string | null;
    grams: number;
    pricePerGram: number;
    lineTotal: number;
    ending: string | null;
    assemblyFeeCzk: number | null;
    assemblyFeeTotal: number | null;
    sku?: { name?: string | null; shadeName?: string | null } | null;
  }>;
}

/**
 * Řádky faktury z položek objednávky (bez dopravy — tu přidává createInvoiceFromOrder).
 * Součet řádků = mezisoučet objednávky − sleva, na korunu přesně.
 */
export function buildInvoiceLines(order: InvoiceLineSource): InvoiceLine[] {
  const items: { name: string; quantity: number; unitPrice: number; unit: string }[] = [];

  // lineTotal u prodejů z adminu zahrnuje i výrobu zakončení, u web objednávek ne.
  // Poznáme to podle toho, co sedí na mezisoučet objednávky.
  const sumLine = order.items.reduce((sum, i) => sum + i.lineTotal, 0);
  const sumFee = order.items.reduce((sum, i) => sum + (i.assemblyFeeTotal || 0), 0);
  const subtotal = Number(order.subtotal) || 0;
  const feeIncluded = Math.abs(sumLine - subtotal) <= Math.abs(sumLine + sumFee - subtotal);

  for (const item of order.items) {
    const baseName =
      item.nameSnapshot && item.nameSnapshot !== 'undefined'
        ? item.nameSnapshot
        : item.sku?.name || 'Vlasy k prodloužení';
    // POS položky už mají odstín v názvu („Luxe – #5 rovne 50cm“)
    const shadePart =
      item.sku?.shadeName && !baseName.includes('#') && !baseName.includes(item.sku.shadeName)
        ? ` — odstín ${item.sku.shadeName}`
        : '';
    const name = `${baseName}${shadePart}`.trim();

    const ending = endingLabel(item.ending);
    const feeTotal = ending ? item.assemblyFeeTotal || 0 : 0;
    const hairTotal = feeIncluded ? item.lineTotal - feeTotal : item.lineTotal;

    // Řádek „gramy × Kč/g“ jen když přesně sedí na uloženou částku (cena za gram
    // se ukládá jako celé číslo); jinak jedna položka za celkovou cenu.
    if (item.grams > 0 && item.grams * item.pricePerGram === hairTotal) {
      items.push({ name, quantity: item.grams, unitPrice: item.pricePerGram, unit: 'g' });
    } else {
      items.push({ name: `${name} — ${item.grams} g`, quantity: 1, unitPrice: hairTotal, unit: 'ks' });
    }

    if (feeTotal > 0) {
      const feePerGram = item.assemblyFeeCzk || 0;
      if (item.grams > 0 && item.grams * feePerGram === feeTotal) {
        items.push({ name: `Výroba — ${ending}`, quantity: item.grams, unitPrice: feePerGram, unit: 'g' });
      } else {
        items.push({ name: `Výroba — ${ending}`, quantity: 1, unitPrice: feeTotal, unit: 'ks' });
      }
    }
  }

  if (items.length === 0) {
    // Objednávka bez položek v DB — jedna souhrnná řádka
    items.push({
      name: `Objednávka č. ${order.orderNumber}`,
      quantity: 1,
      unitPrice: Number(order.subtotal) || Number(order.total),
      unit: 'ks',
    });
  }

  const discount = Number(order.discountAmount) || 0;
  if (discount > 0) {
    items.push({ name: 'Sleva', quantity: 1, unitPrice: -discount, unit: 'ks' });
  }

  return items;
}

export interface OrderInvoiceResult {
  success: boolean;
  invoiceId?: number;
  invoiceNumber?: string;
  invoiceUrl?: string;
  emailSent?: boolean;
  error?: string;
}

/**
 * Vystaví běžnou fakturu ve Fakturoidu z položek objednávky a uloží ji k objednávce.
 * Položky: gramáž × cena/g, výroba zakončení zvlášť, doprava, sleva.
 */
export async function createFakturoidInvoiceForOrder(
  orderId: string,
  opts: { sendEmail?: boolean; dueDays?: number } = {}
): Promise<OrderInvoiceResult> {
  if (!isFakturoidConfigured()) {
    return { success: false, error: 'Fakturoid není nakonfigurován' };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { sku: true } } },
  });
  if (!order) return { success: false, error: 'Objednávka nenalezena' };

  const items = buildInvoiceLines(order);

  const isPaid = order.paymentStatus === 'paid';
  const isTransfer = order.paymentMethod === 'bank_transfer';
  const deliveryLabel = DELIVERY_LABELS[order.deliveryMethod] || '';

  const result = await createInvoiceFromOrder({
    orderId: String(order.orderNumber),
    customerName:
      order.companyName || `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim() || 'Zákazník',
    customerEmail: customerEmailOf(order),
    customerPhone: order.phone ?? undefined,
    customerStreet: order.billingStreet || order.streetAddress || undefined,
    customerCity: order.billingCity || order.city || undefined,
    customerZip: order.billingZipCode || order.zipCode || undefined,
    customerIco: order.ico ?? undefined,
    customerDic: order.dic ?? undefined,
    items,
    shippingPrice: Number(order.shippingCost) || 0,
    shippingName: deliveryLabel ? `Doprava — ${deliveryLabel}` : 'Doprava',
    paymentMethod: order.paymentMethod ?? 'bank_transfer',
    isPaid,
    proforma: false, // vždy běžná faktura
    dueDays: opts.dueDays ?? (isTransfer && !isPaid ? BANK_TRANSFER_DUE_DAYS : undefined),
    sendEmail: opts.sendEmail,
  });

  if (result.success && result.invoiceId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        fakturoidInvoiceId: String(result.invoiceId),
        fakturoidIsProforma: false,
        fakturoidInvoiceUrl: result.invoiceUrl ?? null,
        fakturoidInvoiceNum: result.invoiceNumber ?? null,
      },
    });
  }

  return result;
}

export interface SettleResult {
  invoiceUrl?: string;
  invoiceNumber?: string;
  fakturoid: 'paid' | 'created' | 'skipped' | 'failed';
  emailSent: boolean;
  warning?: string;
}

/**
 * Objednávka je zaplacená → srovnat Fakturoid a poslat zákazníkovi potvrzení.
 *
 * Volat AŽ PO přepnutí paymentStatus na 'paid' (a jen při tom přepnutí —
 * volající ručí za to, že se nezavolá dvakrát).
 *
 * @param source 'admin' = odškrtnuto v adminu (úhradu je potřeba zapsat do Fakturoidu),
 *               'fakturoid' = platbu ohlásil Fakturoid (tam už zapsaná je).
 */
export async function settleOrderPaid(
  orderId: string,
  source: 'admin' | 'fakturoid'
): Promise<SettleResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { fakturoid: 'skipped', emailSent: false, warning: 'Objednávka nenalezena' };

  let invoiceUrl = order.fakturoidInvoiceUrl || undefined;
  let invoiceNumber = order.fakturoidInvoiceNum || undefined;
  let fakturoid: SettleResult['fakturoid'] = 'skipped';
  let warning: string | undefined;

  if (isFakturoidConfigured()) {
    try {
      if (order.fakturoidInvoiceId) {
        const docId = Number(order.fakturoidInvoiceId);

        if (order.fakturoidIsProforma) {
          // Starší objednávky se zálohovkou: úhrada zálohovky vystaví finální fakturu
          const converted = await convertProformaToInvoice(
            docId,
            source === 'admin' ? order.total : undefined
          );
          if (converted.success && converted.invoiceId && converted.invoiceId !== docId) {
            invoiceUrl = converted.invoiceUrl || invoiceUrl;
            invoiceNumber = converted.invoiceNumber || invoiceNumber;
            await prisma.order.update({
              where: { id: orderId },
              data: {
                fakturoidInvoiceId: String(converted.invoiceId),
                fakturoidIsProforma: false,
                fakturoidInvoiceUrl: invoiceUrl ?? null,
                fakturoidInvoiceNum: invoiceNumber ?? null,
              },
            });
            fakturoid = 'paid';
          } else {
            fakturoid = converted.success ? 'paid' : 'failed';
          }
        } else if (source === 'admin') {
          const paid = await markInvoicePaid(docId, order.paidAt ?? undefined);
          fakturoid = paid.success ? 'paid' : 'failed';
        } else {
          fakturoid = 'paid';
        }

        if (fakturoid === 'failed') {
          warning = 'Úhradu se nepodařilo zapsat do Fakturoidu — označte fakturu jako uhrazenou ručně.';
        }
      } else {
        // Objednávka ještě fakturu nemá (např. web + převod) → vystavit rovnou uhrazenou.
        // E-mail z Fakturoidu neposíláme, odkaz jde v potvrzení platby níže.
        const created = await createFakturoidInvoiceForOrder(orderId, { sendEmail: false });
        if (created.success) {
          invoiceUrl = created.invoiceUrl;
          invoiceNumber = created.invoiceNumber;
          fakturoid = 'created';
        } else {
          fakturoid = 'failed';
          warning = `Fakturu se nepodařilo vystavit (${created.error || 'neznámá chyba'}) — vytvořte ji v detailu objednávky.`;
        }
      }
    } catch (error: any) {
      console.error('settleOrderPaid Fakturoid error:', error);
      fakturoid = 'failed';
      warning = 'Chyba při komunikaci s Fakturoidem — zkontrolujte fakturu ručně.';
    }
  }

  // Jedno potvrzení platby s odkazem na doklad
  let emailSent = false;
  const email = customerEmailOf(order);
  if (email) {
    try {
      const { sendPaymentConfirmationEmail } = await import('@/lib/email');
      await sendPaymentConfirmationEmail(email, orderId, order.total, order.orderNumber, {
        invoiceUrl,
        invoiceNumber,
      });
      emailSent = true;
    } catch (error) {
      console.error('Payment confirmation email failed:', error);
    }
  }

  try {
    await prisma.orderHistory.create({
      data: {
        orderId,
        field: 'payment',
        oldValue: null,
        newValue: 'paid',
        changeType: 'payment_settled',
        note: [
          source === 'fakturoid' ? 'Platba spárována ve Fakturoidu' : 'Platba potvrzena v adminu',
          fakturoid === 'paid' ? `faktura ${invoiceNumber || ''} uhrazena` : '',
          fakturoid === 'created' ? `vystavena faktura ${invoiceNumber || ''}` : '',
          fakturoid === 'failed' ? 'Fakturoid: CHYBA' : '',
          emailSent ? `potvrzení odesláno na ${email}` : 'potvrzení e-mailem neodesláno (chybí e-mail)',
        ].filter(Boolean).join(' · '),
        changedBy: source === 'fakturoid' ? 'fakturoid' : 'admin',
      },
    });
  } catch (error) {
    console.error('Order history (payment_settled) failed:', error);
  }

  return { invoiceUrl, invoiceNumber, fakturoid, emailSent, warning };
}

/**
 * Ověří u Fakturoidu, že doklad opravdu existuje a je ve stavu, který webhook hlásí.
 * Webhook sám o sobě není důvěryhodný — pravdu má jen API.
 */
export async function verifyInvoiceStatus(
  invoiceId: number,
  expected: 'paid' | 'overdue'
): Promise<{ ok: boolean; invoice?: any }> {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) return { ok: false };
  return { ok: invoice.status === expected, invoice };
}
