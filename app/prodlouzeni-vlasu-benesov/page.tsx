import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-benesov",
  city: "Benešov",
  from: "z Benešova",
  km: 48,
  travel: "50 minut vlakem · 45 minut po D1 autem",
  keywords: ["prodloužení vlasů Benešov", "prodloužení vlasů Benešova Praha", "kde prodlužovat vlasy Benešov", "vlasy k prodloužení Benešov", "prodloužení vlasů keratinem Benešov", "nanotapes Benešov", "weft prodloužení Benešov", "pravé vlasy Benešov"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuBenesovPage() {
  return <CityLanding data={data} />;
}
