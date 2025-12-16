# 📧 Analýza emailového systému - Múza Hair E-shop

**Datum analýzy:** 2025-12-16
**Cíl:** Identifikovat chybějící email notifikace a doplnit kompletní automatizaci

---

## ✅ CO JE IMPLEMENTOVÁNO

### 📚 Definované email funkce v `/lib/email.ts`

Všechny níže uvedené funkce jsou **implementované a připravené k použití**:

1. **`sendOrderConfirmationEmail`** (řádek 6-125)
   - Email zákazníkovi po vytvoření objednávky
   - Obsahuje: číslo objednávky, položky, celková cena

2. **`sendPaymentConfirmationEmail`** (řádek 127-194)
   - Email zákazníkovi po úspěšném zaplacení
   - Potvrzuje přijatou platbu + částku

3. **`sendShippingNotificationEmail`** (řádek 196-261)
   - Email zákazníkovi při odeslání balíčku
   - Může obsahovat tracking číslo

4. **`sendAdminOrderNotificationEmail`** (řádek 263-361)
   - Email **ADMINOVI** o nové objednávce
   - Obsahuje: číslo objednávky, email zákazníka, položky, odkaz do admin panelu

5. **`sendDeliveryConfirmationEmail`** (řádek 363-428)
   - Email zákazníkovi při doručení balíčku

6. **`sendOrderCancellationEmail`** (řádek 430-497)
   - Email zákazníkovi při zrušení objednávky
   - Obsahuje důvod + informaci o vrácení platby

7. **`sendPaymentReminderEmail`** (řádek 499-570)
   - Připomínka nezaplacené objednávky
   - Pro automatický reminder system

8. **`sendInvoiceEmail`** (řádek 575-670)
   - Email s PDF fakturou jako přílohou

---

## ✅ CO JE ZAVOLANÉ (implementované toky)

### 1. **Vytvoření objednávky** → `/app/api/orders/route.ts` (řádek 193-205)
✅ **IMPLEMENTOVÁNO**
```typescript
// POST /api/orders
sendOrderConfirmationEmail(order.email, order.id, emailItems, order.total)
```

### 2. **Potvrzení platby** → `/app/api/gopay/notify/route.ts` (řádek 184-191)
✅ **IMPLEMENTOVÁNO**
```typescript
// GoPay webhook po úspěšné platbě
sendPaymentConfirmationEmail(result.email, orderId, result.total)
```

### 3. **Automatické generování faktury** → `/app/api/gopay/notify/route.ts` (řádek 317-320)
✅ **IMPLEMENTOVÁNO**
```typescript
// Po úspěšné platbě - automaticky
sendInvoiceEmail(result.email, invoiceNumber, pdfBase64)
```

### 4. **Manuální generování faktury** → `/app/api/invoices/generate/route.ts` (řádek 183-188)
✅ **IMPLEMENTOVÁNO**
```typescript
// Admin manuálně generuje fakturu
sendInvoiceEmail(order.email, invoiceNumber, pdfBase64)
```

### 5. **Manuální označení jako zaplaceno** → `/app/api/admin/orders/[id]/route.ts` (řádek 488-495)
✅ **IMPLEMENTOVÁNO**
```typescript
// Admin označí objednávku jako zaplacenou
sendPaymentConfirmationEmail(updatedOrder.email, id, updatedOrder.total)
```

### 6. **Změna statusu na "shipped"** → `/app/api/orders/[id]/route.ts` (řádek 108-117)
✅ **IMPLEMENTOVÁNO**
```typescript
// Admin označí objednávku jako odeslanou
sendShippingNotificationEmail(currentOrder.email, id)
```

### 7. **Změna statusu na "delivered"** → `/app/api/admin/orders/[id]/route.ts` (řádek 632-643)
✅ **IMPLEMENTOVÁNO**
```typescript
// Admin nebo automaticky - doručeno
sendDeliveryConfirmationEmail(updatedOrder.email, id)
```

### 8. **Zrušení objednávky / refund** → `/app/api/admin/orders/[id]/route.ts` (řádek 645-655)
✅ **IMPLEMENTOVÁNO**
```typescript
// Admin zruší objednávku nebo vrátí platbu
sendOrderCancellationEmail(updatedOrder.email, id, reason)
```

---

## ❌ CO CHYBÍ (není voláno)

### 🚨 KRITICKÉ - CHYBÍ ADMIN NOTIFIKACE!

#### **1. Admin notifikace o nové objednávce**
**Status:** ❌ **NEVOLÁNO NIKDE**

**Funkce existuje:** `sendAdminOrderNotificationEmail` (řádek 263-361 v `/lib/email.ts`)

**Kde by měla být zavolána:**
- `/app/api/orders/route.ts` - hned po vytvoření objednávky (řádek ~206)

**Proč je to důležité:**
- Admin NEVÍ o nových objednávkách
- Musí aktivně kontrolovat admin panel
- Může přehlédnout urgentní objednávky

**Jak funguje:**
- Pošle email na `objednavky@muzahair.cz`
- Obsahuje: číslo objednávky, email zákazníka, položky, celkovou cenu
- Má přímý odkaz do admin panelu: `https://muzahair.cz/admin/objednavky/{orderId}`

---

#### **2. Payment Reminder System**
**Status:** ❌ **NENÍ IMPLEMENTOVÁN**

**Funkce existuje:** `sendPaymentReminderEmail` (řádek 499-570 v `/lib/email.ts`)

**Kde chybí implementace:**
- Žádný CRON job nebo scheduled task
- Žádné API endpoint pro spuštění
- Není automatizace

**Jak by to mělo fungovat:**
1. Denní CRON job (např. přes Vercel Cron)
2. Najde objednávky se statusem `pending` starší než X dní
3. Pošle připomínku s odkazem na dokončení platby

**Doporučení:**
- Vytvořit `/app/api/cron/payment-reminders/route.ts`
- Nastavit Vercel Cron (denně v 10:00)
- Parametrizovat počet dní (např. 2, 5, 7 dní)

---

#### **3. Shipping notification při vytvoření zásilky**
**Status:** ⚠️ **ČÁSTEČNĚ IMPLEMENTOVÁNO**

**Funkce:** `sendShippingNotificationEmail` je volána, ALE:

**Problém:** Chybí tracking číslo!

V souboru `/app/api/orders/[id]/route.ts` (řádek 111):
```typescript
await sendShippingNotificationEmail(currentOrder.email, id)
// ❌ Chybí 3. parametr: trackingNumber
```

**Správně by mělo být:**
```typescript
await sendShippingNotificationEmail(
  currentOrder.email,
  id,
  updatedOrder.trackingNumber  // ← Tracking číslo
)
```

**Kde opravit:**
- `/app/api/orders/[id]/route.ts` (řádek 111)

---

#### **4. Shipping notification při vytvoření zásilky v admin shipments**
**Status:** ❌ **CHYBÍ ÚPLNĚ**

**Soubor:** `/app/api/admin/orders/[id]/shipments/route.ts`

**Problém:**
- Admin vytvoří zásilku (POST endpoint)
- Nastaví tracking číslo + carrier
- **Ale NEPOŠLE EMAIL zákazníkovi!**

**Kde doplnit:**
- `/app/api/admin/orders/[id]/shipments/route.ts` (řádek ~147, před return)

```typescript
// Přidat před return (řádek ~147):
try {
  const { sendShippingNotificationEmail } = await import('@/lib/email');
  await sendShippingNotificationEmail(order.email, id, trackingNumber);
} catch (emailError) {
  console.error('Failed to send shipping notification:', emailError);
  // Don't fail shipment creation if email fails
}
```

---

## 🔧 KDE PŘESNĚ DOPLNIT

### **FIX 1: Admin notifikace o nové objednávce**

**Soubor:** `/app/api/orders/route.ts`
**Řádek:** ~206 (hned po `sendOrderConfirmationEmail`)

```typescript
// Existující kód (řádek 193-205):
try {
  const { sendOrderConfirmationEmail } = await import('@/lib/email');
  const emailItems = order.items.map((item) => ({
    variant: item.nameSnapshot || 'Neznámý produkt',
    quantity: item.saleMode === 'BULK_G' ? `${item.grams}g` : '1',
    price: item.lineTotal + (item.assemblyFeeTotal || 0),
  }));
  await sendOrderConfirmationEmail(order.email, order.id, emailItems, order.total);
} catch (emailError) {
  console.error('Failed to send order confirmation email:', emailError);
  // Don't fail the order creation if email fails
}

// ========== PŘIDAT TENTO KÓD: ==========
// Send admin notification about new order
try {
  const { sendAdminOrderNotificationEmail } = await import('@/lib/email');
  const emailItems = order.items.map((item) => ({
    variant: item.nameSnapshot || 'Neznámý produkt',
    quantity: item.saleMode === 'BULK_G' ? item.grams : 1,
    price: item.pricePerGram,
  }));
  await sendAdminOrderNotificationEmail(
    order.id,
    order.email,
    emailItems,
    order.total
  );
} catch (emailError) {
  console.error('Failed to send admin notification email:', emailError);
  // Don't fail the order creation if email fails
}
// ========================================
```

---

### **FIX 2: Opravit tracking číslo při změně statusu na "shipped"**

**Soubor:** `/app/api/orders/[id]/route.ts`
**Řádek:** 109-117

```typescript
// PŘED (řádek 109-117):
if (currentOrder.deliveryStatus !== 'shipped' && deliveryStatus === 'shipped') {
  try {
    await sendShippingNotificationEmail(currentOrder.email, id);
    console.log('Shipping notification email sent successfully');
  } catch (emailError) {
    console.error('Error sending shipping notification email:', emailError);
  }
}

// PO (opraveno):
if (currentOrder.deliveryStatus !== 'shipped' && deliveryStatus === 'shipped') {
  try {
    await sendShippingNotificationEmail(
      currentOrder.email,
      id,
      updatedOrder.trackingNumber || undefined  // ← Přidat tracking číslo
    );
    console.log('Shipping notification email sent successfully');
  } catch (emailError) {
    console.error('Error sending shipping notification email:', emailError);
  }
}
```

---

### **FIX 3: Přidat email při vytvoření shipmentu v admin**

**Soubor:** `/app/api/admin/orders/[id]/shipments/route.ts`
**Řádek:** ~147 (před `return NextResponse.json`)

```typescript
// Existující kód (řádek ~145):
    },
  });

  // ========== PŘIDAT TENTO KÓD: ==========
  // Send shipping notification to customer
  try {
    const { sendShippingNotificationEmail } = await import('@/lib/email');
    await sendShippingNotificationEmail(order.email, id, trackingNumber);
    console.log('Shipping notification email sent to customer');
  } catch (emailError) {
    console.error('Failed to send shipping notification email:', emailError);
    // Don't fail shipment creation if email fails
  }
  // ========================================

  // Transform order response
  const transformedOrder = {
    // ... existující kód
```

---

### **FIX 4: Implementovat Payment Reminder System (volitelné)**

**Nový soubor:** `/app/api/cron/payment-reminders/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPaymentReminderEmail } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * Vercel Cron Job - Payment Reminders
 *
 * Schedule in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/payment-reminders",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // Verify this is a Vercel Cron request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Find unpaid orders older than 2 days
    const unpaidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        createdAt: {
          lte: twoDaysAgo,
        },
      },
      select: {
        id: true,
        email: true,
        total: true,
        createdAt: true,
      },
    });

    let successCount = 0;
    let errorCount = 0;

    for (const order of unpaidOrders) {
      try {
        const daysSinceOrder = Math.floor(
          (now.getTime() - order.createdAt.getTime()) / (24 * 60 * 60 * 1000)
        );

        await sendPaymentReminderEmail(
          order.email,
          order.id,
          order.total,
          daysSinceOrder
        );

        successCount++;
      } catch (error) {
        console.error(`Failed to send reminder for order ${order.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: unpaidOrders.length,
      sent: successCount,
      failed: errorCount,
    });
  } catch (error) {
    console.error('Payment reminder cron error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment reminders' },
      { status: 500 }
    );
  }
}
```

**Nový soubor:** `/vercel.json` (nebo přidat do existujícího)

```json
{
  "crons": [
    {
      "path": "/api/cron/payment-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Nová environment variable v Vercel:**
```
CRON_SECRET=<random-secret-string>
```

---

## 🔑 RESEND API KEY - Konfigurace

### Kde je API key nakonfigurován?

**Soubor:** `/lib/email.ts` (řádek 3)
```typescript
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
```

### Jak zkontrolovat, jestli je nastaven?

**Vercel Dashboard:**
1. Jdi na https://vercel.com/jevg-ones-projects/muzaready
2. Settings → Environment Variables
3. Hledej `RESEND_API_KEY`

**CLI check:**
```bash
vercel env ls
```

### Jak získat RESEND API key?

1. Jdi na https://resend.com
2. Sign up / Login
3. Dashboard → API Keys → Create API Key
4. Copy the key (začíná `re_...`)

### Jak nastavit v Vercel?

**Přes Dashboard:**
1. Vercel → Project → Settings → Environment Variables
2. Add Variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxxxxxxx`
   - **Environments:** Production, Preview, Development

**Přes CLI:**
```bash
vercel env add RESEND_API_KEY production
# Paste your API key
```

### Jak otestovat, jestli funguje?

**Metoda 1: Zkontroluj logy**
```bash
vercel logs --follow
```

Pokud vidíš:
- ✅ `Order confirmation email sent: { id: '...' }` → Funguje
- ❌ `RESEND_API_KEY not configured; skipping email send` → Není nastaveno

**Metoda 2: Vytvoř testovací objednávku**
- Jdi na web, vytvoř objednávku
- Zkontroluj email inbox
- Zkontroluj Resend Dashboard → Logs

---

## 📊 SOUHRN - Co funguje a co ne

| Email typ | Funkce existuje | Je voláno | Status |
|-----------|----------------|-----------|--------|
| Order Confirmation (zákazník) | ✅ | ✅ | **FUNGUJE** |
| Payment Confirmation (zákazník) | ✅ | ✅ | **FUNGUJE** |
| Invoice (zákazník) | ✅ | ✅ | **FUNGUJE** |
| Shipping Notification (zákazník) | ✅ | ⚠️ Částečně | **FUNGUJE BEZ TRACKING** |
| Delivery Confirmation (zákazník) | ✅ | ✅ | **FUNGUJE** |
| Order Cancellation (zákazník) | ✅ | ✅ | **FUNGUJE** |
| **Admin Notification (nová objednávka)** | ✅ | ❌ | **NEFUNGUJE** |
| **Admin Notification (shipment)** | ✅ | ❌ | **NEFUNGUJE** |
| Payment Reminder | ✅ | ❌ | **NENÍ AUTOMATIZOVÁNO** |

---

## ⏱️ ODHAD ČASU NA DOKONČENÍ

### Základní opravy (kritické):
- **FIX 1:** Admin notifikace o objednávce → **10 minut**
- **FIX 2:** Opravit tracking číslo → **5 minut**
- **FIX 3:** Email při shipmentu → **10 minut**

**Celkem základní opravy: ~25 minut**

### Pokročilé (volitelné):
- **FIX 4:** Payment Reminder System → **45 minut**
  - Vytvořit cron endpoint (20 min)
  - Nastavit vercel.json (5 min)
  - Testování (20 min)

**Celkem s payment reminders: ~70 minut**

---

## 🚀 DOPORUČENÝ POSTUP

### FÁZE 1: Kritické opravy (NYNÍ)
1. ✅ Přidat admin notifikaci o nové objednávce
2. ✅ Opravit tracking číslo v shipping notifikaci
3. ✅ Přidat email při vytvoření shipmentu

### FÁZE 2: Verifikace (PO OPRAVĚ)
1. Zkontrolovat RESEND_API_KEY v Vercel
2. Vytvořit testovací objednávku
3. Zkontrolovat všechny emaily:
   - Zákazník: Order confirmation ✅
   - Admin: Nová objednávka ✅ (NEW!)
   - Zákazník: Payment confirmation ✅
   - Zákazník: Invoice ✅
4. Testovat shipment flow:
   - Admin vytvoří shipment s tracking
   - Zákazník dostane email s tracking číslem ✅ (FIXED!)

### FÁZE 3: Automatizace (POZDĚJI)
1. Implementovat Payment Reminder System
2. Nastavit Vercel Cron
3. Testovat reminder flow

---

## 📋 CHECKLIST - CO ZKONTROLOVAT

### Před opravami:
- [ ] Zkontrolovat `RESEND_API_KEY` v Vercel Environment Variables
- [ ] Ověřit, že Resend účet má aktivní API key
- [ ] Ověřit domain verifikaci v Resend (muzahair.cz)

### Po opravách:
- [ ] Vytvořit testovací objednávku
- [ ] Zkontrolovat inbox zákazníka (order confirmation)
- [ ] Zkontrolovat inbox admina (nová objednávka) ← **NOVÉ**
- [ ] Označit jako zaplaceno → zkontrolovat payment confirmation
- [ ] Označit jako shipped → zkontrolovat tracking v emailu ← **OPRAVENO**
- [ ] Zkontrolovat Vercel logs (`vercel logs --follow`)
- [ ] Zkontrolovat Resend Dashboard → Logs

### Volitelné (payment reminders):
- [ ] Vytvořit `/app/api/cron/payment-reminders/route.ts`
- [ ] Přidat `vercel.json` s cron konfigurací
- [ ] Přidat `CRON_SECRET` do Vercel env vars
- [ ] Testovat cron endpoint ručně
- [ ] Počkat 24h a zkontrolovat, jestli cron běží

---

## 🎯 ZÁVĚR

**Email systém je ~85% kompletní.**

### Co funguje:
✅ Všechny zákaznické emaily (order, payment, invoice, delivery, cancellation)
✅ Automatické generování a zasílání faktur
✅ Email notifikace při změnách statusu

### Co chybí:
❌ **Admin NEVÍ o nových objednávkách** (kritické!)
❌ **Tracking číslo není v emailu** (středně důležité)
❌ **Payment reminder systém není automatizovaný** (nice-to-have)

### Doporučení:
**Doplnit FIX 1-3 co nejdříve** (25 minut práce)
**FIX 4 implementovat později** (když bude čas)

---

**Připraveno k implementaci! 🚀**
