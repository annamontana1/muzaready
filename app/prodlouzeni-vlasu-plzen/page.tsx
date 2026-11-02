import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-plzen",
  city: "Plzeň",
  from: "z Plzně",
  km: 91,
  travel: "1,5 hodiny vlakem · 1 hodinu po D5 autem",
  keywords: ["prodloužení vlasů Plzeň", "prodloužení vlasů Plzně Praha", "kde prodlužovat vlasy Plzeň", "vlasy k prodloužení Plzeň", "prodloužení vlasů keratinem Plzeň", "nanotapes Plzeň", "weft prodloužení Plzeň", "pravé vlasy Plzeň"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuPlzenPage() {
  return <CityLanding data={data} />;
}
