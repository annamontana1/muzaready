import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-dobris",
  city: "Dobříš",
  from: "z Dobříše",
  km: 46,
  travel: "55 minut vlakem · 40 minut autem",
  keywords: ["prodloužení vlasů Dobříš", "prodloužení vlasů Dobříše Praha", "kde prodlužovat vlasy Dobříš", "vlasy k prodloužení Dobříš", "prodloužení vlasů keratinem Dobříš", "nanotapes Dobříš", "weft prodloužení Dobříš", "pravé vlasy Dobříš"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuDobrisPage() {
  return <CityLanding data={data} />;
}
