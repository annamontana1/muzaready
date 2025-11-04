/**
 * Mock produkty pro development a ukázku
 * NOVÁ LOGIKA: Standard/LUXE = jeden produkt s více variantami délek
 *              Platinum = separátní produkty pro každou délku
 */

import {
  Product,
  HAIR_COLORS,
  ProductTier,
  ProductTierNormalized,
  TIER_KEYWORDS,
  SoftnessScale,
  ProductVariant,
} from '@/types/product';
import { normalizeText } from './search-utils';

// Helper pro generování search polí
function generateSearchFields(tier: ProductTier, name: string, description: string, category: string) {
  const tier_normalized: ProductTierNormalized =
    tier === 'Standard' ? 'standard' :
    tier === 'LUXE' ? 'luxe' :
    'platinum';

  const tier_keywords = TIER_KEYWORDS[tier_normalized];

  const softness_scale: SoftnessScale =
    tier === 'Standard' ? 1 :
    tier === 'LUXE' ? 2 :
    3;

  // Combine all searchable text
  const searchText = normalizeText([
    name,
    description,
    tier,
    tier_normalized,
    ...tier_keywords,
    category,
  ].join(' '));

  return {
    tier_normalized,
    tier_keywords,
    softness_scale,
    search_text: searchText,
  };
}

// Generátor mock produktů
function generateMockProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  const structures = ['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'] as const;
  const endings = ['keratin', 'nano_tapes', 'vlasove_tresy'] as const;
  const allShades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // ============================================================================
  // NEBARVENÉ PANENSKÉ VLASY
  // ============================================================================

  ['Standard', 'LUXE'].forEach((tier) => {
    const tierCode = tier === 'Standard' ? 'ST' : 'LX';
    const basePrice = tier === 'Standard' ? 6900 : 8900;
    const shades = [1, 2, 3, 4, 5];
    const lengths = tier === 'Standard' ? [35, 40, 45, 50, 55, 60] : [40, 45, 50, 55, 60, 65, 70];

    shades.forEach((shade) => {
      const color = HAIR_COLORS[shade];
      
      structures.slice(0, 2).forEach((structure) => {
        // Pro Standard/LUXE: JEDEN produkt s VŠEMI délkami jako varianty
        const variants: ProductVariant[] = [];
        
        lengths.forEach((length) => {
          const weight = 100 + Math.floor((length - 35) / 5) * 10;
          const ending = endings[variants.length % 3];
          
          variants.push({
            id: `v${idCounter}-${length}`,
            sku: `NB-${tierCode}-${String(shade).padStart(2, '0')}-${length}-${weight}-${structure === 'rovné' ? 'R' : structure === 'mírně vlnité' ? 'MV' : structure === 'vlnité' ? 'V' : 'K'}-${ending === 'keratin' ? 'KER' : ending === 'nano_tapes' ? 'NTP' : 'SWT'}`,
            shade,
            shade_name: color.name,
            shade_hex: color.hex,
            length_cm: length,
            weight_g: weight,
            structure,
            ending,
            price_czk: Math.round(basePrice * (length / 45) * (weight / 100)),
            in_stock: (idCounter + length) % 7 !== 0,
            stock_quantity: (idCounter + length) % 7 !== 0 ? Math.floor(Math.random() * 20) + 5 : 0,
            ribbon_color: color.hex,
          });
        });

        const product: Product = {
          id: String(idCounter),
          sku: `NB-${tierCode}-${String(shade).padStart(2, '0')}`,
          slug: `nebarvene-${tier.toLowerCase()}-odstin-${shade}`,
          category: 'nebarvene_panenske',
          tier: tier as ProductTier,
          name: `Nebarvené panenské vlasy ${tier} - ${color.name}`,
          description: `100% panenské vlasy ${tier} kvality. Odstín ${shade} (${color.name}), ${structure}. Délka na výběr.`,
          measurement_note: 'Měříme tak, jak jsou (nenatažené)',
          variants,
          images: {
            main: '/images/placeholder.jpg',
            hover: '/images/placeholder-hover.jpg',
            gallery: [],
          },
          base_price_per_100g_45cm: basePrice,
          in_stock: variants.some(v => v.in_stock),
          stock_quantity: variants.reduce((sum, v) => sum + v.stock_quantity, 0),
          meta_title: `Nebarvené panenské vlasy ${tier} - odstín ${shade}`,
          meta_description: `100% panenské vlasy ${tier}. Odstín ${color.name}, ${structure}.`,
          features: [
            '100% přírodní vlasy',
            'Bez chemického ošetření',
            'Tepelně odolné do 180°C',
            'Opakovaně použitelné',
          ],
          care_instructions: 'Šetrné mytí, sušení přirozenou cestou.',
          how_to_use: 'Aplikace keratinovou metodou nebo nano tapes.',
          average_rating: 4.5 + Math.random() * 0.5,
          review_count: Math.floor(Math.random() * 30),
          batch: `A${idCounter}`,
          ...generateSearchFields(tier as ProductTier, `Nebarvené panenské vlasy ${tier} - ${color.name}`, `100% panenské vlasy ${tier} kvality. Odstín ${shade} (${color.name}), ${structure}.`, 'nebarvene panenske vlasy'),
          created_at: new Date(),
          updated_at: new Date(),
        };

        products.push(product);
        idCounter++;
      });
    });
  });

  // Platinum Edition - SEPARÁTNÍ produkty pro každou délku
  const tier = 'Platinum edition';
  const tierCode = 'PL';
  const basePrice = 10900;
  const lengths = [55, 60, 65, 70, 75, 80, 85, 90];

  allShades.forEach((shade) => {
    const color = HAIR_COLORS[shade];
    
    lengths.forEach((length) => {
      structures.slice(0, 1).forEach((structure) => {
        const weight = 120 + Math.floor((length - 55) / 5) * 10;
        const ending = endings[idCounter % 3];
        
        const variant: ProductVariant = {
          id: `v${idCounter}`,
          sku: `NB-${tierCode}-${String(shade).padStart(2, '0')}-${length}-${weight}-${structure === 'rovné' ? 'R' : 'MV'}-${ending === 'keratin' ? 'KER' : ending === 'nano_tapes' ? 'NTP' : 'SWT'}`,
          shade,
          shade_name: color.name,
          shade_hex: color.hex,
          length_cm: length,
          weight_g: weight,
          structure,
          ending,
          price_czk: Math.round(basePrice * (length / 45) * (weight / 100)),
          in_stock: idCounter % 6 !== 0,
          stock_quantity: idCounter % 6 !== 0 ? Math.floor(Math.random() * 15) + 3 : 0,
          ribbon_color: color.hex,
        };

        const product: Product = {
          id: String(idCounter),
          sku: `NB-${tierCode}-${String(shade).padStart(2, '0')}-${length}`,
          slug: `nebarvene-platinum-edition-odstin-${shade}-${length}cm`,
          category: 'nebarvene_panenske',
          tier,
          name: `Nebarvené panenské vlasy Platinum - ${color.name} ${length}cm`,
          description: `100% panenské vlasy Platinum edition. Odstín ${shade} (${color.name}), ${structure}, délka ${length} cm.`,
          measurement_note: 'Měříme tak, jak jsou (nenatažené)',
          variants: [variant],
          images: {
            main: '/images/placeholder.jpg',
            hover: '/images/placeholder-hover.jpg',
            gallery: [],
          },
          base_price_per_100g_45cm: basePrice,
          in_stock: variant.in_stock,
          stock_quantity: variant.stock_quantity,
          meta_title: `Nebarvené panenské vlasy Platinum - odstín ${shade} - ${length}cm`,
          meta_description: `100% panenské vlasy Platinum edition. Odstín ${color.name}, ${structure}, ${length} cm.`,
          features: [
            '100% přírodní vlasy',
            'Nejvyšší kvalita',
            'Bez chemického ošetření',
            'Tepelně odolné do 200°C',
          ],
          care_instructions: 'Premium péče pro Platinum vlasy.',
          how_to_use: 'Profesionální aplikace.',
          average_rating: 4.8 + Math.random() * 0.2,
          review_count: Math.floor(Math.random() * 25),
          batch: `A${idCounter}`,
          ...generateSearchFields(tier, `Nebarvené panenské vlasy Platinum - ${color.name} ${length}cm`, `100% panenské vlasy Platinum edition. Odstín ${shade} (${color.name}), ${structure}, ${length} cm.`, 'nebarvene panenske vlasy platinum'),
          created_at: new Date(),
          updated_at: new Date(),
        };

        products.push(product);
        idCounter++;
      });
    });
  });

  // ============================================================================
  // BARVENÉ BLOND VLASY
  // ============================================================================

  // LUXE - jeden produkt s více variantami délek
  const luxeBasePrice = 7900;
  const barveneLengths = [50, 55, 60, 65, 70];
  
  [5, 6, 7, 8, 9, 10].forEach((shade) => {
    const color = HAIR_COLORS[shade];
    
    const variants: ProductVariant[] = [];
    
    barveneLengths.forEach((length) => {
      const weight = 110 + Math.floor((length - 50) / 5) * 10;
      
      variants.push({
        id: `v${idCounter}-${length}`,
        sku: `BB-LX-${String(shade).padStart(2, '0')}-${length}-${weight}-R-KER`,
        shade,
        shade_name: color.name,
        shade_hex: color.hex,
        length_cm: length,
        weight_g: weight,
        structure: 'rovné',
        ending: 'keratin',
        price_czk: Math.round(luxeBasePrice * (length / 45) * (weight / 100)),
        in_stock: (idCounter + length) % 6 !== 0,
        stock_quantity: (idCounter + length) % 6 !== 0 ? Math.floor(Math.random() * 15) + 3 : 0,
        ribbon_color: color.hex,
      });
    });

    const product: Product = {
      id: String(idCounter),
      sku: `BB-LX-${String(shade).padStart(2, '0')}`,
      slug: `barvene-luxe-odstin-${shade}`,
      category: 'barvene_blond',
      tier: 'LUXE',
      name: `Barvené blond vlasy LUXE - ${color.name}`,
      description: `Profesionálně barvené blond vlasy. LUXE kvalita, odstín ${shade} (${color.name}).`,
      measurement_note: 'Měříme tak, jak jsou (nenatažené)',
      variants,
      images: {
        main: '/images/placeholder.jpg',
        hover: '/images/placeholder-hover.jpg',
        gallery: [],
      },
      base_price_per_100g_45cm: luxeBasePrice,
      in_stock: variants.some(v => v.in_stock),
      stock_quantity: variants.reduce((sum, v) => sum + v.stock_quantity, 0),
      meta_title: `Barvené blond vlasy LUXE - odstín ${shade}`,
      meta_description: 'Profesionálně barvené blond vlasy LUXE.',
      features: [
        'Profesionální barvení',
        'Krásný blond odstín',
        'LUXE kvalita',
      ],
      care_instructions: 'Speciální péče pro barvené vlasy.',
      how_to_use: 'Keratinová aplikace.',
      average_rating: 4.7 + Math.random() * 0.3,
      review_count: Math.floor(Math.random() * 20),
      batch: `B${idCounter}`,
      ...generateSearchFields('LUXE', `Barvené blond vlasy LUXE - ${color.name}`, `Profesionálně barvené blond vlasy. LUXE kvalita, odstín ${shade} (${color.name}).`, 'barvene blond vlasy'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    products.push(product);
    idCounter++;
  });

  // Platinum - separátní produkty pro každou délku
  const platinumBasePrice = 9900;
  const platinumLengths = [60, 65, 70, 75, 80];
  
  [5, 6, 7, 8, 9, 10].forEach((shade) => {
    const color = HAIR_COLORS[shade];
    
    platinumLengths.forEach((length) => {
      const weight = 120 + Math.floor((length - 60) / 5) * 10;
      
      const variant: ProductVariant = {
        id: `v${idCounter}`,
        sku: `BB-PL-${String(shade).padStart(2, '0')}-${length}-${weight}-R-KER`,
        shade,
        shade_name: color.name,
        shade_hex: color.hex,
        length_cm: length,
        weight_g: weight,
        structure: 'rovné',
        ending: 'keratin',
        price_czk: Math.round(platinumBasePrice * (length / 45) * (weight / 100)),
        in_stock: idCounter % 5 !== 0,
        stock_quantity: idCounter % 5 !== 0 ? Math.floor(Math.random() * 12) + 2 : 0,
        ribbon_color: color.hex,
      };

      const product: Product = {
        id: String(idCounter),
        sku: `BB-PL-${String(shade).padStart(2, '0')}-${length}`,
        slug: `barvene-platinum-edition-odstin-${shade}-${length}cm`,
        category: 'barvene_blond',
        tier: 'Platinum edition',
        name: `Barvené blond vlasy Platinum - ${color.name} ${length}cm`,
        description: `Profesionálně barvené blond vlasy Platinum edition. Odstín ${shade} (${color.name}), ${length} cm.`,
        measurement_note: 'Měříme tak, jak jsou (nenatažené)',
        variants: [variant],
        images: {
          main: '/images/placeholder.jpg',
          hover: '/images/placeholder-hover.jpg',
          gallery: [],
        },
        base_price_per_100g_45cm: platinumBasePrice,
        in_stock: variant.in_stock,
        stock_quantity: variant.stock_quantity,
        meta_title: `Barvené blond vlasy Platinum - odstín ${shade} - ${length}cm`,
        meta_description: 'Profesionálně barvené blond vlasy Platinum edition.',
        features: [
          'Profesionální barvení',
          'Prémiový blond odstín',
          'Platinum kvalita',
        ],
        care_instructions: 'Premium péče pro barvené Platinum vlasy.',
        how_to_use: 'Profesionální keratinová aplikace.',
        average_rating: 4.9 + Math.random() * 0.1,
        review_count: Math.floor(Math.random() * 15),
        batch: `B${idCounter}`,
        ...generateSearchFields('Platinum edition', `Barvené blond vlasy Platinum - ${color.name} ${length}cm`, `Profesionálně barvené blond vlasy Platinum edition. Odstín ${shade} (${color.name}), ${length} cm.`, 'barvene blond vlasy platinum'),
        created_at: new Date(),
        updated_at: new Date(),
      };

      products.push(product);
      idCounter++;
    });
  });

  return products;
}

export const mockProducts: Product[] = generateMockProducts();
