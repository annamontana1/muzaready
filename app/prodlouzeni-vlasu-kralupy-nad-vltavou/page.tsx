import CityLanding, { cityMetadata, type CityData } from '@/components/city/CityLanding';

const data: CityData = {
  slug: "prodlouzeni-vlasu-kralupy-nad-vltavou",
  city: "Kralupy nad Vltavou",
  from: "z Kralup nad Vltavou",
  km: 25,
  travel: "30 minut vlakem · 25 minut autem",
  keywords: ["prodloužení vlasů Kralupy nad Vltavou", "prodloužení vlasů Kralup nad Vltavou Praha", "kde prodlužovat vlasy Kralupy nad Vltavou", "vlasy k prodloužení Kralupy nad Vltavou", "prodloužení vlasů keratinem Kralupy nad Vltavou", "nanotapes Kralupy nad Vltavou", "weft prodloužení Kralupy nad Vltavou", "pravé vlasy Kralupy nad Vltavou"],
};

export const metadata = cityMetadata(data);

export default function ProdlouzeniVlasuKralupyNadVltavouPage() {
  return <CityLanding data={data} />;
}
