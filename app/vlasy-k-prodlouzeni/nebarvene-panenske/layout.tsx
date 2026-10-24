import type { Metadata } from 'next';
import { BreadcrumbSchema, FAQSchema, SpeakableSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Nebarvené panenské vlasy k prodloužení | Mùza Hair Praha',
  description: '100% panenské vlasy bez chemického ošetření. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč. Délky 45–90 cm, 10 odstínů. Ruční výroba v Praze, dodání do 48h.',
  keywords: [
    'nebarvené panenské vlasy',
    'panenské vlasy Praha',
    'virgin hair',
    'vlasy bez chemie',
    'panenské vlasy k prodloužení',
    'standard vlasy',
    'luxe vlasy',
    'platinum vlasy',
    'vlasy na keratin',
    'vlasy pásky',
  ],
  openGraph: {
    title: 'Nebarvené panenské vlasy | Mùza Hair Praha',
    description: '100% přírodní panenské vlasy bez chemie. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske',
  },
};

const nebarveneFAQ = [
  {
    question: 'Co jsou nebarvené panenské vlasy?',
    answer: 'Nebarvené panenské vlasy jsou 100% přírodní lidské vlasy, které nikdy neprošly žádným chemickým ošetřením – nebyly barveny, netrvaleny ani jinak upravovány. Zachovávají si přirozenou kutikulu (kůžičku vlákna), díky čemuž jsou nejtrvanlivější a nejpřirozenější volbou.',
  },
  {
    question: 'V jakých délkách jsou nebarvené vlasy dostupné?',
    answer: 'Nabízíme nebarvené panenské vlasy v délkách 45, 50, 55, 60, 65, 70, 75, 80, 85 a 90 cm. Nejoblíbenější jsou délky 55–65 cm. Cena se liší podle délky – delší vlasy jsou vzácnější a nákladnější.',
  },
  {
    question: 'Mohu nebarvené vlasy přebarvit?',
    answer: 'Ano, panenské vlasy lze přebarvit na tmavší odstín nebo dobarvonat. Zesvětlování (odbarvování) možné je, ale výrazně zkracuje životnost vlasů – doporučujeme konzultaci s kadeřníkem. Barví se stejně jako vlastní vlasy.',
  },
  {
    question: 'Jaký je rozdíl v ceně nebarvených vlasů?',
    answer: 'Cena závisí na třídě kvality a délce. Standard (3–6 měs. nošení) od 6 900 Kč/100g, LUXE (12–18 měs.) od 8 900 Kč/100g, Platinum edition (18–24 měs.) od 10 900 Kč/100g. K ceně vlasů se připočítává výroba zakončení.',
  },
];

export default function NebarvenePanenskeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Domů', url: 'https://muzahair.cz' },
        { name: 'Vlasy k prodloužení', url: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
        { name: 'Nebarvené panenské vlasy', url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske' },
      ]} />
      <FAQSchema items={nebarveneFAQ} />
      <SpeakableSchema
        url="/vlasy-k-prodlouzeni/nebarvene-panenske"
        cssSelector={['h1', '.page-description', '.faq-answer']}
      />
      {children}
    </>
  );
}
