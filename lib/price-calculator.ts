/**
 * Price Calculator
 * Kalkuluje ceny variant podle specifikace Muza Hair
 */

import { PRICING_CONFIG, PriceCalculationInput } from "@/types/pricing";

export class PriceCalculator {
  private config = PRICING_CONFIG;

  /**
   * Hlavní metoda pro výpočet ceny
   */
  calculate(params: PriceCalculationInput): number {
    // 1. Base price za 100g @ 45cm
    const basePrice =
      this.config.base_price_per_100g_45cm_czk[params.category][params.tier];

    // 2. Length multiplier
    const lengthMult = this.config.length_multiplier[params.lengthCm] || 1.0;

    // 3. Structure multiplier
    const structureMult = this.config.structure_multiplier[params.structure];

    // 4. Shade surcharge (jen pro barvené)
    let shadeSurcharge = 0;
    if (
      params.category === "barvene_blond" &&
      this.config.shade_surcharge_czk.barvene_blond[params.shade] !== undefined
    ) {
      shadeSurcharge =
        this.config.shade_surcharge_czk.barvene_blond[params.shade];
    }

    // 5. Ending surcharge
    const endingSurcharge = this.config.ending_surcharge_czk[params.ending] || 0;

    // 6. Výpočet ceny za 100g při dané délce a struktuře
    const priceFor100g = basePrice * lengthMult * structureMult + shadeSurcharge;

    // 7. Přepočet na požadovanou gramáž (lineárně)
    const priceForWeight = (priceFor100g / 100) * params.weightG;

    // 8. Přidání příplatku za zakončení
    const finalPrice = priceForWeight + endingSurcharge;

    // 9. Zaokrouhlení na 10 Kč
    return Math.round(finalPrice / 10) * 10;
  }

  /**
   * Helper: Cena za 100g/45cm pro zobrazení v listech
   */
  getBaseDisplayPrice(category: string, tier: string): number {
    return this.config.base_price_per_100g_45cm_czk[
      category as keyof typeof this.config.base_price_per_100g_45cm_czk
    ][tier as keyof (typeof this.config.base_price_per_100g_45cm_czk)[keyof typeof this.config.base_price_per_100g_45cm_czk]];
  }

  /**
   * Formátuje cenu s českými tisícovými oddělovači
   */
  formatPrice(price: number): string {
    return `${price.toLocaleString("cs-CZ")} Kč`;
  }

  /**
   * Vypočítá range cen pro daný produkt (min-max)
   */
  calculatePriceRange(
    category: string,
    tier: string,
    minWeight: number = 50,
    maxWeight: number = 300,
    minLength: number = 35,
    maxLength: number = 90
  ): { min: number; max: number } {
    const baseParams: PriceCalculationInput = {
      category: category as PriceCalculationInput["category"],
      tier: tier as PriceCalculationInput["tier"],
      shade: 1,
      lengthCm: minLength,
      weightG: minWeight,
      structure: "rovné",
      ending: "keratin",
    };

    // Min: nejkratší, nejlehčí, rovné, keratin
    const minPrice = this.calculate(baseParams);

    // Max: nejdelší, nejtěžší, kudrnaté, sewing weft
    const maxParams: PriceCalculationInput = {
      ...baseParams,
      lengthCm: maxLength,
      weightG: maxWeight,
      structure: "kudrnaté",
      ending: "sewing_weft",
      shade: category === "barvene_blond" ? 10 : 1,
    };

    const maxPrice = this.calculate(maxParams);

    return { min: minPrice, max: maxPrice };
  }
}

// Export singleton instance
export const priceCalculator = new PriceCalculator();
