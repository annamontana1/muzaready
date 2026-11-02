import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-ricany",
  city: "Říčany",
  from: "z Říčan",
  km: 22,
  travel: "30 minut vlakem · 25 minut autem",
  keywords: ["prodloužení vlasů Říčany", "prodloužení vlasů Říčan Praha", "kde prodlužovat vlasy Říčany", "vlasy k prodloužení Říčany", "prodloužení vlasů keratinem Říčany", "nanotapes Říčany", "weft prodloužení Říčany", "pravé vlasy Říčany"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuRicanyPage() {
  return <CityLanding data={data} />;
}
