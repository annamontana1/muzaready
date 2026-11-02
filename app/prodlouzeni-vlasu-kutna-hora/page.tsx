import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-kutna-hora",
  city: "Kutná Hora",
  from: "z Kutné Hory",
  km: 67,
  travel: "1 hodinu vlakem · 55 minut po D1 autem",
  keywords: ["prodloužení vlasů Kutná Hora", "prodloužení vlasů Kutné Hory Praha", "kde prodlužovat vlasy Kutná Hora", "vlasy k prodloužení Kutná Hora", "prodloužení vlasů keratinem Kutná Hora", "nanotapes Kutná Hora", "weft prodloužení Kutná Hora", "pravé vlasy Kutná Hora"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKutnaHoraPage() {
  return <CityLanding data={data} />;
}
