import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-prerov",
  city: "Přerov",
  from: "z Přerova",
  km: 271,
  travel: "2,5 hodiny vlakem · 2,5 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Přerov", "prodloužení vlasů Přerova Praha", "kde prodlužovat vlasy Přerov", "vlasy k prodloužení Přerov", "prodloužení vlasů keratinem Přerov", "nanotapes Přerov", "weft prodloužení Přerov", "pravé vlasy Přerov"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuPrerovPage() {
  return <CityLanding data={data} />;
}
