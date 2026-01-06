export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function ObchodniPodminkyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Obchodní podmínky</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Úvodní ustanovení</h2>
          <p className="text-gray-700 mb-4">
            1.1. Tyto obchodní podmínky (dále jen "obchodní podmínky") obchodní společnosti <strong>Mùza Hair, s.r.o.</strong>, se sídlem Praha, Česká republika,
            IČO: [DOPLNIT IČO], zapsané v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka [DOPLNIT], (dále jen "prodávající")
            upravují v souladu s ustanovením § 1751 odst. 1 zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen "občanský zákoník")
            vzájemná práva a povinnosti smluvních stran vzniklé v souvislosti nebo na základě kupní smlouvy (dále jen "kupní smlouva") uzavírané mezi prodávajícím
            a jinou fyzickou osobou (dále jen "kupující") prostřednictvím internetového obchodu prodávajícího.
          </p>
          <p className="text-gray-700 mb-4">
            1.2. Internetový obchod je prodávajícím provozován na webové stránce umístěné na internetové adrese <a href="https://muzaready-iota.vercel.app" className="text-purple-600 hover:underline">muzaready-iota.vercel.app</a> (dále jen "webová stránka"), a to prostřednictvím rozhraní webové stránky (dále jen "webové rozhraní obchodu").
          </p>
          <p className="text-gray-700 mb-4">
            1.3. Obchodní podmínky se nevztahují na případy, kdy osoba, která má v úmyslu nakoupit zboží od prodávajícího, je právnickou osobou či osobou,
            jež jedná při objednávání zboží v rámci své podnikatelské činnosti nebo v rámci svého samostatného výkonu povolání.
          </p>
          <p className="text-gray-700">
            1.4. Ustanovení odchylná od obchodních podmínek je možné sjednat v kupní smlouvě. Odchylná ujednání v kupní smlouvě mají přednost před ustanoveními obchodních podmínek.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uživatelský účet</h2>
          <p className="text-gray-700 mb-4">
            2.1. Na základě registrace kupujícího provedené na webové stránce může kupující přistupovat do svého uživatelského rozhraní.
            Ze svého uživatelského rozhraní může kupující provádět objednávání zboží (dále jen "uživatelský účet").
          </p>
          <p className="text-gray-700 mb-4">
            2.2. Při registraci na webové stránce a při objednávání zboží je kupující povinen uvádět správně a pravdivě všechny údaje.
            Údaje uvedené v uživatelském účtu je kupující při jakékoliv jejich změně povinen aktualizovat.
          </p>
          <p className="text-gray-700 mb-4">
            2.3. Přístup k uživatelskému účtu je zabezpečen uživatelským jménem a heslem. Kupující je povinen zachovávat mlčenlivost ohledně
            informací nezbytných k přístupu do jeho uživatelského účtu.
          </p>
          <p className="text-gray-700">
            2.4. Prodávající může zrušit uživatelský účet, a to zejména v případě, kdy kupující svůj uživatelský účet déle než 2 roky nevyužívá,
            či v případě, kdy kupující poruší své povinnosti z kupní smlouvy (včetně obchodních podmínek).
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uzavření kupní smlouvy</h2>
          <p className="text-gray-700 mb-4">
            3.1. Veškerá prezentace zboží umístěná ve webovém rozhraní obchodu je informativního charakteru a prodávající není povinen uzavřít kupní smlouvu
            ohledně tohoto zboží. Ustanovení § 1732 odst. 2 občanského zákoníku se nepoužije.
          </p>
          <p className="text-gray-700 mb-4">
            3.2. Webové rozhraní obchodu obsahuje informace o zboží, a to včetně uvedení cen jednotlivého zboží. Ceny zboží jsou uvedeny včetně daně z přidané hodnoty
            a všech souvisejících poplatků. Ceny zboží zůstávají v platnosti po dobu, kdy jsou zobrazovány ve webovém rozhraní obchodu.
          </p>
          <p className="text-gray-700 mb-4">
            3.3. Pro objednání zboží vyplní kupující objednávkový formulář ve webovém rozhraní obchodu. Objednávkový formulář obsahuje zejména informace o:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-2">
            <li>objednávaném zboží (objednávané zboží "vloží" kupující do elektronického nákupního košíku webového rozhraní obchodu),</li>
            <li>způsobu úhrady kupní ceny zboží, údaje o požadovaném způsobu doručení objednávaného zboží a</li>
            <li>informace o nákladech spojených s dodáním zboží (dále společně jen jako "objednávka").</li>
          </ul>
          <p className="text-gray-700 mb-4">
            3.4. Před zasláním objednávky prodávajícímu je kupujícímu umožněno zkontrolovat a měnit údaje, které do objednávky kupující vložil,
            a to i s ohledem na možnost kupujícího zjišťovat a opravovat chyby vzniklé při zadávání dat do objednávky. Objednávku odešle kupující
            prodávajícímu kliknutím na tlačítko "Odeslat objednávku". Údaje uvedené v objednávce jsou prodávajícím považovány za správné.
          </p>
          <p className="text-gray-700 mb-4">
            3.5. Podmínkou platnosti objednávky je vyplnění všech povinných údajů v objednávkovém formuláři a potvrzení kupujícího o tom,
            že se seznámil s těmito obchodními podmínkami.
          </p>
          <p className="text-gray-700">
            3.6. Prodávající neprodleně po obdržení objednávky toto obdržení kupujícímu potvrdí elektronickou poštou, a to na adresu elektronické
            pošty kupujícího uvedenou v uživatelském účtu či v objednávce (dále jen "elektronická adresa kupujícího"). Kupní smlouva je uzavřena
            okamžikem doručení přijetí objednávky (akceptací), jež je prodávajícím zasláno kupujícímu elektronickou poštou.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cena zboží a platební podmínky</h2>
          <p className="text-gray-700 mb-4">
            4.1. Cenu zboží a případné náklady spojené s dodáním zboží dle kupní smlouvy může kupující uhradit prodávajícímu následujícími způsoby:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-2">
            <li>bezhotovostně platební kartou online prostřednictvím platební brány,</li>
            <li>bezhotovostně převodem na účet prodávajícího,</li>
            <li>dobírkou v hotovosti při převzetí zboží (pouze pro doručení v ČR).</li>
          </ul>
          <p className="text-gray-700 mb-4">
            4.2. Společně s kupní cenou je kupující povinen zaplatit prodávajícímu také náklady spojené s balením a dodáním zboží ve smluvené výši.
            Není-li uvedeno výslovně jinak, rozumí se dále kupní cenou i náklady spojené s dodáním zboží.
          </p>
          <p className="text-gray-700 mb-4">
            4.3. Prodávající nepožaduje od kupujícího zálohu či jinou obdobnou platbu. Tímto není dotčeno ustanovení čl. 4.6 obchodních podmínek
            ohledně povinnosti uhradit kupní cenu zboží předem.
          </p>
          <p className="text-gray-700 mb-4">
            4.4. V případě platby v hotovosti je kupní cena splatná při převzetí zboží. V případě bezhotovostní platby je kupní cena splatná do 7 dnů
            od uzavření kupní smlouvy.
          </p>
          <p className="text-gray-700 mb-4">
            4.5. V případě bezhotovostní platby je kupující povinen uhrazovat kupní cenu zboží společně s uvedením variabilního symbolu platby.
            V případě bezhotovostní platby je závazek kupujícího uhradit kupní cenu splněn okamžikem připsání příslušné částky na účet prodávajícího.
          </p>
          <p className="text-gray-700">
            4.6. Prodávající je oprávněn, zejména v případě, že ze strany kupujícího nedojde k dodatečnému potvrzení objednávky, požadovat
            uhrazení celé kupní ceny ještě před odesláním zboží kupujícímu. Ustanovení § 2119 odst. 1 občanského zákoníku se nepoužije.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Odstoupení od smlouvy</h2>
          <p className="text-gray-700 mb-4">
            5.1. Kupující bere na vědomí, že dle ustanovení § 1837 občanského zákoníku nelze mimo jiné odstoupit od kupní smlouvy o dodávce zboží,
            které bylo upraveno podle přání kupujícího nebo pro jeho osobu (např. zboží obarvené na míru), od kupní smlouvy o dodávce zboží,
            které podléhá rychlé zkáze, opotřebení nebo zastarání.
          </p>
          <p className="text-gray-700 mb-4">
            5.2. Nejedná-li se o případ uvedený v čl. 5.1 obchodních podmínek či o jiný případ, kdy nelze od kupní smlouvy odstoupit, má kupující
            v souladu s ustanovením § 1829 odst. 1 občanského zákoníku právo od kupní smlouvy odstoupit, a to do čtrnácti (14) dnů od převzetí zboží.
          </p>
          <p className="text-gray-700 mb-4">
            5.3. V případě, že kupující od kupní smlouvy odstoupí, zašle nebo předá prodávajícímu bez zbytečného odkladu, nejpozději do čtrnácti (14) dnů
            od odstoupení od kupní smlouvy, zboží, které od něj obdržel. Odstoupení od kupní smlouvy může být zasláno na adresu prodávajícího.
          </p>
          <p className="text-gray-700 mb-4">
            5.4. Odstoupí-li kupující od kupní smlouvy, vrátí mu prodávající bez zbytečného odkladu, nejpozději do čtrnácti (14) dnů od odstoupení
            od kupní smlouvy, všechny peněžní prostředky včetně nákladů na dodání, které od něho na základě kupní smlouvy přijal, stejným způsobem.
            Prodávající je však povinen vrátit přijaté peněžní prostředky kupujícímu jiným způsobem jen tehdy, pokud s tím kupující souhlasil
            a pokud tím kupujícímu nevzniknou další náklady.
          </p>
          <p className="text-gray-700 mb-4">
            5.5. Odstoupí-li kupující od kupní smlouvy, prodávající není povinen vrátit přijaté peněžní prostředky kupujícímu dříve,
            než mu kupující zboží vrátí nebo prokáže, že zboží prodávajícímu odeslal.
          </p>
          <p className="text-gray-700 mb-4">
            5.6. Kupující nese náklady spojené s navrácením zboží prodávajícímu, a to i v tom případě, kdy zboží nemůže být vráceno pro svou povahu
            obvyklou poštovní cestou.
          </p>
          <p className="text-gray-700">
            5.7. Formulář pro odstoupení od smlouvy je k dispozici ke stažení na webové stránce prodávajícího v sekci "Informace".
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Přeprava a dodání zboží</h2>
          <p className="text-gray-700 mb-4">
            6.1. V případě, že je způsob dopravy smluven na základě zvláštního požadavku kupujícího, nese kupující riziko a případné dodatečné
            náklady spojené s tímto způsobem dopravy.
          </p>
          <p className="text-gray-700 mb-4">
            6.2. Je-li prodávající podle kupní smlouvy povinen dodat zboží na místo určené kupujícím v objednávce, je kupující povinen převzít
            zboží při dodání. Pokud prodávající dodá zboží na jiné místo, než které bylo v objednávce sjednáno, je povinen kupující toto zboží
            převzít jen v případě, že byl o této skutečnosti předem informován a s ní vyslovil souhlas.
          </p>
          <p className="text-gray-700 mb-4">
            6.3. V případě, že je z důvodů na straně kupujícího nutno zboží doručovat opakovaně nebo jiným způsobem, než bylo uvedeno v objednávce,
            je kupující povinen uhradit náklady spojené s opakovaným doručováním zboží, resp. náklady spojené s jiným způsobem doručení.
          </p>
          <p className="text-gray-700">
            6.4. Při převzetí zboží od přepravce je kupující povinen zkontrolovat neporušenost obalů zboží a v případě jakýchkoliv závad
            toto neprodleně oznámit přepravci. V případě shledání porušení obalu svědčícího o neoprávněném vniknutí do zásilky nemusí kupující
            zásilku od přepravce převzít. Tímto není dotčeno právo kupujícího na uplatnění práv z odpovědnosti za vady zboží.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Práva z vadného plnění (reklamace)</h2>
          <p className="text-gray-700 mb-4">
            7.1. Práva a povinnosti smluvních stran ohledně práv z vadného plnění se řídí příslušnými obecně závaznými předpisy
            (zejména ustanoveními § 1914 až 1925, § 2099 až 2117 a § 2161 až 2174 občanského zákoníku).
          </p>
          <p className="text-gray-700 mb-4">
            7.2. Prodávající odpovídá kupujícímu, že zboží při převzetí nemá vady. Zejména prodávající odpovídá kupujícímu, že v době,
            kdy kupující zboží převzal:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700 space-y-2">
            <li>má zboží vlastnosti, které si strany ujednaly, a chybí-li ujednání, takové vlastnosti, které prodávající nebo výrobce popsal
            nebo které kupující očekával s ohledem na povahu zboží a na základě reklamy jimi prováděné,</li>
            <li>se zboží hodí k účelu, který pro jeho použití prodávající uvádí nebo ke kterému se zboží tohoto druhu obvykle používá,</li>
            <li>zboží odpovídá jakostí nebo provedením smluvenému vzorku nebo předloze, byla-li jakost nebo provedení určeno podle smluveného vzorku nebo předlohy,</li>
            <li>je zboží v odpovídajícím množství, míře nebo hmotnosti a</li>
            <li>zboží vyhovuje požadavkům právních předpisů.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            7.3. Prodávající má povinnost a zavazuje se dodat kupujícímu zboží v jakosti a provedení dle kupní smlouvy. Prodávající neodpovídá
            za vady zboží, které byly způsobeny používáním zboží v rozporu s návodem k použití nebo obecnými zásadami péče o zboží.
          </p>
          <p className="text-gray-700 mb-4">
            7.4. Zjistí-li kupující vadu, měl by prodávajícímu oznámit, o jakou vadu se jedná. Projeví se vada v průběhu šesti měsíců
            od převzetí, má se za to, že zboží bylo vadné již při převzetí (záruka je poskytována na dobu 24 měsíců).
          </p>
          <p className="text-gray-700 mb-4">
            7.5. Práva z odpovědnosti za vady zboží se uplatňují u prodávajícího na emailové adrese: <a href="mailto:info@muzahair.cz" className="text-purple-600 hover:underline">info@muzahair.cz</a> nebo na adrese sídla prodávajícího.
            O vyřízení reklamace bude kupující informován elektronickou poštou zaslanou na elektronickou adresu kupujícího a případně též telefonicky.
          </p>
          <p className="text-gray-700">
            7.6. Prodávající nebo jím pověřený pracovník rozhodne o reklamaci ihned, ve složitých případech do tří pracovních dnů.
            Do této lhůty se nezapočítává doba přiměřená podle druhu výrobku či služby potřebná k odbornému posouzení vady.
            Reklamace včetně odstranění vady musí být vyřízena bez zbytečného odkladu, nejpozději do 30 dnů ode dne uplatnění reklamace,
            pokud se prodávající s kupujícím nedohodne na delší lhůtě.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Další práva a povinnosti smluvních stran</h2>
          <p className="text-gray-700 mb-4">
            8.1. Kupující nabývá vlastnictví ke zboží zaplacením celé kupní ceny zboží.
          </p>
          <p className="text-gray-700 mb-4">
            8.2. Prodávající není ve vztahu ke kupujícímu vázán žádnými kodexy chování ve smyslu ustanovení § 1826 odst. 1 písm. e) občanského zákoníku.
          </p>
          <p className="text-gray-700 mb-4">
            8.3. K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná Česká obchodní inspekce, se sídlem Štěpánská 567/15,
            120 00 Praha 2, IČ: 00020869, internetová adresa: <a href="https://www.coi.cz" className="text-purple-600 hover:underline">https://www.coi.cz</a>.
            Platformu pro řešení sporů on-line nacházející se na internetové adrese <a href="http://ec.europa.eu/consumers/odr" className="text-purple-600 hover:underline">http://ec.europa.eu/consumers/odr</a> je možné využít při řešení sporů mezi prodávajícím a kupujícím z kupní smlouvy.
          </p>
          <p className="text-gray-700">
            8.4. Prodávající je oprávněn k prodeji zboží na základě živnostenského oprávnění. Živnostenskou kontrolu provádí v rámci své působnosti
            příslušný živnostenský úřad. Dozor nad oblastí ochrany osobních údajů vykonává Úřad pro ochranu osobních údajů.
            Česká obchodní inspekce vykonává ve vymezeném rozsahu mimo jiné dozor nad dodržováním zákona č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších předpisů.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ochrana osobních údajů</h2>
          <p className="text-gray-700">
            Ochrana osobních údajů kupujícího, který je fyzickou osobou, je poskytována zákonem č. 110/2019 Sb., o zpracování osobních údajů,
            ve znění pozdějších předpisů a Nařízením Evropského parlamentu a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob
            v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (GDPR). Podrobné informace o zpracování osobních údajů
            jsou uvedeny v samostatném dokumentu <a href="/informace/ochrana-soukromi" className="text-purple-600 hover:underline">Zásady ochrany osobních údajů</a>.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Zasílání obchodních sdělení</h2>
          <p className="text-gray-700 mb-4">
            10.1. Kupující souhlasí se zasíláním informací souvisejících se zbožím, službami nebo podnikem prodávajícího na elektronickou adresu
            kupujícího a dále souhlasí se zasíláním obchodních sdělení prodávajícím na elektronickou adresu kupujícího.
          </p>
          <p className="text-gray-700">
            10.2. Kupující souhlasí s ukládáním tzv. cookies na jeho počítač. V případě, že je nákup na webové stránce možné provést a závazky
            prodávajícího z kupní smlouvy plnit, aniž by docházelo k ukládání tzv. cookies na počítač kupujícího, může kupující souhlas
            podle předchozí věty kdykoliv odvolat.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Závěrečná ustanovení</h2>
          <p className="text-gray-700 mb-4">
            11.1. Pokud vztah založený kupní smlouvou obsahuje mezinárodní (zahraniční) prvek, pak strany sjednávají, že vztah se řídí českým právem.
            Tímto nejsou dotčena práva spotřebitele vyplývající z obecně závazných právních předpisů.
          </p>
          <p className="text-gray-700 mb-4">
            11.2. Je-li některé ustanovení obchodních podmínek neplatné nebo neúčinné, nebo se takovým stane, namísto neplatných ustanovení
            nastoupí ustanovení, jehož smysl se neplatnému ustanovení co nejvíce přibližuje. Neplatností nebo neúčinností jednoho ustanovení
            není dotčena platnost ostatních ustanovení.
          </p>
          <p className="text-gray-700 mb-4">
            11.3. Kupní smlouva včetně obchodních podmínek je archivována prodávajícím v elektronické podobě a není přístupná.
          </p>
          <p className="text-gray-700 mb-4">
            11.4. Kontaktní údaje prodávajícího: adresa pro doručování: [DOPLNIT ADRESU], adresa elektronické pošty: <a href="mailto:info@muzahair.cz" className="text-purple-600 hover:underline">info@muzahair.cz</a>,
            telefon: <a href="tel:+420XXXXXXXXX" className="text-purple-600 hover:underline">+420 XXX XXX XXX</a>.
          </p>
          <p className="text-gray-700">
            <strong>Tyto obchodní podmínky nabývají účinnosti dnem 1.1.2026.</strong>
          </p>
        </section>
      </div>
    </div>
  );
}