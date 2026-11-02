import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-karlovy-vary",
  city: "Karlovy Vary",
  from: "z Karlových Varů",
  km: 128,
  travel: "2,5 hodiny vlakem · 1,5 hodiny po D6 autem",
  keywords: ["prodloužení vlasů Karlovy Vary", "prodloužení vlasů Karlových Varů Praha", "kde prodlužovat vlasy Karlovy Vary", "vlasy k prodloužení Karlovy Vary", "prodloužení vlasů keratinem Karlovy Vary", "nanotapes Karlovy Vary", "weft prodloužení Karlovy Vary", "pravé vlasy Karlovy Vary"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKarlovyVaryPage() {
  return <CityLanding data={data} />;
}
