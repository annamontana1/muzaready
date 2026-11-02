import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-mlada-boleslav",
  city: "Mladá Boleslav",
  from: "z Mladé Boleslavi",
  km: 59,
  travel: "1 hodinu vlakem · 45 minut po D10 autem",
  keywords: ["prodloužení vlasů Mladá Boleslav", "prodloužení vlasů Mladé Boleslavi Praha", "kde prodlužovat vlasy Mladá Boleslav", "vlasy k prodloužení Mladá Boleslav", "prodloužení vlasů keratinem Mladá Boleslav", "nanotapes Mladá Boleslav", "weft prodloužení Mladá Boleslav", "pravé vlasy Mladá Boleslav"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuMladaBoleslavPage() {
  return <CityLanding data={data} />;
}
