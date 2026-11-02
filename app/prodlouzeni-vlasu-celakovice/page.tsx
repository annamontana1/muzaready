import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-celakovice",
  city: "Čelákovice",
  from: "z Čelákovic",
  km: 28,
  travel: "35 minut vlakem · 30 minut autem",
  keywords: ["prodloužení vlasů Čelákovice", "prodloužení vlasů Čelákovic Praha", "kde prodlužovat vlasy Čelákovice", "vlasy k prodloužení Čelákovice", "prodloužení vlasů keratinem Čelákovice", "nanotapes Čelákovice", "weft prodloužení Čelákovice", "pravé vlasy Čelákovice"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuCelakovicePage() {
  return <CityLanding data={data} />;
}
