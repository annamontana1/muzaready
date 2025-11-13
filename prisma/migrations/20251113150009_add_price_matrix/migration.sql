-- CreateTable
CREATE TABLE "price_matrix" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "lengthCm" INTEGER NOT NULL,
    "pricePerGramCzk" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_matrix_category_tier_lengthCm_key" ON "price_matrix"("category", "tier", "lengthCm");
