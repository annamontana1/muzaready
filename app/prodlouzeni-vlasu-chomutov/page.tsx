import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-chomutov",
  city: "Chomutov",
  from: "z Chomutova",
  km: 100,
  travel: "1,5 hodiny vlakem · 1 hodinu autem",
  keywords: ["prodloužení vlasů Chomutov", "prodloužení vlasů Chomutova Praha", "kde prodlužovat vlasy Chomutov", "vlasy k prodloužení Chomutov", "prodloužení vlasů keratinem Chomutov", "nanotapes Chomutov", "weft prodloužení Chomutov", "pravé vlasy Chomutov"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuChomutovPage() {
  return <CityLanding data={data} />;
}
