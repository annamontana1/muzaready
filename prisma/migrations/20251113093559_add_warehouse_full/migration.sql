/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variant` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `grams` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotal` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerGram` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleMode` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HairTreatment" AS ENUM ('PANENSKE_NEBARVENE', 'BARVENE');

-- CreateEnum
CREATE TYPE "CustomerCategory" AS ENUM ('STANDARD', 'LUXE', 'PLATINUM_EDITION');

-- CreateEnum
CREATE TYPE "EndingOption" AS ENUM ('KERATIN', 'PASKY', 'TRESSY', 'NONE');

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "variant",
ADD COLUMN     "assemblyFeeCzk" INTEGER,
ADD COLUMN     "assemblyFeeTotal" INTEGER,
ADD COLUMN     "assemblyFeeType" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ending" "EndingOption" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "grams" INTEGER NOT NULL,
ADD COLUMN     "lineTotal" INTEGER NOT NULL,
ADD COLUMN     "nameSnapshot" TEXT,
ADD COLUMN     "pricePerGram" INTEGER NOT NULL,
ADD COLUMN     "saleMode" "SaleMode" NOT NULL,
ADD COLUMN     "skuId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "skus" ADD COLUMN     "customerCategory" "CustomerCategory",
ADD COLUMN     "isListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listingPriority" INTEGER,
ADD COLUMN     "reservedUntil" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
