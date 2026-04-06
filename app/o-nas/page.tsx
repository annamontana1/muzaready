import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Múza Hair Praha – pravé vlasy k prodloužení | O nás',
  description:
    'Jsme český výrobce prémiových pravých vlasů k prodloužení. Zakladatelka Anna stojí za panenskou kvalitou vlasů z vlastního pražského ateliéru.',
  openGraph: {
    title: 'Múza Hair Praha – pravé vlasy k prodloužení | O nás',
    description:
      'Jsme český výrobce prémiových pravých vlasů k prodloužení. Zakladatelka Anna stojí za panenskou kvalitou vlasů z vlastního pražského ateliéru.',
    url: 'https://muzahair.cz/o-nas',
  },
};

export default function ONasPage() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Hero */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          O nás
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-8 max-w-3xl"
          style={{ color: 'var(--text-dark)' }}
        >
          Múza Hair Praha: pravé vlasy k prodloužení z pražského ateliéru s příběhem
        </h1>

        <p className="text-[15px] leading-[1.8] font-light max-w-2xl" style={{ color: 'var(--text-soft)' }}>
          Múza Hair Praha je český výrobce a dodavatel prémiových pravých vlasů k prodloužení
          s vlastní barvírnou a ruční výrobou v Praze. Zakladatelka Anna nabízí vlasy ve čtyřech
          liniích — Standard, Luxe, Platinum a Baby Shades — z východoevropských, středoevropských
          i dětských vlasů nejvyšší kvality. V pražském ateliéru vyrábíme tape-in pásky, wefty,
          clip-in vlasy a keratin prameny z vlasů s ověřeným původem.
        </p>
      </section>

      {/* Story — Chapter 1 */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div className="max-w-3xl">
          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            Příběh
          </div>

          <h2
            className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-10"
            style={{ color: 'var(--text-dark)' }}
          >
            Jak jeden darovaný copánek změnil můj pohled na vlasy
          </h2>

          <div className="flex flex-col gap-6">
            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Můj příběh začíná před dvanácti lety na Ukrajině — u jednoho neočekávaného setkání v lékárně.
              Zaplatila jsem starší paní léky. Ona mě na oplátku pozvala na pirohy a ve staré krabičce
              obalené novinami mi ukázala poklad: dlouhý, zapletený copánek uložený celá desetiletí.
            </p>

            {/* Pull quote */}
            <div className="py-8 border-l-2 pl-8" style={{ borderColor: 'var(--burgundy)' }}>
              <p
                className="font-cormorant text-[clamp(22px,2.5vw,30px)] font-light leading-[1.4] italic"
                style={{ color: 'var(--burgundy)' }}
              >
                „Nech si ho na památku," řekla tiše.
              </p>
            </div>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Netušila jsem, že právě tento dar změní směr mého života.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Sama jsem nikdy neměla příliš husté vlasy — a tak mě napadlo nechat si z copánku vyrobit
              vlasový příčesek. Toto hledání mě zavedlo téměř 800 kilometrů od mé rodné vesnice,
              do Dnipropetrovsku, k paní Olze, která ručně vyráběla luxusní paruky a příčesky
              z pravých vlasů. Jakmile jsem uviděla její práci, bylo mi jasné: takové řemeslo by
              mělo poptávku i v Česku.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Následujících deset let jsem zasvětila hledání těch nejlepších pravých vlasů k prodloužení.
              Cestovala jsem, navštěvovala výkupny, osobně testovala kvalitu, elasticitu i reakci vlasů
              na barvení. Naučila jsem se rozpoznat skutečně panenské, nebarvené vlasy od levných
              směsí z továren.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Nebylo to vždy snadné. Jeden dodavatel mi po roce spolehlivé spolupráce místo slíbených
              panenských vlasů poslal zplstnatělé dredy a spálené blond prameny, které po umytí ztvrdly
              jako plast. Přišla jsem o peníze. Ale získala jsem něco cennějšího: přesné pochopení toho,
              co skutečná kvalita znamená — a co jsou jen prázdná slova.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Tato zkušenost mě přivedla k jedinému možnému řešení: vzít celý proces do vlastních rukou.
              Tak vznikla Múza Hair Praha — značka stojící na poctivosti, vlastní výrobě a přímém výkupu
              vlasů od dárkyň v České republice i zahraničí.
            </p>
          </div>
        </div>
      </section>

      {/* Story — Chapter 2 */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory-warm)' }}>
        <div className="max-w-3xl">
          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            Výroba
          </div>

          <h2
            className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-10"
            style={{ color: 'var(--text-dark)' }}
          >
            Vlastní výroba a technologie, která mluví sama za sebe
          </h2>

          <div className="flex flex-col gap-6">
            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Múza Hair Praha dnes stojí na vlastní barvírně, ruční výrobě a profesionálním týmu
              v pražském ateliéru. Nejsme překupníci — každý produkt vzniká přímo u nás.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Naším největším technologickým přínosem je vlastní metoda průmyslového odbarvování vlasů,
              kterou jsme zdokonalovali přes pět let. V naší barvírně pracuje pět specialistů — každý
              zodpovídá za konkrétní část procesu. Díky tomu dokážeme odbarvit pravé vlasy až na
              platinové blond odstíny bez poškození vlasového vlákna. Naše blond vlasy jsou hebké,
              živé a lesklé — ne suché a křehké jako vlasy zpracované továrním způsobem.
            </p>

            {/* Pull quote */}
            <div className="py-8 border-l-2 pl-8" style={{ borderColor: 'var(--burgundy)' }}>
              <p
                className="font-cormorant text-[clamp(22px,2.5vw,28px)] font-light leading-[1.4]"
                style={{ color: 'var(--text-dark)' }}
              >
                Každý culík pochází od jednoho dárce — z Česka, Ukrajiny, Vietnamu, Řecka
                a Kazachstánu.
              </p>
            </div>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Nabízíme dvě základní kategorie vlasů. Panenské, nebarvené vlasy — chemicky nedotčené,
              s přirozenou strukturou, ideální pro zesvětlování nebo další tónování. A profesionálně
              tónované vlasy zpracované přímo v naší barvírně, kde každý krok procesu odbarvování
              probíhá pod odborným dohledem.
            </p>

            <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Na trhu, kde mnoho firem prodává „evropské" vlasy nejasného původu, jdeme opačnou cestou.
              Kvalitu nepoznáte podle etikety, ale podle pružnosti, lesku a zdravé struktury každého pramene.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Kolekce
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Co v našem ateliéru najdete
        </h2>

        <p className="text-[15px] leading-[1.8] font-light max-w-xl mb-12" style={{ color: 'var(--text-soft)' }}>
          V pražském ateliéru Múza Hair vyrábíme produkty ze čtyř kategorií pravých vlasů —
          každá má svou strukturu, hustotu i charakter.
        </p>

        <div className="w-16 h-px mb-10" style={{ background: 'var(--accent)' }} />

        <h3
          className="font-cormorant text-[22px] font-light mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Kategorie vlasů
        </h3>

        <div className="flex flex-col gap-0 mb-16 max-w-2xl">
          {[
            { name: 'Východoevropské vlasy', desc: 'silnější, přirozeně tmavší odstíny, výjimečná hustota a dlouhá životnost' },
            { name: 'Středoevropské vlasy', desc: 'jemnější struktura, přirozené blond i hnědé tóny, ideální pro středoevropský typ' },
            { name: 'Dětské vlasy — nejvyšší kvalita', desc: 'nejjemnější textura, nedotčená struktura, mimořádná hebkost a přirozený lesk' },
            { name: 'Baby Shades', desc: 'speciální linie v nejsvětlejších, přirozeně světlých odstínech pro ty, které touží po blond bez kompromisů' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-5 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="block w-4 h-px mt-[11px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <span className="text-[15px] font-light" style={{ color: 'var(--text-dark)' }}>
                  {item.name}
                </span>
                <span className="text-[15px] font-light" style={{ color: 'var(--text-soft)' }}>
                  {' '}— {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h3
          className="font-cormorant text-[22px] font-light mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Produktové edice
        </h3>

        <div className="flex flex-col gap-0 mb-16 max-w-2xl">
          {[
            { edition: 'Standard', desc: 'Spolehlivá kvalita pro každodenní nošení a salony' },
            { edition: 'Luxe', desc: 'Prémiový výběr pro náročnější zákaznice a stylisty' },
            { edition: 'Platinum', desc: 'Nejlepší culíky z naší nabídky — pro ty, pro které je kvalita na prvním místě' },
            { edition: 'Baby Shades', desc: 'Exkluzivní světlé odstíny z nejjemnějších vlasů — přirozeně, bez přebarvování' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-8 py-5 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-light w-24 flex-shrink-0 pt-px"
                style={{ color: 'var(--accent)' }}
              >
                {item.edition}
              </span>
              <span className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        <h3
          className="font-cormorant text-[22px] font-light mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Typy produktů ve všech edicích
        </h3>

        <div className="flex flex-col gap-0 max-w-2xl mb-6">
          {[
            'Vlasové pásky tape-in — výroba na zakázku za 14 dní',
            'Wefty pro Hollywood metodu prodloužení — výroba za 14 dní',
            'Keratin prameny a micro ring — výroba za 3 dny',
            'Panenské nebarvené culíky (raw hair) pro salony',
            'Clip-in vlasy Praha — sady, pásy, culíky',
            'Clip-in ofiny z pravých vlasů',
            'Paruky na míru',
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-5 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="block w-4 h-px mt-[11px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <span className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text-soft)' }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[15px] font-light" style={{ color: 'var(--text-dark)' }}>
          Všechny produkty vznikají ručně v Praze — ne v továrně.
        </p>
      </section>

      {/* Why us */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Proč Múza Hair
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Pět důvodů, proč nám zákaznice věří
        </h2>

        <div className="flex flex-col gap-0 max-w-3xl">
          {[
            {
              title: '12 let zkušeností s pravými vlasy',
              text: 'Dvanáct let přímé práce s vlasy od dárkyň, vlastní výroby a spolupráce se salony v celé ČR. Tato zkušenost se odráží v každém produktu, který opustí náš ateliér.',
            },
            {
              title: 'Vlastní barvírna a ruční výroba v Praze',
              text: 'Nekupujeme hotové produkty od třetích stran — zpracováváme vlasy přímo u nás. Každý výrobní krok probíhá pod naším dohledem v pražském ateliéru.',
            },
            {
              title: 'Ověřený původ každého culíku',
              text: 'Vlasy vykupujeme přímo od dárkyň v Česku, Ukrajině, Polsku, Rumunsku, Vietnamu, Řecku a Kazachstánu. Každý culík pochází od jednoho dárce a má jasnou historii.',
            },
            {
              title: 'Vlastní technologie odbarvování',
              text: 'Naše pětileté know-how v průmyslovém odbarvování umožňuje získat platinové blond vlasy bez poškození vlasového vlákna. V barvírně pracuje pět specialistů, každý zodpovědný za svou část procesu.',
            },
            {
              title: 'Showroom Praha — osobní výběr vlasů',
              text: 'Nemusíte nakupovat naslepo. V pražském showroomu si vlasy prohlédnete, osaháte a vyberete přesně ten odstín a délku, který vám sedí. Konzultace je zdarma.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 border-b"
              style={{ borderColor: 'var(--ivory-warm)' }}
            >
              <span
                className="block w-4 h-px mt-[13px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <p className="text-[15px] font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                  {item.title}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory-warm)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Časté otázky
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Co se zákaznice nejčastěji ptají
        </h2>

        <div className="flex flex-col gap-0 max-w-2xl">
          {[
            {
              q: 'Co je Múza Hair Praha?',
              a: 'Múza Hair Praha je český výrobce a dodavatel prémiových pravých vlasů k prodloužení s vlastní barvírnou a ruční výrobou v Praze. Vyrábíme tape-in pásky, wefty, clip-in vlasy, keratin prameny i paruky na míru — vždy z vlasů s ověřeným původem, ve čtyřech edicích: Standard, Luxe, Platinum a Baby Shades.',
            },
            {
              q: 'Odkud pocházejí vaše vlasy?',
              a: 'Vlasy vykupujeme přímo od dárkyň v České republice, Ukrajině, Polsku, Rumunsku, Vietnamu, Řecku a Kazachstánu. Každý culík pochází od jednoho dárce, má ověřený původ a prochází ruční kontrolou v pražském ateliéru. Vlasy od různých dárkyň nikdy nemícháme.',
            },
            {
              q: 'Jsou vaše vlasy skutečně panenské?',
              a: 'Nabízíme dvě kategorie vlasů. První jsou panenské, nebarvené vlasy — chemicky nedotčené, ideální pro zesvětlování nebo tónování. Druhá kategorie jsou profesionálně tónované vlasy z naší vlastní barvírny, kde pracuje pět specialistů — každý zodpovídá za konkrétní část procesu průmyslového odbarvování. Výsledkem jsou vlasy hebké, živé a bez poškození vlákna.',
            },
            {
              q: 'Kde vás najdu v Praze?',
              a: 'Máme fyzický showroom v Praze, kde si vlasy osobně prohlédnete a vyberete. Konzultace je zdarma a vítaná. Přesnou adresu a aktuální otevírací dobu najdete na muzahair.cz — nebo nás kontaktujte přímo pro sjednání termínu.',
            },
            {
              q: 'Nabízíte velkoobchodní prodej pro salony?',
              a: 'Ano, spolupracujeme s kadeřnickými salony a extension technicians po celé ČR. Nabízíme velkoobchodní ceny, komisní prodej a možnost osobního odběru v Praze. Spolupracujeme výhradně s odborníky, kteří sdílejí naše hodnoty — poctivost a preciznost.',
            },
            {
              q: 'Jak dlouho trvá výroba vlasů na zakázku?',
              a: 'Záleží na produktu. Tape-in pásky, wefty a clip-in vlasy vyrábíme za 14 dní. Keratin prameny, micro keratin a micro ring jsou připraveny za 3 dny. Skladové barvy expedujeme ihned. Přesné termíny potvrdíme při objednávce.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="block w-4 h-px mt-[13px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <p className="text-[15px] font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                  {faq.q}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Přijďte se podívat
        </h2>

        <p className="text-[15px] leading-[1.8] font-light max-w-lg mb-10" style={{ color: 'var(--text-soft)' }}>
          Srdečně vás zvu do našeho pražského showroomu, kde si vlasy prohlédnete, osaháte
          a vyberete přesně ten odstín a délku pro vás. Konzultace je zdarma a nezávazná.
        </p>

        <div className="flex gap-4 flex-wrap items-center mb-10">
          <Link
            href="/kontakt"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Kontaktovat nás
          </Link>
          <Link
            href="/vlasy-k-prodlouzeni"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2"
            style={{ color: 'var(--text-mid)' }}
          >
            Prohlédnout kolekci →
          </Link>
        </div>

        <p className="text-[13px] font-light italic" style={{ color: 'var(--text-soft)' }}>
          S láskou k řemeslu a kráse, Anna — zakladatelka Múza Hair Praha
        </p>
      </section>

    </div>
  );
}
