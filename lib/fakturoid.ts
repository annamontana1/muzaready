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
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ grant_type: 'client_credentials' }),
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
    // Fakturoid v3: GET /subjects/search.json?query= (hledá ve jménu, e-mailu, IČO…)
    const wanted = email.trim().toLowerCase();
    const contacts = await fakturoidFetch(`/subjects/search.json?query=${encodeURIComponent(wanted)}`);
    if (!Array.isArray(contacts)) return null;
    // Fulltext vrací i částečné shody — fakturu smí dostat jen kontakt s přesně tímto e-mailem
    return contacts.find((c: any) => (c?.email || '').trim().toLowerCase() === wanted) || null;
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
  custom_id?: string; // naše ID objednávky (pro dohledání)
}

/**
 * Create an invoice in Fakturoid
 */
export async function createInvoice(invoice: FakturoidInvoice): Promise<any> {
  try {
    const { proforma, ...invoiceData } = invoice;
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
 * Convert proforma to final invoice in Fakturoid.
 * Fakturoid v3: when a proforma payment is recorded via POST /payments.json,
 * Fakturoid auto-creates the final invoice and sets proforma.related_id to its ID.
 * No fire event needed — just fetch the proforma and read related_id.
 */
export async function convertProformaToInvoice(proformaId: number, paidAmount?: number, currency?: string): Promise<{ success: boolean; invoiceId?: number; invoiceNumber?: string; invoiceUrl?: string }> {
  try {
    // If a paid amount is provided, record the payment first (this triggers auto-creation of the invoice)
    if (paidAmount !== undefined) {
      await fakturoidFetch(`/invoices/${proformaId}/payments.json`, {
        method: 'POST',
        body: JSON.stringify({ amount: String(paidAmount), currency: currency || 'CZK' }),
      });
    }

    // Fakturoid auto-creates the invoice when proforma is paid; read related_id
    const proforma = await fakturoidFetch(`/invoices/${proformaId}.json`);
    const relatedId = proforma?.related_id;

    if (relatedId) {
      const invoice = await fakturoidFetch(`/invoices/${relatedId}.json`);
      return {
        success: true,
        invoiceId: invoice?.id,
        invoiceNumber: invoice?.number,
        invoiceUrl: invoice?.public_html_url,
      };
    }

    // Proforma is paid but auto-invoice not yet generated; return proforma itself
    return {
      success: true,
      invoiceId: proforma?.id,
      invoiceNumber: proforma?.number,
      invoiceUrl: proforma?.public_html_url,
    };
  } catch (error) {
    console.error('Fakturoid convertProformaToInvoice error:', error);
    return { success: false };
  }
}

/**
 * Mark invoice as paid
 */
export async function markInvoicePaid(
  invoiceId: number,
  paidOn?: Date
): Promise<{ success: boolean; alreadyPaid?: boolean; error?: string }> {
  try {
    // Fakturoid v3: úhrada se zapisuje přes /payments.json (event "pay" už neexistuje).
    // Bez `amount` se uhradí celý zbytek. Děkovný e-mail neposíláme z Fakturoidu —
    // potvrzení platby odchází z e-shopu (jeden e-mail, ať je platba zapsaná odkudkoli).
    await fakturoidFetch(`/invoices/${invoiceId}/payments.json`, {
      method: 'POST',
      body: JSON.stringify({
        paid_on: (paidOn || new Date()).toISOString().split('T')[0],
        send_thank_you_email: false,
      }),
    });
    return { success: true };
  } catch (error: any) {
    const message = String(error?.message || error);
    // 403 „Payment cannot be added to already paid invoice“ = už je uhrazeno (např. spárováno bankou)
    if (/already paid/i.test(message)) return { success: true, alreadyPaid: true };
    console.error('Fakturoid mark paid error:', error);
    return { success: false, error: message };
  }
}

/**
 * Načte doklad z Fakturoidu (stav, číslo, veřejný odkaz).
 */
export async function getInvoice(invoiceId: number): Promise<any | null> {
  try {
    return await fakturoidFetch(`/invoices/${invoiceId}.json`);
  } catch (error) {
    console.error('Fakturoid get invoice error:', error);
    return null;
  }
}

/**
 * Send invoice by email
 */
export async function sendInvoiceByEmail(invoiceId: number, email?: string): Promise<boolean> {
  try {
    // Fakturoid v3: POST /invoices/{id}/message.json (jen placené tarify).
    // Předmět a text se berou z nastavení účtu; deliver_now obejde odesílací okno.
    await fakturoidFetch(`/invoices/${invoiceId}/message.json`, {
      method: 'POST',
      body: JSON.stringify({ ...(email ? { email } : {}), deliver_now: true }),
    });
    return true;
  } catch (error) {
    console.error('Fakturoid send email error:', error);
    return false;
  }
}

export async function updateInvoiceDueDate(invoiceId: number, dueDateIso: string): Promise<void> {
  await fakturoidFetch(`/invoices/${invoiceId}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ due_on: dueDateIso }),
  });
}

/**
 * Cancel invoice in Fakturoid (storno)
 * Works for unpaid invoices. For paid invoices, removes payment first then cancels.
 */
export async function cancelInvoice(invoiceId: number): Promise<{ success: boolean; message?: string }> {
  // Step 1: try direct cancel via fire event (works for unpaid invoices in v3)
  try {
    await fakturoidFetch(`/invoices/${invoiceId}/fire.json?event=cancel`, { method: 'POST' });
    return { success: true, message: 'Faktura stornována ve Fakturoidu' };
  } catch (firstError: any) {
    // Step 2: invoice might be paid — remove payment(s) first, then cancel
    try {
      // Get all payments on this invoice
      const payments = await fakturoidFetch(`/invoices/${invoiceId}/payments.json`);
      if (Array.isArray(payments) && payments.length > 0) {
        for (const payment of payments) {
          await fakturoidFetch(`/invoices/${invoiceId}/payments/${payment.id}.json`, {
            method: 'DELETE',
          });
        }
      }
      // Now cancel
      await fakturoidFetch(`/invoices/${invoiceId}/fire.json?event=cancel`, { method: 'POST' });
      return { success: true, message: 'Platba odstraněna a faktura stornována ve Fakturoidu' };
    } catch (secondError: any) {
      console.error('Fakturoid cancelInvoice error:', secondError);
      return {
        success: false,
        message: 'Fakturu nelze stornovat automaticky. Stornujte ji ručně ve Fakturoidu.',
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
  dueDays?: number; // splatnost ve dnech (výchozí: zálohovka 3, faktura 14)
  sendEmail?: boolean; // false = fakturu jen vytvořit, neposílat (výchozí true)
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
  emailSent?: boolean; // true = Fakturoid odeslal doklad zákazníkovi e-mailem
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
      due: order.dueDays ?? (order.proforma ? 3 : 14),
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

    // 5. Send invoice/proforma email via Fakturoid
    let emailSent = false;
    if (order.customerEmail && order.sendEmail !== false) {
      emailSent = await sendInvoiceByEmail(invoice.id, order.customerEmail);
      if (emailSent) {
        console.log(`✅ Fakturoid email sent for invoice ${invoice.id} (${invoice.number})`);
      } else {
        console.error(`❌ Fakturoid email FAILED for invoice ${invoice.id} (${invoice.number})`);
      }
    }

    return {
      success: true,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      invoiceUrl: invoice.public_html_url,
      emailSent,
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
