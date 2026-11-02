import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-brno",
  city: "Brno",
  from: "z Brna",
  km: 205,
  travel: "2,5 hodiny vlakem · 2 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Brno", "prodloužení vlasů Brno cena", "kde prodlužovat vlasy Brno", "salon prodloužení vlasů Brno", "prodloužení vlasů keratinem Brno", "prodloužení vlasů nanotapes Brno", "prodloužení vlasů weft Brno", "hollywoodské prodloužení vlasů Brno", "nejlepší prodloužení vlasů Brno", "pravé vlasy prodloužení Brno", "prodloužení vlasů Jihomoravský kraj"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuBrnoPage() {
  return <CityLanding data={data} />;
}
