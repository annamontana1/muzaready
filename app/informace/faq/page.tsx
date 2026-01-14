'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // ===== KATEGORIE: O PRODUKTECH =====
  {
    category: 'O produktech',
    question: 'Jaký je rozdíl mezi Standard, LUXE a Platinum Edition?',
    answer: `**Standard** - Naše základní kvalita pro každodenní nošení. Vlasy jsou jemné, příjemné na dotek a dostupné v délkách 40-80 cm. Ideální pro první zkušenost s prodloužením.

**LUXE** - Prémiová kvalita s extra hebkostí a měkkostí. Vlasy mají přirozenější lesk a drží natočení déle. Vhodné pro náročnější zákaznice, které chtějí luxusnější pocit.

**Platinum Edition** - Nejvyšší kvalita, "ready-to-wear" kusy předem připravené v konkrétní délce a gramáži. Každý kus je unikátní, s perfektním zakončením. Ideální pro ty, kdo chtějí luxus bez čekání.`
  },
  {
    category: 'O produktech',
    question: 'Co znamená "nebarvené panenské vlasy"?',
    answer: `Panenské vlasy jsou vlasy, které **nikdy nebyly chemicky zpracovány** - nebyly barvené, melírované ani trvale ondulované. Jsou v původním stavu, jak vyrostly. To znamená:
- Zachovaná kuticula (vnější vrstva vlasu)
- Přirozená pevnost a pružnost
- Delší životnost
- Možnost samy barvit nebo natáčet
- Přirozenější lesk a pocit

Naše nebarvené vlasy jsou v odstínech 1-4 (černá až hnědá).`
  },
  {
    category: 'O produktech',
    question: 'Co znamená "barvené vlasy"?',
    answer: `Barvené vlasy jsou profesionálně obarvené panenské vlasy ve světlejších odstínech (5-10), včetně různých odstínů blond.

Barvení provádíme v **naší vlastní barvírně v Praze**, kde máme plnou kontrolu nad kvalitou. Vlasy zůstávají zdravé a hebké i po barvení.

K dispozici v odstínech:
- Odstín 5: Světle hnědá
- Odstín 6: Tmavá blond
- Odstín 7: Blond
- Odstín 8: Světlá blond
- Odstín 9: Velmi světlá blond
- Odstín 10: Platinová blond`
  },
  {
    category: 'O produktech',
    question: 'Jak poznám, který odstín mi bude sedět?',
    answer: `**Nejlepší způsob:**
1. Navštivte náš **showroom v Praze**, kde si můžete prohlédnout všechny odstíny naživo a přiložit si je k vlasům
2. Naši specialisté vám poradí, který odstín ladí s vaším podtónem pleti

**Online nákup:**
- Na každé produktové stránce máme **detailní fotky odstínů**
- Galerie odstínů s hex kódy barev
- Pokud si nejste jistí, kontaktujte nás na WhatsApp (+420 XXX XXX XXX) a pošlete nám selfie - poradíme vám

**Tipy:**
- Chladné podtóny pleti → popelové/studené odstíny
- Teplé podtóny pleti → zlatavé/teplé odstíny
- Můžete zkusit o 1-2 odstíny světlejší než vaše vlasy pro přirozený efekt melíru`
  },
  {
    category: 'O produktech',
    question: 'Jaké struktury vlasů nabízíte?',
    answer: `Máme tři základní struktury:

**Rovné (straight)** - Hladké, lesklé vlasy bez vln. Ideální pro elegantní, přímý look. Nejjednodušší na údržbu.

**Mírně vlnité (wavy)** - Jemné vlny, přirozený "beach waves" efekt. Velmi populární, vypadá nenuceně a romanticky.

**Kudrnaté (curly)** - Výrazné kudrliny, objemný vzhled. Pro ty, kdo chtějí dramatičtější změnu. Vyžaduje více péče.

Všechny struktury můžete **samy upravovat** - žehličkou, kulmo nebo natáčkami. Panenské vlasy drží natočení velmi dobře!`
  },
  {
    category: 'O produktech',
    question: 'Jak dlouho vydrží vlasy k prodloužení?',
    answer: `Záleží na kvalitě a péči:

**Standard:** 6-12 měsíců při správné péči
**LUXE:** 12-18 měsíců
**Platinum Edition:** 18-24 měsíců

**Faktory, které ovlivňují životnost:**
✅ **Prodlouží životnost:**
- Šetrné mytí (2-3x týdně)
- Použití kondicionéru a olejů
- Sušení ručníkem, ne fénem na max teplotu
- Česání od konců
- Spaní se zápletem nebo chráničem

❌ **Zkrátí životnost:**
- Časté mytí (denně)
- Agresivní šampony s sulfáty
- Horká voda (používejte vlažnou)
- Spaní s rozpuštěnými vlasy
- Časté barvení nebo chemické zpracování
- Chlor v bazénu (noste čepici)`
  },
  {
    category: 'O produktech',
    question: 'Kolik gramů vlasů potřebuji?',
    answer: `Záleží na tom, co chcete dosáhnout:

**100-150 g** - Lehké prodloužení, přidání objemu
**150-200 g** - Střední objem, viditelné prodloužení
**200-250 g** - Plný objem, dramatická změna
**250+ g** - Maximální objem, velmi husté vlasy

**Pro referenci:**
- Jemné vlasy: 100-150 g
- Střední hustota: 150-200 g
- Husté vlasy: 200-250 g

V našem e-shopu můžete objednat vlasy **přesně podle gramů** (Standard/LUXE) nebo si vybrat **předem připravené kusy** (Platinum Edition).

Pokud si nejste jistí, **napište nám** - pošleme vám kalkulačku nebo vám poradíme osobně!`
  },

  // ===== KATEGORIE: OBJEDNÁVÁNÍ =====
  {
    category: 'Objednávání',
    question: 'Jak si objednám vlasy online?',
    answer: `**Krok za krokem:**

1. **Projděte si katalog** - kategorie "Nebarvené panenské" nebo "Barvené vlasy"
2. **Vyberte kvalitu** - Standard, LUXE nebo Platinum Edition
3. **Zvolte odstín** - klikněte na produktovou kartu
4. **Nastavte parametry:**
   - Délka (40-80 cm)
   - Gramáž (100-500 g)
   - Zakončení (Keratin, I-tip, U-tip, Tape-in, Clip-in)
5. **Přidejte do košíku** - tlačítko "Přidat do košíku"
6. **Dokončete objednávku** - vyplňte kontaktní údaje a adresu
7. **Vyberte dopravu a platbu**
8. **Potvrďte objednávku** - dostanete email s potvrzením

**Potřebujete pomoc?** Zavolejte/napište na WhatsApp: +420 XXX XXX XXX`
  },
  {
    category: 'Objednávání',
    question: 'Můžu objednat speciální kombinaci (např. jiné zakončení nebo barvení)?',
    answer: `**Ano!** Nabízíme individuální zakázky:

**Co můžeme udělat:**
- Obarvení na míru (vlastní odstín podle vzorku)
- Kombinace délek (např. 50% 60cm + 50% 70cm)
- Speciální zakončení (Mix Keratin + Tape-in)
- Extra dlouhé vlasy (80cm+)
- Balayage/ombre efekt

**Postup:**
1. Kontaktujte nás **PŘED objednávkou**
2. Popište, co přesně chcete
3. Pošlete inspirační foto (pokud máte)
4. My vám připravíme nabídku s cenou a termínem
5. Po potvrzení vyrobíme vlasy na míru

**Doba výroby:** 2-4 týdny (záleží na složitosti)

**Kontakt:**
- Email: info@muzahair.cz
- WhatsApp: +420 XXX XXX XXX
- Osobně v showroomu`
  },
  {
    category: 'Objednávání',
    question: 'Můžu si objednat vzorek vlasů?',
    answer: `**Ano!** Nabízíme vzorky odstínů:

**Co dostanete:**
- Malý pramen vlasů (cca 5-10 g)
- Přesně ten odstín a strukturu, který zvažujete
- Možnost přiložit si k vlasům a vyzkoušet doma

**Cena vzorku:** 200 Kč (při následné objednávce vlasů vám částku odečteme)

**Jak objednat:**
1. Napište nám email: info@muzahair.cz
2. Uveďte, který odstín a strukturu chcete
3. Pošleme vám platební údaje
4. Po zaplacení expedujeme do 2 prac. dnů

**TIP:** Pokud jste v Praze, můžete **zdarma** navštívit showroom a prohlédnout si všechny vzorky naživo!`
  },
  {
    category: 'Objednávání',
    question: 'Dostanu potvrzení objednávky?',
    answer: `**Ano, dostanete 2 emaily:**

1. **Okamžité potvrzení** - hned po dokončení objednávky
   - Obsahuje číslo objednávky
   - Souhrn položek
   - Celková cena

2. **Potvrzení expedice** - když vaše objednávka odejde
   - Tracking číslo zásilky
   - Očekávaný termín doručení
   - Link na sledování

**Nedostal/a jste email?**
- Zkontrolujte SPAM/NEVYŽÁDANÁ POŠTA
- Ověřte, že jste zadali správnou emailovou adresu
- Kontaktujte nás: info@muzahair.cz`
  },
  {
    category: 'Objednávání',
    question: 'Můžu změnit nebo zrušit objednávku?',
    answer: `**Ano, ale záleží na stavu objednávky:**

**PŘED EXPEDICÍ** (do 24 hodin):
✅ Můžete změnit:
- Doručovací adresu
- Typ dopravy
- Množství/parametry produktu

**Postup:**
1. Napište nám email: info@muzahair.cz
2. Uveďte číslo objednávky
3. Popište, co chcete změnit
4. My vám potvrdíme změnu

**PO EXPEDICI:**
❌ Nelze změnit
✅ Můžete využít **právo na odstoupení** (viz otázka o vrácení)

**ZRUŠENÍ OBJEDNÁVKY:**
- Před expedicí: **ZDARMA**
- Po expedici: Platí právo na odstoupení (14 dní), ale **hradíte poštovné**

**TIP:** Objednávky expedujeme rychle (do 48h), tak nás kontaktujte co nejdříve!`
  },

  // ===== KATEGORIE: PLATBA =====
  {
    category: 'Platba',
    question: 'Jaké způsoby platby přijímáte?',
    answer: `Nabízíme **3 způsoby platby:**

**1. Online kartou** 💳
- Okamžitá platba přes platební bránu
- **Výhody:** Rychlé, bezpečné, objednávka se okamžitě zpracuje
- Přijímáme: Visa, Mastercard, Maestro

**2. Bankovní převod** 🏦
- Platba na účet
- **Výhody:** Tradiční způsob
- Variabilní symbol: číslo objednávky
- IBAN: CZ XX XXXX XXXX XXXX XXXX XXXX
- Objednávka se expeduje po připsání platby (1-3 dny)

**3. Dobírka** 📦 (pouze ČR)
- Zaplatíte kurýrovi při převzetí
- **Výhody:** Platíte až když vidíte balík
- Poplatek: +50 Kč
- Pouze hotovost

**Bezpečnost:**
Všechny platby jsou šifrované SSL certifikátem. Nikdy neuvidíme vaše číslo karty.`
  },
  {
    category: 'Platba',
    question: 'Kdy se strhne platba z karty?',
    answer: `**Okamžitě** při dokončení objednávky.

**Jak to funguje:**
1. Kliknete na "Dokončit objednávku"
2. Přesměrujeme vás na platební bránu
3. Zadáte údaje karty
4. Částka se **okamžitě strhne**
5. Dostanete potvrzení o platbě
6. My vidíme zaplacenou objednávku a začneme ji zpracovávat

**Co když se platba nezdaří?**
- Objednávka se neuloží
- Peníze se nestrhnou
- Můžete to zkusit znovu nebo zvolit jiný způsob platby

**Vrácení peněz:**
Pokud vrátíte zboží (odstoupení od smlouvy), peníze vrátíme **do 14 dnů** stejnou metodou (na kartu).`
  },
  {
    category: 'Platba',
    question: 'Můžu platit v eurech nebo jiné měně?',
    answer: `**Momentálně ne** - všechny ceny jsou v **českých korunách (CZK)**.

**Pro zahraniční zákazníky:**
- Vaše banka automaticky převede CZK na vaši měnu
- Může se účtovat **malý poplatek za konverzi** (záleží na bance)
- Kurz je aktuální kurz vaší banky v den platby

**Doporučení pro zahraniční platby:**
- Používejte kartu s nízkými zahraničními poplatky (Revolut, Wise, N26)
- Nebo zvolte bankovní převod (SEPA) - levnější než karta

**Budete mít v budoucnu EUR?**
Plánujeme přidat EUR platby v roce 2026!`
  },
  {
    category: 'Platba',
    question: 'Máte nějaké slevy nebo slevové kódy?',
    answer: `**Ano! Máme několik způsobů, jak ušetřit:**

**1. Newsletter sleva** 📧
- Přihlaste se k newsletteru
- Dostanete **10% slevu na první nákup**

**2. Velkoobchodní ceny** 💼
- Pro kadeřnické salóny a firemní zákazníky
- Sleva od **15-30%** podle objemu
- Kontaktujte nás: obchod@muzahair.cz

**3. Sezónní akce** 🎉
- Black Friday (listopad)
- Vánoční slevy (prosinec)
- Jarní výprodej (březen)

**4. Věrnostní program** ⭐
- Při 3. nákupu: 5% sleva
- Při 5. nákupu: 10% sleva
- Od 10. nákupu: 15% permanentní sleva

**Jak uplatnit slevový kód:**
1. V košíku najděte pole "Slevový kód"
2. Zadejte kód (např. NEWSLETTER10)
3. Klikněte "Použít"
4. Sleva se automaticky odečte z ceny`
  },

  // ===== KATEGORIE: DOPRAVA =====
  {
    category: 'Doprava',
    question: 'Jaké dopravní možnosti nabízíte a kolik stojí?',
    answer: `**V ČESKU:**

📦 **Zásilkovna** - 79 Kč
- Doručení na výdejní místo (5000+ míst)
- 2-3 pracovní dny
- Sledování zásilky

📮 **Česká pošta - Balík na poštu** - 89 Kč
- Doručení na vybranou pobočku
- 2-4 pracovní dny

🚚 **Česká pošta - Balík do ruky** - 119 Kč
- Doručení kurýrem na adresu
- 2-3 pracovní dny
- SMS notifikace

🏃 **PPL** - 139 Kč
- Expresní doručení do 24h
- Pouze Praha a velká města

**✨ DOPRAVA ZDARMA od 3 000 Kč!**

**DO ZAHRANIČÍ:**

🌍 **Evropa** - od 299 Kč
- 5-10 pracovních dnů
- Sledování zásilky
- Celní prohlášení zajištěno`
  },
  {
    category: 'Doprava',
    question: 'Jak dlouho trvá doručení?',
    answer: `**Zpracování objednávky:** 1-2 pracovní dny

**Standardní dodací lhůty:**
- Zásilkovna: 2-3 dny od expedice
- Česká pošta: 2-4 dny
- PPL Express: 1-2 dny

**Celkem od objednávky:**
- ⚡ Express (PPL): 2-3 dny
- 📦 Standardní: 3-5 dní
- 🌍 Zahraniční: 7-14 dní

**Co ovlivňuje rychlost:**
✅ **Zrychlí:**
- Platba kartou (okamžité zpracování)
- Objednávka v pracovní dny
- Praha a velká města

❌ **Zpomalí:**
- Platba převodem (čekáme na připsání)
- Objednávka o víkendu/svátcích
- Individuální zakázky (2-4 týdny)
- Doprava do odlehlých oblastí

**Sledování zásilky:**
Tracking číslo dostanete emailem po expedici.`
  },
  {
    category: 'Doprava',
    question: 'Můžu si vyzvednout objednávku osobně?',
    answer: `**Ano!** Máte 2 možnosti:

**1. Osobní odběr v showroomu** ⭐ **ZDARMA**
- Adresa: Revoluční 8, Praha 1, 110 00
- Otevírací doba:
  - Po-Pá: 10:00 - 18:00
  - So: 10:00 - 14:00
  - Ne: Zavřeno

**Postup:**
1. Při objednávce zvolte "Osobní odběr"
2. Dostanete email, že je objednávka připravená (24-48h)
3. Přijďte si ji vyzvednout v pracovní době
4. Vezměte si občanku nebo potvrzení objednávky

**2. Návštěva showroomu BEZ objednávky**
- Můžete si prohlédnout všechny vzorky
- Poradit se s odborníkem
- A koupit vlasy přímo na místě
- **Doporučujeme:** Zavolejte předem (+420 XXX XXX XXX) a domluvte si schůzku

**Výhody osobního odběru:**
✅ Ušetříte za dopravu
✅ Vidíte produkt před koupí
✅ Můžete se poradit osobně
✅ Máte jistotu, že dostanete přesně to, co chcete`
  },
  {
    category: 'Doprava',
    question: 'Co když mi balík nedorazí nebo je poškozený?',
    answer: `**Balík nedorazil:**

1. **Zkontrolujte tracking** - možná je na cestě nebo na depu
2. **Počkejte 2 dny navíc** - občas dochází ke zpoždění
3. **Kontaktujte nás:** info@muzahair.cz
   - Uveďte číslo objednávky
   - My zahájíme reklamaci u dopravce
4. **Řešení:**
   - Dopravce balík najde → doručí do 7 dní
   - Balík se ztratil → pošleme náhradní balík ZDARMA

**Balík je poškozený:**

⚠️ **DŮLEŽITÉ:** Zkontrolujte balík **PŘED převzetím od kurýra!**

**Postup:**
1. **Vizuální kontrola** - pomačkaná krabice, díry, mokrý obal
2. **Pokud vypadá poškozeně:**
   - ❌ **NEPŘEBÍREJTE BALÍK**
   - 📝 Sepište s kurýrem protokol o poškození
   - 📸 Vyfoťte balík
   - ✉️ Napište nám: info@muzahair.cz

3. **Pokud zjistíte poškození až doma:**
   - 📸 Vyfoťte balík i obsah
   - 📧 Napište nám do 24h: info@muzahair.cz
   - 🔄 Vyřešíme reklamaci

**Garance:**
Pokud je zboží poškozené, **pošleme náhradní ZDARMA** nebo vrátíme peníze (dle vaší volby).`
  },
  {
    category: 'Doprava',
    question: 'Doručujete do zahraničí?',
    answer: `**Ano!** Doručujeme do **celé Evropy**.

**Země EU:**
- Slovensko, Polsko, Německo, Rakousko - 299 Kč
- Další EU země - 399 Kč
- Doba doručení: 5-10 pracovních dnů
- **Bez cla** (volný pohyb v EU)

**Země mimo EU:**
- Švýcarsko, Norsko, UK - 599 Kč
- Doba doručení: 7-14 dní
- **Pozor:** Může se účtovat **clo a DPH** v cílové zemi
  - Platí příjemce při převzetí
  - Výše závisí na místních předpisech

**Co potřebujete:**
- Uvést **úplnou adresu včetně PSČ**
- **Telefon** pro kontakt od dopravce
- Při objednávce nad 150 EUR může být požadována **kopie občanky**

**Sledování:**
Tracking funguje mezinárodně - uvidíte, kde je váš balík.

**Pozn.:** Individuální zakázky (barvení na míru) odesíláme pouze v ČR/SK.`
  },

  // ===== KATEGORIE: VRÁCENÍ A REKLAMACE =====
  {
    category: 'Vrácení a reklamace',
    question: 'Můžu vrátit zboží, pokud mi nesedí odstín?',
    answer: `**Ano**, máte **14 dní na vrácení** bez udání důvodu.

**Podmínky:**
✅ **MŮŽETE vrátit:**
- Nepoužité vlasy v originálním balení
- Neporušené obaly a etikety
- Kompletní zboží (včetně příslušenství)

❌ **NELZE vrátit:**
- Použité vlasy (i když jen vyzkoušené)
- Obarvené na míru (individuální zakázka)
- Zboží bez obalu nebo poškozeného obalu
- Zboží, které přišlo do kontaktu s vodou/produkty

**Postup vrácení:**

1. **Napište nám do 14 dnů** od převzetí
   - Email: info@muzahair.cz
   - Uveďte číslo objednávky a důvod vrácení

2. **Počkejte na potvrzení**
   - Pošleme vám instrukce a adresu

3. **Zašlete zboží zpět**
   - Dobře zabalte (nejlépe originální obal)
   - Doporučujeme pojištěnou zásilku
   - **Vy hradíte poštovné** zpět

4. **Vrácení peněz**
   - Do 14 dnů od doručení zpět
   - Stejnou metodou, jakou jste platili
   - Poštovné za doručení k vám **NEVRACÍME**

**TIP:** Pokud si nejste jistí odstínem, objednejte si **vzorek** (200 Kč) - tím se vyhnete vracení!`
  },
  {
    category: 'Vrácení a reklamace',
    question: 'Co když jsou vlasy vadné?',
    answer: `**Reklamace vady** je něco jiného než odstoupení od smlouvy!

**Co je považováno za vadu:**
- Vlasy se **třepí nebo lámou** hned po rozbalení
- **Barva výrazně neodpovídá** popisu (ne jen "jiný odstín než jsem čekal")
- Vlasy jsou **znečištěné nebo poškozené**
- Nesprávná **gramáž nebo délka** (odchylka >10%)

**Co NENÍ vada:**
- Rozdíl v odstínu oproti monitoru (každý displej zobrazuje jinak)
- Vlasy se **zauzlují po použití** - to je normální, vyžadují péči
- Vlasy **ztratily lesk po měsících** - to je opotřebení, ne vada

**Postup reklamace:**

1. **Napište nám IHNED po zjištění**
   - Email: info@muzahair.cz
   - Popište vadu
   - Přiložte **FOTO** (nutné!)

2. **Vyřízení do 3 dnů**
   - Posoudíme, zda jde o vadu
   - Pokud ano, pošleme instrukce

3. **Vrácení vadného zboží**
   - Zašlete nám zboží (my hradíme poštovné)
   - Nebo osobně do showroomu

4. **Řešení (vaše volba):**
   - ✅ **Výměna za nové** (nejčastější)
   - ✅ **Vrácení peněz**
   - ✅ **Oprava** (pokud možné)
   - ✅ **Sleva** (pokud chcete produkt ponechat)

**Lhůta vyřízení:** Max. 30 dnů (většinou do 7 dní)

**Záruka:** 24 měsíců na výrobní vady`
  },
  {
    category: 'Vrácení a reklamace',
    question: 'Co když vlasy nesedí mému klientovi? (Pro kadeřnice)',
    answer: `**Pro kadeřnické salóny máme speciální podmínky:**

**Možnost A: Reklamace před aplikací**
- Pokud zjistíte vadu **PŘED nasazením** klientovi
- Postupujte podle standardní reklamace (viz výše)
- Výměna nebo vrácení peněz

**Možnost B: Výměna odstínu**
- Pokud odstín nesedí, ale vlasy jsou nepoužité
- Můžeme vyměnit za jiný odstín
- Platíte pouze rozdíl v ceně (pokud je)
- Poplatek za výměnu: 200 Kč

**Možnost C: Profesionální poradenství**
- **PŘED aplikací** nám zavolejte
- Pomůžeme vám vybrat správný odstín
- Můžeme poslat vzorky ZDARMA (pro kadeřnictví)

**Nemůžeme reklamovat:**
- Vlasy po aplikaci klientovi
- Vlasy, které klient nosil
- Škody způsobené nesprávnou aplikací

**Pro kadeřnictví:**
- Registrujte se jako profesionální zákazník
- Dostanete **15-30% slevy**
- Prioritní support
- Vzdělávací materiály ZDARMA

**Kontakt pro kadeřnictví:**
- Email: obchod@muzahair.cz
- Tel: +420 XXX XXX XXX`
  },

  // ===== KATEGORIE: PÉČE O VLASY =====
  {
    category: 'Péče o vlasy',
    question: 'Jak správně pečovat o vlasy k prodloužení?',
    answer: `**Základní péče - 5 ZLATÝCH PRAVIDEL:**

**1. MYTÍ** 🚿
- **2-3x týdně** (ne denně!)
- Vlažná voda (ne horká)
- Šampon **bez sulfátů**
- Mytí od kořínků směrem dolů (ne kruhovými pohyby)
- Důkladně vypláchnout

**2. KONDICIONÉR** 💧
- **Vždy** po šamponu
- Nanášet od poloviny délky ke konci
- **NE na keratin bondy** (uvolní se)
- Nechat působit 3-5 minut
- Důkladně vypláchnout

**3. ČESÁNÍ** 🪮
- Pouze **speciální kartáč** (s kulatými hroty)
- **Od konců směrem nahoru**
- Před mytím rozčesat suché vlasy
- Po mytí nechat částečně oschnout, pak česat

**4. SUŠENÍ** 💨
- Nejlépe **přirozeně** (ručník + vzduch)
- Pokud fén: **studený/vlažný vzduch**
- Termická ochrana VŽDY
- Nesušit vlasy "hlavou dolů" (zamotají se)

**5. SPANÍ** 😴
- **Zapletené** nebo volný cop
- Nebo hedvábný čepec/šátek
- **NIKDY** s mokrými vlasy

**Co NEDĚLAT:**
❌ Chlor (bazén) - noste čepici
❌ Slané moře - opláchnout sladkou vodou
❌ Přímé slunce - UV ochrana
❌ Agresivní žehlení (nad 180°C)
❌ Spaní s mokrými/rozpuštěnými vlasy`
  },
  {
    category: 'Péče o vlasy',
    question: 'Můžu vlasy barvit, žehlit nebo natáčet?',
    answer: `**BARVENÍ:**
✅ **ANO**, ale:
- Pouze **profesionálním kadeřníkem**
- Pouze **panenské vlasy** (nebarvené)
- Doporučujeme **o 1-2 tóny tmavší** (zesvětlování škodí)
- Po obarvení bude životnost kratší

**ŽEHLENÍ/NATÁČENÍ:**
✅ **ANO**, klidně:
- Max teplota: **180°C**
- Vždy použít **termickou ochranu**
- Vlasy musí být **suché**
- Žehlit rychle, ne příliš často na stejném místě

**Doporučené teploty:**
- Jemné vlasy: 140-160°C
- Střední: 160-180°C
- Hrubé: 180-200°C (výjimečně)

**TRVALÁ/CHEMICKÉ ÚPRAVY:**
⚠️ **NEDOPORUČUJEME**
- Výrazně zkracuje životnost
- Může poškodit strukturu
- Pokud nutně: pouze profesionál
- A pak extra péče

**BĚLENÍ/MELÍROVÁNÍ:**
❌ **NEDOPORUČUJEME**
- Velmi agresivní proces
- Zničí vlasy
- Raději si kupte již obarvené vlasy ve světlém odstínu

**TIP:** Naše **barvené vlasy** (odstíny 5-10) jsou profesionálně obarvené v naší barvírně a vydrží déle než když budete barvit doma.`
  },
  {
    category: 'Péče o vlasy',
    question: 'Jaké produkty doporučujete?',
    answer: `**ŠAMPONY (bez sulfátů):** 🧴
- Kerastase Bain Satin
- Redken All Soft
- Olaplex No. 4
- Matrix Biolage
- Nebo cokoliv s označením "sulfate-free"

**KONDICIONÉRY:** 💧
- Kerastase Lait Vital
- Redken All Soft Conditioner
- Olaplex No. 5
- Matrix Biolage Conditioner

**MASKY (1x týdně):** 🥥
- Kerastase Masquintense
- Olaplex No. 8
- Redken All Soft Mega Mask
- Nebo kokosový olej (100% přírodní)

**OLEJE/SÉRA:** ✨
- Moroccanoil Treatment
- Kerastase Elixir Ultime
- Redken Diamond Oil
- Argonový olej

**TERMICKÁ OCHRANA:** 🔥
- GHD Heat Protect Spray
- Tigi Blow Out Balm
- Kerastase Ciment Thermique

**CO VYHNOUT:**
❌ Šampony s SLS/SLES (sodium lauryl sulfate)
❌ Šampony "proti lupům" (jsou agresivní)
❌ Levné drogériové značky
❌ Produkty s alkoholem na prvních místech složení

**TIP:** Investujte do kvalitních produktů - ušetříte na nových vlasech, protože vydrží déle!`
  },

  // ===== KATEGORIE: APLIKACE A INSTALACE =====
  {
    category: 'Aplikace',
    question: 'Můžu si vlasy nasadit sama doma?',
    answer: `**Záleží na typu zakončení:**

**✅ ANO - Clip-in vlasy**
- Nejjednodušší
- Nasadíte za 5 minut
- Sundáte před spaním
- Ideální pro začátečníky
- Tutoriál: [odkaz na YouTube]

**⚠️ MOŽNÉ, ale nedoporučujeme - Tape-in**
- Potřebujete speciální pásky a nářadí
- Těžké dostat na správné místo
- Riziko špatného držení
- Raději kadeřník

**❌ NE - Keratin bondy (I-tip, U-tip)**
- Potřebujete **speciální kleště**
- Technika je složitá
- Špatná aplikace = poškození vlasů
- **Pouze profesionální kadeřník**

**Kde najít kadeřníka:**
- Náš seznam partnerských salonů: [odkaz]
- Nebo váš oblíbený kadeřník (většina umí prodloužení)
- Cena aplikace: 500-2000 Kč (záleží na salonu)

**Náš tip:**
Pokud to děláte poprvé, **jděte ke kadeřníkovi**. Budete mít jistotu, že to bude správně a vlasy vydrží.`
  },
  {
    category: 'Aplikace',
    question: 'Jak dlouho trvá aplikace vlasů?',
    answer: `**Záleží na množství a typu:**

**Keratin bondy (I-tip/U-tip):**
- 100 g (cca 50 pramenů): **2-3 hodiny**
- 150 g (cca 75 pramenů): **3-4 hodiny**
- 200 g (cca 100 pramenů): **4-5 hodin**

**Tape-in:**
- 100 g (cca 40 pásků): **1-2 hodiny**
- 150 g (cca 60 pásků): **2-3 hodiny**

**Clip-in:**
- **5-10 minut** (sama doma)

**Co ovlivňuje čas:**
- Zkušenost kadeřníka
- Hustota vašich vlasů
- Složitost střihu
- Zda je třeba zastřihnout na míru

**První aplikace trvá déle** než re-aplikace.

**TIP:** Objednejte si u kadeřníka schůzku s dostatečným časem a nepospíchejte - kvalitní aplikace je základ!`
  },
  {
    category: 'Aplikace',
    question: 'Jak často je třeba přenášet/obnovovat vlasy?',
    answer: `**Keratin bondy:**
- **Re-aplikace:** každé **3-4 měsíce**
- Důvod: Vaše vlasy rostou, bondy se posouvají dolů
- Postup: Kadeřník bondy **odstraní** (speciální remover) a **nasadí znovu**

**Tape-in:**
- **Re-aplikace:** každé **6-8 týdnů**
- Rychlejší než keratin
- Pásky se vyměňují za nové

**Clip-in:**
- **Není třeba re-aplikace**
- Sundáte a nasadíte, kdy chcete
- Vydrží 6-12 měsíců bez servisu

**Cena re-aplikace:**
- Keratin: 800-1500 Kč
- Tape-in: 500-1000 Kč
- Záleží na salonu

**Co se stane, když nepřenášíte včas:**
- Bondy/pásky jsou viditelné
- Mohou se zamotávat
- Riziko poškození vašich vlasů
- Horší drží

**TIP:** Nechte si zarezervovat další termín už při aplikaci!`
  },

  // ===== KATEGORIE: SHOWROOM A KONTAKT =====
  {
    category: 'Showroom',
    question: 'Můžu navštívit váš showroom? Kde jste?',
    answer: `**Ano! Máme showroom v Praze:**

📍 **Adresa:**
Revoluční 8
Praha 1, 110 00

🕐 **Otevírací doba:**
- **Pondělí - Pátek:** 10:00 - 18:00
- **Sobota:** 10:00 - 14:00
- **Neděle:** Zavřeno

**Co u nás můžete:**
✅ Prohlédnout si **všechny vzorky** odstínů
✅ **Přiložit si vlasy** k vašim vlastním
✅ **Poradit se** s našimi specialisty
✅ **Koupit rovnou** - odnesete si hned
✅ Zjistit **doporučenou gramáž** pro vaše vlasy
✅ Prohlédnout si různé **typy zakončení**

**Doporučujeme:**
📞 Zavolejte předem: **+420 XXX XXX XXX**
- Domluvíme si čas
- Budeme mít pro vás připravené vzorky
- Věnujeme vám plnou pozornost

**Parkování:** [info o parkování]
**MHD:** Metro/tramvaj [číslo linky], zastávka [název]

**Vstup ZDARMA** - nemusíte nic kupovat, můžete jen nakouknout!`
  },
  {
    category: 'Showroom',
    question: 'Nabízíte konzultaci před koupí?',
    answer: `**Ano! Máme 3 typy konzultací:**

**1. ONLINE konzultace** 💬 **ZDARMA**
- Napište nám na WhatsApp: +420 XXX XXX XXX
- Pošlete selfie vašich vlasů
- Poradíme vám:
  - Který odstín vám bude sedět
  - Kolik gramů potřebujete
  - Jakou délku zvolit
  - Jaký typ zakončení

**2. VIDEO hovor** 📹 **ZDARMA**
- Videohovor (WhatsApp/Messenger)
- Trv㏁ 15-20 minut
- Ukážeme vám vzorky naživo
- Objednejte si na: info@muzahair.cz

**3. OSOBNÍ konzultace** 🏢 **ZDARMA**
- Přímo v showroomu
- Objednejte si termín: +420 XXX XXX XXX
- Trvá 30-60 minut
- Vyzkoušíte si vzorky
- Doporučíme vám přesně, co potřebujete

**Pro kadeřnice:**
Nabízíme **profesionální školení** aplikace vlasů:
- Kurz: 2 hodiny
- Cena: 1 500 Kč (nebo ZDARMA při nákupu nad 10k)
- Certifikát po absolvování

**Všechny konzultace jsou NEZÁVAZNÉ** - nemusíte nic kupovat!`
  },
  {
    category: 'Showroom',
    question: 'Jak vás můžu kontaktovat?',
    answer: `**Máme několik způsobů:**

📧 **Email:**
- Obecné dotazy: info@muzahair.cz
- Objednávky: objednavky@muzahair.cz
- Reklamace: reklamace@muzahair.cz
- Pro kadeřnictví: obchod@muzahair.cz

📱 **WhatsApp/SMS:**
- +420 XXX XXX XXX
- Nejrychlejší odpověď (do 1 hodiny v pracovní době)

📞 **Telefon:**
- +420 XXX XXX XXX
- Po-Pá: 9:00 - 17:00

💬 **Live chat:**
- Na webu (vpravo dole)
- Online Po-Pá: 10:00 - 18:00

📍 **Osobně:**
- Showroom v Praze (viz otázka výše)
- Doporučujeme předchozí objednání

📱 **Sociální sítě:**
- Instagram: @muzahair
- Facebook: Mùza Hair
- TikTok: @muzahair

**Kdy odpovídáme:**
- WhatsApp: **do 1 hodiny** (pracovní doba)
- Email: **do 24 hodin** (pracovní dny)
- Telefon: **okamžitě** (v pracovní době)

**Víkendy:** Na urgentní dotazy odpovídáme i o víkendech (WhatsApp).`
  },
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Všechny');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'Všechny' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Často kladené otázky (FAQ)</h1>
      <p className="text-lg text-gray-600 mb-8">
        Máte otázky? Najděte odpovědi na nejčastější dotazy o našich produktech, objednávání, dopravě a péči o vlasy.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Hledat v FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('Všechny')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedCategory === 'Všechny'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Všechny
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Nenašli jsme odpověď na váš dotaz.</p>
            <p>Zkuste jiné hledání nebo nás kontaktujte na <a href="mailto:info@muzahair.cz" className="text-purple-600 hover:underline">info@muzahair.cz</a></p>
          </div>
        ) : (
          filteredFAQs.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {item.question}
                  </h3>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    openQuestion === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openQuestion === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: item.answer
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p class="mt-4">')
                        .replace(/\n/g, '<br />')
                        .replace(/^(.*)$/gm, '<p>$1</p>')
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-purple-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenašli jste odpověď?</h2>
        <p className="text-gray-700 mb-6">
          Rádi vám poradíme! Kontaktujte nás a odpovíme do 24 hodin.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:info@muzahair.cz"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Napsat email
          </a>
          <a
            href="https://wa.me/420XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            WhatsApp
          </a>
          <a
            href="tel:+420XXXXXXXXX"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
          >
            Zavolat
          </a>
        </div>
      </div>
    </div>
  );
}
