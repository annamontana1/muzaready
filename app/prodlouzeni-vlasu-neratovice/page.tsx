import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-neratovice",
  city: "Neratovice",
  from: "z Neratovic",
  km: 32,
  travel: "35 minut vlakem · 30 minut autem",
  keywords: ["prodloužení vlasů Neratovice", "prodloužení vlasů Neratovic Praha", "kde prodlužovat vlasy Neratovice", "vlasy k prodloužení Neratovice", "prodloužení vlasů keratinem Neratovice", "nanotapes Neratovice", "weft prodloužení Neratovice", "pravé vlasy Neratovice"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuNeratovicePage() {
  return <CityLanding data={data} />;
}
