/**
 * Mock produkty pro development a ukázku
 */

import { Product, HAIR_COLORS, ProductTier } from '@/types/product';

// Generátor mock produktů
function generateMockProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  const tiers: ProductTier[] = ['Standard', 'LUXE', 'Platinum edition'];
  const structures = ['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'] as const;
  const endings = ['keratin', 'nano_tapes', 'sewing_weft'] as const;

  // Nebarvené panenské vlasy - různé kombinace
  tiers.forEach((tier) => {
    // Určíme dostupné odstíny podle tieru
    const shades = tier === 'Platinum edition' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4];
    // Určíme rozsahy délek
    const lengths = tier === 'Standard' ? [35, 40, 45, 50, 55, 60, 65, 70, 75]
                  : tier === 'LUXE' ? [40, 45, 50, 55, 60, 65, 70, 75, 80, 85]
                  : [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

    shades.forEach((shade) => {
      const color = HAIR_COLORS[shade];
      lengths.forEach((length, lengthIdx) => {
        // Vytvoříme cca 2 produkty pro každou kombinaci tier+shade+length
        structures.slice(0, lengthIdx % 3 === 0 ? 2 : 1).forEach((structure) => {
          const basePrice = tier === 'Standard' ? 6900 : tier === 'LUXE' ? 8900 : 10900;
          const weight = 100 + (lengthIdx * 10);
          const ending = endings[idCounter % 3];

          const product: Product = {
            id: String(idCounter),
            sku: `NB-${tier === 'Standard' ? 'ST' : tier === 'LUXE' ? 'LX' : 'PL'}-${String(shade).padStart(2, '0')}-${length}-${weight}`,
            slug: `nebarvene-${tier.toLowerCase().replace(' ', '-')}-odstin-${shade}-${length}cm`,
            category: 'nebarvene_panenske',
            tier,
            name: `Nebarvené panenské vlasy ${tier} - ${color.name}`,
            description: `100% panenské vlasy ${tier} kvality. Odstín ${shade} (${color.name}), ${structure}, délka ${length} cm.`,
            measurement_note: 'Měříme tak, jak jsou (nenatažené)',
            variants: [
              {
                id: `v${idCounter}`,
                sku: `NB-${tier === 'Standard' ? 'ST' : tier === 'LUXE' ? 'LX' : 'PL'}-${String(shade).padStart(2, '0')}-${length}-${weight}-${structure === 'rovné' ? 'R' : structure === 'mírně vlnité' ? 'MV' : structure === 'vlnité' ? 'V' : 'K'}-${ending === 'keratin' ? 'KER' : ending === 'nano_tapes' ? 'NTP' : 'SWT'}-A${idCounter}`,
                shade,
                shade_name: color.name,
                shade_hex: color.hex,
                length_cm: length,
                weight_g: weight,
                structure,
                ending,
                price_czk: Math.round(basePrice * (length / 45) * (weight / 100)),
                in_stock: idCounter % 5 !== 0, // 80% skladem
                stock_quantity: idCounter % 5 !== 0 ? Math.floor(Math.random() * 20) + 5 : 0,
                ribbon_color: color.hex,
              },
            ],
            images: {
              main: '/images/placeholder.jpg',
              hover: '/images/placeholder-hover.jpg',
              gallery: [],
            },
            base_price_per_100g_45cm: basePrice,
            in_stock: idCounter % 5 !== 0,
            stock_quantity: idCounter % 5 !== 0 ? Math.floor(Math.random() * 20) + 5 : 0,
            meta_title: `Nebarvené panenské vlasy ${tier} - odstín ${shade}`,
            meta_description: `100% panenské vlasy ${tier}. Odstín ${color.name}, ${structure}, ${length} cm.`,
            features: [
              '100% přírodní vlasy',
              'Bez chemického ošetření',
              'Tepelně odolné do 180°C',
              'Opakovaně použitelné',
            ],
            care_instructions: 'Šetrné mytí, sušení přirozenou cestou.',
            how_to_use: `Aplikace ${ending === 'keratin' ? 'keratinovou metodou' : ending === 'nano_tapes' ? 'nano tapes' : 'ručně šitými tresy'}.`,
            average_rating: 4.5 + Math.random() * 0.5,
            review_count: Math.floor(Math.random() * 30),
            batch: `A${idCounter}`,
            created_at: new Date(),
            updated_at: new Date(),
          };

          products.push(product);
          idCounter++;

          // Omezíme počet produktů na cca 60
          if (idCounter > 60) return;
        });
        if (idCounter > 60) return;
      });
      if (idCounter > 60) return;
    });
    if (idCounter > 60) return;
  });

  // Přidáme pár barvených blond produktů
  [9, 10].forEach((shade) => {
    const color = HAIR_COLORS[shade];
    ['LUXE', 'Platinum edition'].forEach((tier) => {
      [60, 65, 70, 75].forEach((length) => {
        const basePrice = tier === 'LUXE' ? 7900 : 9900;
        const weight = 120;

        const product: Product = {
          id: String(idCounter),
          sku: `BB-${tier === 'LUXE' ? 'LX' : 'PL'}-${String(shade).padStart(2, '0')}-${length}-${weight}`,
          slug: `barvene-${tier.toLowerCase().replace(' ', '-')}-odstin-${shade}`,
          category: 'barvene_blond',
          tier: tier as ProductTier,
          name: `Barvené blond vlasy ${tier}`,
          description: `Profesionálně barvené blond vlasy. ${tier} kvalita, odstín ${shade} (${color.name}).`,
          measurement_note: 'Měříme tak, jak jsou (nenatažené)',
          variants: [
            {
              id: `v${idCounter}`,
              sku: `BB-${tier === 'LUXE' ? 'LX' : 'PL'}-${String(shade).padStart(2, '0')}-${length}-${weight}-R-KER-B${idCounter}`,
              shade,
              shade_name: color.name,
              shade_hex: color.hex,
              length_cm: length,
              weight_g: weight,
              structure: 'rovné',
              ending: 'keratin',
              price_czk: Math.round(basePrice * (length / 45) * (weight / 100)),
              in_stock: true,
              stock_quantity: Math.floor(Math.random() * 15) + 3,
              ribbon_color: color.hex,
            },
          ],
          images: {
            main: '/images/placeholder.jpg',
            hover: '/images/placeholder-hover.jpg',
            gallery: [],
          },
          base_price_per_100g_45cm: basePrice,
          in_stock: true,
          meta_title: `Barvené blond vlasy ${tier} - odstín ${shade}`,
          meta_description: 'Profesionálně barvené blond vlasy.',
          features: [
            'Profesionální barvení',
            'Krásný blond odstín',
            `${tier} kvalita`,
          ],
          care_instructions: 'Speciální péče pro barvené vlasy.',
          how_to_use: 'Keratinová aplikace.',
          average_rating: 4.7 + Math.random() * 0.3,
          review_count: Math.floor(Math.random() * 20),
          batch: `B${idCounter}`,
          created_at: new Date(),
          updated_at: new Date(),
        };

        products.push(product);
        idCounter++;
      });
    });
  });

  return products;
}

export const mockProducts: Product[] = generateMockProducts();
