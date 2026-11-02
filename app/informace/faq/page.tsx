'use client';

import { useState } from 'react';
import Link from 'next/link';

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
- Pokud si nejste jistí, kontaktujte nás na WhatsApp (+420 728 722 880) a pošlete nám selfie - poradíme vám

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

**Potřebujete pomoc?** Zavolejte/napište na WhatsApp: +420 728 722 880`
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
- Email: muzahaircz@gmail.com
- WhatsApp: +420 728 722 880
- Osobně v showroomu`
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
- Kontaktujte nás: muzahaircz@gmail.com`
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
1. Napište nám email: muzahaircz@gmail.com
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
    answer: `**V e-shopu platíte vždy předem bankovním převodem.**

- Po odeslání objednávky uvidíte **QR kód pro platbu** a pošleme vám ho i v potvrzovacím e-mailu.
- Číslo účtu: **321286011/0300** (IBAN: CZ70 0300 0000 0003 2128 6011)
- Variabilní symbol: číslo objednávky
- Objednávku odešleme (nebo připravíme k osobnímu odběru) po připsání platby.

Dobírku nenabízíme.

**V showroomu** můžete zaplatit hotově nebo kartou.`
  },
  {
    category: 'Platba',
    question: 'Kdy musím objednávku zaplatit?',
    answer: `V e-shopu se kartou neplatí, platba probíhá **předem bankovním převodem** (nejrychleji naskenováním QR kódu v mobilním bankovnictví).

Jakmile platba dorazí na účet, objednávku připravíme a odešleme. Při okamžité platbě to bývá týž den.`
  },
  {
    category: 'Platba',
    question: 'Můžu platit v eurech nebo jiné měně?',
    answer: `Ceny jsou v **českých korunách (CZK)**. Ze zahraničí můžete poslat převod na náš IBAN **CZ70 0300 0000 0003 2128 6011**, vaše banka částku přepočítá ze své měny. Případný poplatek za převod určuje vaše banka.`
  },
  {
    category: 'Platba',
    question: 'Máte nějaké slevy nebo slevové kódy?',
    answer: `**Pro salony a kadeřnice** máme velkoobchodní ceny. Stačí se zaregistrovat na stránce [Velkoobchod](/velkoobchod). Po schválení účtu se vám po přihlášení zobrazí velkoobchodní ceny přímo v e-shopu.

O dalších akcích informujeme na Instagramu **@muzahair.cz**.`
  },

  // ===== KATEGORIE: DOPRAVA =====
  {
    category: 'Doprava',
    question: 'Jaké dopravní možnosti nabízíte a kolik stojí?',
    answer: `- **Zásilkovna** (výdejní místo nebo box): **89 Kč**
- **DPD** výdejní místo nebo box: **68 Kč**
- **Doručení na adresu**: **129 Kč**
- **Osobní odběr** v showroomu, Revoluční 8, Praha 1: **zdarma**

Objednávku odešleme po připsání platby.`
  },
  {
    category: 'Doprava',
    question: 'Jak dlouho trvá doručení?',
    answer: `Skladové zboží odešleme do **1–3 pracovních dnů od připsání platby**. Zásilkovna a DPD pak doručují obvykle do 1–2 pracovních dnů.

Zboží vyráběné na zakázku (pásky, weft, clip-in) připravujeme **14 pracovních dnů**, keratinové prameny 3 pracovní dny.

Číslo pro sledování zásilky vám pošleme e-mailem po odeslání.`
  },
  {
    category: 'Doprava',
    question: 'Můžu si vyzvednout objednávku osobně?',
    answer: `**Ano!** Máte 2 možnosti:

**1. Osobní odběr v showroomu** ZDARMA
- Adresa: Revoluční 8, Praha 1, 110 00
- Otevřeno: Po–Ne 10:00–16:00, **jindy po domluvě**

**Postup:**
1. Při objednávce zvolte "Osobní odběr"
2. Dostanete email, že je objednávka připravená (24-48h)
3. Domluvte si čas vyzvednutí (+420 728 722 880)
4. Vezměte si občanku nebo potvrzení objednávky

**2. Návštěva showroomu BEZ objednávky**
- Můžete si prohlédnout všechny vzorky
- Poradit se s odborníkem
- A koupit vlasy přímo na místě
- **Doporučujeme:** Zavolejte předem (+420 728 722 880) a domluvte si schůzku

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
3. **Kontaktujte nás:** muzahaircz@gmail.com
   - Uveďte číslo objednávky
   - My zahájíme reklamaci u dopravce
4. **Řešení:**
   - Dopravce balík najde → doručí do 7 dní
   - Balík se ztratil → pošleme náhradní balík ZDARMA

**Balík je poškozený:**

DŮLEŽITÉ: Zkontrolujte balík **PŘED převzetím od kurýra!**

**Postup:**
1. **Vizuální kontrola** - pomačkaná krabice, díry, mokrý obal
2. **Pokud vypadá poškozeně:**
   - NEPŘEBÍREJTE BALÍK
   - Sepište s kurýrem protokol o poškození
   - Vyfoťte balík
   - Napište nám: muzahaircz@gmail.com

3. **Pokud zjistíte poškození až doma:**
   - Vyfoťte balík i obsah
   - Napište nám do 24h: muzahaircz@gmail.com
   - Vyřešíme reklamaci

**Garance:**
Pokud je zboží poškozené, **pošleme náhradní ZDARMA** nebo vrátíme peníze (dle vaší volby).`
  },
  {
    category: 'Doprava',
    question: 'Doručujete do zahraničí?',
    answer: `Ano, **po individuální domluvě**. Cenu poštovného stanovíme podle země a hmotnosti zásilky. Napište nám na WhatsApp +420 728 722 880 nebo na muzahaircz@gmail.com, kam chcete vlasy poslat.

Platba je i v tomto případě předem převodem na IBAN **CZ70 0300 0000 0003 2128 6011**.`
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
   - Email: muzahaircz@gmail.com
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

**TIP:** Pokud si nejste jistí odstínem, pošlete nám fotku svých vlasů na WhatsApp +420 728 722 880 a poradíme ještě před objednávkou.`
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
   - Email: muzahaircz@gmail.com
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

**Možnost B: Poradenství předem**
- **PŘED aplikací** nám zavolejte
- Pomůžeme vám vybrat správný odstín

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
- Email: muzahaircz@gmail.com
- Tel: +420 728 722 880`
  },

  // ===== KATEGORIE: PÉČE O VLASY =====
  {
    category: 'Péče o vlasy',
    question: 'Jak správně pečovat o vlasy k prodloužení?',
    answer: `**Základní péče - 5 ZLATÝCH PRAVIDEL:**

**1. MYTÍ**
- **2-3x týdně** (ne denně!)
- Vlažná voda (ne horká)
- Šampon **bez sulfátů**
- Mytí od kořínků směrem dolů (ne kruhovými pohyby)
- Důkladně vypláchnout

**2. KONDICIONÉR**
- **Vždy** po šamponu
- Nanášet od poloviny délky ke konci
- **NE na keratin bondy** (uvolní se)
- Nechat působit 3-5 minut
- Důkladně vypláchnout

**3. ČESÁNÍ**
- Pouze **speciální kartáč** (s kulatými hroty)
- **Od konců směrem nahoru**
- Před mytím rozčesat suché vlasy
- Po mytí nechat částečně oschnout, pak česat

**4. SUŠENÍ**
- Nejlépe **přirozeně** (ručník + vzduch)
- Pokud fén: **studený/vlažný vzduch**
- Termická ochrana VŽDY
- Nesušit vlasy "hlavou dolů" (zamotají se)

**5. SPANÍ**
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
NEDOPORUČUJEME
- Výrazně zkracuje životnost
- Může poškodit strukturu
- Pokud nutně: pouze profesionál
- A pak extra péče

**BĚLENÍ/MELÍROVÁNÍ:**
NEDOPORUČUJEME
- Velmi agresivní proces
- Zničí vlasy
- Raději si kupte již obarvené vlasy ve světlém odstínu

**TIP:** Naše **barvené vlasy** (odstíny 5-10) jsou profesionálně obarvené v naší barvírně a vydrží déle než když budete barvit doma.`
  },
  {
    category: 'Péče o vlasy',
    question: 'Jaké produkty doporučujete?',
    answer: `**ŠAMPONY (bez sulfátů):**
- Kerastase Bain Satin
- Redken All Soft
- Olaplex No. 4
- Matrix Biolage
- Nebo cokoliv s označením "sulfate-free"

**KONDICIONÉRY:**
- Kerastase Lait Vital
- Redken All Soft Conditioner
- Olaplex No. 5
- Matrix Biolage Conditioner

**MASKY (1x týdně):**
- Kerastase Masquintense
- Olaplex No. 8
- Redken All Soft Mega Mask
- Nebo kokosový olej (100% přírodní)

**OLEJE/SÉRA:**
- Moroccanoil Treatment
- Kerastase Elixir Ultime
- Redken Diamond Oil
- Argonový olej

**TERMICKÁ OCHRANA:**
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

**ANO - Clip-in vlasy**
- Nejjednodušší
- Nasadíte za 5 minut
- Sundáte před spaním
- Ideální pro začátečníky

**MOŽNÉ, ale nedoporučujeme - Tape-in**
- Potřebujete speciální pásky a nářadí
- Těžké dostat na správné místo
- Riziko špatného držení
- Raději kadeřník

**NE - Keratin bondy (I-tip, U-tip)**
- Potřebujete **speciální kleště**
- Technika je složitá
- Špatná aplikace = poškození vlasů
- **Pouze profesionální kadeřník**

**Kde vlasy nechat nasadit:**
- U vaší kadeřnice, nebo v našem **partnerském salonu v Praze** (objednání přes WhatsApp +420 728 722 880)
- Přesnou cenu aplikace se dozvíte na osobní konzultaci, viz [Ceník aplikace](/ceny-aplikaci)

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

**Cena korekce:** viz [Ceník aplikace](/ceny-aplikaci), přesnou cenu řekneme na konzultaci.

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

Adresa:
Revoluční 8
Praha 1, 110 00

Otevřeno: **Po–Ne 10:00–16:00, jindy po domluvě**

**Co u nás můžete:**
✅ Prohlédnout si **všechny vzorky** odstínů
✅ **Přiložit si vlasy** k vašim vlastním
✅ **Poradit se** s našimi specialisty
✅ **Koupit rovnou** - odnesete si hned
✅ Zjistit **doporučenou gramáž** pro vaše vlasy
✅ Prohlédnout si různé **typy zakončení**

**Doporučujeme:**
Zavolejte předem: **+420 728 722 880**
- Domluvíme si čas
- Budeme mít pro vás připravené vzorky
- Věnujeme vám plnou pozornost

Prodloužení samotné neděláme v showroomu, ale v našem **partnerském salonu v Praze**.`
  },
  {
    category: 'Showroom',
    question: 'Nabízíte konzultaci před koupí?',
    answer: `**Ano! Máme 3 typy konzultací:**

**1. ONLINE konzultace** ZDARMA
- Napište nám na WhatsApp: +420 728 722 880
- Pošlete selfie vašich vlasů
- Poradíme vám:
  - Který odstín vám bude sedět
  - Kolik gramů potřebujete
  - Jakou délku zvolit
  - Jaký typ zakončení

**2. VIDEO hovor** ZDARMA
- Videohovor (WhatsApp/Messenger)
- Trvá 15-20 minut
- Ukážeme vám vzorky naživo
- Objednejte si na: muzahaircz@gmail.com

**3. OSOBNÍ konzultace** ZDARMA
- Přímo v showroomu
- Objednejte si termín: +420 728 722 880
- Trvá 30-60 minut
- Vyzkoušíte si vzorky
- Doporučíme vám přesně, co potřebujete

**Všechny konzultace jsou NEZÁVAZNÉ** - nemusíte nic kupovat!`
  },
  {
    category: 'Showroom',
    question: 'Jak vás můžu kontaktovat?',
    answer: `- **WhatsApp a telefon:** +420 728 722 880
- **E-mail:** muzahaircz@gmail.com
- **Instagram:** @muzahair.cz
- **Osobně:** showroom Revoluční 8, Praha 1, pouze na objednání`
  },
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

function answerHtml(answer: string) {
  return answer
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-text-dark">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br />')
    .replace(/^(.*)$/, '<p>$1</p>');
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Všechny');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'Všechny' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-muza-cream text-text-dark font-jost min-h-screen">
      {/* Úvod */}
      <section className="mx-auto max-w-3xl px-4 pt-8 pb-10 md:pt-12 md:pb-12">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Časté otázky</span>
        </nav>
        <h1 className="mt-8 font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">
          Odpovědi na vaše otázky
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[#45302F]">
          Najděte odpovědi na nejčastější dotazy o našich produktech, objednávání, dopravě a péči o vlasy.
        </p>
      </section>

      {/* Hledání, kategorie a otázky */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <label htmlFor="faq-search" className="sr-only">Hledat v otázkách</label>
        <input
          id="faq-search"
          type="search"
          placeholder="Hledat v FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[52px] px-5 rounded-full border border-muza-line bg-white text-base text-text-dark placeholder:text-[#45302F]/70 focus:outline-none focus:border-muza-ink transition-colors"
        />

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Kategorie otázek">
          {['Všechny', ...categories].map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center h-10 px-4 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-muza-ink text-muza-onink'
                    : 'border border-muza-line text-muza-ink hover:border-muza-ink'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {filteredFAQs.length === 0 ? (
            <div className="py-10 border-t border-muza-line">
              <p className="text-base mb-2">Nenašli jsme odpověď na váš dotaz.</p>
              <p className="text-sm text-[#45302F]">
                Zkuste jiné hledání nebo nás kontaktujte na{' '}
                <a href="mailto:muzahaircz@gmail.com" className="text-muza-ink underline underline-offset-4">muzahaircz@gmail.com</a>
              </p>
            </div>
          ) : (
            filteredFAQs.map((item, n) => (
              <details
                key={item.question}
                className={`group py-4 border-t border-muza-line ${n === filteredFAQs.length - 1 ? 'border-b' : ''}`}
              >
                <summary className="flex justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-medium">
                  {item.question}
                  <span aria-hidden="true" className="text-muza-ink text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <div
                  className="mt-3 text-sm leading-relaxed text-[#45302F]"
                  dangerouslySetInnerHTML={{ __html: answerHtml(item.answer) }}
                />
              </details>
            ))
          )}
        </div>
      </section>

      {/* Kontakt */}
      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Nenašli jste odpověď?</h2>
          <p className="mt-3 text-base text-[#45302F]">
            Rádi vám poradíme! Kontaktujte nás a odpovíme do 24 hodin.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:muzahaircz@gmail.com" className={BTN_PRIMARY}>Napsat email</a>
            <a href="https://wa.me/420728722880" target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>WhatsApp</a>
            <a href="tel:+420728722880" className={BTN_SECONDARY}>Zavolat</a>
          </div>
        </div>
      </section>
    </div>
  );
}
