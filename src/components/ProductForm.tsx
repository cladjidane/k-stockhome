
import { Camera, Plus } from 'lucide-react';
import React, { useState } from 'react';

import { Product } from '../types';
import BarcodeScanner from '../features/products/components/BarcodeScanner';

interface ProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function ProductForm({ onAdd, products, onUpdateQuantity }: ProductFormProps) {
  const [showScanner, setShowScanner] = useState(false);

  const handleProductScanned = (scannedProduct: Omit<Product, 'id'>) => {
    console.log('Product scanned:', scannedProduct);
    const productWithDefaults = {
      name: '',
      quantity: 1,
      unit: 'unité',
      ...scannedProduct,
      category: scannedProduct.categories?.toLowerCase().includes('ingredients') 
        ? 'ingredient' 
        : 'product',
      categories: scannedProduct.categories
    };
    
    console.log('Sending product to store:', productWithDefaults);
    onAdd(productWithDefaults);
    setShowScanner(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <button
        type="button"
        onClick={() => setShowScanner(true)}
        className="flex flex-col items-center justify-center p-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <Camera className="w-16 h-16 mb-4" />
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
