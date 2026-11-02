import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-melnik",
  city: "Mělník",
  from: "z Mělníka",
  km: 39,
  travel: "50 minut vlakem · 40 minut autem",
  keywords: ["prodloužení vlasů Mělník", "prodloužení vlasů Mělníka Praha", "kde prodlužovat vlasy Mělník", "vlasy k prodloužení Mělník", "prodloužení vlasů keratinem Mělník", "nanotapes Mělník", "weft prodloužení Mělník", "pravé vlasy Mělník"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuMelnikPage() {
  return <CityLanding data={data} />;
}
