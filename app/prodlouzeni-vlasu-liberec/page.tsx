import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-liberec",
  city: "Liberec",
  from: "z Liberce",
  km: 105,
  travel: "1,5 hodiny vlakem · 1,5 hodiny autem",
  keywords: ["prodloužení vlasů Liberec", "prodloužení vlasů Liberce Praha", "kde prodlužovat vlasy Liberec", "vlasy k prodloužení Liberec", "prodloužení vlasů keratinem Liberec", "nanotapes Liberec", "weft prodloužení Liberec", "pravé vlasy Liberec"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuLiberecPage() {
  return <CityLanding data={data} />;
}
