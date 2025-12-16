# 🚀 Quick Start Guide - Dokončení E-shopu

**Čas k dokončení: 8 hodin (1 pracovní den)**

---

## 🎯 TL;DR - Co potřebuješ udělat

### KRITICKÉ (8 hodin):
1. **Customer Order Tracking stránka** (4h) - zákazníci potřebují vidět své objednávky
2. **Otestovat Order Confirmation Email** (1h) - ověřit, že funguje
3. **Low Stock Email Alerts** (3h) - dostat upozornění, když dochází zboží

**Po těchto 8 hodinách: E-SHOP JE READY! 🎉**

---

## ✅ CO JE HOTOVO

Dobré zprávy! **80-90% je hotovo**:

### Backend (100% ✅)
- ✅ **Stock management:** Automatické odečítání zásob při platbě (GoPay + ruční)
- ✅ **Email functions:** Všechny email funkce v `/lib/email.ts`
  - `sendOrderConfirmationEmail` ✅
  - `sendPaymentConfirmationEmail` ✅
  - `sendShippingNotificationEmail` ✅
  - `sendDeliveryConfirmationEmail` ✅
  - `sendOrderCancellationEmail` ✅
  - `sendPaymentReminderEmail` ✅
  - `sendLowStockAlertEmail` ❌ (potřeba vytvořit)
- ✅ **Invoice generation:** Automatické při zaplacení
- ✅ **Refund handling:** Vrácení zásob při refundu/zrušení
- ✅ **Order lookup API:** `/api/orders/lookup` (pro customer tracking)
- ✅ **Admin panel:** Kompletní správa objednávek
- ✅ **Stock validation:** Kontrola dostupnosti při checkoutu

### Frontend (70% ✅)
- ✅ Admin dashboard s low stock alerts
- ✅ Order management UI
- ❌ **Customer order tracking page** (CHYBÍ - potřeba vytvořit)

---

## 🔴 CO CHYBÍ (8 hodin práce)

### 1. Customer Order Tracking Page (4h) ⚠️ NEJVYŠŠÍ PRIORITA

**Soubor:** `/app/sledovani-objednavky/page.tsx` (NOVÝ)

**Co vytvoř:**

```tsx
'use client';

import { useState } from 'react';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Objednávka nenalezena');
        setOrder(null);
        return;
      }

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError('Chyba při vyhledávání objednávky');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sledování objednávky</h1>

        {/* Form */}
        <form onSubmit={handleLookup} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                placeholder="vas@email.cz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID objednávky
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                placeholder="abc123..."
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B1538] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#6B1028] disabled:opacity-50"
            >
              {loading ? 'Hledám...' : 'Vyhledat objednávku'}
            </button>
          </div>
        </form>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Detail objednávky</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Stav objednávky</p>
                  <p className="font-medium">{getOrderStatusLabel(order.orderStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platba</p>
                  <p className="font-medium">{getPaymentStatusLabel(order.paymentStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doručení</p>
                  <p className="font-medium">{getDeliveryStatusLabel(order.deliveryStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Celková cena</p>
                  <p className="font-medium">{order.total.toLocaleString('cs-CZ')} Kč</p>
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Sledovací číslo</p>
                <p className="text-lg font-mono text-blue-700">{order.trackingNumber}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-3">Objednané položky</h3>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between border-b border-gray-200 pb-2">
                    <div>
                      <p className="font-medium">{item.skuName}</p>
                      <p className="text-sm text-gray-600">
                        {item.saleMode === 'BULK_G' ? `${item.grams}g` : '1 ks'}
                      </p>
                    </div>
                    <p className="font-medium">{item.lineGrandTotal.toLocaleString('cs-CZ')} Kč</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getOrderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Čeká na zpracování',
    processing: 'Zpracovává se',
    completed: 'Dokončeno',
    cancelled: 'Zrušeno',
    shipped: 'Odesláno',
  };
  return labels[status] || status;
}

function getPaymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    unpaid: 'Nezaplaceno',
    paid: 'Zaplaceno',
    partial: 'Částečně zaplaceno',
    refunded: 'Vráceno',
  };
  return labels[status] || status;
}

function getDeliveryStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Čeká na odeslání',
    shipped: 'Odesláno',
    delivered: 'Doručeno',
    returned: 'Vráceno',
  };
  return labels[status] || status;
}
```

**Co ještě upravit:**
- Přidat odkaz do všech emailů: `https://muzahair.cz/sledovani-objednavky?id=${orderId}&email=${email}`
- Při URL parametrech předvyplnit formulář

---

### 2. Otestovat Order Confirmation Email (1h)

**Zkontroluj:**
1. Je `RESEND_API_KEY` v prostředí?
   ```bash
   # Vercel dashboard → Settings → Environment Variables
   # Nebo local .env.local
   ```

2. Vytvoř testovací objednávku a zkontroluj email

3. Přidej odkaz na tracking do emailu:
   - **Soubor:** `/lib/email.ts` - řádky 78-79
   - Přidat:
     ```html
     <p><a href="https://muzahair.cz/sledovani-objednavky?id=${orderId}&email=${email}" style="color: #8B1538; font-weight: bold;">Sledovat objednávku →</a></p>
     ```

---

### 3. Low Stock Email Alerts (3h)

**Krok 1: Email funkce** (`/lib/email.ts`)

Přidej na konec souboru:

```typescript
export const sendLowStockAlertEmail = async (
  lowStockSkus: Array<{
    sku: string;
    name: string | null;
    availableGrams: number | null;
    saleMode: string;
  }>
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured');
    return;
  }

  try {
    const skuListHtml = lowStockSkus
      .map((sku) => {
        const stock = sku.saleMode === 'BULK_G' && sku.availableGrams !== null
          ? `${sku.availableGrams}g`
          : 'Vyprodáno';
        return `<li><strong>${sku.sku}</strong> ${sku.name ? `(${sku.name})` : ''}: ${stock}</li>`;
      })
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            ul { background: white; padding: 20px; border-radius: 5px; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Upozornění na nízké zásoby</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Následující SKU mají nízké zásoby nebo jsou vyprodané:</p>
              <ul>
                ${skuListHtml}
              </ul>
              <p><strong>Akce:</strong> Přejdi do <a href="https://muzahair.cz/admin/sklad" style="color: #8B1538;">správy skladu</a> pro doplnění zásob.</p>
              <div class="footer">
                <p>Tento email byl odeslán automaticky.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'sklad@muzahair.cz',
      to: 'objednavky@muzahair.cz', // Admin email
      subject: `⚠️ Low Stock Alert - ${lowStockSkus.length} SKU`,
      html,
    });

    console.log('Low stock alert email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending low stock alert email:', error);
    throw error;
  }
};
```

**Krok 2: Cron endpoint** (`/app/api/cron/check-low-stock/route.ts`)

Vytvoř nový soubor:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendLowStockAlertEmail } from '@/lib/email';
export const runtime = 'nodejs';

const LOW_STOCK_THRESHOLD = 100; // grams
const RATE_LIMIT_HOURS = 4; // Don't send more than once per 4 hours

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel sets this automatically)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find low stock SKUs
    const lowStockSkus = await prisma.sku.findMany({
      where: {
        OR: [
          { inStock: false },
          {
            AND: [
              { saleMode: 'BULK_G' },
              { availableGrams: { lt: LOW_STOCK_THRESHOLD } },
            ],
          },
        ],
      },
      select: {
        sku: true,
        name: true,
        availableGrams: true,
        saleMode: true,
      },
    });

    if (lowStockSkus.length === 0) {
      return NextResponse.json({ message: 'No low stock items' }, { status: 200 });
    }

    // Send email alert
    await sendLowStockAlertEmail(lowStockSkus);

    return NextResponse.json(
      {
        message: `Low stock alert sent for ${lowStockSkus.length} SKUs`,
        skus: lowStockSkus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking low stock:', error);
    return NextResponse.json(
      { error: 'Failed to check low stock' },
      { status: 500 }
    );
  }
}
```

**Krok 3: Vercel Cron Setup**

Vytvoř/uprav soubor `vercel.json` v root:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-low-stock",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

**Krok 4: Nastavit CRON_SECRET**

V Vercel dashboard → Settings → Environment Variables:
- Key: `CRON_SECRET`
- Value: (vygeneruj random string, např: `low-stock-cron-secret-xyz123`)

---

## 🎉 HOTOVO!

Po dokončení těchto 3 úkolů máš **plně funkční e-shop**:

✅ Zákazníci vidí své objednávky
✅ Dostávají emaily po každé změně
✅ Admin dostává upozornění na low stock
✅ Zásoby se automaticky odečítají
✅ Faktury se automaticky generují
✅ Refundy vrací zásoby

---

## 🧪 TESTING CHECKLIST

### Test 1: Order Creation Flow
1. Vytvoř objednávku na webu
2. ✅ Zkontroluj, že přišel **order confirmation email**
3. ✅ Email obsahuje **odkaz na sledování objednávky**
4. ✅ Klikni na odkaz a zkontroluj, že stránka funguje

### Test 2: Payment Flow
1. V admin panelu označ objednávku jako "paid"
2. ✅ Zkontroluj, že přišel **payment confirmation email**
3. ✅ Zkontroluj, že se vytvořila **faktura**
4. ✅ Zkontroluj, že se **odečetly zásoby**

### Test 3: Shipping Flow
1. V admin panelu vytvoř shipment
2. ✅ Zkontroluj, že přišel **shipping notification email**

### Test 4: Low Stock Alert
1. Nastav SKU na low stock (< 100g)
2. Ručně zavolej `/api/cron/check-low-stock`
3. ✅ Zkontroluj, že přišel **low stock alert email**

---

## 📝 DALŠÍ KROKY (VOLITELNÉ)

Po spuštění můžeš postupně doplnit:

1. **Payment Reminder Emails** (2h)
   - Automatická připomínka po 3 dnech nezaplacení

2. **Auto-cancel Unpaid Orders** (1.5h)
   - Automatické zrušení po 7 dnech nezaplacení

3. **Shipping Integration** (10h)
   - DPD / Česká pošta API
   - Automatické tracking čísla

4. **Advanced Analytics** (8h)
   - Grafy, reporty, export

---

**Hodně štěstí! Máš to skoro hotovo! 🚀**
