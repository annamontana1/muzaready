export const metadata = {
  title: 'Zásady používání cookies | Mùza Hair Praha',
  description: 'Informace o tom, jak používáme cookies na našem webu',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Zásady používání cookies</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Co jsou cookies?</h2>
          <p>
            Cookies jsou malé textové soubory, které se ukládají do vašeho počítače, tabletu nebo
            mobilního telefonu při návštěvě našeho webu. Pomáhají nám zajistit, aby web fungoval správně,
            byl bezpečnější a poskytoval lepší uživatelský zážitek.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Jak používáme cookies</h2>
          <p>
            Na našem webu muzahair.cz používáme následující typy cookies:
          </p>

          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">2.1 Nezbytné cookies</h3>
              <p><strong>Účel:</strong> Zajištění základní funkčnosti webu</p>
              <p><strong>Souhlas:</strong> Není vyžadován (technicky nutné pro provoz)</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold mb-2">Používané cookies:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>admin-session</strong> – přihlášení do admin panelu (trvání: 24 hodin)</li>
                  <li><strong>user-session</strong> – přihlášení zákazníka (trvání: 30 dní)</li>
                  <li><strong>cart-items</strong> – uchování obsahu košíku (trvání: 7 dní)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">2.2 Analytické cookies</h3>
              <p><strong>Účel:</strong> Měření návštěvnosti a analýza chování uživatelů</p>
              <p><strong>Souhlas:</strong> Vyžadován</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold mb-2">Používané služby:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Google Analytics</strong> (pokud používáte) – analýza návštěvnosti, trvání: 2 roky</li>
                  <li><strong>Vercel Analytics</strong> – výkonnostní metriky, trvání: 1 rok</li>
                </ul>
                <p className="mt-2 text-sm">
                  Tyto cookies nám pomáhají pochopit, jak návštěvníci používají náš web,
                  které stránky jsou nejpopulárnější a jak můžeme web vylepšit.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">2.3 Marketingové cookies</h3>
              <p><strong>Účel:</strong> Přizpůsobení reklam a měření kampaní</p>
              <p><strong>Souhlas:</strong> Vyžadován</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold mb-2">Používané služby:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Facebook Pixel</strong> (pokud používáte) – remarketing, trvání: 90 dní</li>
                  <li><strong>Google Ads</strong> (pokud používáte) – sledování konverzí, trvání: 90 dní</li>
                </ul>
                <p className="mt-2 text-sm">
                  Tyto cookies nám umožňují zobrazovat relevantní reklamy a měřit úspěšnost
                  našich marketingových kampaní.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">2.4 Preferenční cookies</h3>
              <p><strong>Účel:</strong> Zapamatování vašich preferencí</p>
              <p><strong>Souhlas:</strong> Vyžadován</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="font-semibold mb-2">Používané cookies:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>language</strong> – preferovaný jazyk (CZ/EN), trvání: 1 rok</li>
                  <li><strong>currency</strong> – preferovaná měna (CZK/EUR), trvání: 1 rok</li>
                  <li><strong>cookie-consent</strong> – uložení vašeho souhlasu s cookies, trvání: 1 rok</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Cookies třetích stran</h2>
          <p>
            Některé cookies mohou být nastaveny třetími stranami, jejichž služby na našem webu využíváme:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>GoPay</strong> – platební brána pro bezpečné platby</li>
            <li><strong>Google Analytics</strong> – analýza návštěvnosti</li>
            <li><strong>Vercel</strong> – hosting a výkon webu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Jak spravovat cookies</h2>
          <p>
            Cookies můžete kdykoli ovládat a spravovat v nastavení svého prohlížeče.
            Můžete je zcela zakázat nebo je mazat po každé návštěvě webu.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mt-4">
            <p className="font-semibold mb-2">Jak smazat cookies ve vašem prohlížeči:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Chrome:</strong> Nastavení → Ochrana soukromí a zabezpečení → Cookies a další data webu</li>
              <li><strong>Mozilla Firefox:</strong> Nastavení → Soukromí a zabezpečení → Cookies a data stránek</li>
              <li><strong>Safari:</strong> Předvolby → Soukromí → Správa dat webových stránek</li>
              <li><strong>Microsoft Edge:</strong> Nastavení → Cookies a oprávnění webu → Cookies a uložená data</li>
            </ul>
          </div>

          <p className="mt-4">
            <strong>Upozornění:</strong> Pokud zakážete cookies, některé funkce webu nemusí fungovat správně
            (např. přihlášení, nákupní košík, jazykové preference).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Doba uchování cookies</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Typ cookie</th>
                  <th className="text-left py-2">Doba trvání</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Session cookies</td>
                  <td className="py-2">Do zavření prohlížeče</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Nákupní košík</td>
                  <td className="py-2">7 dní</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Přihlášení (admin)</td>
                  <td className="py-2">24 hodin</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Přihlášení (zákazník)</td>
                  <td className="py-2">30 dní</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Preference (jazyk, měna)</td>
                  <td className="py-2">1 rok</td>
                </tr>
                <tr>
                  <td className="py-2">Analytické cookies</td>
                  <td className="py-2">1-2 roky</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Váš souhlas</h2>
          <p>
            Při první návštěvě našeho webu vás požádáme o souhlas s používáním cookies prostřednictvím
            informační lišty (cookie banner). Můžete zvolit:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Přijmout vše</strong> – souhlasíte se všemi typy cookies</li>
            <li><strong>Odmítnout volitelné</strong> – budou použity pouze nezbytné cookies</li>
            <li><strong>Nastavení</strong> – můžete si vybrat, které kategorie cookies chcete povolit</li>
          </ul>
          <p className="mt-4">
            Svůj souhlas můžete kdykoli odvolat změnou nastavení cookies v patičce webu
            nebo v nastavení vašeho prohlížeče.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Aktualizace těchto zásad</h2>
          <p>
            Tyto zásady používání cookies můžeme občas aktualizovat, abychom odráželi změny
            v našich praktikách nebo z právních důvodů. O významných změnách vás budeme informovat
            prostřednictvím oznámení na webu.
          </p>
          <p className="mt-2"><strong>Poslední aktualizace:</strong> 7. prosince 2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Další informace</h2>
          <p>
            Pokud máte jakékoli dotazy týkající se používání cookies na našem webu, kontaktujte nás:
          </p>
          <p className="mt-4">
            <strong>E-mail:</strong> info@muzahair.cz<br />
            <strong>Telefon:</strong> +420 728 722 880<br />
            <strong>Adresa:</strong> Revoluční 8, 110 00 Praha 1
          </p>
          <p className="mt-4">
            Další informace o ochraně osobních údajů naleznete v našich
            {' '}<a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">Zásadách ochrany osobních údajů (GDPR)</a>.
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">💡 Užitečné zdroje</h2>
          <p>Více informací o cookies a ochraně soukromí:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <a href="https://www.aboutcookies.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                AboutCookies.org
              </a> – Kompletní průvodce cookies
            </li>
            <li>
              <a href="https://www.uoou.cz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Úřad pro ochranu osobních údajů
              </a> – Oficiální informace o GDPR v ČR
            </li>
            <li>
              <a href="https://www.youronlinechoices.eu/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Your Online Choices
              </a> – Odmítnutí behaviorální reklamy
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
