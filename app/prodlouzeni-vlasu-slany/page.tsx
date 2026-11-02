import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-slany",
  city: "Slaný",
  from: "ze Slaného",
  km: 37,
  travel: "45 minut vlakem · 35 minut autem",
  keywords: ["prodloužení vlasů Slaný", "prodloužení vlasů Slaného Praha", "kde prodlužovat vlasy Slaný", "vlasy k prodloužení Slaný", "prodloužení vlasů keratinem Slaný", "nanotapes Slaný", "weft prodloužení Slaný", "pravé vlasy Slaný"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuSlanyPage() {
  return <CityLanding data={data} />;
}
