export const metadata = {
  title: 'Ochrana osobních údajů | Mùza Hair Praha',
  description: 'Informace o zpracování a ochraně osobních údajů v souladu s GDPR',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Ochrana osobních údajů (GDPR)</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Správce osobních údajů</h2>
          <p>
            <strong>Mùza Hair Praha</strong><br />
            Revoluční 8, 110 00 Praha 1<br />
            Telefon: +420 728 722 880<br />
            E-mail: info@muzahair.cz
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Jaké osobní údaje zpracováváme</h2>
          <p>V rámci poskytování našich služeb a prodeje produktů zpracováváme následující osobní údaje:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identifikační údaje:</strong> jméno, příjmení</li>
            <li><strong>Kontaktní údaje:</strong> e-mailová adresa, telefonní číslo, doručovací adresa</li>
            <li><strong>Platební údaje:</strong> údaje o platbách a objednávkách (bez údajů o platební kartě)</li>
            <li><strong>Technické údaje:</strong> IP adresa, cookies, informace o zařízení a prohlížeči</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Účel zpracování osobních údajů</h2>
          <p>Vaše osobní údaje zpracováváme za následujícími účely:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Realizace objednávky:</strong> vyřízení a doručení objednávky, komunikace o stavu objednávky</li>
            <li><strong>Fakturace a účetnictví:</strong> vystavení daňových dokladů, vedení účetnictví</li>
            <li><strong>Zákaznická podpora:</strong> odpovědi na dotazy, řešení reklamací</li>
            <li><strong>Marketing:</strong> zasílání newsletteru (pouze se souhlasem)</li>
            <li><strong>Provoz e-shopu:</strong> technická správa webu, zabezpečení, analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Právní základ zpracování</h2>
          <p>Osobní údaje zpracováváme na základě:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Plnění smlouvy</strong> (čl. 6 odst. 1 písm. b GDPR) – vyřízení objednávky</li>
            <li><strong>Právní povinnosti</strong> (čl. 6 odst. 1 písm. c GDPR) – účetnictví, archivace dokladů</li>
            <li><strong>Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f GDPR) – zabezpečení webu, analytics</li>
            <li><strong>Souhlas</strong> (čl. 6 odst. 1 písm. a GDPR) – marketing, newslettery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Doba uložení údajů</h2>
          <p>Vaše osobní údaje uchováváme po dobu:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Účetní doklady:</strong> 10 let (dle zákona o účetnictví)</li>
            <li><strong>Objednávky a faktury:</strong> 10 let</li>
            <li><strong>Zákaznické dotazy:</strong> 3 roky</li>
            <li><strong>Marketing (newsletter):</strong> do odvolání souhlasu</li>
            <li><strong>Technické logy:</strong> max. 12 měsíců</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Komu předáváme osobní údaje</h2>
          <p>Vaše osobní údaje můžeme předat těmto kategoriím příjemců:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dopravci:</strong> Česká pošta, DPD, PPL (pro doručení objednávek)</li>
            <li><strong>Platební brána:</strong> GoPay s.r.o. (zpracování plateb)</li>
            <li><strong>Hosting a IT služby:</strong> Vercel, Supabase (provoz e-shopu)</li>
            <li><strong>Účetní:</strong> pro vedení účetnictví a daňovou evidenci</li>
          </ul>
          <p>Všichni zpracovatelé jsou vázáni smlouvou o zpracování osobních údajů a nesmí data používat pro jiné účely.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Vaše práva</h2>
          <p>Máte následující práva týkající se ochrany osobních údajů:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Právo na přístup:</strong> můžete požádat o kopii svých osobních údajů</li>
            <li><strong>Právo na opravu:</strong> opravit nesprávné nebo neúplné údaje</li>
            <li><strong>Právo na výmaz:</strong> požádat o smazání údajů (pokud není zákonná povinnost je uchovávat)</li>
            <li><strong>Právo na omezení:</strong> omezit zpracování vašich údajů</li>
            <li><strong>Právo na přenositelnost:</strong> obdržet data ve strojově čitelném formátu</li>
            <li><strong>Právo vznést námitku:</strong> proti zpracování na základě oprávněného zájmu</li>
            <li><strong>Právo odvolat souhlas:</strong> kdykoli odvolat souhlas s marketingovými e-maily</li>
          </ul>
          <p className="mt-4">Pro uplatnění svých práv nás kontaktujte na <strong>info@muzahair.cz</strong>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Cookies</h2>
          <p>
            Náš web používá cookies pro zajištění funkčnosti e-shopu, zlepšení uživatelského zážitku a analytické účely.
            Podrobné informace o používaných cookies naleznete v našich{' '}
            <a href="/cookies" className="text-blue-600 hover:underline">Zásadách používání cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Zabezpečení údajů</h2>
          <p>
            Zavázali jsme se chránit vaše osobní údaje před neoprávněným přístupem, ztrátou nebo zneužitím.
            Používáme technická a organizační opatření, jako například:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Šifrování citlivých dat (SSL/TLS)</li>
            <li>Zabezpečené databáze s omezeným přístupem</li>
            <li>Pravidelné bezpečnostní audity</li>
            <li>Školení zaměstnanců o ochraně osobních údajů</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Změny zásad ochrany osobních údajů</h2>
          <p>
            Tyto zásady mohou být občas aktualizovány. O významných změnách vás budeme informovat
            prostřednictvím e-mailu nebo oznámení na webu.
          </p>
          <p className="mt-2"><strong>Poslední aktualizace:</strong> 7. prosince 2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Stížnost na dozorový orgán</h2>
          <p>
            Pokud se domníváte, že zpracování vašich osobních údajů porušuje GDPR, máte právo podat stížnost
            u dozorového orgánu:
          </p>
          <p className="mt-2">
            <strong>Úřad pro ochranu osobních údajů</strong><br />
            Pplk. Sochora 27, 170 00 Praha 7<br />
            Tel.: +420 234 665 111<br />
            E-mail: posta@uoou.cz<br />
            Web: <a href="https://www.uoou.cz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.uoou.cz</a>
          </p>
        </section>

        <section className="border-t pt-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Kontakt</h2>
          <p>
            V případě jakýchkoli dotazů týkajících se ochrany osobních údajů nás prosím kontaktujte:
          </p>
          <p className="mt-4">
            <strong>E-mail:</strong> info@muzahair.cz<br />
            <strong>Telefon:</strong> +420 728 722 880<br />
            <strong>Adresa:</strong> Revoluční 8, 110 00 Praha 1
          </p>
        </section>
      </div>
    </div>
  );
}
