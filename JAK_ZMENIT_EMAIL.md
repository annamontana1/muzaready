# 📧 JAK ZMĚNIT EMAIL V TEST OBJEDNÁVCE

## ⚠️ Pokud nevidíš pole pro email v edit stránce:

### 1. Hard Refresh (nejčastější problém)
- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R`
- Nebo otevři stránku v **inkognito okně**

### 2. Zkontroluj Deployment
- Jdi na: https://vercel.com/dashboard
- Vyber projekt: **muzaready-bahy**
- Zkontroluj, jestli je nejnovější deployment hotový
- Poslední commit by měl být: `da48670`

### 3. Počkej na Deployment
- Deployment může trvat **1-3 minuty**
- Počkej a pak zkus znovu

---

## ✅ Pokud pole pro email vidíš:

1. Otevři detail objednávky
2. Klikni na **"Upravit objednávku"**
3. Změň email na skutečný (např. `tvuj-email@gmail.com`)
4. Ulož změny
5. Všechny další email notifikace půjdou na nový email

---

## 🔄 Alternativní řešení (pokud pole stále nevidíš):

### Metoda 1: Přes API (pokud máš přístup)
```bash
curl -X PUT https://muzaready-bahy.vercel.app/api/admin/orders/[ORDER_ID] \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{"email": "tvuj-email@gmail.com"}'
```

### Metoda 2: Vytvoř novou test objednávku se správným emailem
- Vytvoř novou test objednávku
- Použij API s parametrem email (pokud máš přístup)

---

## 📧 Po změně emailu:

Můžeš testovat všechny email notifikace:
- ✅ Payment Confirmation Email
- ✅ Shipping Notification Email
- ✅ Delivery Confirmation Email
- ✅ Refund Email
- ✅ Invoice Email

---

## ⚠️ Důležité:

- **RESEND_API_KEY** musí být nastaven v Vercel Environment Variables
- Email musí být skutečný (ne @example.com)
- Po změně emailu budou všechny další notifikace chodit na nový email
