-- CreateEnum
CREATE TYPE "SaleMode" AS ENUM ('PIECE_BY_WEIGHT', 'BULK_G');

-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateTable
CREATE TABLE "skus" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT,
    "productId" TEXT,
    "shade" TEXT,
    "shadeName" TEXT,
    "shadeHex" TEXT,
    "lengthCm" INTEGER,
    "structure" TEXT,
    "ending" TEXT,
    "ribbonColor" TEXT,
    "saleMode" "SaleMode" NOT NULL,
    "pricePerGramCzk" INTEGER NOT NULL,
    "weightTotalG" INTEGER,
    "soldOut" BOOLEAN NOT NULL DEFAULT false,
    "availableGrams" INTEGER,
    "minOrderG" INTEGER,
    "stepG" INTEGER,
    "inStock" BOOLEAN NOT NULL DEFAULT false,
    "inStockSince" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "type" "MoveType" NOT NULL,
    "grams" INTEGER NOT NULL,
    "note" TEXT,
    "refOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skus_sku_key" ON "skus"("sku");

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
