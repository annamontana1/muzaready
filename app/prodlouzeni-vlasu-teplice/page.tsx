import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-teplice",
  city: "Teplice",
  from: "z Teplic",
  km: 84,
  travel: "1 hodinu vlakem · 1 hodinu po D8 autem",
  keywords: ["prodloužení vlasů Teplice", "prodloužení vlasů Teplic Praha", "kde prodlužovat vlasy Teplice", "vlasy k prodloužení Teplice", "prodloužení vlasů keratinem Teplice", "nanotapes Teplice", "weft prodloužení Teplice", "pravé vlasy Teplice"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuTeplicePage() {
  return <CityLanding data={data} />;
}
