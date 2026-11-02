import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-znojmo",
  city: "Znojmo",
  from: "ze Znojma",
  km: 247,
  travel: "2,5 hodiny vlakem · 2,5 hodiny autem",
  keywords: ["prodloužení vlasů Znojmo", "prodloužení vlasů Ze Znojma Praha", "kde prodlužovat vlasy Znojmo", "vlasy k prodloužení Znojmo", "prodloužení vlasů keratinem Znojmo", "nanotapes Znojmo", "weft prodloužení Znojmo", "pravé vlasy Znojmo"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuZnojmoPage() {
  return <CityLanding data={data} />;
}
