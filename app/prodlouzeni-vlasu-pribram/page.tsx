import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-pribram",
  city: "Příbram",
  from: "z Příbrami",
  km: 60,
  travel: "1 hodinu vlakem · 45 minut po D4 autem",
  keywords: ["prodloužení vlasů Příbram", "prodloužení vlasů Příbrami Praha", "kde prodlužovat vlasy Příbram", "vlasy k prodloužení Příbram", "prodloužení vlasů keratinem Příbram", "nanotapes Příbram", "weft prodloužení Příbram", "pravé vlasy Příbram"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuPribramPage() {
  return <CityLanding data={data} />;
}
