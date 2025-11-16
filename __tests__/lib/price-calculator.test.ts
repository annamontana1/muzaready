import { describe, it, expect } from 'vitest';
import { priceCalculator } from '@/lib/price-calculator';

describe('PriceCalculator - B2B Discount Methods', () => {
  describe('applyB2BDiscount', () => {
    it('should return original price when isB2B is false', () => {
      const price = 1000;
      const result = priceCalculator.applyB2BDiscount(price, false);
      expect(result).toBe(1000);
    });

    it('should apply 10% discount when isB2B is true', () => {
      const price = 1000;
      const result = priceCalculator.applyB2BDiscount(price, true);
      // 1000 - (1000 * 0.10) = 900
      expect(result).toBe(900);
    });

    it('should round to nearest 10 Kč for B2B prices', () => {
      const price = 1234; // 1234 - 123.4 = 1110.6 → rounds to 1110
      const result = priceCalculator.applyB2BDiscount(price, true);
      expect(result).toBe(1110);
    });

    it('should handle edge case: zero price', () => {
      const result = priceCalculator.applyB2BDiscount(0, true);
      expect(result).toBe(0);
    });

    it('should handle edge case: price exactly divisible by 10', () => {
      const price = 5000;
      const result = priceCalculator.applyB2BDiscount(price, true);
      // 5000 - 500 = 4500
      expect(result).toBe(4500);
    });

    it('should handle small prices correctly', () => {
      const price = 100;
      const result = priceCalculator.applyB2BDiscount(price, true);
      // 100 - 10 = 90
      expect(result).toBe(90);
    });

    it('should handle large prices correctly', () => {
      const price = 50000;
      const result = priceCalculator.applyB2BDiscount(price, true);
      // 50000 - 5000 = 45000
      expect(result).toBe(45000);
    });

    it('should properly round prices that result in decimal values', () => {
      const price = 999;
      const result = priceCalculator.applyB2BDiscount(price, true);
      // 999 - 99.9 = 899.1 → Math.round(899.1 / 10) * 10 = 900
      expect(result).toBe(900);
    });
  });

  describe('getB2BDiscountPercent', () => {
    it('should return 10 as the B2B discount percentage', () => {
      const discountPercent = priceCalculator.getB2BDiscountPercent();
      expect(discountPercent).toBe(10);
    });
  });

  describe('B2B Discount Integration Scenarios', () => {
    it('should correctly calculate B2B price for product with 100g base price', () => {
      // Typical scenario: 40cm, 100g, Standard tier, no surcharges
      const basePrice = 299; // Example base price
      const selectedWeight = 100;
      const priceFor100g = basePrice;

      const subtotal = (priceFor100g * selectedWeight) / 100; // 299
      const finalPrice = priceCalculator.applyB2BDiscount(subtotal, true);

      // 299 - 29.9 = 269.1 → 270
      expect(finalPrice).toBe(270);
    });

    it('should correctly calculate B2B price for different weight', () => {
      // 200g at 299 per 100g
      const priceFor100g = 299;
      const selectedWeight = 200;

      const subtotal = (priceFor100g * selectedWeight) / 100; // 598
      const finalPrice = priceCalculator.applyB2BDiscount(subtotal, true);

      // 598 - 59.8 = 538.2 → 540
      expect(finalPrice).toBe(540);
    });

    it('should correctly show original price calculation for UI display', () => {
      const finalPrice = 270; // B2B price
      const discountPercent = priceCalculator.getB2BDiscountPercent();

      // Calculate original price: finalPrice / (1 - discount/100)
      const originalPrice = finalPrice / (1 - discountPercent / 100);

      // 270 / 0.9 = 300
      expect(originalPrice).toBeCloseTo(300, 0);
    });

    it('should handle non-B2B users - no discount applied', () => {
      const basePrice = 299;
      const selectedWeight = 150;

      const subtotal = (basePrice * selectedWeight) / 100; // 448.5 → 450 after rounding
      const finalPrice = priceCalculator.applyB2BDiscount(subtotal, false);

      // No discount for non-B2B
      expect(finalPrice).toBe(subtotal);
    });
  });

  describe('B2B Discount with Finishing Addons', () => {
    it('should apply discount to subtotal including finishing addon', () => {
      const basePrice = 299;
      const selectedWeight = 100;
      const finishingAddon = 50; // Example addon price

      const subtotal =
        (basePrice * selectedWeight) / 100 + finishingAddon; // 349
      const finalPrice = priceCalculator.applyB2BDiscount(subtotal, true);

      // 349 - 34.9 = 314.1 → 310
      expect(finalPrice).toBe(310);
    });

    it('should handle B2B discount with multiple addons', () => {
      const basePrice = 299;
      const selectedWeight = 100;
      const addon1 = 30;
      const addon2 = 20;

      const subtotal =
        (basePrice * selectedWeight) / 100 + addon1 + addon2; // 349
      const finalPrice = priceCalculator.applyB2BDiscount(subtotal, true);

      // 349 - 34.9 = 314.1 → 310
      expect(finalPrice).toBe(310);
    });
  });

  describe('Discount Rounding Consistency', () => {
    it('should always round down to nearest 10 Kč multiple', () => {
      // Test various prices to ensure rounding is consistent
      const testCases = [
        { price: 111, expected: 100 }, // 111 - 11.1 = 99.9 → 100
        { price: 115, expected: 100 }, // 115 - 11.5 = 103.5 → 100
        { price: 205, expected: 180 }, // 205 - 20.5 = 184.5 → 180
        { price: 789, expected: 710 }, // 789 - 78.9 = 710.1 → 710
      ];

      testCases.forEach(({ price, expected }) => {
        const result = priceCalculator.applyB2BDiscount(price, true);
        expect(result).toBe(expected);
      });
    });
  });
});
