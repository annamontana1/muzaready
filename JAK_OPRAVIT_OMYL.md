# 🔄 Jak opravit omyl: Označil/a jsem objednávku jako zaplaceno, ale nebyla zaplacena

## ✅ Rychlé řešení (2 způsoby)

### 1️⃣ **Tlačítko "Označit jako nezaplaceno"** (Nejrychlejší)

**Kde:** V detailu objednávky (`/admin/objednavky/[id]`)

**Jak na to:**
1. Otevři detail objednávky, kterou jsi omylem označil/a jako zaplaceno
2. Najdi oranžové tlačítko **"Označit jako nezaplaceno"** (vedle modrého tlačítka "Označit jako zaplaceno")
3. Klikni na něj
4. Potvrď akci v dialogu
5. Hotovo! ✅

**Co se stane:**
- `paymentStatus`: `paid` → `unpaid`
- `orderStatus`: automaticky se vrátí na `pending` (pokud bylo `processing` nebo `shipped`)

---

### 2️⃣ **Edit stránka** (Pro pokročilejší úpravy)

**Kde:** `/admin/objednavky/[id]/edit`

**Jak na to:**
1. V detailu objednávky klikni na tlačítko **"✏️ Upravit objednávku"** (vpravo nahoře)
2. Nebo jdi přímo na: `/admin/objednavky/[id]/edit`
3. Změň **"Stav platby"** z `Zaplaceno` na `Nezaplaceno`
4. Můžeš také změnit další statusy najednou
5. Klikni **"Uložit změny"**
6. Hotovo! ✅

**Výhody:**
- Můžeš změnit více věcí najednou (payment, delivery, order status)
- Vidíš všechny možnosti v dropdown menu

---

## 🎯 Kdy použít který způsob?

### Použij tlačítko "Označit jako nezaplaceno", když:
- ✅ Chceš rychle opravit omyl
- ✅ Chceš změnit pouze payment status
- ✅ Nechceš měnit nic jiného

### Použij edit stránku, když:
- ✅ Chceš změnit více statusů najednou
- ✅ Chceš vidět všechny možnosti
- ✅ Chceš změnit i jiné věci (např. delivery status)

---

## ⚠️ Důležité poznámky

### Potvrzení před změnou
- Tlačítko "Označit jako nezaplaceno" vyžaduje potvrzení (dialog)
- To zabraňuje omylným kliknutím

### Automatické změny
- Když označíš jako nezaplaceno, `orderStatus` se automaticky vrátí na `pending` (pokud bylo `processing` nebo `shipped`)
- To je správné chování - nezaplacená objednávka by neměla být ve stavu "zpracovává se" nebo "odesláno"

### Historie změn
- Všechny změny se ukládají s `lastStatusChangeAt` timestampem
- Můžeš vidět, kdy byla změna provedena

---

## 📋 Kompletní workflow pro opravu omylu

### Scénář: Omylem jsem klikl/a "Označit jako zaplaceno"

1. **Zjistíš omyl** (např. zákazník říká, že nezaplatil)
2. **Otevřeš detail objednávky** (`/admin/objednavky/[id]`)
3. **Klikneš na "Označit jako nezaplaceno"** (oranžové tlačítko)
4. **Potvrdíš akci** v dialogu
5. **Objednávka je opravena** → `unpaid/pending/pending`
6. **Můžeš pokračovat normálně** (čekat na platbu, poslat reminder, atd.)

---

## 🔍 Jak poznat, že je objednávka omylem označená jako zaplaceno?

**Znaky:**
- ✅ V admin panelu vidíš zelený badge "Zaplaceno"
- ✅ Ale zákazník říká, že nezaplatil
- ✅ V bankovním účtu není příchozí platba
- ✅ GoPay nepotvrdil platbu

**Co dělat:**
- Použij tlačítko "Označit jako nezaplaceno"
- Nebo použij edit stránku

---

## 💡 Tipy

### Prevence omylů
- ✅ Vždy zkontroluj bankovní účet před označením jako zaplaceno
- ✅ Pro bankovní převody počkej na potvrzení z banky
- ✅ Pro GoPay počkej na automatické potvrzení

### Rychlé opravy
- ✅ Použij tlačítko "Označit jako nezaplaceno" pro rychlou opravu
- ✅ Nebo použij edit stránku pro komplexnější změny

---

**TL;DR:**
1. Otevři detail objednávky
2. Klikni na oranžové tlačítko **"Označit jako nezaplaceno"**
3. Potvrď akci
4. Hotovo! ✅

**Nebo:** Použij edit stránku (`/admin/objednavky/[id]/edit`) pro pokročilejší úpravy.

