-- Create Rayon table
CREATE TABLE IF NOT EXISTS "Rayon" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create temporary table to store unique rayon names from products
CREATE TEMPORARY TABLE temp_rayons AS
SELECT DISTINCT rayon FROM "Product" WHERE rayon IS NOT NULL;

-- Insert unique rayons into the new Rayon table
INSERT INTO "Rayon" (name)
SELECT rayon FROM temp_rayons;

-- Add rayonId column to Product table
ALTER TABLE "Product"
ADD COLUMN "rayonId" TEXT;

-- Add foreign key constraint
ALTER TABLE "Product"
ADD CONSTRAINT fk_product_rayon
FOREIGN KEY ("rayonId") REFERENCES "Rayon"(id);

-- Update Product table to set rayonId based on rayon names
UPDATE "Product" p
SET "rayonId" = r.id
FROM "Rayon" r
WHERE p.rayon = r.name;

-- Drop the old rayon column
ALTER TABLE "Product"
DROP COLUMN rayon;

-- Drop temporary table
DROP TABLE temp_rayons;