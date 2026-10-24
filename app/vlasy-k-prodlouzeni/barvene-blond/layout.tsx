import type { Metadata } from 'next';
import { BreadcrumbSchema, FAQSchema, SpeakableSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Barvené blond vlasy k prodloužení | Vlastní barvírna Praha | Mùza Hair',
  description: 'Profesionálně odbarvené blond vlasy v odstínech 5–10. Vlastní barvírna v Praze – přirozené a trvanlivé výsledky. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč.',
  keywords: [
    'barvené blond vlasy',
    'blond vlasy k prodloužení',
    'odbarvené vlasy Praha',
    'světlé vlasy k prodloužení',
    'blond prodloužení vlasů',
    'platinové vlasy',
    'blond keratin vlasy',
    'vlastní barvírna Praha',
    'blond vlasové tresy',
  ],
  openGraph: {
    title: 'Barvené blond vlasy | Vlastní barvírna Praha | Mùza Hair',
    description: 'Profesionálně odbarvené blond vlasy v odstínech 5–10. Vlastní barvírna v Praze. Standard od 6 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-blond',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-blond',
  },
};

const barveneFAQ = [
  {
    question: 'Jak se barví blond vlasy Mùza Hair?',
    answer: 'Barvení probíhá v naší vlastní barvírně v Praze. Vlasy odbarvujeme postupně v několika fázích, aby si zachovaly pevnost a přirozenou kutikulu. Nepoužíváme levné rychloodbarvovaèe – proces trvá déle, ale výsledek je trvanlivější a přirozenější.',
  },
  {
    question: 'V jakých odstínech jsou barvené vlasy dostupné?',
    answer: 'Nabízíme barvené vlasy v odstínech 5 (středně blond) až 10 (platinová blond). Nejtmavší odstín 5 je přirozená teplá blond, odstín 10 je studená platinová blond. Každý odstín má přibližně 2–3 variace teplosti tónu.',
  },
  {
    question: 'Jsou barvené vlasy méně trvanlivé než nebarvené?',
    answer: 'Barvené vlasy mají při správné péči srovnatelnou životnost jako nebarvené vlasy stejné třídy. Standard vydrží 3–6 měsíců, LUXE 12–18 měsíců. Klíčová je péče – používejte šampony pro barvené vlasy, vyhýbejte se přílišnému teplu a pravidelně vlasy hydratujte.',
  },
  {
    question: 'Mohu barvené blond vlasy přebarvit na tmavší?',
    answer: 'Ano, barvené blond vlasy lze dobarvonat na tmavší odstín. Není doporučeno je dále odbarvovat – to by mohlo poškodit strukturu vlákna. Vždy doporučujeme konzultaci s kadeřníkem.',
  },
];

export default function BarvenéBlondLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Domů', url: 'https://muzahair.cz' },
        { name: 'Vlasy k prodloužení', url: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
        { name: 'Barvené blond vlasy', url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-blond' },
      ]} />
      <FAQSchema items={barveneFAQ} />
      <SpeakableSchema
        url="/vlasy-k-prodlouzeni/barvene-blond"
        cssSelector={['h1', '.page-description', '.faq-answer']}
      />
      {children}
    </>
  );
}
