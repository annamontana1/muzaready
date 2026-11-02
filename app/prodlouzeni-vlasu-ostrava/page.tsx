import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-ostrava",
  city: "Ostrava",
  from: "z Ostravy",
  km: 370,
  travel: "3,5 hodiny vlakem · 3,5 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Ostrava", "prodloužení vlasů Ostrava cena", "kde prodlužovat vlasy Ostrava", "salon prodloužení vlasů Ostrava", "prodloužení vlasů keratinem Ostrava", "prodloužení vlasů nanotapes Ostrava", "prodloužení vlasů weft Ostrava", "hollywoodské prodloužení vlasů Ostrava", "nejlepší prodloužení vlasů Ostrava", "pravé vlasy Ostrava", "prodloužení vlasů Moravskoslezský kraj"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuOstravaPage() {
  return <CityLanding data={data} />;
}
