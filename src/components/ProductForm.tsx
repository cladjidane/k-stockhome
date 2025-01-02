import { Camera, Plus } from "lucide-react";
import React, { useState } from "react";

import { Product } from "../types";
import BarcodeScanner from "../features/products/components/BarcodeScanner";

interface ProductFormProps {
  onAdd: (product: Omit<Product, "id">) => void;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function ProductForm({
  onAdd,
  products,
  onUpdateQuantity,
}: ProductFormProps) {
  const [showScanner, setShowScanner] = useState(false);

  const handleProductScanned = (scannedProduct: Omit<Product, "id">) => {
    console.log("Product scanned:", scannedProduct);
    const productWithDefaults = {
      name: "",
      quantity: 1,
      unit: "unité",
      ...scannedProduct,
      category: scannedProduct.categories?.toLowerCase().includes("ingredients")
        ? "ingredient"
        : "product",
      categories: scannedProduct.categories,
    };

    console.log("Sending product to store:", productWithDefaults);
    onAdd(productWithDefaults);
    setShowScanner(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <button
        type="button"
        onClick={() => setShowScanner(true)}
        className="bg-white/50 flex flex-col items-center text-neutral-600 justify-center p-8 border border-4 border-neutral-600 rounded-xl transition-all"
      >
        <Camera className="w-16 h-16 mb-4 text-neutral-600" />
        <span className="text-lg font-medium">Scanner un produit</span>
      </button>

      {showScanner && (
        <BarcodeScanner
          onProductFound={handleProductScanned}
          onClose={() => setShowScanner(false)}
          products={products}
          onUpdateQuantity={onUpdateQuantity}
        />
      )}
    </div>
  );
}
