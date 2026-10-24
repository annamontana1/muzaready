import type { Metadata } from 'next';
import { FAQSchema, BreadcrumbSchema, SpeakableSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'FAQ – Často kladené otázky | Mùza Hair Praha',
  description: 'Odpovědi na nejčastější otázky o vlasech k prodloužení – typy, ceny, péče, výroba, aplikace, doručení. Mùza Hair Praha – 8 let zkušeností.',
  openGraph: {
    title: 'FAQ – Časté otázky | Mùza Hair',
    description: 'Vše, co potřebujete vědět o vlasech k prodloužení od Mùza Hair.',
    url: 'https://muzahair.cz/informace/faq',
  },
  alternates: {
    canonical: 'https://muzahair.cz/informace/faq',
  },
};

const faqSections = [
  {
    category: 'O vlasech',
    items: [
      {
        question: 'Co jsou panenské vlasy?',
        answer: 'Panenské vlasy (virgin hair) jsou 100% přírodní lidské vlasy, které nebyly nikdy chemicky ošetřeny – nebarveny, netrvaleny ani jinak upravovány. Zachovávají si přirozený kůžičkový povrch (kutikulu), díky čemuž jsou nejkvalitnější, nejtrvanlivější a nejpřirozenější volbou pro prodloužení vlasů.',
      },
      {
        question: 'Jak se liší Standard, LUXE a Platinum?',
        answer: 'Standard vlasy jsou kvalitní panenské vlasy pro kratší nošení 3–6 měsíců, ideální jako první prodloužení od 6 900 Kč/100g. LUXE jsou prémiovější vlasy s životností 12–18 měsíců, od 8 900 Kč/100g. Platinum edition jsou nejkvalitnější vlasy z Ukrajiny, Polska a Rumunska s certifikátem původu, vydrží 18–24 měsíců, od 10 900 Kč/100g. Rozdíl je v jemnosti vlasu, délce kutikuly a původu.',
      },
      {
        question: 'Odkud vlasy pocházejí?',
        answer: 'Vlasy Standard a LUXE jsou panenské vlasy z prověřených zdrojů. Vlasy Platinum edition pocházejí výhradně z Ukrajiny, Polska a Rumunska a jsou doplněny certifikátem původu. Žádné vlasy nepocházejí z Asie – všechny jsou evropského nebo východoevropského původu.',
      },
      {
        question: 'Jsou vlasy zdravotně nezávadné?',
        answer: 'Ano. Veškeré vlasy Mùza Hair splňují evropské normy pro kosmetické výrobky. Panenské vlasy jsou čistě přírodního původu, bez chemického ošetření. Barvení probíhá v naší vlastní barvírně s profesionálními přípravky certifikovanými pro EU.',
      },
    ],
  },
  {
    category: 'Výroba a zakázky',
    items: [
      {
        question: 'Jak funguje zakázková výroba?',
        answer: 'Vyberte si vlasy (třída, délka, gramáž), poté zvolte zakončení: Keratin (3–5 dní, 1 000 Kč/100g), Nanotapes (10–14 dní, 3 990 Kč/100g) nebo Hand Weft (10–14 dní, 5 990 Kč/100g). Objednávku potvrdíme, výrobu spustíme po přijetí platby. Hotové vlasy expedujeme ihned po výrobě.',
      },
      {
        question: 'Mohu vrátit zakázkový výrobek?',
        answer: 'Ne. Vlasy vyrobené na zakázku (s konkrétním zakončením) jsou dle § 1837 občanského zákoníku vyňaty z práva na odstoupení od smlouvy, protože jde o zboží zhotovené dle požadavků spotřebitele. Proto vždy pečlivě zvažte volbu zakončení a gramáže před objednávkou.',
      },
      {
        question: 'Co je zatmavení kořínků?',
        answer: 'Zatmavení kořínků (root darkening) je služba, při které kořínkovou část vlasů jemně ztmavíme, aby přechod mezi vašimi vlasy a prodloužením vypadal přirozeněji. Cena je 690 Kč/100g navíc k ceně vlasů a výroby.',
      },
    ],
  },
  {
    category: 'Péče o vlasy',
    items: [
      {
        question: 'Jak pečovat o vlasy k prodloužení?',
        answer: 'Používejte šampony a kondicionéry bez sulfátů a parafínů. Vlasy před spaním zapletejte do volného copu. Před tepelnou úpravou (kulma, žehlička) vždy naneste ochranný sprej. Pravidelně vlasy promazávejte arganovým nebo kokosovým olejem. Nechodte spát s mokrými vlasy.',
      },
      {
        question: 'Lze vlasy barvit nebo zesvětlovat?',
        answer: 'Panenské vlasy lze přebarvit na tmavší odstín. Zesvětlování (odbarvování) výrazně zkrátí životnost vlasů a nedoporučujeme ho. Barvené blond vlasy jsou citlivější na další chemické procesy – vždy konzultujte s kadeřníkem, který má zkušenosti s prodloužením vlasů.',
      },
      {
        question: 'Jak dlouho vlasy vydrží?',
        answer: 'Standard: 3–6 měsíců. LUXE: 12–18 měsíců. Platinum: 18–24 měsíců. Životnost závisí na správné péči – při používání sulfátových šamponů nebo nevhodné péči se může zkrátit na polovinu.',
      },
    ],
  },
  {
    category: 'Objednávka a doručení',
    items: [
      {
        question: 'Jak zaplatit?',
        answer: 'Přijímáme platbu bankovním převodem (záloha nebo plná platba předem). Zakázková výroba se spouští až po přijetí platby. Hotové vlasy z katalogu lze zaplatit kartou online.',
      },
      {
        question: 'Jak rychle vlasy dostanu?',
        answer: 'Vlasy s keratinovým zakončením vyrobíme za 1–3 pracovní dny, Nanotapes a Hand Weft za 10–14 pracovních dní. Po výrobě expedujeme do 48 hodin přepravní společností.',
      },
      {
        question: 'Doručujete i mimo Prahu?',
        answer: 'Ano, doručujeme po celé České republice. Showroom máme v Praze (09:00–19:00 denně), kde si lze vlasy vyzvednout osobně nebo si rovnou naplánovat konzultaci.',
      },
    ],
  },
  {
    category: 'B2B a velkoobchod',
    items: [
      {
        question: 'Nabízíte B2B podmínky pro kadeřnice?',
        answer: 'Ano. Kadeřnice a salony mohou požádat o B2B spolupráci. Po schválení (24–48 hod) získáte slevu 10 % na veškeré produkty bez minimálního odběru. U větších objemů nabízíme individuální ceny. Pište na info@muzahair.cz.',
      },
      {
        question: 'Existuje minimální odběr pro velkoobchod?',
        answer: 'Ne, žádný minimální odběr nestanovujeme. B2B zákazníci nakupují za zvýhodněné ceny od první objednávky.',
      },
    ],
  },
];

// Zploštíme pro FAQ schema
const allFaqItems = faqSections.flatMap((s) => s.items);

export default function FAQPage() {
  return (
    <>
      <FAQSchema items={allFaqItems} />
      <BreadcrumbSchema items={[
        { name: 'Domů', url: 'https://muzahair.cz' },
        { name: 'Informace', url: 'https://muzahair.cz/informace' },
        { name: 'FAQ', url: 'https://muzahair.cz/informace/faq' },
      ]} />
      <SpeakableSchema
        url="/informace/faq"
        cssSelector={['.faq-question', '.faq-answer', 'h1']}
      />

      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Často kladené otázky
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Máte otázky o vlasech k prodloužení? Tady najdete odpovědi na vše, co zákaznice nejčastěji řeší.
          </p>

          <div className="space-y-12">
            {faqSections.map((section) => (
              <section key={section.category}>
                <h2 className="text-2xl font-playfair text-burgundy mb-6 pb-2 border-b border-beige">
                  {section.category}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.question} className="bg-ivory rounded-xl p-6">
                      <h3 className="faq-question text-lg font-semibold text-gray-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="faq-answer text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 p-8 bg-burgundy text-white rounded-2xl text-center">
            <h2 className="text-2xl font-playfair mb-3">Nenašli jste odpověď?</h2>
            <p className="mb-6 opacity-90">
              Napište nám nebo přijďte do showroomu – rádi poradíme osobně.
            </p>
            <a
              href="/kontakt"
              className="inline-block bg-white text-burgundy font-semibold px-8 py-3 rounded-full hover:bg-cream transition-colors"
            >
              Kontaktovat nás
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
