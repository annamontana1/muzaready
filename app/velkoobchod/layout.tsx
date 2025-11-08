import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Velkoobchod - B2B pro kadernicky salony | Muza Hair',
  description: 'Ziskejte velkoobchodni ceny na vlasy k prodlouzeni. Jsme cesky vyrobce se svou barvirnou - nabizime nebarvene i barvene vlasy (Standard, LUXE, Platinum Edition) pro profesionaly.',
  openGraph: {
    title: 'Velkoobchod - B2B pro kadernicky salony | Muza Hair',
    description: 'Ziskejte velkoobchodni ceny na vlasy k prodlouzeni. Jsme cesky vyrobce se svou barvirnou - nabizime nebarvene i barvene vlasy (Standard, LUXE, Platinum Edition) pro profesionaly.',
  },
};

export default function VelkoobchodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
