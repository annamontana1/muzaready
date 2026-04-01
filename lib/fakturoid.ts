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
 * Convert proforma to final invoice in Fakturoid
 */
export async function convertProformaToInvoice(proformaId: number): Promise<{ success: boolean; invoiceId?: number; invoiceNumber?: string; invoiceUrl?: string }> {
  try {
    // Fire "invoice" event on proforma to convert it
    await fakturoidFetch(`/invoices/${proformaId}/fire.json`, {
      method: 'POST',
      body: JSON.stringify({ event: 'invoice' }),
    });

    // After conversion, get the new invoice details
    const invoice = await fakturoidFetch(`/invoices/${proformaId}.json`);
    return {
      success: true,
      invoiceId: invoice?.id,
      invoiceNumber: invoice?.number,
      invoiceUrl: invoice?.public_html_url,
    };
  } catch (error) {
    console.error('Fakturoid convertProformaToInvoice error:', error);
    return { success: false };
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

/**
 * Cancel invoice in Fakturoid (storno)
 * Works for unpaid invoices. For paid invoices, creates a credit note.
 */
export async function cancelInvoice(invoiceId: number): Promise<{ success: boolean; message?: string }> {
  // Step 1: try direct cancel (works for unpaid invoices)
  try {
    await fakturoidFetch(`/invoices/${invoiceId}/cancel.json`, { method: 'POST' });
    return { success: true, message: 'Faktura stornována ve Fakturoidu' };
  } catch (firstError: any) {
    // Step 2: invoice might be paid — try undepay first, then cancel
    try {
      await fakturoidFetch(`/invoices/${invoiceId}/fire.json?event=undepay`, { method: 'POST' });
      await fakturoidFetch(`/invoices/${invoiceId}/cancel.json`, { method: 'POST' });
      return { success: true, message: 'Platba odznačena a faktura stornována ve Fakturoidu' };
    } catch (secondError: any) {
      console.error('Fakturoid cancelInvoice error:', secondError);
      return {
        success: false,
        message: 'Fakturu nelze stornovat. Stornujte ji ručně ve Fakturoidu.',
      };
    }
  }
}

// ============================================================================
// Helper: Create invoice from e-shop order
// ============================================================================

export interface OrderForInvoice {
  orderId: string;
  customerName: string;
  customerEmail?: string; // volitelné — faktura se vytvoří i bez emailu, jen se neodešle
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
  invoiceUrl?: string;
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
      due: order.proforma ? 3 : 14,
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

    // 5. Send invoice/proforma email via Fakturoid (includes QR code)
    if (order.customerEmail) {
      try {
        await fakturoidFetch(`/invoices/${invoice.id}/deliver.json`, {
          method: 'POST',
        });
        console.log('Fakturoid email delivered for invoice', invoice.id);
      } catch (deliverError) {
        console.error('Fakturoid deliver error (non-blocking):', deliverError);
      }
    }

    return {
      success: true,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      invoiceUrl: invoice.public_html_url,
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
