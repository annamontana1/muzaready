import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-usti-nad-labem",
  city: "Ústí nad Labem",
  from: "z Ústí nad Labem",
  km: 83,
  travel: "1 hodinu vlakem · 1 hodinu po D8 autem",
  keywords: ["prodloužení vlasů Ústí nad Labem", "prodloužení vlasů Ústí nad Labem Praha", "kde prodlužovat vlasy Ústí nad Labem", "vlasy k prodloužení Ústí nad Labem", "prodloužení vlasů keratinem Ústí nad Labem", "nanotapes Ústí nad Labem", "weft prodloužení Ústí nad Labem", "pravé vlasy Ústí nad Labem"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuUstiNadLabemPage() {
  return <CityLanding data={data} />;
}
