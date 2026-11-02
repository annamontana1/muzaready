import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-pardubice",
  city: "Pardubice",
  from: "z Pardubic",
  km: 120,
  travel: "1,5 hodiny vlakem · 1,5 hodiny po D11 autem",
  keywords: ["prodloužení vlasů Pardubice", "prodloužení vlasů Pardubic Praha", "kde prodlužovat vlasy Pardubice", "vlasy k prodloužení Pardubice", "prodloužení vlasů keratinem Pardubice", "nanotapes Pardubice", "weft prodloužení Pardubice", "pravé vlasy Pardubice"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuPardubicePage() {
  return <CityLanding data={data} />;
}
