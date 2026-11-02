import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-praha",
  city: "Praha",
  from: "z Prahy",
  km: 0,
  travel: "",
  local: true,
  keywords: ["prodloužení vlasů Praha", "prodloužení vlasů Praha cena", "kde prodlužovat vlasy Praha", "salon prodloužení vlasů Praha", "prodloužení vlasů keratinem Praha", "prodloužení vlasů nanotapes Praha", "prodloužení vlasů weft Praha", "hollywoodské prodloužení vlasů Praha", "nejlepší prodloužení vlasů Praha", "prodloužení vlasů Praha recenze", "prodloužení vlasů Praha 1"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuPrahaPage() {
  return <CityLanding data={data} />;
}
