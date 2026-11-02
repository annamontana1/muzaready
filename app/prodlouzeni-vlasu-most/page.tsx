import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-most",
  city: "Most",
  from: "z Mostu",
  km: 80,
  travel: "1 hodinu vlakem · 1 hodinu po D8 autem",
  keywords: ["prodloužení vlasů Most", "prodloužení vlasů Mostu Praha", "kde prodlužovat vlasy Most", "vlasy k prodloužení Most", "prodloužení vlasů keratinem Most", "nanotapes Most", "weft prodloužení Most", "pravé vlasy Most"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuMostPage() {
  return <CityLanding data={data} />;
}
