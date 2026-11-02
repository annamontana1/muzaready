import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-kolin",
  city: "Kolín",
  from: "z Kolína",
  km: 58,
  travel: "50 minut vlakem · 50 minut po D11 autem",
  keywords: ["prodloužení vlasů Kolín", "prodloužení vlasů Kolína Praha", "kde prodlužovat vlasy Kolín", "vlasy k prodloužení Kolín", "prodloužení vlasů keratinem Kolín", "nanotapes Kolín", "weft prodloužení Kolín", "pravé vlasy Kolín"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKolinPage() {
  return <CityLanding data={data} />;
}
