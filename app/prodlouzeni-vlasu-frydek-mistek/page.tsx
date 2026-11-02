import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-frydek-mistek",
  city: "Frýdek-Místek",
  from: "z Frýdku-Místku",
  km: 346,
  travel: "3,5 hodiny vlakem · 3,5 hodiny autem",
  keywords: ["prodloužení vlasů Frýdek-Místek", "prodloužení vlasů Frýdku-Místku Praha", "kde prodlužovat vlasy Frýdek-Místek", "vlasy k prodloužení Frýdek-Místek", "prodloužení vlasů keratinem Frýdek-Místek", "nanotapes Frýdek-Místek", "weft prodloužení Frýdek-Místek", "pravé vlasy Frýdek-Místek"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuFrydekMistekPage() {
  return <CityLanding data={data} />;
}
