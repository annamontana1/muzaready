import type { Metadata } from 'next';
import { FAQSchema, BreadcrumbSchema, ItemListSchema, SpeakableSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Vlasy k prodloužení | 100% panenské vlasy Praha | Mùza Hair',
  description: 'Prémiové vlasy k prodloužení z vlastní pražské barvírny. Nebarvené panenské vlasy a barvené blond odstíny. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč. Ruční výroba v ČR.',
  keywords: [
    'vlasy k prodloužení',
    'panenské vlasy Praha',
    'nebarvené vlasy k prodloužení',
    'barvené blond vlasy',
    'keratin vlasy',
    'pásky vlasy',
    'nano tapes',
    'vlasové tresy',
    'prodloužení vlasů Praha',
    'pravé vlasy',
    'vlasy na míru',
  ],
  openGraph: {
    title: 'Vlasy k prodloužení – 100% panenské vlasy | Mùza Hair',
    description: 'Prémiové vlasy k prodloužení z vlastní pražské barvírny. Ruční výroba v ČR. Standard od 6 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni',
  },
};

const hairExtensionsFAQ = [
  {
    question: 'Jaký je rozdíl mezi nebarvenými a barvenými vlasy k prodloužení?',
    answer: 'Nebarvené panenské vlasy nebyly nikdy chemicky ošetřeny – jsou v přirozeném stavu, což zajišťuje maximální pevnost a délku nošení. Barvené blond vlasy prošly profesionálním odbarvením v naší vlastní pražské barvírně – jsou vhodné pro zákaznice, které chtějí světlé odstíny bez kompromisů na kvalitě.',
  },
  {
    question: 'Jak vybrat správnou délku vlasů k prodloužení?',
    answer: 'Pro přirozený výsledek doporučujeme délku o 10–15 cm delší, než jsou vaše vlastní vlasy. Nejoblíbenější délky jsou 55–65 cm (po prsa). Kratší ženy (do 165 cm) volí délky 45–60 cm, vyšší ženy si mohou dovolit 65–75 cm. Délky 80–90 cm jsou vhodné pro speciální příležitosti.',
  },
  {
    question: 'Jaké jsou metody zakončení vlasů k prodloužení?',
    answer: 'Nabízíme: Keratin Standard/Micro/Pásky (výroba 1–3 dny, cena 1 000 Kč/100g), Nanotapes 2,8 cm nebo 4 cm (výroba 10–14 dní, cena 3 990 Kč/100g) a Hand Weft ručně šité tresy (výroba 10–14 dní, cena 5 990 Kč/100g). Výběr závisí na způsobu aplikace, který preferuje váš kadeřník.',
  },
  {
    question: 'Kolik gramů vlasů k prodloužení potřebuji?',
    answer: 'Pro základní objem a délku stačí obvykle 100g. Pro hustší výsledek nebo delší délky (nad 70 cm) doporučujeme 150–200g. Platíte za každých 100g vlasů plus zakázkovou výrobu. Váha po výrobě se může lišit max. o 5 %.',
  },
  {
    question: 'Lze vlasy k prodloužení barvit a tepelně upravovat?',
    answer: 'Panenské vlasy lze dobarvonat (ne odbarvovat) a běžně tvarovat (kulma, žehlička). Doporučujeme ochranné přípravky před teplem a šetrné šampony bez sulfátů. Barvené blond vlasy jsou citlivější – barvojte jen se zkušeným kadeřníkem.',
  },
];

export default function VlasyKProdlouzeniLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQSchema items={hairExtensionsFAQ} />
      <BreadcrumbSchema items={[
        { name: 'Domů', url: 'https://muzahair.cz' },
        { name: 'Vlasy k prodloužení', url: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
      ]} />
      <ItemListSchema
        name="Vlasy k prodloužení – Mùza Hair"
        description="Prémiové vlasy k prodloužení – nebarvené panenské vlasy a barvené blond odstíny. Ruční výroba v Praze."
        url="/vlasy-k-prodlouzeni"
        items={[
          {
            name: 'Nebarvené panenské vlasy',
            url: '/vlasy-k-prodlouzeni/nebarvene-panenske',
            description: '100% přírodní vlasy bez chemického ošetření. Standard, LUXE, Platinum.',
          },
          {
            name: 'Barvené blond vlasy',
            url: '/vlasy-k-prodlouzeni/barvene-blond',
            description: 'Profesionálně odbarvené vlasy v odstínech 5–10. Vlastní barvírna Praha.',
          },
        ]}
      />
      <SpeakableSchema
        url="/vlasy-k-prodlouzeni"
        cssSelector={['h1', '.category-description', '.faq-answer']}
      />
      {children}
    </>
  );
}
