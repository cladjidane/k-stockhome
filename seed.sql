-- Insert Categories
INSERT INTO "Category" ("id", "name", "createdAt", "updatedAt") VALUES
('cat1', 'Alimentaire', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat2', 'Hygiène', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat3', 'Entretien', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat4', 'Boissons', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert SubCategories
INSERT INTO "SubCategory" ("id", "name", "createdAt", "updatedAt") VALUES
('sub1', 'Conserves', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub2', 'Pâtes & Riz', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub3', 'Produits Corporels', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub4', 'Lessive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub5', 'Sodas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub6', 'Eaux', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Brands
INSERT INTO "Brand" ("id", "name", "createdAt", "updatedAt") VALUES
('brand1', 'Panzani', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('brand2', 'Dove', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('brand3', 'Ariel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('brand4', 'Coca-Cola', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('brand5', 'Evian', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('brand6', 'Cassegrain', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products
INSERT INTO "Product" ("id", "rayon", "categoryId", "subCategoryId", "brandId", "conditionnement", "quantite", "createdAt", "updatedAt") VALUES
('prod1', 'A1', 'cat1', 'sub2', 'brand1', 'Paquet 500g', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod2', 'B3', 'cat2', 'sub3', 'brand2', 'Flacon 250ml', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod3', 'C2', 'cat3', 'sub4', 'brand3', 'Bidon 2L', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod4', 'D1', 'cat4', 'sub5', 'brand4', 'Pack 6x33cl', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod5', 'D2', 'cat4', 'sub6', 'brand5', 'Pack 6x1.5L', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod6', 'A2', 'cat1', 'sub1', 'brand6', 'Bocal 400g', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Barcodes
INSERT INTO "Barcode" ("id", "code", "productId", "createdAt") VALUES
('bar1', '3038350012345', 'prod1', CURRENT_TIMESTAMP),
('bar2', '3038350023456', 'prod2', CURRENT_TIMESTAMP),
('bar3', '3038350034567', 'prod3', CURRENT_TIMESTAMP),
('bar4', '3038350045678', 'prod4', CURRENT_TIMESTAMP),
('bar5', '3038350056789', 'prod5', CURRENT_TIMESTAMP),
('bar6', '3038350067890', 'prod6', CURRENT_TIMESTAMP);