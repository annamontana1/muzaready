import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-rakovnik",
  city: "Rakovník",
  from: "z Rakovníka",
  km: 64,
  travel: "1 hodinu vlakem · 50 minut autem",
  keywords: ["prodloužení vlasů Rakovník", "prodloužení vlasů Rakovníka Praha", "kde prodlužovat vlasy Rakovník", "vlasy k prodloužení Rakovník", "prodloužení vlasů keratinem Rakovník", "nanotapes Rakovník", "weft prodloužení Rakovník", "pravé vlasy Rakovník"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuRakovnikPage() {
  return <CityLanding data={data} />;
}
