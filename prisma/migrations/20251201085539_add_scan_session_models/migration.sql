-- CreateTable
CREATE TABLE "scan_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'scanning',
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "syncedAt" DATETIME
);

-- CreateTable
CREATE TABLE "scan_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "skuName" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "scannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scan_items_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "scan_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "scan_items_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
