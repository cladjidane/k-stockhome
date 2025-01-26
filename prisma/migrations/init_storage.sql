-- Create Storage table
CREATE TABLE IF NOT EXISTS "Storage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add storageId column to Product table
ALTER TABLE "Product"
ADD COLUMN "storageId" TEXT;

-- Add foreign key constraint
ALTER TABLE "Product"
ADD CONSTRAINT fk_product_storage
FOREIGN KEY ("storageId") REFERENCES "Storage"(id);

-- Create index for better query performance
CREATE INDEX "Product_storageId_idx" ON "Product"("storageId");