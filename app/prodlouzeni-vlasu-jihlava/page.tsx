import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-jihlava",
  city: "Jihlava",
  from: "z Jihlavy",
  km: 131,
  travel: "2 hodiny vlakem · 1,5 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Jihlava", "prodloužení vlasů Jihlavy Praha", "kde prodlužovat vlasy Jihlava", "vlasy k prodloužení Jihlava", "prodloužení vlasů keratinem Jihlava", "nanotapes Jihlava", "weft prodloužení Jihlava", "pravé vlasy Jihlava"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuJihlavaPage() {
  return <CityLanding data={data} />;
}
