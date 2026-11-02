import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-zlin",
  city: "Zlín",
  from: "ze Zlína",
  km: 316,
  travel: "3,5 hodiny vlakem · 3,5 hodiny autem",
  keywords: ["prodloužení vlasů Zlín", "prodloužení vlasů Ze Zlína Praha", "kde prodlužovat vlasy Zlín", "vlasy k prodloužení Zlín", "prodloužení vlasů keratinem Zlín", "nanotapes Zlín", "weft prodloužení Zlín", "pravé vlasy Zlín"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuZlinPage() {
  return <CityLanding data={data} />;
}
