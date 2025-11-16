// SKU-based cart item structure (unified for entire app)
export interface SkuCartItem {
  skuId: string;
  skuName: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  ending: 'KERATIN' | 'PASKY' | 'TRESSY' | 'NONE';
  assemblyFeeType: 'FLAT' | 'PER_GRAM';
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;
  quantity: number; // for legacy support (usually 1 for SKU)
  addedAt: number; // timestamp when added to cart
}

export interface CartContextType {
  items: SkuCartItem[];
  addToCart: (item: Omit<SkuCartItem, 'addedAt'>) => void;
  removeFromCart: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  updateGrams: (skuId: string, grams: number) => void; // for BULK_G items
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWithShipping: (shippingCost: number) => number;
}
