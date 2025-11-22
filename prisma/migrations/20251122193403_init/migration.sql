-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "tier" TEXT NOT NULL,
    "base_price_per_100g_45cm" REAL NOT NULL,
    "set_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "variants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CZ',
    "deliveryMethod" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'awaiting_payment',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "subtotal" REAL NOT NULL,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "trackingNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "shippedAt" DATETIME
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "assemblyFeeCzk" INTEGER,
    "assemblyFeeTotal" INTEGER,
    "assemblyFeeType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ending" TEXT NOT NULL DEFAULT 'NONE',
    "grams" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "nameSnapshot" TEXT,
    "pricePerGram" INTEGER NOT NULL,
    "saleMode" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "variant" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "name" TEXT,
    "productId" TEXT,
    "shade" TEXT,
    "shadeName" TEXT,
    "shadeHex" TEXT,
    "shadeRangeStart" INTEGER,
    "shadeRangeEnd" INTEGER,
    "lengthCm" INTEGER,
    "structure" TEXT,
    "ending" TEXT,
    "ribbonColor" TEXT,
    "saleMode" TEXT NOT NULL,
    "pricePerGramCzk" REAL,
    "pricePerGramEur" REAL,
    "weightTotalG" INTEGER,
    "weightGrams" INTEGER,
    "priceCzkTotal" REAL,
    "priceEurTotal" REAL,
    "soldOut" BOOLEAN NOT NULL DEFAULT false,
    "availableGrams" INTEGER,
    "minOrderG" INTEGER,
    "stepG" INTEGER,
    "inStock" BOOLEAN NOT NULL DEFAULT false,
    "inStockSince" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "customerCategory" TEXT,
    "isListed" BOOLEAN NOT NULL DEFAULT false,
    "listingPriority" INTEGER,
    "reservedUntil" DATETIME
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skuId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "grams" INTEGER NOT NULL,
    "note" TEXT,
    "refOrderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_matrix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "shadeRangeStart" INTEGER,
    "shadeRangeEnd" INTEGER,
    "lengthCm" INTEGER NOT NULL,
    "pricePerGramCzk" REAL NOT NULL,
    "pricePerGramEur" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "czk_to_eur" DECIMAL NOT NULL,
    "description" TEXT,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "wholesaleRequested" BOOLEAN NOT NULL DEFAULT false,
    "isWholesale" BOOLEAN NOT NULL DEFAULT false,
    "wholesaleRequestedAt" DATETIME,
    "wholesaleApprovedAt" DATETIME,
    "companyName" TEXT,
    "businessType" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "country" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "streetAddress" TEXT,
    "taxId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_sessionId_productId_key" ON "cart_items"("sessionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_sessionId_productId_key" ON "favorites"("sessionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "skus_sku_key" ON "skus"("sku");

-- CreateIndex
CREATE INDEX "price_matrix_category_tier_idx" ON "price_matrix"("category", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "price_matrix_category_tier_shadeRangeStart_shadeRangeEnd_lengthCm_key" ON "price_matrix"("category", "tier", "shadeRangeStart", "shadeRangeEnd", "lengthCm");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
