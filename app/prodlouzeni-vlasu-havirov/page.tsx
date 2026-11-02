import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-havirov",
  city: "Havířov",
  from: "z Havířova",
  km: 350,
  travel: "4 hodiny vlakem · 4 hodiny autem",
  keywords: ["prodloužení vlasů Havířov", "prodloužení vlasů Havířova Praha", "kde prodlužovat vlasy Havířov", "vlasy k prodloužení Havířov", "prodloužení vlasů keratinem Havířov", "nanotapes Havířov", "weft prodloužení Havířov", "pravé vlasy Havířov"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuHavirovPage() {
  return <CityLanding data={data} />;
}
