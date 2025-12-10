# 📧 JAK ZMĚNIT EMAIL V OBJEDNÁVCE PŘES API

## ⚠️ Pokud nemůžeš spustit redeploy (Vercel limit)

Můžeš změnit email přímo přes API endpoint z prohlížeče.

---

## 🚀 METODA 1: Přes Browser Console (nejjednodušší)

### Krok 1: Otevři detail objednávky
```
https://muzaready-bahy.vercel.app/admin/objednavky/[ORDER_ID]
```

### Krok 2: Otevři Browser Console
- **Mac:** `Cmd + Option + J`
- **Windows:** `Ctrl + Shift + J`
- Nebo klikni pravým tlačítkem → "Inspect" → "Console"

### Krok 3: Spusť tento kód
```javascript
// Nahraď ORDER_ID a EMAIL
const orderId = 'cmiyhid5k0006l704btc83biw'; // ID tvé objednávky
const newEmail = 'tvuj-email@gmail.com'; // Tvůj skutečný email

fetch(`/api/admin/orders/${orderId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({ email: newEmail }),
})
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error('Chyba:', data.error);
      alert('Chyba: ' + data.error);
    } else {
      console.log('Email změněn:', data.email);
      alert('Email úspěšně změněn na: ' + data.email);
      window.location.reload();
    }
  })
  .catch(err => {
    console.error('Chyba:', err);
    alert('Chyba při změně emailu');
  });
```

### Krok 4: Obnov stránku
- Po úspěšné změně obnov stránku (F5)
- Email by měl být změněn

---

## 🔄 METODA 2: Vytvoř novou test objednávku se správným emailem

### Krok 1: Otevři Browser Console na stránce s objednávkami
```
https://muzaready-bahy.vercel.app/admin/objednavky
```

### Krok 2: Spusť tento kód
```javascript
const email = prompt('Zadej email pro test objednávku:');
if (!email) {
  alert('Email je povinný');
} else {
  fetch('/api/admin/test-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: email }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Chyba: ' + data.error);
      } else {
        alert('Test objednávka vytvořena: ' + data.order.id);
        window.location.reload();
      }
    })
    .catch(err => {
      alert('Chyba při vytváření objednávky');
    });
}
```

---

## 📋 Co potřebuješ:

1. **Order ID** - najdeš v URL nebo v detailu objednávky
2. **Skutečný email** - kam chceš posílat testovací emaily
3. **Browser Console** - pro spuštění kódu

---

## ✅ Po změně emailu:

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
