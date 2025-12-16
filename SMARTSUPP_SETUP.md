# 💬 Smartsupp Live Chat - Setup Návod

## Co je Smartsupp?

Smartsupp je ZDARMA live chat řešení pro e-shop s těmito funkcemi:

- ✅ Neomezený live chat
- ✅ 100 konverzací/měsíc ZDARMA
- ✅ 3 agenti v týmu
- ✅ Mobilní aplikace (iOS, Android)
- ✅ Automatické odpovědi
- ✅ Nahrávání videí návštěvníků
- ✅ Offline formulář
- ✅ Statistiky a reports

## Proč Smartsupp?

**Konkurence má:**
- Notino.cz → 24/7 live chat
- Alza.cz → Live chat + video call
- Mall.cz → Live chat + chatbot

**Výhody pro Múza Hair:**
- 📈 +25-40% konverze s live chatem
- ⚡ Okamžitá odpověď na dotazy zákazníků
- 💰 ZDARMA až 100 konverzací/měsíc
- 📱 Odpovídej z mobilu odkudkoliv
- 🇨🇿 České rozhraní

---

## 1. Registrace (5 minut)

1. **Přejdi na:** https://www.smartsupp.com/cs/
2. **Klikni:** "Začít zdarma"
3. **Vyplň:**
   - Email: tvuj@email.cz
   - Heslo: (silné heslo)
   - Název webu: "Múza Hair"
   - URL: muzaready.cz

4. **Zvol plán:** FREE (100 chats/měsíc)

---

## 2. Získání API klíče

1. **Přihlas se** do Smartsupp dashboardu
2. **Přejdi na:** Nastavení → Instalace
3. **Zkopíruj** tvůj unikátní klíč
   - Vypadá jako: `1234567890abcdef1234567890abcdef`

---

## 3. Instalace do e-shopu

### Option A: Přes Environment Variable (doporučeno)

1. **Otevři** Vercel dashboard
2. **Přejdi na:** Settings → Environment Variables
3. **Přidej novou proměnnou:**
   ```
   Name: NEXT_PUBLIC_SMARTSUPP_KEY
   Value: [tvůj klíč z dashboardu]
   Environment: Production, Preview, Development
   ```
4. **Klikni:** Save
5. **Redeploy** aplikaci

### Option B: Přes .env.local soubor

1. **Otevři** `/Users/zen/muzaready/.env.local`
2. **Přidej řádek:**
   ```bash
   NEXT_PUBLIC_SMARTSUPP_KEY=tvuj_klic_zde
   ```
3. **Uložit** soubor
4. **Restartuj** dev server

---

## 4. Ověření instalace

1. **Otevři** tvůj e-shop: https://muzaready-iota.vercel.app
2. **Počkej** 5-10 sekund
3. **Měl bys vidět** Smartsupp chat widget v pravém dolním rohu
4. **Klikni** na widget a otestuj zprávu

---

## 5. Customizace (volitelné)

### Změna barev

1. **Dashboard** → Design
2. **Zvol barvu:** #8B1538 (burgundy Múza Hair)
3. **Uložit**

### Automatické zprávy

1. **Dashboard** → Chatbots
2. **Vytvoř zprávu:**
   ```
   Ahoj! 👋 Jsem tady, abych ti pomohl s výběrem vlasů.
   Máš otázku ohledně délek, odstínů nebo kvality?
   ```

### Offline formulář

1. **Dashboard** → Settings → Offline Form
2. **Zapni:** "Zobrazit když offline"
3. **Formulář přijde na:** tvůj@email.cz

### Přidat členy týmu

1. **Dashboard** → Team
2. **Klikni:** Invite member
3. **Zadej:** email kolegy
4. **Vyber roli:** Agent nebo Admin

---

## 6. Mobilní aplikace

### iOS
- App Store: "Smartsupp Live Chat"
- Odpovídej zákazníkům odkudkoliv!

### Android
- Google Play: "Smartsupp Live Chat"
- Push notifikace pro nové zprávy

---

## 7. Statistiky a reporty

**Dashboard ukazuje:**
- 📊 Počet konverzací dnes/týden/měsíc
- ⏱️ Průměrná doba odpovědi
- 😊 Hodnocení zákazníků
- 🎯 Nejčastější otázky

---

## 8. Časté dotazy

### Q: Je to opravdu zdarma?
A: Ano! FREE plán zahrnuje 100 chats/měsíc, 3 agenty, mobilní app.

### Q: Co když překročím 100 chats?
A: Můžeš upgradovat na Standard plán (299 Kč/měsíc) pro neomezené chaty.

### Q: Funguje na mobilu?
A: Ano! Widget je responzivní. A ty můžeš odpovídat z mobilní aplikace.

### Q: Můžu mít offline hodiny?
A: Ano! V dashboardu nastav pracovní dobu. Mimo hodiny se zobrazí offline formulář.

### Q: Nahrává to opravdu video návštěvníků?
A: Ano! Smartsupp nahrává pohyb myši a kliky (ne celou obrazovku). Pomáhá pochopit chování zákazníků.

---

## 9. Best Practices

### ✅ Rychlé odpovědi
- Průměrná doba odpovědi: < 2 minuty
- Připrav si šablony odpovědí na časté otázky

### ✅ Osobní přístup
```
❌ Špatně: "Dobrý den. Jaký je váš dotaz?"
✅ Dobře:  "Ahoj! 👋 Já jsem Katka z Múza Hair. Jak ti můžu pomoci?"
```

### ✅ Proaktivní zprávy
- Po 30 sekundách na product page: "Potřebuješ poradit s výběrem?"
- V košíku 1+ minuta: "Máš otázku ohledně objednávky?"

### ✅ Sleduj metriky
- Response time → cíl < 2 min
- Customer satisfaction → cíl > 90%
- Conversations → růst každý měsíc

---

## 10. Troubleshooting

### Problém: Widget se nezobrazuje

**Řešení:**
1. Zkontroluj NEXT_PUBLIC_SMARTSUPP_KEY v Vercel env vars
2. Hard refresh (Cmd+Shift+R)
3. Zkontroluj konzoli (F12) pro error messages
4. Verifikuj že key je správný v Smartsupp dashboardu

### Problém: Widget je ve špatných barvách

**Řešení:**
1. Dashboard → Design → Choose colors
2. Primary: #8B1538 (burgundy)
3. Secondary: #5B0F26 (dark burgundy)
4. Save changes

### Problém: Nefunguje na mobilu

**Řešení:**
1. Widget je responzivní by default
2. Možná blokovaný adblockerem - whitelistni smartsuppchat.com
3. Zkontroluj console logs

---

## 11. Kontakt Support

**Smartsupp Support:**
- Email: support@smartsupp.com
- Live chat: https://www.smartsupp.com
- Dokumentace: https://docs.smartsupp.com

---

## Summary Checklist

- [ ] Registrován na Smartsupp.com
- [ ] Zkopírován API key
- [ ] Přidán NEXT_PUBLIC_SMARTSUPP_KEY do Vercel
- [ ] Redeploy aplikace
- [ ] Widget viditelný na webu
- [ ] Otestována zpráva
- [ ] Customizovány barvy (burgundy)
- [ ] Nastaveny offline hodiny
- [ ] Stažena mobilní app
- [ ] Přidán tým (volitelné)
- [ ] Nastaveny automatické zprávy

---

**✅ Hotovo!** Live chat je aktivní. Zákazníci tě teď můžou kontaktovat okamžitě! 🎉
