import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-beroun",
  city: "Beroun",
  from: "z Berouna",
  km: 34,
  travel: "40 minut vlakem · 35 minut po D5 autem",
  keywords: ["prodloužení vlasů Beroun", "prodloužení vlasů Berouna Praha", "kde prodlužovat vlasy Beroun", "vlasy k prodloužení Beroun", "prodloužení vlasů keratinem Beroun", "nanotapes Beroun", "weft prodloužení Beroun", "pravé vlasy Beroun"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuBerounPage() {
  return <CityLanding data={data} />;
}
