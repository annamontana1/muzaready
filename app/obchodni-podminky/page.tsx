import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obchodní podmínky | Múza Hair Praha',
  description: 'Všeobecné obchodní podmínky pro nákup vlasů k prodloužení na muzahair.cz. Platné od 1. 5. 2025.',
};

export default function ObchodniPodminkyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Obchodní podmínky</h1>
      <p className="text-sm text-gray-500 mb-10">Verze platná od: 1. 5. 2025 · muzahair.cz</p>

      {/* Kontaktní údaje prodávajícího */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-10 text-sm leading-relaxed">
        <p className="font-semibold text-gray-900 mb-1">Prodávající:</p>
        <p>Anna Zvinchuk, Múza Hair Praha s.r.o.</p>
        <p>IČO: [DOPLNIT] &nbsp;|&nbsp; DIČ: [DOPLNIT, pokud plátce DPH]</p>
        <p>Sídlo: [Přesná adresa sídla firmy], Praha</p>
        <p>Showroom: [Adresa showroomu], Praha</p>
        <p>E-mail: <a href="mailto:info@muzahair.cz" className="text-burgundy underline">info@muzahair.cz</a></p>
        <p>Telefon: <a href="tel:+420728722880" className="text-burgundy underline">+420 728 722 880</a></p>
        <p>Web: <a href="https://muzahair.cz" className="text-burgundy underline">muzahair.cz</a></p>
      </div>

      {/* Obsah */}
      <div className="bg-ivory border border-beige rounded-lg p-5 mb-10 text-sm">
        <p className="font-semibold mb-2">Obsah obchodních podmínek:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li><a href="#cl1" className="hover:underline">Úvodní ustanovení a základní pojmy</a></li>
          <li><a href="#cl2" className="hover:underline">Uzavření kupní smlouvy a objednávka</a></li>
          <li><a href="#cl3" className="hover:underline">Ceny, platba a fakturace</a></li>
          <li><a href="#cl4" className="hover:underline">Dodání zboží – doprava a dodací lhůty</a></li>
          <li><a href="#cl5" className="hover:underline">Specifika zboží – lidské vlasy</a></li>
          <li><a href="#cl6" className="hover:underline">Odstoupení od smlouvy – vrácení zboží do 14 dní</a></li>
          <li><a href="#cl7" className="hover:underline">Práva z vadného plnění – záruční podmínky</a></li>
          <li><a href="#cl8" className="hover:underline">Reklamační řád</a></li>
          <li><a href="#cl9" className="hover:underline">Výroba na zakázku</a></li>
          <li><a href="#cl10" className="hover:underline">Velkoobchodní podmínky (B2B)</a></li>
          <li><a href="#cl11" className="hover:underline">Ochrana osobních údajů (GDPR)</a></li>
          <li><a href="#cl12" className="hover:underline">Závěrečná ustanovení</a></li>
        </ol>
      </div>

      <div className="prose prose-lg max-w-none space-y-10 text-gray-800">

        {/* Čl. 1 */}
        <section id="cl1">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 1 – Úvodní ustanovení a základní pojmy</h2>
          <p><strong>1.1</strong> Tyto všeobecné obchodní podmínky (dále jen „obchodní podmínky") se vztahují na smlouvy uzavřené prostřednictvím e-shopu Múza Hair Praha umístněného na webovém rozhraní <strong>www.muzahair.cz</strong> (dále jen „webové rozhraní") a dále na smlouvy uzavřené osobně v showroomu prodávajícího.</p>
          <p><strong>1.2 Prodávajícím</strong> je: Anna Zvinchuk, Múza Hair Praha s.r.o., IČO: [DOPLNIT], se sídlem [DOPLNIT], Praha (dále jen „prodávající").</p>
          <p><strong>1.3 Kupujícím</strong> je fyzická nebo právnická osoba, která uzavírá smlouvu s prodávajícím (dále jen „kupující"). Kupující-spotřebitel je fyzická osoba jednající mimo rámec své podnikatelské činnosti.</p>
          <p><strong>1.4 Zbožím</strong> se rozumí produkty nabízené na webovém rozhraní – zejména pravé lidské vlasy k prodloužení, vlasové pásky, vlasové tresy (weft), keratin prameny, clip-in vlasy a vlasové doplňky.</p>
          <p><strong>1.5</strong> Právní vztahy těmito obchodními podmínkami výslovně neupravené se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Prodej lidských vlasů je v souladu s § 112 občanského zákoníku – lidské vlasy jsou věcí movitou, kterou lze přenechat jinému i za odměnu. Prodej vlasů prostřednictvím e-shopu není právně omezen.</p>
        </section>

        {/* Čl. 2 */}
        <section id="cl2">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 2 – Uzavření kupní smlouvy a objednávka</h2>
          <p><strong>2.1</strong> Prezentace zboží na webovém rozhraní je informativního charakteru a nepředstavuje návrh na uzavření smlouvy. Smlouva je uzavřena okamžikem potvrzení objednávky prodávajícím.</p>
          <p><strong>2.2 Způsoby objednání:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Prostřednictvím e-shopu muzahair.cz – vyplněním objednávkového formuláře</li>
            <li>E-mailem na adresu info@muzahair.cz</li>
            <li>Osobně v showroomu prodávajícího v Praze</li>
            <li>Telefonicky na čísle +420 728 722 880</li>
          </ul>
          <p><strong>2.3</strong> Objednávka musí obsahovat: přesné označení zboží (název, typ, délka, barva, struktura, kolekce), počet kusů, způsob platby, způsob doručení a kontaktní údaje kupujícího.</p>
          <p><strong>2.4</strong> Po odeslání objednávky obdrží kupující potvrzovací e-mail. Kupní smlouva je uzavřena okamžikem doručení potvrzení objednávky od prodávajícího.</p>
          <p><strong>2.5</strong> Prodávající si vyhrazuje právo odmítnout objednávku v případě vyprodání zásob, nedostupnosti zboží nebo zjevné chyby v ceně na webovém rozhraní. V takovém případě o tom kupujícího neprodleně informuje a vrátí veškeré případně uhrazené platby do 14 dní.</p>
          <p><strong>2.6</strong> Storno objednávky je možné bezplatně provést do 24 hodin od jejího podání, pokud zboží ještě nebylo předáno dopravci. Po uplynutí této lhůty je storno možné pouze v případě, že výroba zboží dosud nezačala.</p>
        </section>

        {/* Čl. 3 */}
        <section id="cl3">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 3 – Ceny, platba a fakturace</h2>
          <p><strong>3.1</strong> Ceny zboží jsou uvedeny na webovém rozhraní v českých korunách (CZK). Prodávající není plátcem DPH.</p>
          <p><strong>3.2</strong> Ceny jsou platné v okamžiku odeslání objednávky. Prodávající si vyhrazuje právo změnit ceny zboží; změna cen se nevztahuje na již potvrzené objednávky.</p>
          <p><strong>3.3 Způsoby platby:</strong></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Způsob platby</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Poplatek</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Poznámka</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Platba kartou online</td>
                  <td className="border border-gray-300 px-3 py-2">Zdarma</td>
                  <td className="border border-gray-300 px-3 py-2">Okamžitá úhrada přes platební bránu</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">Bankovní převod</td>
                  <td className="border border-gray-300 px-3 py-2">Zdarma</td>
                  <td className="border border-gray-300 px-3 py-2">Zboží expedováno po přijetí platby</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Hotově v showroomu</td>
                  <td className="border border-gray-300 px-3 py-2">Zdarma</td>
                  <td className="border border-gray-300 px-3 py-2">Pouze při osobním odběru Praha</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">Dobírka (PPL / Zásilkovna)</td>
                  <td className="border border-gray-300 px-3 py-2">Dle dopravce</td>
                  <td className="border border-gray-300 px-3 py-2">Platba při převzetí zásilky</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Záloha 50 % (zakázková výroba)</td>
                  <td className="border border-gray-300 px-3 py-2">Zdarma</td>
                  <td className="border border-gray-300 px-3 py-2">Zbývající část při předání</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>3.4</strong> Vlastnické právo ke zboží přechází na kupujícího okamžikem úplného zaplacení kupní ceny a převzetí zboží.</p>
          <p><strong>3.5</strong> Daňový doklad (faktura) je zasílán elektronicky na e-mailovou adresu kupujícího, nebo přiložen k zásilce.</p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm">
            <p className="font-semibold">⚠️ Důležité</p>
            <p>Prodávající je oprávněn požadovat úhradu zálohy nebo celé ceny před expedicí zboží, zejména u zakázkové výroby (pásky, weft, clip-in) a u objednávek nad 5 000 Kč.</p>
          </div>
        </section>

        {/* Čl. 4 */}
        <section id="cl4">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 4 – Dodání zboží – doprava a dodací lhůty</h2>
          <p><strong>4.1 Způsoby dodání:</strong></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Způsob dopravy</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Cena</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Dodání</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Zásilkovna (výdejní místo)</td>
                  <td className="border border-gray-300 px-3 py-2">79 Kč</td>
                  <td className="border border-gray-300 px-3 py-2">2–3 pracovní dny</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">PPL – doručení na adresu</td>
                  <td className="border border-gray-300 px-3 py-2">119 Kč</td>
                  <td className="border border-gray-300 px-3 py-2">1–2 pracovní dny</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">PPL – doručení na adresu (dobírka)</td>
                  <td className="border border-gray-300 px-3 py-2">149 Kč</td>
                  <td className="border border-gray-300 px-3 py-2">1–2 pracovní dny</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">Osobní odběr – showroom Praha</td>
                  <td className="border border-gray-300 px-3 py-2">Zdarma</td>
                  <td className="border border-gray-300 px-3 py-2">Dle dohody, Po–So 10–18 h</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Doprava ZDARMA</td>
                  <td className="border border-gray-300 px-3 py-2">0 Kč</td>
                  <td className="border border-gray-300 px-3 py-2">Objednávky nad [DOPLNIT] Kč</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>4.2 Dodací lhůty:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Skladové zboží: expedice do 1–3 pracovních dnů od potvrzení objednávky (resp. přijetí platby)</li>
            <li>Zakázková výroba – vlasové pásky, weft, clip-in: <strong>14 pracovních dnů</strong></li>
            <li>Zakázková výroba – keratin prameny, micro keratin: <strong>3 pracovní dny</strong></li>
            <li>Zboží dostupné na objednávku: dle individuální dohody</li>
          </ul>
          <p><strong>4.3</strong> Při převzetí zboží je kupující povinen zkontrolovat neporušenost obalu. Zjistí-li poškození, informuje okamžitě dopravce a prodávajícího. Zásilku s viditelně poškozeným obalem je kupující oprávněn odmítnout.</p>
          <p><strong>4.4</strong> Pokud kupující zásilku bezdůvodně odmítne převzít nebo si ji nevyzvedne, prodávající je oprávněn účtovat náklady na dopravu a případné skladné.</p>
          <p><strong>4.5</strong> Zasílání do zahraničí je možné po individuální domluvě. Výše poštovného pro zahraniční zásilky je stanovena individuálně dle destinace a hmotnosti zásilky.</p>
        </section>

        {/* Čl. 5 */}
        <section id="cl5">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 5 – Specifika zboží – lidské vlasy</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-sm mb-4">
            <p className="font-semibold">⚠️ Důležité</p>
            <p>Lidské vlasy jsou přírodní produkt. Z hygienických důvodů nelze vrátit ani reklamovat vlasy, které byly použity (aplikovány na hlavu), chemicky upraveny (barveny, zesvětlovány) nebo mechanicky poškozeny nevhodnou péčí.</p>
          </div>
          <p><strong>5.1</strong> Vzhledem k přirozené povaze lidských vlasů upozorňujeme na tato specifika:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Barva vlasů na monitoru nebo fotografii se může mírně lišit od skutečnosti vlivem nastavení displeje a světelných podmínek. Za tuto odchylku nelze uplatňovat reklamaci.</li>
            <li>Přírodní vlasy mohou vykazovat mírné odlišnosti ve struktuře, tloušťce a přirozené vlnitosti – to je charakteristikou přírodního produktu, nikoli vadou.</li>
            <li>Životnost vlasů závisí na způsobu a frekvenci péče. Doporučujeme používat profesionální kosmetiku pro prodloužené vlasy.</li>
            <li>Vlasy, u nichž došlo ke znatelnému snížení kvality vlivem nevhodné péče (nevhodné šampony, barvení bez konzultace, přehnívání), nelze reklamovat.</li>
            <li>Po aplikaci vlasů v salonu nebo showroomu nejsou vlasy považovány za použité – pokud nebyly chemicky ani mechanicky poškozeny.</li>
          </ul>
          <p><strong>5.2</strong> Doporučení před nákupem: Pokud si nejste jistá výběrem odstínu nebo délky, doporučujeme konzultaci v showroomu Múza Hair Praha – konzultace je zdarma. Vzorník barev je k dispozici osobně.</p>
          <p><strong>5.3</strong> Kupující bere na vědomí, že vlasy zakoupené jako „barvené" prošly procesem odbarvování a/nebo tónování v barvírně Múza Hair. Tyto vlasy jsou připraveny k použití a není doporučeno je dále zesvětlovat v domácích podmínkách bez konzultace s odborníkem.</p>
        </section>

        {/* Čl. 6 */}
        <section id="cl6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 6 – Odstoupení od smlouvy – vrácení zboží do 14 dní</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded text-sm mb-4">
            <p className="font-semibold">Zákonné právo</p>
            <p>Kupující-spotřebitel má právo odstoupit od kupní smlouvy uzavřené přes e-shop nebo mimo obchodní prostory (telefon, e-mail) bez udání důvodu ve lhůtě <strong>14 dní</strong> od převzetí zboží. Toto právo se nevztahuje na zboží upravené na míru (zakázková výroba), použité zboží a zboží z hygienických důvodů nevhodné k vrácení po otevření.</p>
          </div>
          <p><strong>6.1</strong> Lhůta pro odstoupení: <strong>14 kalendářních dní</strong> ode dne převzetí zboží kupujícím.</p>
          <p><strong>6.2 Kdy NELZE od smlouvy odstoupit:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Vlasy vyrobené na zakázku podle specifikací kupujícího (zakázkové pásky, weft, keratin prameny, clip-in dle přání)</li>
            <li>Vlasy, které byly aplikovány na hlavu nebo jinak použity</li>
            <li>Vlasy, které byly barveny, zesvětlovány nebo jinak chemicky upravovány kupujícím</li>
            <li>Vlasy s porušenou originální páskou nebo sponkou (clip-in – pokud byly sponky rozepnuty a vlasy aplikovány)</li>
            <li>Zboží poškozené nevhodnou manipulací nebo nesprávným skladováním kupujícím</li>
          </ul>
          <p><strong>6.3 Postup pro vrácení zboží:</strong></p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Informujte nás o odstoupení e-mailem na <a href="mailto:info@muzahair.cz" className="text-burgundy underline">info@muzahair.cz</a> nebo písemně. Uveďte číslo objednávky, název zboží a důvod vrácení.</li>
            <li>Zboží zašlete doporučenou zásilkou (<strong>NE na dobírku</strong> – takové zásilky nepřebíráme) na adresu prodávajícího, nebo předejte osobně v showroomu.</li>
            <li>Zboží musí být nepoužité, nepoškozené, v originálním obalu s originálními etiketami.</li>
            <li>Kupující nese náklady na zaslání zboží zpět prodávajícímu.</li>
            <li>Prodávající vrátí kupní cenu do 14 dní od převzetí vráceného zboží, a to převodem na bankovní účet kupujícího.</li>
          </ol>
          <p><strong>6.4</strong> Poplatek za opětovné naskladnění: <strong>100 Kč za každou položku</strong>. Tento poplatek bude odečten od vrácené kupní ceny.</p>
          <p><strong>6.5</strong> Výměna zboží za jiný odstín nebo délku: Pokud zboží nebylo použito, umožňujeme výměnu za jiný odstín nebo délku do 14 dní. Náklady na zpětné zaslání hradí kupující. Nové zboží zasíláme bez poplatku za dopravu.</p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm">
            <p className="font-semibold">ℹ️ Specifika pro clip-in vlasy</p>
            <p>Vlasy CLIP-IN máte právo vyjmout z obalu a přiložit k vlastním vlasům pro vizuální kontrolu barvy a délky. <strong>NELZE</strong> však rozepínat sponky a vlasy aplikovat na hlavu – v takovém případě je zboží považováno za použité a nelze jej vrátit.</p>
          </div>
        </section>

        {/* Čl. 7 */}
        <section id="cl7">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 7 – Práva z vadného plnění – záruční podmínky</h2>
          <p><strong>7.1 Záruční doba:</strong> Na nepoužité zboží poskytujeme záruční dobu <strong>24 měsíců</strong> od převzetí zboží.</p>
          <p><strong>7.2 Co je vadou zboží:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Dodání jiného zboží, než bylo objednáno (jiná délka, barva, typ)</li>
            <li>Vadná nebo chybějící aplikační páska (u tape-in)</li>
            <li>Poškozená sponka (u clip-in) při převzetí</li>
            <li>Neodpovídající gramáž balení (tolerance ± 3 g)</li>
          </ul>
          <p><strong>7.3 Co NENÍ vadou zboží:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Přirozená odchylka v odstínu barvy oproti zobrazení na monitoru</li>
            <li>Přirozená mírná vlnitost slovanských vlasů (85 % slovanských vlasů je přirozeně lehce vlnité)</li>
            <li>Změna struktury vlasů vlivem nesprávné péče, přehnívání nebo chemické úpravy</li>
            <li>Opotřebení vlasů způsobené obvyklým používáním (ztráta lesku, mírné zkrácení vlivem suché péče)</li>
            <li>Ztráta barvy u tónovaných vlasů při používání šamponů nevhodných pro barvené vlasy</li>
          </ul>
          <p><strong>7.4</strong> Kupující je povinen kontrolovat kvalitu (barvu, délku, strukturu, gramáž) ihned po převzetí zásilky. Vady zjistitelné při převzetí je kupující povinen nahlásit bez zbytečného odkladu.</p>
        </section>

        {/* Čl. 8 */}
        <section id="cl8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 8 – Reklamační řád</h2>
          <p><strong>8.1 Kde reklamaci uplatnit:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>E-mailem: <a href="mailto:reklamace@muzahair.cz" className="text-burgundy underline">reklamace@muzahair.cz</a> (uveďte číslo objednávky, popis vady, fotografie)</li>
            <li>Osobně: v showroomu Múza Hair Praha (po předchozí domluvě)</li>
            <li>Písemně na adresu: [Adresa prodávajícího], Praha</li>
          </ul>
          <p><strong>8.2 Co uvést v reklamaci:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Číslo objednávky a datum nákupu</li>
            <li>Přesný popis vady (čím vlasy neodpovídají objednávce)</li>
            <li>Fotodokumentace vady</li>
            <li>Veškeré úkony provedené na vlasech od nákupu (aplikace, péče, barvení)</li>
            <li>Požadovaný způsob vyřešení reklamace</li>
          </ul>
          <p><strong>8.3</strong> Lhůta pro vyřízení reklamace: Reklamace bude vyřízena bez zbytečného odkladu, nejpozději do <strong>30 kalendářních dnů</strong> ode dne jejího uplatnění. O výsledku budete informováni e-mailem.</p>
          <p><strong>8.4 Práva kupujícího z vadného plnění</strong> (dle § 2099 a násl. OZ):</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Dodání nového zboží bez vady (výměna)</li>
            <li>Oprava vady (pokud je to možné)</li>
            <li>Přiměřená sleva z kupní ceny</li>
            <li>Odstoupení od smlouvy (vrácení peněz) – při podstatném porušení smlouvy</li>
          </ul>
          <p><strong>8.5</strong> Reklamace vlasů po aplikaci: Při reklamaci vlasů, které byly již aplikovány na hlavu kadeřníkem, je nutné doložit popis aplikačního procesu a používané přípravky. Vlasy poškozené neodbornou aplikací nebo nevhodnou péčí nemohou být uznány jako vadné.</p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm">
            <p className="font-semibold">⚠️ Důležité</p>
            <p>Zboží zaslané na reklamaci <strong>na dobírku nepřebíráme</strong>. Přepravní náklady v případě oprávněné reklamace hradí prodávající. V případě neoprávněné reklamace hradí kupující přepravní náklady oběma směry.</p>
          </div>
        </section>

        {/* Čl. 9 */}
        <section id="cl9">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 9 – Výroba na zakázku</h2>
          <p><strong>9.1</strong> Zakázkovou výrobou se rozumí výroba vlasových produktů dle specifikace kupujícího – zejména vlasové pásky, weft, clip-in a keratin prameny vyrobené z culíku kupujícího nebo z naší zásoby dle přesného požadavku.</p>
          <p><strong>9.2 Výrobní lhůty:</strong></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Typ výroby</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Lhůta</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-300 px-3 py-2">Vlasové pásky (tape-in)</td><td className="border border-gray-300 px-3 py-2">14 pracovních dnů</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">Weft (Hollywood prodloužení)</td><td className="border border-gray-300 px-3 py-2">14 pracovních dnů</td></tr>
                <tr><td className="border border-gray-300 px-3 py-2">Clip-in vlasy</td><td className="border border-gray-300 px-3 py-2">14 pracovních dnů</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">Keratin prameny</td><td className="border border-gray-300 px-3 py-2">3 pracovní dny</td></tr>
                <tr><td className="border border-gray-300 px-3 py-2">Micro keratin prameny</td><td className="border border-gray-300 px-3 py-2">3 pracovní dny</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>9.3</strong> Zakázkové zboží vyrobené dle specifikace kupujícího <strong>NELZE vrátit ani vyměnit</strong> – viz čl. 6.2. Výjimkou je případ, kdy zboží trpí vadou (neodpovídá objednávce).</p>
          <p><strong>9.4</strong> Výroba z culíku kupujícího: Kupující může přinést vlastní culík do showroomu nebo nám ho zaslat. Prodávající z culíku vyrobí požadované zakončení. Hmotnost a délka hotového výrobku závisí na kvalitě a délce dodaného culíku.</p>
          <p><strong>9.5</strong> Záloha na zakázkovou výrobu: U zakázkové výroby je prodávající oprávněn požadovat zálohu <strong>50 % kupní ceny</strong> před zahájením výroby.</p>
        </section>

        {/* Čl. 10 */}
        <section id="cl10">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 10 – Velkoobchodní podmínky (B2B)</h2>
          <p><strong>10.1</strong> Tyto obchodní podmínky se vztahují i na obchodní vztahy s podnikateli (B2B). Na spotřebitele-podnikatele se nevztahuje zákonná ochrana spotřebitele (zejm. právo odstoupit od smlouvy do 14 dní bez udání důvodu).</p>
          <p><strong>10.2 Velkoobchodní podmínky Múza Hair Praha:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Minimální objednávka pro B2B: [DOPLNIT minimální hodnotu nebo množství]</li>
            <li>Velkoobchodní ceny: přiděleny po registraci jako B2B partner</li>
            <li>Splatnost faktur: 14 dní (po dohodě možno prodloužit na 30 dní)</li>
            <li>Možnost osobního odběru v showroomu Praha – po předchozí domluvě</li>
            <li>Možnost konzultace vzorků před objednávkou</li>
            <li>Pravidelné zásoby – přednostní zpracování B2B objednávek</li>
          </ul>
          <p><strong>10.3</strong> Pro registraci jako B2B partner kontaktujte: <a href="mailto:b2b@muzahair.cz" className="text-burgundy underline">b2b@muzahair.cz</a> nebo telefonicky +420 728 722 880.</p>
          <p><strong>10.4</strong> B2B kupující nemá právo na odstoupení od smlouvy bez udání důvodu. Reklamace se řídí čl. 7 a 8 těchto podmínek, přičemž se nepoužijí ustanovení o spotřebitelských právech.</p>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded text-sm">
            <p className="font-semibold">ℹ️ Důležité</p>
            <p>Prodávající poskytuje B2B partnerům: vzorkovník barev, marketingové fotografie k produktům, doporučení pro aplikaci, přednostní zákaznickou podporu.</p>
          </div>
        </section>

        {/* Čl. 11 */}
        <section id="cl11">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 11 – Ochrana osobních údajů (GDPR)</h2>
          <p><strong>11.1</strong> Správcem osobních údajů je: Anna Zvinchuk, Múza Hair Praha s.r.o., IČO: [DOPLNIT].</p>
          <p><strong>11.2 Jaké údaje zpracováváme:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Identifikační údaje: jméno, příjmení, IČO (u B2B)</li>
            <li>Kontaktní údaje: e-mail, telefon, doručovací adresa</li>
            <li>Transakční údaje: údaje o objednávkách, platbách</li>
            <li>Komunikační údaje: e-mailová a telefonická komunikace</li>
          </ul>
          <p><strong>11.3</strong> Účel zpracování: Plnění kupní smlouvy, komunikace se zákazníkem, zasílání obchodního sdělení (pouze se souhlasem), vedení účetnictví, ochrana práv prodávajícího.</p>
          <p><strong>11.4</strong> Doba uchovávání: Po dobu trvání smluvního vztahu a po zákonem stanovenou dobu poté (účetní záznamy 10 let, daňové doklady 10 let).</p>
          <p><strong>11.5</strong> Práva subjektu údajů: Právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost dat a právo vznést námitku. Žádost adresujte na: <a href="mailto:info@muzahair.cz" className="text-burgundy underline">info@muzahair.cz</a>.</p>
          <p><strong>11.6</strong> Prodávající nepředává osobní údaje třetím stranám, s výjimkou dopravců (za účelem doručení zásilky) a zpracovatelů plateb.</p>
          <p><strong>11.7</strong> Dozorový orgán: Úřad pro ochranu osobních údajů (ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">www.uoou.cz</a>.</p>
        </section>

        {/* Čl. 12 */}
        <section id="cl12">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Článek 12 – Závěrečná ustanovení</h2>
          <p><strong>12.1</strong> Tyto obchodní podmínky jsou platné a účinné od <strong>1. 5. 2025</strong>. Prodávající si vyhrazuje právo tyto podmínky měnit – změny vstupují v platnost dnem zveřejnění na webovém rozhraní.</p>
          <p><strong>12.2</strong> Mimosoudní řešení spotřebitelských sporů: Kupující-spotřebitel má právo obrátit se na Českou obchodní inspekci (ČOI) – <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">www.coi.cz</a>, nebo na platformu pro řešení sporů online: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-burgundy underline">ec.europa.eu/consumers/odr</a>.</p>
          <p><strong>12.3</strong> Tyto obchodní podmínky jsou dostupné na webovém rozhraní muzahair.cz/obchodni-podminky/ a jsou k dispozici v showroomu Múza Hair Praha.</p>
          <p><strong>12.4</strong> Kupující odesláním objednávky stvrzuje, že se s těmito obchodními podmínkami seznámil a souhlasí s nimi.</p>
        </section>

        {/* Kontakty */}
        <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Kontakty pro zákaznickou podporu</h2>
          <ul className="space-y-1 text-sm">
            <li>Běžné dotazy: <a href="mailto:info@muzahair.cz" className="text-burgundy underline">info@muzahair.cz</a></li>
            <li>Reklamace: <a href="mailto:reklamace@muzahair.cz" className="text-burgundy underline">reklamace@muzahair.cz</a></li>
            <li>B2B / Velkoobchod: <a href="mailto:b2b@muzahair.cz" className="text-burgundy underline">b2b@muzahair.cz</a></li>
            <li>Showroom Praha: [Adresa] – Po–So 10–18 h</li>
            <li>Telefon: <a href="tel:+420728722880" className="text-burgundy underline">+420 728 722 880</a></li>
          </ul>
        </section>

        {/* Příloha 1 */}
        <section id="priloha1" className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Příloha č. 1 – Vzorový formulář pro odstoupení od smlouvy</h2>
          <p className="text-sm text-gray-600 mb-4">Vyplňte a zašlete pouze v případě, že chcete odstoupit od smlouvy.</p>
          <div className="text-sm space-y-2 text-gray-700">
            <p><strong>Komu:</strong> Múza Hair Praha s.r.o., [adresa], Praha &nbsp;|&nbsp; <a href="mailto:info@muzahair.cz" className="text-burgundy underline">info@muzahair.cz</a></p>
            <p>Oznamuji, že tímto odstupuji od kupní smlouvy na zboží:</p>
            <div className="space-y-2 ml-4">
              {[
                'Název zboží',
                'Číslo objednávky',
                'Datum objednání',
                'Datum převzetí',
                'Jméno kupujícího',
                'Adresa kupujícího',
                'Číslo účtu pro vrácení',
                'Datum',
                'Podpis',
              ].map((label) => (
                <div key={label} className="flex gap-2">
                  <span className="min-w-[200px] font-medium">{label}:</span>
                  <span className="flex-1 border-b border-gray-400">&nbsp;</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Vyplněný formulář zašlete e-mailem na info@muzahair.cz nebo doporučeně poštou na adresu prodávajícího. Zboží zašlete doporučenou zásilkou (nikoli na dobírku) nejpozději do 14 dní od odeslání tohoto formuláře.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
