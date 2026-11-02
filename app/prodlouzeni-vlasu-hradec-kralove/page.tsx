import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-hradec-kralove",
  city: "Hradec Králové",
  from: "z Hradce Králové",
  km: 112,
  travel: "1,5 hodiny vlakem · 1,5 hodiny po D11 autem",
  keywords: ["prodloužení vlasů Hradec Králové", "prodloužení vlasů Hradce Králové Praha", "kde prodlužovat vlasy Hradec Králové", "vlasy k prodloužení Hradec Králové", "prodloužení vlasů keratinem Hradec Králové", "nanotapes Hradec Králové", "weft prodloužení Hradec Králové", "pravé vlasy Hradec Králové"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuHradecKralovePage() {
  return <CityLanding data={data} />;
}
