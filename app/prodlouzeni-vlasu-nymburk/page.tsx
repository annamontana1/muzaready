import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-nymburk",
  city: "Nymburk",
  from: "z Nymburka",
  km: 53,
  travel: "50 minut vlakem · 45 minut autem",
  keywords: ["prodloužení vlasů Nymburk", "prodloužení vlasů Nymburka Praha", "kde prodlužovat vlasy Nymburk", "vlasy k prodloužení Nymburk", "prodloužení vlasů keratinem Nymburk", "nanotapes Nymburk", "weft prodloužení Nymburk", "pravé vlasy Nymburk"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuNymburkPage() {
  return <CityLanding data={data} />;
}
