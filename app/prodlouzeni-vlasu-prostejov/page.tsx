import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-prostejov",
  city: "Prostějov",
  from: "z Prostějova",
  km: 250,
  travel: "2,5 hodiny vlakem · 2,5 hodiny po D1 autem",
  keywords: ["prodloužení vlasů Prostějov", "prodloužení vlasů Prostějova Praha", "kde prodlužovat vlasy Prostějov", "vlasy k prodloužení Prostějov", "prodloužení vlasů keratinem Prostějov", "nanotapes Prostějov", "weft prodloužení Prostějov", "pravé vlasy Prostějov"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuProstejovPage() {
  return <CityLanding data={data} />;
}
