import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-opava",
  city: "Opava",
  from: "z Opavy",
  km: 358,
  travel: "4 hodiny vlakem · 4 hodiny autem",
  keywords: ["prodloužení vlasů Opava", "prodloužení vlasů Opavy Praha", "kde prodlužovat vlasy Opava", "vlasy k prodloužení Opava", "prodloužení vlasů keratinem Opava", "nanotapes Opava", "weft prodloužení Opava", "pravé vlasy Opava"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuOpavaPage() {
  return <CityLanding data={data} />;
}
