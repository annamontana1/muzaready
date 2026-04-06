export const metadata = {
  title: 'Reklamace a vrácení zboží | Mùza Hair Praha',
  description: 'Podmínky pro reklamaci a vrácení zboží',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Reklamace a vrácení zboží</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-text-mid">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">1. Právo na odstoupení od smlouvy (14 dnů)</h2>
          <p>
            <strong>1.1</strong> Jako spotřebitel máte právo odstoupit od smlouvy do <strong>14 dnů</strong>
            od převzetí zboží bez udání důvodu.
          </p>
          <p>
            <strong>1.2 Jak odstoupit:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Zašlete e-mail na <strong>info@muzahair.cz</strong> s uvedením čísla objednávky</li>
            <li>Nebo vyplňte formulář na našem webu</li>
            <li>Zboží zašlete zpět na adresu: <strong>Revoluční 8, 110 00 Praha 1</strong></li>
          </ul>
          <p>
            <strong>1.3 Podmínky vrácení:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Zboží musí být nepoužité, nepoškozené</li>
            <li>V originálním obalu</li>
            <li>S kompletním příslušenstvím</li>
            <li>Nejlépe včetně dokladu o koupi</li>
          </ul>
          <p>
            <strong>1.4</strong> Peníze vám vrátíme do <strong>14 dnů</strong> od obdržení vráceného zboží
            stejným způsobem, jakým jste platili.
          </p>
          <p>
            <strong>1.5</strong> Náklady na vrácení zboží hradíte vy (pokud zboží není vadné).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">2. Výjimky z práva na odstoupení</h2>
          <p>Právo na odstoupení nelze uplatnit u:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Zboží na míru:</strong> vlasy vyrobené podle vašich specifikací (délka, barva, metoda)</li>
            <li><strong>Hygienické důvody:</strong> pokud bylo zboží rozbaleno a použito</li>
            <li><strong>Akční zboží:</strong> s výraznou slevou označené jako „vyprodej" nebo „na objednávku"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">3. Reklamace vadného zboží (záruka 24 měsíců)</h2>
          <p>
            <strong>3.1 Záruční doba:</strong> <strong>24 měsíců</strong> od převzetí zboží.
          </p>
          <p>
            <strong>3.2</strong> Co je možné reklamovat:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Výrobní vady (chybný střih, zpracování)</li>
            <li>Neodpovídající kvalita (jiná kvalita než objednaná - Standard, LUXE, Platinum)</li>
            <li>Neodpovídající barva (významný rozdíl oproti objednanému odstínu)</li>
            <li>Poškození při přepravě</li>
          </ul>
          <p>
            <strong>3.3</strong> Co nelze reklamovat:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Běžné opotřebení při správném použití</li>
            <li>Poškození způsobené nesprávnou péčí (přehřátí, barvení, chemické ošetření)</li>
            <li>Mechanické poškození (ustřižení, spálení)</li>
            <li>Záměrné poškození nebo zneužití</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">4. Jak podat reklamaci</h2>
          <p><strong>Krok 1:</strong> Kontaktujte nás co nejdříve</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>E-mail: <strong>info@muzahair.cz</strong></li>
            <li>Telefon: <strong>+420 728 722 880</strong></li>
            <li>Uveďte: číslo objednávky, popis vady, přiložte fotky</li>
          </ul>
          <p className="mt-4"><strong>Krok 2:</strong> Zašlete zboží zpět</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adresa: <strong>Revoluční 8, 110 00 Praha 1</strong></li>
            <li>Přiložte vyplněný reklamační formulář (najdete níže)</li>
            <li>Doporučujeme zaslat doporučeně nebo jako balík s&nbsp;pojištěním</li>
          </ul>
          <p className="mt-4"><strong>Krok 3:</strong> Vyřízení reklamace</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Posoudíme oprávněnost reklamace do <strong>30 dnů</strong></li>
            <li>Pokud je reklamace oprávněná:
              <ul className="list-circle pl-6 mt-2">
                <li>Vyměníme zboží za nové</li>
                <li>Vrátíme peníze</li>
                <li>Poskytneme slevu</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">5. Reklamační formulář</h2>
          <div className="bg-soft-cream p-6 rounded-lg border border-warm-beige">
            <p className="font-semibold mb-2">Údaje pro vyplnění:</p>
            <ul className="space-y-1 text-sm">
              <li>• Jméno a příjmení</li>
              <li>• Kontaktní e-mail a telefon</li>
              <li>• Číslo objednávky</li>
              <li>• Datum nákupu</li>
              <li>• Název reklamovaného zboží</li>
              <li>• Popis vady (co přesně je špatně)</li>
              <li>• Požadovaný způsob vyřízení (výměna / vrácení peněz / oprava / sleva)</li>
              <li>• Datum podání reklamace</li>
              <li>• Podpis</li>
            </ul>
            <p className="mt-4 text-sm">
              📄 <a href="/files/reklamacni-formular.pdf" className="text-blue-600 hover:underline">Stáhnout reklamační formulář (PDF)</a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">6. Náklady na reklamaci</h2>
          <p>
            <strong>6.1</strong> Pokud je reklamace oprávněná:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Náklady na dopravu hradíme my</li>
            <li>Vrátíme vám poštovné za zaslání reklamovaného zboží</li>
          </ul>
          <p className="mt-4">
            <strong>6.2</strong> Pokud reklamace není oprávněná:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Zboží vám vrátíme na vaše náklady</li>
            <li>Můžeme požadovat úhradu nákladů na posouzení (max. 200 Kč)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">7. Doporučení pro péči o vlasy</h2>
          <p>Pro zachování kvality vlasů doporučujeme:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Používat kvalitní šampony a kondicionéry pro prodloužené vlasy</li>
            <li>Ošetřovat vlasy hydratačními maskami 1x týdně</li>
            <li>Nestříhat vlasy bez konzultace s kadeřníkem</li>
            <li>Chránit vlasy před vysokými teplotami (max. 180°C)</li>
            <li>Nespat s mokrými vlasy</li>
            <li>Pravidelně rozčesávat speciálním kartáčem</li>
          </ul>
          <p className="mt-4">
            📖 Více informací: <a href="/blog/pece-o-prodlouzene-vlasy" className="text-blue-600 hover:underline">Péče o prodloužené vlasy: 10 zlatých pravidel</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">8. Mimosoudní řešení sporů</h2>
          <p>
            V případě sporu se můžete obrátit na:
          </p>
          <p className="mt-2">
            <strong>Česká obchodní inspekce</strong><br />
            Ústřední inspektorát – oddělení ADR<br />
            Štěpánská 15, 120 00 Praha 2<br />
            E-mail: adr@coi.cz<br />
            Web: <a href="https://www.coi.cz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.coi.cz</a>
          </p>
          <p className="mt-4">
            <strong>Online platforma EU pro řešení sporů:</strong><br />
            <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">9. Časté dotazy (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-text-dark">❓ Mohu vrátit vlasy, pokud mi nesedí barva?</p>
              <p>Ano, do 14 dnů bez udání důvodu, pokud jsou vlasy nepoužité a nepoškozené.</p>
            </div>
            <div>
              <p className="font-semibold text-text-dark">❓ Mohu vrátit vlasy, které jsem si nechala aplikovat?</p>
              <p>Ne, aplikované vlasy nelze vrátit (hygienické důvody).</p>
            </div>
            <div>
              <p className="font-semibold text-text-dark">❓ Jak dlouho trvá vyřízení reklamace?</p>
              <p>Maximálně 30 dnů od obdržení reklamovaného zboží.</p>
            </div>
            <div>
              <p className="font-semibold text-text-dark">❓ Kdo hradí poštovné při vrácení zboží?</p>
              <p>Při odstoupení od smlouvy: vy. Při oprávněné reklamaci: my.</p>
            </div>
            <div>
              <p className="font-semibold text-text-dark">❓ Mohu si vyměnit vlasy za jinou délku?</p>
              <p>Ano, do 14 dnů, pokud jsou nepoužité. Případný cenový rozdíl doplatíte/vrátíme.</p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6 mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-text-dark">📞 Potřebujete pomoc?</h2>
          <p>
            Pokud si nejste jistí, zda je váš problém reklamace nebo máte jakékoli dotazy,
            neváhejte nás kontaktovat. Rádi vám poradíme!
          </p>
          <p className="mt-4">
            <strong>E-mail:</strong> info@muzahair.cz<br />
            <strong>Telefon:</strong> +420 728 722 880<br />
            <strong>WhatsApp:</strong> +420 728 722 880<br />
            <strong>Adresa:</strong> Revoluční 8, 110 00 Praha 1<br />
            <strong>Otevírací doba:</strong> Po-Pá 9:00-18:00
          </p>
        </section>

        <section className="mt-8">
          <p className="text-sm text-text-mid">
            <strong>Platnost:</strong> Tyto podmínky jsou platné od 7. prosince 2025.<br />
            <strong>Související dokumenty:</strong>{' '}
            <a href="/obchodni-podminky" className="text-blue-600 hover:underline">Obchodní podmínky</a>,{' '}
            <a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">Ochrana osobních údajů</a>
          </p>
        </section>
      </div>
    </div>
  );
}
