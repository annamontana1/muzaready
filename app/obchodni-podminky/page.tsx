export const metadata = {
  title: 'Obchodní podmínky | Mùza Hair Praha',
  description: 'Obchodní podmínky pro nákup vlasů k prodloužení',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Obchodní podmínky</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Základní ustanovení</h2>
          <p>
            <strong>1.1</strong> Tyto obchodní podmínky (dále jen „OP") upravují vztahy mezi prodávajícím
            a kupujícím při prodeji zboží prostřednictvím internetového obchodu.
          </p>
          <p>
            <strong>1.2 Prodávající:</strong><br />
            Mùza Hair Praha<br />
            Revoluční 8, 110 00 Praha 1<br />
            Telefon: +420 728 722 880<br />
            E-mail: info@muzahair.cz
          </p>
          <p>
            <strong>1.3</strong> Kupujícím je spotřebitel nebo podnikatel, který uzavírá kupní smlouvu
            s prodávajícím mimo svou podnikatelskou činnost (spotřebitel) nebo v rámci své podnikatelské
            činnosti (podnikatel).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Uzavření kupní smlouvy</h2>
          <p>
            <strong>2.1</strong> Nabídka zboží na webové stránce není právně závaznou nabídkou prodávajícího.
          </p>
          <p>
            <strong>2.2</strong> Kupní smlouva vzniká odesláním objednávky kupujícím a jejím přijetím prodávajícím,
            o čemž je kupující informován e-mailem na zadanou e-mailovou adresu.
          </p>
          <p>
            <strong>2.3</strong> Kupující odesláním objednávky potvrzuje, že se seznámil s těmito OP
            a že s nimi souhlasí.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Cena zboží a platební podmínky</h2>
          <p>
            <strong>3.1</strong> Ceny zboží jsou uvedeny včetně DPH a všech souvisejících poplatků.
          </p>
          <p>
            <strong>3.2</strong> K ceně zboží může být připočtena cena dopravy dle zvoleného způsobu doručení.
          </p>
          <p>
            <strong>3.3</strong> Způsoby platby:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Platba kartou online</strong> – přes platební bránu GoPay</li>
            <li><strong>Bankovní převod</strong> – na základě vystavené faktury</li>
            <li><strong>Platba v hotovosti</strong> – při osobním odběru</li>
          </ul>
          <p>
            <strong>3.4</strong> Prodávající si vyhrazuje právo nepřijmout objednávku, pokud kupující opakovaně
            neplní své závazky vůči prodávajícímu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Dodání zboží</h2>
          <p>
            <strong>4.1</strong> Dodání zboží se uskutečňuje:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Na adresu určenou kupujícím (doručení dopravcem)</li>
            <li>Osobním odběrem na prodejně (Revoluční 8, Praha 1)</li>
          </ul>
          <p>
            <strong>4.2</strong> Dodací lhůta: obvykle <strong>3-7 pracovních dnů</strong> od potvrzení objednávky
            a připsání platby na účet prodávajícího.
          </p>
          <p>
            <strong>4.3</strong> Pokud prodávající nemůže dodat zboží ve sjednané lhůtě, informuje kupujícího
            a nabídne náhradní plnění nebo vrácení peněz.
          </p>
          <p>
            <strong>4.4</strong> Náklady na doručení:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Česká pošta (balík): 120 Kč</li>
            <li>PPL / DPD: 99 Kč</li>
            <li>Osobní odběr: zdarma</li>
            <li>Doprava zdarma při objednávce nad 3.000 Kč</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Práva z vadného plnění (záruka)</h2>
          <p>
            <strong>5.1</strong> Prodávající poskytuje záruku na kvalitu dodaného zboží dle platných právních předpisů
            (zejména zákon č. 89/2012 Sb., občanský zákoník).
          </p>
          <p>
            <strong>5.2</strong> Záruční doba činí <strong>24 měsíců</strong> od převzetí zboží kupujícím.
          </p>
          <p>
            <strong>5.3</strong> Kupující je povinen reklamaci uplatnit bez zbytečného odkladu, nejlépe písemně
            na e-mail <strong>info@muzahair.cz</strong> nebo na adresu prodejny.
          </p>
          <p>
            <strong>5.4</strong> Prodávající vyřídí reklamaci do <strong>30 dnů</strong> od jejího uplatnění.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Odstoupení od smlouvy (spotřebitel)</h2>
          <p>
            <strong>6.1</strong> Kupující-spotřebitel má právo odstoupit od smlouvy do <strong>14 dnů</strong>
            od převzetí zboží bez udání důvodu.
          </p>
          <p>
            <strong>6.2</strong> Odstoupení musí být zasláno na e-mail <strong>info@muzahair.cz</strong> nebo
            písemně na adresu prodejny.
          </p>
          <p>
            <strong>6.3</strong> Zboží musí být vráceno kompletní, nepoškozené, v originálním obalu,
            nejlépe včetně dokladu o koupi.
          </p>
          <p>
            <strong>6.4</strong> Prodávající vrátí kupujícímu platbu do <strong>14 dnů</strong> od obdržení
            vráceného zboží stejným způsobem, jakým ji kupující uhradil (pokud se nedohodnou jinak).
          </p>
          <p>
            <strong>6.5</strong> Spotřebitel nese náklady spojené s vrácením zboží.
          </p>
          <p>
            <strong>6.6 Výjimky:</strong> Právo na odstoupení nelze uplatnit u zboží:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Vyrobeného dle speciální přání kupujícího (zboží na míru)</li>
            <li>Z hygienických důvodů (pokud bylo rozbaleno)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Ochrana osobních údajů</h2>
          <p>
            <strong>7.1</strong> Ochrana osobních údajů kupujícího je upravena v samostatném dokumentu
            {' '}<a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">Ochrana osobních údajů (GDPR)</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Alternativní řešení sporů</h2>
          <p>
            <strong>8.1</strong> V případě sporu mezi prodávajícím a kupujícím-spotřebitelem má kupující právo
            obrátit se na Českou obchodní inspekci:
          </p>
          <p className="mt-2">
            Česká obchodní inspekce<br />
            Ústřední inspektorát – oddělení ADR<br />
            Štěpánská 15, 120 00 Praha 2<br />
            E-mail: adr@coi.cz<br />
            Web: <a href="https://www.coi.cz" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.coi.cz</a>
          </p>
          <p className="mt-2">
            <strong>8.2</strong> Online řešení sporů (platforma EU):
            {' '}<a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Závěrečná ustanovení</h2>
          <p>
            <strong>9.1</strong> Prodávající si vyhrazuje právo změnit tyto OP. Nové znění OP bude
            zveřejněno na webových stránkách a nabude účinnosti dnem zveřejnění.
          </p>
          <p>
            <strong>9.2</strong> Vztahy a případné spory, které vzniknou na základě kupní smlouvy,
            se řídí právním řádem České republiky.
          </p>
          <p className="mt-4"><strong>Tyto OP jsou platné a účinné od 7. prosince 2025.</strong></p>
        </section>

        <section className="border-t pt-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Kontakt</h2>
          <p>
            V případě jakýchkoli dotazů týkajících se obchodních podmínek nás prosím kontaktujte:
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
