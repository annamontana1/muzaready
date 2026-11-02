import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-decin",
  city: "Děčín",
  from: "z Děčína",
  km: 110,
  travel: "1,5 hodiny vlakem · 1,5 hodiny po D8 autem",
  keywords: ["prodloužení vlasů Děčín", "prodloužení vlasů Děčína Praha", "kde prodlužovat vlasy Děčín", "vlasy k prodloužení Děčín", "prodloužení vlasů keratinem Děčín", "nanotapes Děčín", "weft prodloužení Děčín", "pravé vlasy Děčín"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuDecinPage() {
  return <CityLanding data={data} />;
}
