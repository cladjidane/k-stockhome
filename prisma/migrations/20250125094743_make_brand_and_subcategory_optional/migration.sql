-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rayon" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "sousCategorie" TEXT,
    "marque" TEXT,
    "conditionnement" TEXT,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "codebar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Product_codebar_idx" ON "Product"("codebar");

-- CreateIndex
CREATE INDEX "Product_rayon_categorie_idx" ON "Product"("rayon", "categorie");
