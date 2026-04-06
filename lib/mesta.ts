export interface Mesto {
  slug: string;
  name: string;         // nominativ: Brno
  inCity: string;       // lokál: v Brně
  region: string;       // Jihomoravský kraj
  distanceKm: number;   // vzdálenost od Prahy (km)
  trainHours: string;   // vlak z Prahy
  tagline: string;      // unikátní popis pro stránku
}

export const MESTA: Mesto[] = [
  {
    slug: 'brno',
    name: 'Brno',
    inCity: 'v Brně',
    region: 'Jihomoravský kraj',
    distanceKm: 210,
    trainHours: '2,5 hod',
    tagline: 'druhé největší město ČR — zákaznice z Brna si vlasy objednávají online a nechávají aplikovat u místní kadeřnice nebo přijedou do Prahy.',
  },
  {
    slug: 'ostrava',
    name: 'Ostrava',
    inCity: 'v Ostravě',
    region: 'Moravskoslezský kraj',
    distanceKm: 360,
    trainHours: '3,5 hod',
    tagline: 'největší město Moravy — doručujeme vlasové pásky, keratinové pramínky i vlasové tresy přímo k vám.',
  },
  {
    slug: 'plzen',
    name: 'Plzeň',
    inCity: 'v Plzni',
    region: 'Plzeňský kraj',
    distanceKm: 90,
    trainHours: '1,5 hod',
    tagline: 'blízko Prahy — z Plzně do Prahy vlakem 1,5 hodiny. Vlasy objednáte online, aplikaci zvládnete u nás nebo u kadeřnice.',
  },
  {
    slug: 'liberec',
    name: 'Liberec',
    inCity: 'v Liberci',
    region: 'Liberecký kraj',
    distanceKm: 105,
    trainHours: '1,5 hod',
    tagline: 'centrum severních Čech — zákaznice z Liberecka si vlasy nakonfigurují online a dostanou je poštou přímo domů.',
  },
  {
    slug: 'olomouc',
    name: 'Olomouc',
    inCity: 'v Olomouci',
    region: 'Olomoucký kraj',
    distanceKm: 280,
    trainHours: '2 hod',
    tagline: 'historické centrum Moravy — pravé vlasy na prodloužení zasíláme po celé Moravě. Objednávka online, doprava do 2 pracovních dní.',
  },
  {
    slug: 'ceske-budejovice',
    name: 'České Budějovice',
    inCity: 'v Českých Budějovicích',
    region: 'Jihočeský kraj',
    distanceKm: 150,
    trainHours: '2 hod',
    tagline: 'jihočeská metropole — vlasové pásky, keratinové pramínky i vlasové tresy zasíláme do Jihočeského kraje expresní poštou.',
  },
  {
    slug: 'hradec-kralove',
    name: 'Hradec Králové',
    inCity: 'v Hradci Králové',
    region: 'Královéhradecký kraj',
    distanceKm: 120,
    trainHours: '1,5 hod',
    tagline: 'kraj východních Čech — objednávka vlasů online a doprava přímo do Hradce Králové nebo okolí.',
  },
  {
    slug: 'pardubice',
    name: 'Pardubice',
    inCity: 'v Pardubicích',
    region: 'Pardubický kraj',
    distanceKm: 110,
    trainHours: '1 hod',
    tagline: 'z Pardubic do Prahy za hodinu — zákaznice z Pardubicka si vlasy objednají online nebo přijedou osobně do showroomu.',
  },
  {
    slug: 'zlin',
    name: 'Zlín',
    inCity: 've Zlíně',
    region: 'Zlínský kraj',
    distanceKm: 310,
    trainHours: '3 hod',
    tagline: 'zlínský kraj — zasíláme keratinové pramínky, nanotapes i vlasové tresy na adresu přímo ve Zlíně i okolí.',
  },
  {
    slug: 'karlovy-vary',
    name: 'Karlovy Vary',
    inCity: 'v Karlových Varech',
    region: 'Karlovarský kraj',
    distanceKm: 130,
    trainHours: '2 hod',
    tagline: 'lázeňský kraj — pravé vlasy k prodloužení zasíláme do Karlových Varů i celého Karlovarského kraje.',
  },
  {
    slug: 'usti-nad-labem',
    name: 'Ústí nad Labem',
    inCity: 'v Ústí nad Labem',
    region: 'Ústecký kraj',
    distanceKm: 90,
    trainHours: '1 hod',
    tagline: 'severní Čechy — z Ústí nad Labem do Prahy za hodinu. Vlasy objednáte online nebo rychle přijedete do showroomu.',
  },
  {
    slug: 'jihlava',
    name: 'Jihlava',
    inCity: 'v Jihlavě',
    region: 'Kraj Vysočina',
    distanceKm: 130,
    trainHours: '2 hod',
    tagline: 'kraj Vysočina — doručujeme keratinové pramínky, vlasové pásky i tresy přímo do Jihlavy a celého kraje Vysočina.',
  },
  {
    slug: 'kladno',
    name: 'Kladno',
    inCity: 'v Kladně',
    region: 'Středočeský kraj',
    distanceKm: 30,
    trainHours: '30 min',
    tagline: 'hned vedle Prahy — z Kladna do showroomu Múza Hair se dostanete za 30 minut. Vlasy objednáte online nebo přijedete osobně.',
  },
  {
    slug: 'mlada-boleslav',
    name: 'Mladá Boleslav',
    inCity: 'v Mladé Boleslavi',
    region: 'Středočeský kraj',
    distanceKm: 65,
    trainHours: '1 hod',
    tagline: 'středočeský kraj — vlasové pásky nanotapes, keratinové pramínky i vlasové tresy zasíláme do Mladé Boleslavi a okolí.',
  },
  {
    slug: 'havirov',
    name: 'Havířov',
    inCity: 'v Havířově',
    region: 'Moravskoslezský kraj',
    distanceKm: 340,
    trainHours: '3,5 hod',
    tagline: 'Moravskoslezský kraj — objednávka vlasů online, doprava přímo do Havířova. Kvalita z Prahy doručená domů.',
  },
];

export const getMestoBySlug = (slug: string): Mesto | undefined =>
  MESTA.find((m) => m.slug === slug);
