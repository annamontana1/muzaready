import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-ceske-budejovice",
  city: "České Budějovice",
  from: "z Českých Budějovic",
  km: 151,
  travel: "2,5 hodiny vlakem · 2 hodiny po D3 autem",
  keywords: ["prodloužení vlasů České Budějovice", "prodloužení vlasů Českých Budějovic Praha", "kde prodlužovat vlasy České Budějovice", "vlasy k prodloužení České Budějovice", "prodloužení vlasů keratinem České Budějovice", "nanotapes České Budějovice", "weft prodloužení České Budějovice", "pravé vlasy České Budějovice"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuCeskeBudejovicePage() {
  return <CityLanding data={data} />;
}
