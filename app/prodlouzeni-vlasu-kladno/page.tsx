import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-kladno",
  city: "Kladno",
  from: "z Kladna",
  km: 27,
  travel: "35 minut vlakem · 30 minut po D7 autem",
  keywords: ["prodloužení vlasů Kladno", "prodloužení vlasů Kladna Praha", "kde prodlužovat vlasy Kladno", "vlasy k prodloužení Kladno", "prodloužení vlasů keratinem Kladno", "nanotapes Kladno", "weft prodloužení Kladno", "pravé vlasy Kladno"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKladnoPage() {
  return <CityLanding data={data} />;
}
