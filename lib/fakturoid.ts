/**
 * Fakturoid API v3 Client
 * OAuth 2 Client Credentials Flow
 * Docs: https://www.fakturoid.cz/api/v3
 */

const FAKTUROID_SLUG = 'annazvinchuk1';
const FAKTUROID_CLIENT_ID = process.env.FAKTUROID_CLIENT_ID || '';
const FAKTUROID_CLIENT_SECRET = process.env.FAKTUROID_CLIENT_SECRET || '';
const FAKTUROID_API_BASE = `https://app.fakturoid.cz/api/v3/accounts/${FAKTUROID_SLUG}`;
const FAKTUROID_TOKEN_URL = 'https://app.fakturoid.cz/api/v3/oauth/token';
const USER_AGENT = 'MuzaHair E-shop (muzahaircz@gmail.com)';

// Token cache
let cachedToken: { access_token: string; expires_at: number } | null = null;

/**
 * Get OAuth 2 access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken.access_token;
  }

  const credentials = Buffer.from(`${FAKTUROID_CLIENT_ID}:${FAKTUROID_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(FAKTUROID_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Fakturoid token error:', response.status, text);
    throw new Error(`Fakturoid auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 7200) * 1000,
  };

  return cachedToken.access_token;
}

/**
 * Make authenticated API request to Fakturoid
 */
async function fakturoidFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`${FAKTUROID_API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': USER_AGENT,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Fakturoid API error [${options.method || 'GET'} ${path}]:`, response.status, text);
    throw new Error(`Fakturoid API error: ${response.status} - ${text.substring(0, 200)}`);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// ============================================================================
// Contacts (Zákazníci)
// ============================================================================

export interface FakturoidContact {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
  registration_no?: string; // IČO
  vat_no?: string; // DIČ
}

/**
 * Find contact by email
 */
export async function findContactByEmail(email: string): Promise<FakturoidContact | null> {
  try {
    const contacts = await fakturoidFetch(`/subjects/search.json?query=${encodeURIComponent(email)}`);
    if (contacts && contacts.length > 0) {
      return contacts[0];
    }
    return null;
  } catch (error) {
    console.error('Fakturoid find contact error:', error);
    return null;
  }
}

/**
 * Create a new contact in Fakturoid
 */
export async function createContact(contact: FakturoidContact): Promise<FakturoidContact | null> {
  try {
    return await fakturoidFetch('/subjects.json', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  } catch (error) {
    console.error('Fakturoid create contact error:', error);
    return null;
  }
}

/**
 * Find or create contact — returns Fakturoid subject ID
 */
export async function findOrCreateContact(contact: FakturoidContact): Promise<number | null> {
  if (contact.email) {
    const existing = await findContactByEmail(contact.email);
    if (existing?.id) return existing.id;
  }

  const created = await createContact(contact);
  return created?.id || null;
}

// ============================================================================
// Invoices (Faktury)
// ============================================================================

export interface FakturoidInvoiceLine {
  name: string;
  quantity: number;
  unit_name?: string;
  unit_price: number;
  vat_rate?: number;
}

export interface FakturoidInvoice {
  subject_id: number;
  order_number?: string;
  note?: string;
  payment_method?: string; // 'bank' | 'cash' | 'cod' | 'card' | 'paypal'
  currency?: string;
  lines: FakturoidInvoiceLine[];
  due?: number; // days until due
  proforma?: boolean; // create as proforma invoice
}

/**
 * Create an invoice in Fakturoid
 */
export async function createInvoice(invoice: FakturoidInvoice): Promise<any> {
  try {
    const { proforma, ...invoiceData } = invoice;
    const endpoint = proforma ? '/invoices.json' : '/invoices.json';
    // Fakturoid v3: use document_type to distinguish
    const body = proforma
      ? { ...invoiceData, document_type: 'proforma' }
      : invoiceData;
    return await fakturoidFetch('/invoices.json', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Fakturoid create invoice error:', error);
    return null;
  }
}

/**
 * Mark invoice as paid
 */
export async function markInvoicePaid(invoiceId: number): Promise<void> {
  try {
    await fakturoidFetch(`/invoices/${invoiceId}/fire.json`, {
      method: 'POST',
      body: JSON.stringify({ event: 'pay' }),
    });
  } catch (error) {
    console.error('Fakturoid mark paid error:', error);
  }
}

/**
 * Send invoice by email
 */
export async function sendInvoiceByEmail(invoiceId: number): Promise<void> {
  try {
    await fakturoidFetch(`/invoices/${invoiceId}/deliver.json`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Fakturoid send email error:', error);
  }
}

// ============================================================================
// Helper: Create invoice from e-shop order
// ============================================================================

export interface OrderForInvoice {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerStreet?: string;
  customerCity?: string;
  customerZip?: string;
  customerCountry?: string;
  customerIco?: string;
  customerDic?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number; // CZK
    unit?: string; // "g", "ks"
  }>;
  shippingPrice?: number;
  shippingName?: string;
  paymentMethod?: string;
  isPaid?: boolean;
  proforma?: boolean; // create proforma (zálohová faktura) instead of regular invoice
}

/**
 * Create invoice from e-shop order
 * 1. Find or create contact
 * 2. Create invoice with line items
 * 3. Optionally mark as paid and send email
 */
export async function createInvoiceFromOrder(order: OrderForInvoice): Promise<{
  success: boolean;
  invoiceId?: number;
  invoiceNumber?: string;
  error?: string;
}> {
  try {
    if (!FAKTUROID_CLIENT_ID || !FAKTUROID_CLIENT_SECRET) {
      return { success: false, error: 'Fakturoid není nakonfigurován' };
    }

    // 1. Find or create contact
    const subjectId = await findOrCreateContact({
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      street: order.customerStreet,
      city: order.customerCity,
      zip: order.customerZip,
      country: order.customerCountry || 'CZ',
      registration_no: order.customerIco,
      vat_no: order.customerDic,
    });

    if (!subjectId) {
      return { success: false, error: 'Nepodařilo se vytvořit kontakt ve Fakturoid' };
    }

    // 2. Build invoice lines (neplátce DPH = 0%)
    const lines: FakturoidInvoiceLine[] = order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit_name: item.unit || 'ks',
      unit_price: item.unitPrice,
      vat_rate: 0,
    }));

    // Add shipping if present
    if (order.shippingPrice && order.shippingPrice > 0) {
      lines.push({
        name: order.shippingName || 'Doprava',
        quantity: 1,
        unit_name: 'ks',
        unit_price: order.shippingPrice,
        vat_rate: 0,
      });
    }

    // 3. Create invoice (proforma or regular)
    const invoice = await createInvoice({
      subject_id: subjectId,
      order_number: order.orderId,
      payment_method: order.paymentMethod === 'gopay' ? 'card' : 'bank',
      currency: 'CZK',
      due: 14,
      lines,
      proforma: order.proforma || false,
    });

    if (!invoice?.id) {
      return { success: false, error: 'Nepodařilo se vytvořit fakturu' };
    }

    // 4. Mark as paid if already paid (e.g. card payment)
    if (order.isPaid) {
      await markInvoicePaid(invoice.id);
    }

    // 5. Send invoice email via Resend (Fakturoid deliver endpoint unreliable)
    try {
      const { Resend } = await import('resend');
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && order.customerEmail) {
        const resend = new Resend(resendKey);
        const invoiceUrl = `https://app.fakturoid.cz/${FAKTUROID_SLUG}/p/${invoice.token}/${invoice.number}`;
        const isProforma = order.proforma;
        await resend.emails.send({
          from: 'Mùza Hair <faktury@mail.muzahair.cz>',
          to: order.customerEmail,
          subject: `${isProforma ? 'Proforma faktura' : 'Faktura'} ${invoice.number} — Mùza Hair`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #722F37; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 22px;">💎 Mùza Hair</h1>
                <p style="margin: 8px 0 0; opacity: 0.9;">${isProforma ? 'Proforma faktura' : 'Faktura'} za vaši objednávku</p>
              </div>
              <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
                <p>Dobrý den,</p>
                <p>${isProforma ? 'vystavili jsme pro vás proforma fakturu' : 'vystavili jsme pro vás fakturu'} <strong>${invoice.number}</strong>.</p>
                <div style="background: #f9f5f3; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
                  <p style="margin: 0 0 12px; font-size: 14px; color: #666;">Celková částka k úhradě:</p>
                  <p style="margin: 0; font-size: 28px; font-weight: bold; color: #722F37;">${order.items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0).toLocaleString('cs-CZ')} Kč</p>
                </div>
                <p style="text-align: center;">
                  <a href="${invoiceUrl}" style="display: inline-block; padding: 14px 32px; background: #722F37; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    📄 Zobrazit ${isProforma ? 'proformu' : 'fakturu'}
                  </a>
                </p>
                ${isProforma ? '<p style="color: #666; font-size: 13px;">Po zaplacení vám vystavíme daňový doklad.</p>' : ''}
                <p>Děkujeme za váš nákup!</p>
                <p style="color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">Mùza Hair · Praha · www.muzahair.cz</p>
              </div>
            </div>
          `,
        });
        console.log('Invoice email sent via Resend to', order.customerEmail);
      }
    } catch (emailError) {
      console.error('Resend invoice email error (non-blocking):', emailError);
    }

    return {
      success: true,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
    };
  } catch (error: any) {
    console.error('Fakturoid createInvoiceFromOrder error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if Fakturoid is configured
 */
export function isFakturoidConfigured(): boolean {
  return !!(FAKTUROID_CLIENT_ID && FAKTUROID_CLIENT_SECRET);
}
