# 📧 NASTAVENÍ RESEND EMAIL V VERCEL

## 🔑 Resend API Key
```
re_U2XbzvZ_3u4QRRFBacmf3KPeXSZ653mU
```

---

## 🚀 KROK 1: Přidat RESEND_API_KEY do Vercel

### 1. Jdi na Vercel Dashboard
```
https://vercel.com/dashboard
```

### 2. Vyber projekt
- Projekt: **muzaready-bahy** (nebo jak se jmenuje)
- Nebo použij URL: `muzaready-bahy.vercel.app`

### 3. Otevři Settings → Environment Variables
- Klikni na **Settings** (v horní liště)
- Klikni na **Environment Variables** (v levém menu)

### 4. Přidej RESEND_API_KEY
- Klikni na **"Add New"**
- **Name:** `RESEND_API_KEY`
- **Value:** `re_U2XbzvZ_3u4QRRFBacmf3KPeXSZ653mU`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Klikni **"Save"**

### 5. Redeploy
- Po přidání environment variable klikni na **"Redeploy"** (v sekci Deployments)
- Nebo počkej na automatický redeploy při dalším push

---

## ✅ KONTROLA: Jsou všechny změny nasazeny?

### Poslední commit v deploymentu:
```
b6b8d1b - feat: Kompletní skladová správa
```

### Novější commity, které by měly být nasazeny:
```
4761726 - feat: Přidáno tlačítko pro refund
4c5b15d - feat: Automatické vytváření faktury
c81e9d5 - feat: Automatické workflow
ae244f9 - feat: Kompletní email notifikace
```

### Pokud chybí novější commity:
1. Zkontroluj, jestli jsou všechny pushnuty na GitHub:
   ```bash
   git log origin/main --oneline -5
   ```

2. Pokud chybí, pushni je:
   ```bash
   git push origin main
   ```

3. Vercel automaticky nasadí nové změny

---

## 📧 EMAIL NOTIFIKACE - Co funguje?

Po nastavení RESEND_API_KEY budou fungovat:

✅ **Order Confirmation Email** - po vytvoření objednávky  
✅ **Payment Confirmation Email** - po zaplacení  
✅ **Shipping Notification Email** - po odeslání  
✅ **Delivery Confirmation Email** - po doručení  
✅ **Order Cancellation Email** - po refundu/zrušení  
✅ **Invoice Email** - faktura v emailu po zaplacení  

---

## 🧪 TESTOVÁNÍ EMAILŮ

### 1. Vytvoř test objednávku
- Jdi na: `https://muzaready-bahy.vercel.app/admin/objednavky`
- Klikni na "Vytvořit test objednávku"

### 2. Označ jako zaplaceno
- V detailu objednávky klikni na "Označit jako zaplaceno"
- Zkontroluj emailovou schránku (email z objednávky)
- Měl by přijít:
  - ✅ Payment Confirmation Email
  - ✅ Invoice Email (s PDF fakturou)

### 3. Označ jako odesláno
- Klikni na "Označit jako odesláno"
- Zkontroluj emailovou schránku
- Měl by přijít Shipping Notification Email

### 4. Označ jako doručeno
- Klikni na "Označit jako doručeno"
- Zkontroluj emailovou schránku
- Měl by přijít Delivery Confirmation Email

---

## 🔍 KONTROLA V KONZOLI

V Vercel deployment logs bys měl vidět:
```
Order confirmation email sent: ...
Payment confirmation email sent: ...
Shipping notification email sent: ...
Delivery confirmation email sent: ...
Invoice email sent: ...
```

---

## ⚠️ ČASTÉ PROBLÉMY

**Emaily se neposílají:**
- Zkontroluj, že RESEND_API_KEY je nastaven v Vercel
- Zkontroluj, že je nastaven pro všechny environments (Production, Preview, Development)
- Zkontroluj Vercel deployment logs pro chybové hlášky

**Email se nepošle, ale v logu je "skipping email":**
- Znamená to, že RESEND_API_KEY není nastaven
- Přidej ho do Vercel Environment Variables

**Email se pošle, ale nedorazí:**
- Zkontroluj spam složku
- Zkontroluj, že emailová adresa je správná
- Zkontroluj Resend dashboard pro detaily

---

## ✅ CHECKLIST

- [ ] RESEND_API_KEY přidán do Vercel Environment Variables
- [ ] Nastaven pro všechny environments (Production, Preview, Development)
- [ ] Vercel redeploy proveden
- [ ] Test objednávka vytvořena
- [ ] Email notifikace testovány
- [ ] Všechny commity jsou nasazeny

---

## 🎉 Hotovo!

Po nastavení RESEND_API_KEY budou všechny email notifikace fungovat!
