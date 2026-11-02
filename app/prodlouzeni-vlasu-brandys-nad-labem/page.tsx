import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-brandys-nad-labem",
  city: "Brandýs nad Labem",
  from: "z Brandýsa nad Labem",
  km: 24,
  travel: "35 minut vlakem · 30 minut autem",
  keywords: ["prodloužení vlasů Brandýs nad Labem", "prodloužení vlasů Brandýsa nad Labem Praha", "kde prodlužovat vlasy Brandýs nad Labem", "vlasy k prodloužení Brandýs nad Labem", "prodloužení vlasů keratinem Brandýs nad Labem", "nanotapes Brandýs nad Labem", "weft prodloužení Brandýs nad Labem", "pravé vlasy Brandýs nad Labem"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuBrandysNadLabemPage() {
  return <CityLanding data={data} />;
}
