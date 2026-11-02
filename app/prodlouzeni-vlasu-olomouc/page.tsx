import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-olomouc",
  city: "Olomouc",
  from: "z Olomouce",
  km: 280,
  travel: "3 hodiny vlakem · 3 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Olomouc", "prodloužení vlasů Olomouce Praha", "kde prodlužovat vlasy Olomouc", "vlasy k prodloužení Olomouc", "prodloužení vlasů keratinem Olomouc", "nanotapes Olomouc", "weft prodloužení Olomouc", "pravé vlasy Olomouc"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuOlomoucPage() {
  return <CityLanding data={data} />;
}
