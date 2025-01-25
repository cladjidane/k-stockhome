/*
  Warnings:

  - You are about to drop the column `codebar` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Barcode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Barcode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rayon" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "sousCategorie" TEXT,
    "marque" TEXT,
    "conditionnement" TEXT,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("categorie", "conditionnement", "createdAt", "id", "marque", "quantite", "rayon", "sousCategorie", "updatedAt") SELECT "categorie", "conditionnement", "createdAt", "id", "marque", "quantite", "rayon", "sousCategorie", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_rayon_categorie_idx" ON "Product"("rayon", "categorie");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Barcode_code_key" ON "Barcode"("code");

-- CreateIndex
CREATE INDEX "Barcode_code_idx" ON "Barcode"("code");

-- CreateIndex
CREATE INDEX "Barcode_productId_idx" ON "Barcode"("productId");
