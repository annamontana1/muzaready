import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-karvina",
  city: "Karviná",
  from: "z Karviné",
  km: 356,
  travel: "4 hodiny vlakem · 4 hodiny autem",
  keywords: ["prodloužení vlasů Karviná", "prodloužení vlasů Karviné Praha", "kde prodlužovat vlasy Karviná", "vlasy k prodloužení Karviná", "prodloužení vlasů keratinem Karviná", "nanotapes Karviná", "weft prodloužení Karviná", "pravé vlasy Karviná"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKarvinaPage() {
  return <CityLanding data={data} />;
}
