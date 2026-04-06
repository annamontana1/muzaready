import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů | MuzaReady',
  description: 'Informace o zpracování osobních údajů v souladu s GDPR',
};

export default function OchranaOsobnichUdajuPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Ochrana osobních údajů</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-text-mid mb-8">
          Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
        </p>

        {/* 1. ÚVODNÍ USTANOVENÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">1. Úvodní ustanovení</h2>

          <p className="mb-4">
            Tento dokument obsahuje informace o zpracování osobních údajů provozovaného e-shopu
            <strong> MuzaReady.cz</strong> (dále jen „e-shop") v souladu s nařízením Evropského
            parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním
            osobních údajů a o volném pohybu těchto údajů (GDPR).
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-4">
            <h3 className="font-bold text-text-dark mb-2">Správce osobních údajů:</h3>
            <p className="mb-2"><strong>Název:</strong> [NÁZEV SPOLEČNOSTI / JMÉNO PODNIKATELE]</p>
            <p className="mb-2"><strong>IČO:</strong> [IČO]</p>
            <p className="mb-2"><strong>Sídlo:</strong> Revoluční 8, Praha 1, 110 00</p>
            <p className="mb-2"><strong>E-mail:</strong> [EMAIL]</p>
            <p className="mb-2"><strong>Telefon:</strong> [TELEFON]</p>
            <p className="text-sm text-text-mid mt-4">
              (dále jen „správce" nebo „my")
            </p>
          </div>

          <p className="mb-4">
            Ochrana vašeho soukromí je pro nás prioritou. Tento dokument vás informuje o tom,
            jaké osobní údaje shromažďujeme, jak je používáme, komu je předáváme a jaká máte práva.
          </p>
        </section>

        {/* 2. ZÁKLADNÍ POJMY */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">2. Základní pojmy</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Osobní údaj:</strong> jakákoli informace týkající se identifikované nebo
              identifikovatelné fyzické osoby (např. jméno, adresa, e-mail, IP adresa)
            </li>
            <li>
              <strong>Zpracování:</strong> jakákoliv operace s osobními údaji (shromažďování,
              uchovávání, úprava, použití, předání, výmaz atd.)
            </li>
            <li>
              <strong>Správce:</strong> subjekt, který určuje účel a prostředky zpracování
              osobních údajů (v tomto případě provozovatel e-shopu)
            </li>
            <li>
              <strong>Zpracovatel:</strong> subjekt, který zpracovává osobní údaje jménem správce
              (např. dopravce, platební brána)
            </li>
            <li>
              <strong>Subjekt údajů:</strong> fyzická osoba, jejíž osobní údaje jsou zpracovávány
              (vy jako zákazník)
            </li>
          </ul>
        </section>

        {/* 3. JAKÉ OSOBNÍ ÚDAJE ZPRACOVÁVÁME */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">3. Jaké osobní údaje zpracováváme</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">3.1 Údaje při registraci a objednávce</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Jméno a příjmení</strong> - pro identifikaci zákazníka a doručení objednávky</li>
                <li><strong>E-mailová adresa</strong> - pro komunikaci o objednávce a zasílání potvrzení</li>
                <li><strong>Telefonní číslo</strong> - pro kontakt při doručení nebo dotazech k objednávce</li>
                <li><strong>Doručovací adresa</strong> - pro doručení zboží</li>
                <li><strong>Fakturační adresa</strong> - pro vystavení daňového dokladu (pokud se liší od doručovací)</li>
                <li><strong>IČO, DIČ</strong> - pokud nakupujete jako podnikatel/firma</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">3.2 Technické údaje</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>IP adresa</strong> - pro zabezpečení a prevenci podvodů</li>
                <li><strong>Cookies a identifikátory zařízení</strong> - pro funkčnost webu a analytiku</li>
                <li><strong>Údaje o prohlížeči a zařízení</strong> - pro optimalizaci webu</li>
                <li><strong>Historie nákupů</strong> - pro evidenci objednávek a zákaznický servis</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">3.3 Platební údaje</h3>
              <p className="mb-2">
                Platební údaje (číslo karty, CVV kód) jsou zpracovávány přímo platební bránou a
                <strong> nejsou ukládány na našich serverech</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Při platbě kartou: zpracovává platební brána (PCI DSS certifikovaná)</li>
                <li>Při platbě převodem: evidujeme variabilní symbol a datum platby</li>
                <li>Při dobírce: evidujeme způsob platby pro potřeby dopravce</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">3.4 Komunikace</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>E-mailová korespondence</strong> - záznamy komunikace pro zákaznický servis</li>
                <li><strong>Telefonická komunikace</strong> - záznamy dotazů a řešení reklamací</li>
                <li><strong>Chat zprávy</strong> - pokud využíváte online chat podporu</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. ÚČELY ZPRACOVÁNÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">4. Účely zpracování a právní základ</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-warm-beige">
              <thead className="bg-soft-cream">
                <tr>
                  <th className="border border-warm-beige px-4 py-2 text-left">Účel zpracování</th>
                  <th className="border border-warm-beige px-4 py-2 text-left">Právní základ</th>
                  <th className="border border-warm-beige px-4 py-2 text-left">Doba zpracování</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Zpracování a vyřízení objednávky</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Přijmutí objednávky, komunikace, doručení, fakturace
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Po dobu trvání smluvního vztahu + 3 roky po ukončení
                  </td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Účetní a daňové účely</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Archivace dokladů, evidence pro daňovou kontrolu
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Plnění právní povinnosti (čl. 6 odst. 1 písm. c) GDPR)
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    10 let od konce zdaňovacího období (dle zákona o účetnictví)
                  </td>
                </tr>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Marketingová komunikace</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Zasílání newsletterů, nabídek, slev
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Souhlas (čl. 6 odst. 1 písm. a) GDPR)
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Do odvolání souhlasu
                  </td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Reklamace a záruční plnění</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Vyřizování reklamací, záruční opravy
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Plnění právní povinnosti + oprávněný zájem
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Po dobu trvání záruky + 3 roky po uplatnění reklamace
                  </td>
                </tr>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Prevence podvodů a zneužití</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Ochrana před podvodnými objednávkami, spam
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Oprávněný zájem správce (čl. 6 odst. 1 písm. f) GDPR)
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    1 rok od pokusu o zneužití
                  </td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">
                    <strong>Analýza chování na webu</strong>
                    <br />
                    <span className="text-sm text-text-mid">
                      Google Analytics, heatmapy, optimalizace
                    </span>
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Souhlas (cookies)
                  </td>
                  <td className="border border-warm-beige px-4 py-2">
                    Do odvolání souhlasu, max. 26 měsíců
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. KOMU PŘEDÁVÁME ÚDAJE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">5. Komu předáváme osobní údaje</h2>

          <p className="mb-4">
            Vaše osobní údaje mohou být předány následujím kategoriím příjemců (zpracovatelů):
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-text-dark mb-2">Dopravní společnosti</h3>
              <p className="text-text-mid">
                <strong>Účel:</strong> Doručení zboží
                <br />
                <strong>Předávané údaje:</strong> Jméno, příjmení, telefon, doručovací adresa
                <br />
                <strong>Příjemci:</strong> Zásilkovna (Packeta), Česká pošta, DPD, GLS a další
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-text-dark mb-2">Platební brány</h3>
              <p className="text-text-mid">
                <strong>Účel:</strong> Zpracování plateb
                <br />
                <strong>Předávané údaje:</strong> Částka, e-mail, variabilní symbol (platební údaje zpracovává přímo brána)
                <br />
                <strong>Příjemci:</strong> [NÁZEV PLATEBNÍ BRÁNY]
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-text-dark mb-2">Účetní a daňové služby</h3>
              <p className="text-text-mid">
                <strong>Účel:</strong> Vedení účetnictví, daňová evidence
                <br />
                <strong>Předávané údaje:</strong> Fakturační údaje, IČO, DIČ
                <br />
                <strong>Příjemci:</strong> Externí účetní
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-text-dark mb-2">Marketingové nástroje</h3>
              <p className="text-text-mid">
                <strong>Účel:</strong> Zasílání newsletterů, analýza kampaní
                <br />
                <strong>Předávané údaje:</strong> E-mail, jméno (s vaším souhlasem)
                <br />
                <strong>Příjemci:</strong> Google Analytics, Facebook Pixel, MailChimp/SendGrid
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-text-dark mb-2">Hostingové služby</h3>
              <p className="text-text-mid">
                <strong>Účel:</strong> Provoz webu a databáze
                <br />
                <strong>Předávané údaje:</strong> Všechny údaje uložené v systému
                <br />
                <strong>Příjemci:</strong> Vercel (hosting), Supabase (databáze)
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-6">
            <h3 className="font-bold text-text-dark mb-2">🔒 Zabezpečení</h3>
            <p className="text-text-mid">
              Všichni zpracovatelé jsou smluvně zavázáni k ochraně osobních údajů a mohou je
              používat pouze pro účely, které jsme jim stanovili. Údaje nepředáváme třetím stranám
              pro jejich vlastní marketingové účely bez vašeho souhlasu.
            </p>
          </div>
        </section>

        {/* 6. VAŠE PRÁVA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">6. Vaše práva</h2>

          <p className="mb-6">
            Podle GDPR máte následující práva vztahující se k vašim osobním údajům:
          </p>

          <div className="space-y-4">
            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">📋 Právo na přístup k údajům</h3>
              <p className="text-text-mid">
                Máte právo získat potvrzení, zda zpracováváme vaše osobní údaje, a pokud ano,
                máte právo získat kopii těchto údajů včetně informací o jejich zpracování.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">✏️ Právo na opravu</h3>
              <p className="text-text-mid">
                Máte právo požadovat opravu nepřesných nebo neúplných osobních údajů.
                Opravy můžete provést sami ve svém uživatelském účtu nebo nás kontaktovat.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">🗑️ Právo na výmaz ("právo být zapomenut")</h3>
              <p className="text-text-mid mb-2">
                Máte právo požadovat výmaz osobních údajů, pokud:
              </p>
              <ul className="list-disc pl-6 text-text-mid space-y-1">
                <li>Již nejsou potřebné pro účely, pro které byly shromážděny</li>
                <li>Odvoláte souhlas a neexistuje jiný právní základ pro zpracování</li>
                <li>Vznesete námitku proti zpracování a neexistují oprávnené důvody pro zpracování</li>
                <li>Osobní údaje byly zpracovány protiprávně</li>
              </ul>
              <p className="text-text-mid mt-2 text-sm">
                <strong>Poznámka:</strong> Některé údaje musíme uchovávat ze zákona (např. účetní doklady po dobu 10 let).
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">⏸️ Právo na omezení zpracování</h3>
              <p className="text-text-mid">
                Máte právo požadovat omezení zpracování (např. pouze uchovávání bez dalšího použití),
                pokud popíráte přesnost údajů, zpracování je protiprávní nebo již údaje nepotřebujeme,
                ale vy je požadujete pro právní nároky.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">📦 Právo na přenositelnost údajů</h3>
              <p className="text-text-mid">
                Máte právo získat osobní údaje, které jste nám poskytli, ve strukturovaném, běžně
                používaném a strojově čitelném formátu (např. CSV, JSON) a máte právo předat tyto
                údaje jinému správci.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">🚫 Právo vznést námitku</h3>
              <p className="text-text-mid mb-2">
                Máte právo kdykoliv vznést námitku proti zpracování osobních údajů, které je
                prováděno na základě oprávněného zájmu nebo pro účely přímého marketingu.
              </p>
              <p className="text-text-mid text-sm">
                <strong>Přímý marketing:</strong> Pokud vznesete námitku proti zpracování pro účely
                přímého marketingu, nebudeme již vaše osobní údaje pro tyto účely zpracovávat.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">❌ Právo odvolat souhlas</h3>
              <p className="text-text-mid">
                Pokud je zpracování založeno na souhlasu, máte právo tento souhlas kdykoliv odvolat.
                Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.
              </p>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="text-lg font-bold text-text-dark mb-2">⚖️ Právo podat stížnost u dozorového úřadu</h3>
              <p className="text-text-mid mb-2">
                Máte právo podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ), pokud se
                domníváte, že zpracování vašich osobních údajů porušuje GDPR.
              </p>
              <div className="mt-3 p-4 bg-soft-cream rounded">
                <p className="font-semibold">Úřad pro ochranu osobních údajů</p>
                <p className="text-sm">Pplk. Sochora 27, 170 00 Praha 7</p>
                <p className="text-sm">E-mail: posta@uoou.cz</p>
                <p className="text-sm">Tel.: +420 234 665 111</p>
                <p className="text-sm">Web: www.uoou.cz</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-6">
            <h3 className="font-bold text-text-dark mb-2">📧 Jak uplatnit vaše práva</h3>
            <p className="text-text-mid mb-2">
              Pro uplatnění kteréhokoliv z výše uvedených práv nás kontaktujte:
            </p>
            <ul className="list-disc pl-6 text-text-mid">
              <li><strong>E-mailem:</strong> [EMAIL]</li>
              <li><strong>Poštou:</strong> Revoluční 8, Praha 1, 110 00</li>
              <li><strong>Telefonicky:</strong> [TELEFON]</li>
            </ul>
            <p className="text-text-mid mt-3 text-sm">
              Odpovíme vám do <strong>30 dnů</strong> od obdržení žádosti. V odůvodněných případech
              můžeme tuto lhůtu prodloužit o další 2 měsíce.
            </p>
          </div>
        </section>

        {/* 7. COOKIES */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">7. Cookies a sledovací technologie</h2>

          <p className="mb-4">
            Náš web používá cookies (malé textové soubory uložené ve vašem prohlížeči) a další
            sledovací technologie pro zlepšení funkčnosti webu a analýzu návštěvnosti.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">🔧 Nezbytné cookies (funkční)</h3>
              <p className="text-text-mid mb-2">
                Tyto cookies jsou nezbytné pro fungování webu a nelze je vypnout. Používají se pro:
              </p>
              <ul className="list-disc pl-6 text-text-mid">
                <li>Zapamatování položek v nákupním košíku</li>
                <li>Udržení přihlášení k uživatelskému účtu</li>
                <li>Zapamatování vašich preferencí (jazyk, měna)</li>
                <li>Zabezpečení webu (ochrana před útoky)</li>
              </ul>
              <p className="text-sm text-text-mid mt-2">
                <strong>Právní základ:</strong> Oprávněný zájem (nezbytné pro fungování webu)
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">📊 Analytické cookies</h3>
              <p className="text-text-mid mb-2">
                Pomáhají nám pochopit, jak návštěvníci používají web, abychom jej mohli vylepšovat:
              </p>
              <ul className="list-disc pl-6 text-text-mid">
                <li><strong>Google Analytics:</strong> Analýza návštěvnosti, zdroje návštěvníků, chování na webu</li>
                <li><strong>Heatmapy:</strong> Sledování klikání a scrollování pro optimalizaci designu</li>
                <li>Měření konverzí a úspěšnosti marketingových kampaní</li>
              </ul>
              <p className="text-sm text-text-mid mt-2">
                <strong>Právní základ:</strong> Váš souhlas (můžete odvolat v nastavení cookies)
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">📢 Marketingové cookies</h3>
              <p className="text-text-mid mb-2">
                Používají se pro cílenou reklamu a remarketing:
              </p>
              <ul className="list-disc pl-6 text-text-mid">
                <li><strong>Facebook Pixel:</strong> Sledování konverzí a zobrazování reklam na Facebooku</li>
                <li><strong>Google Ads:</strong> Remarketing a měření efektivity reklam</li>
                <li>Personalizace obsahu a nabídek</li>
              </ul>
              <p className="text-sm text-text-mid mt-2">
                <strong>Právní základ:</strong> Váš souhlas (můžete odvolat v nastavení cookies)
              </p>
            </div>
          </div>

          <div className="bg-soft-cream border border-warm-beige rounded-lg p-6 mt-6">
            <h3 className="font-bold text-text-dark mb-3">⚙️ Jak spravovat cookies</h3>
            <p className="text-text-mid mb-3">
              Váš souhlas s cookies můžete spravovat následujícími způsoby:
            </p>
            <ul className="list-disc pl-6 text-text-mid space-y-2">
              <li>
                <strong>Nastavení v banneru:</strong> Při první návštěvě webu se zobrazí cookie banner,
                kde můžete vybrat, které kategorie cookies akceptujete
              </li>
              <li>
                <strong>Nastavení prohlížeče:</strong> Můžete blokovat nebo mazat cookies přímo v nastavení
                vašeho prohlížeče (Chrome, Firefox, Safari, Edge)
              </li>
              <li>
                <strong>Odhlášení z Google Analytics:</strong> Můžete použít{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
            <p className="text-sm text-text-mid mt-4">
              <strong>Poznámka:</strong> Zablokování některých cookies může omezit funkčnost webu
              (např. nebude fungovat nákupní košík nebo přihlášení).
            </p>
          </div>
        </section>

        {/* 8. ZABEZPEČENÍ ÚDAJŮ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">8. Zabezpečení osobních údajů</h2>

          <p className="mb-4">
            Bezpečnost vašich osobních údajů bereme velmi vážně. Implementovali jsme následující
            technická a organizační opatření:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="font-semibold text-text-dark mb-2">🔐 Technická opatření</h3>
              <ul className="list-disc pl-6 text-text-mid space-y-1 text-sm">
                <li>SSL/TLS šifrování (HTTPS) pro veškerou komunikaci</li>
                <li>Šifrování citlivých dat v databázi</li>
                <li>Pravidelné bezpečnostní audity a aktualizace</li>
                <li>Firewall a ochrana před DDoS útoky</li>
                <li>Bezpečné hashování hesel (bcrypt)</li>
                <li>Dvou-faktorová autentizace pro administrátory</li>
                <li>Pravidelné zálohování dat</li>
              </ul>
            </div>

            <div className="bg-white border border-warm-beige rounded-lg p-6">
              <h3 className="font-semibold text-text-dark mb-2">📋 Organizační opatření</h3>
              <ul className="list-disc pl-6 text-text-mid space-y-1 text-sm">
                <li>Přístup k údajům pouze pro oprávněné osoby</li>
                <li>Smluvní zavázání zpracovatelů k ochraně údajů</li>
                <li>Školení zaměstnanců o GDPR a ochraně údajů</li>
                <li>Pravidelné kontroly zpracování údajů</li>
                <li>Plán reakce na bezpečnostní incidenty</li>
                <li>Minimalizace zpracovávaných údajů (Privacy by Design)</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mt-6">
            <h3 className="font-bold text-text-dark mb-2">⚠️ Oznámení bezpečnostního incidentu</h3>
            <p className="text-text-mid">
              V případě porušení zabezpečení osobních údajů (data breach), které může představovat
              riziko pro vaše práva a svobody, vás budeme informovat do <strong>72 hodin</strong> od
              zjištění incidentu. Současně incident nahlásíme Úřadu pro ochranu osobních údajů.
            </p>
          </div>
        </section>

        {/* 9. DOBA UCHOVÁVÁNÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">9. Doba uchovávání osobních údajů</h2>

          <p className="mb-4">
            Vaše osobní údaje uchováváme pouze po dobu nezbytně nutnou pro naplnění účelů,
            pro které byly shromážděny, nebo po dobu stanovenou zákonem:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-warm-beige">
              <thead className="bg-soft-cream">
                <tr>
                  <th className="border border-warm-beige px-4 py-2 text-left">Kategorie údajů</th>
                  <th className="border border-warm-beige px-4 py-2 text-left">Doba uchovávání</th>
                  <th className="border border-warm-beige px-4 py-2 text-left">Právní základ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">Objednávky a komunikace</td>
                  <td className="border border-warm-beige px-4 py-2">3 roky po ukončení smlouvy</td>
                  <td className="border border-warm-beige px-4 py-2">Promlčecí doba (občanský zákoník)</td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">Účetní doklady (faktury)</td>
                  <td className="border border-warm-beige px-4 py-2">10 let od konce zdaňovacího období</td>
                  <td className="border border-warm-beige px-4 py-2">Zákon o účetnictví, daňové předpisy</td>
                </tr>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">Reklamace a záruční plnění</td>
                  <td className="border border-warm-beige px-4 py-2">3 roky po vyřízení reklamace</td>
                  <td className="border border-warm-beige px-4 py-2">Promlčecí doba</td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">Marketingové souhlasy (newsletter)</td>
                  <td className="border border-warm-beige px-4 py-2">Do odvolání souhlasu</td>
                  <td className="border border-warm-beige px-4 py-2">Souhlas subjektu údajů</td>
                </tr>
                <tr>
                  <td className="border border-warm-beige px-4 py-2">Cookies a analytické údaje</td>
                  <td className="border border-warm-beige px-4 py-2">Max. 26 měsíců</td>
                  <td className="border border-warm-beige px-4 py-2">Souhlas (Google Analytics standard)</td>
                </tr>
                <tr className="bg-soft-cream">
                  <td className="border border-warm-beige px-4 py-2">Uživatelský účet (neaktivní)</td>
                  <td className="border border-warm-beige px-4 py-2">5 let od poslední aktivity</td>
                  <td className="border border-warm-beige px-4 py-2">Oprávněný zájem</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-text-mid mt-4">
            <strong>Poznámka:</strong> Po uplynutí doby uchovávání údaje bezpečně vymažeme nebo
            anonymizujeme (odstraníme všechny identifikátory, aby nebylo možné určit vaši identitu).
          </p>
        </section>

        {/* 10. PŘENOS ÚDAJŮ DO TŘETÍCH ZEMÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">10. Přenos osobních údajů mimo EU</h2>

          <p className="mb-4">
            Některé služby, které používáme, mohou zpracovávat vaše osobní údaje mimo Evropský
            hospodářský prostor (EHP). V takovém případě zajišťujeme, že:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              Země má rozhodnutí Evropské komise o přiměřené úrovni ochrany (např. Velká Británie)
            </li>
            <li>
              Jsou použity standardní smluvní doložky schválené Evropskou komisí
            </li>
            <li>
              Zpracovatel má platnou certifikaci (např. Privacy Shield - pro USA)
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <h3 className="font-bold text-text-dark mb-2">🌍 Služby s přenosem mimo EU</h3>
            <ul className="space-y-2 text-text-mid">
              <li>
                <strong>Google Analytics (USA):</strong> Standardní smluvní doložky + Google Cloud
                certifikace
              </li>
              <li>
                <strong>Vercel Hosting (USA):</strong> Standardní smluvní doložky, data může být
                uložena v EU regionu
              </li>
              <li>
                <strong>Supabase (mezinárodní):</strong> Data uložena v EU serveru (Frankfurt)
              </li>
            </ul>
          </div>
        </section>

        {/* 11. DĚTI A NEZLETILÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">11. Ochrana údajů dětí</h2>

          <p className="mb-4">
            Náš e-shop není určen dětem mladším 16 let. Vědomě neshromažďujeme osobní údaje dětí
            mladších 16 let bez souhlasu rodičů nebo zákonných zástupců.
          </p>

          <p className="mb-4">
            Pokud zjistíte, že nám dítě mladší 16 let poskytlo osobní údaje bez souhlasu zákonného
            zástupce, kontaktujte nás prosím na <strong>[EMAIL]</strong> a tyto údaje neprodleně
            vymažeme.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-text-mid">
              <strong>Pozor:</strong> Pokud má dítě věk 16-18 let, může nakupovat s předchozím
              souhlasem zákonného zástupce (dle občanského zákoníku). V takovém případě je zákonný
              zástupce odpovědný za právní jednání dítěte.
            </p>
          </div>
        </section>

        {/* 12. AUTOMATIZOVANÉ ROZHODOVÁNÍ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">12. Automatizované rozhodování a profilování</h2>

          <p className="mb-4">
            Na našem e-shopu <strong>nepoužíváme</strong> plně automatizované rozhodování, které by
            mělo právní účinky nebo významně ovlivňovalo vaši osobu (např. automatické zamítnutí
            objednávky bez lidského zásahu).
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Používáme:</h3>
              <ul className="list-disc pl-6 text-text-mid space-y-1">
                <li>
                  <strong>Doporučovací systémy:</strong> Zobrazení produktů, které by vás mohly
                  zajímat (na základě historie prohlížení a nákupů)
                </li>
                <li>
                  <strong>Detekce podvodů:</strong> Automatické kontroly podezřelých objednávek
                  (finální rozhodnutí vždy provádí člověk)
                </li>
                <li>
                  <strong>Personalizace obsahu:</strong> Přizpůsobení nabídek na základě vašich
                  preferencí
                </li>
              </ul>
            </div>

            <div className="bg-soft-cream border border-warm-beige rounded-lg p-6">
              <p className="text-text-mid">
                <strong>Vaše práva:</strong> Pokud bychom v budoucnu používali automatizované
                rozhodování s právními účinky, budete mít právo:
              </p>
              <ul className="list-disc pl-6 text-text-mid mt-2 space-y-1">
                <li>Získat lidský zásah ze strany správce</li>
                <li>Vyjádřit své stanovisko</li>
                <li>Napadnout rozhodnutí</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 13. ZMĚNY ZÁSAD */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">13. Změny těchto zásad ochrany osobních údajů</h2>

          <p className="mb-4">
            Vyhrazujeme si právo tyto zásady kdykoli aktualizovat, abychom zohlednili změny v právních
            předpisech, našich obchodních praktikách nebo používaných technologiích.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <h3 className="font-bold text-text-dark mb-2">📣 Oznámení změn</h3>
            <p className="text-text-mid mb-3">
              O podstatných změnách vás budeme informovat:
            </p>
            <ul className="list-disc pl-6 text-text-mid space-y-1">
              <li>E-mailem na adresu uvedenou ve vašem účtu (pokud jste registrováni)</li>
              <li>Oznámením na webu (banner nebo notifikace)</li>
              <li>Aktualizací data "Poslední aktualizace" v záhlaví tohoto dokumentu</li>
            </ul>
            <p className="text-text-mid mt-3">
              Doporučujeme vám tyto zásady pravidelně kontrolovat, abyste byli informováni o tom,
              jak chráníme vaše osobní údaje.
            </p>
          </div>
        </section>

        {/* 14. KONTAKT */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-4">14. Kontaktní údaje</h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-warm-beige rounded-lg p-8">
            <h3 className="text-xl font-bold text-text-dark mb-4">📧 Kontaktujte nás</h3>

            <p className="text-text-mid mb-6">
              Pokud máte jakékoli dotazy týkající se zpracování vašich osobních údajů nebo chcete
              uplatnit svá práva, kontaktujte nás:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-dark mb-2">Správce osobních údajů</h4>
                <p className="text-text-mid text-sm">
                  <strong>Název:</strong> [NÁZEV SPOLEČNOSTI / JMÉNO PODNIKATELE]
                  <br />
                  <strong>IČO:</strong> [IČO]
                  <br />
                  <strong>Adresa:</strong> Revoluční 8, Praha 1, 110 00
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-text-dark mb-2">Kontakt</h4>
                <p className="text-text-mid text-sm">
                  <strong>E-mail:</strong> [EMAIL]
                  <br />
                  <strong>Telefon:</strong> [TELEFON]
                  <br />
                  <strong>Provozní doba:</strong> Po-Pá 9:00-17:00
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-warm-beige">
              <h4 className="font-semibold text-text-dark mb-2">Pověřenec pro ochranu osobních údajů (DPO)</h4>
              <p className="text-text-mid text-sm">
                [POKUD MÁTE POVĚŘENCE, DOPLŇTE KONTAKT - jinak tento oddíl vymažte]
                <br />
                <strong>Jméno:</strong> [JMÉNO DPO]
                <br />
                <strong>E-mail:</strong> [DPO_EMAIL]
              </p>
              <p className="text-xs text-text-mid mt-2">
                <em>Poznámka: Malé a střední podniky obvykle nejsou povinny jmenovat DPO,
                pokud neprovádějí rozsáhlé zpracování citlivých údajů.</em>
              </p>
            </div>
          </div>
        </section>

        {/* ZÁVĚR */}
        <section className="mb-12">
          <div className="bg-green-50 border-l-4 border-green-500 p-6">
            <h3 className="font-bold text-text-dark mb-2">✅ Shrnutí</h3>
            <p className="text-text-mid">
              Ochrana vašeho soukromí je pro nás prioritou. Zpracováváme pouze nezbytné osobní údaje,
              zabezpečujeme je moderními technologiemi a dáváme vám plnou kontrolu nad vašimi daty.
              Pokud máte jakékoli dotazy nebo obavy, neváhejte nás kontaktovat.
            </p>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-warm-beige">
          <p className="text-sm text-text-mid">
            Děkujeme za vaši důvěru.
          </p>
          <p className="text-lg font-semibold text-text-dark mt-2">
            Tým MuzaReady
          </p>
        </div>
      </div>
    </div>
  );
}
