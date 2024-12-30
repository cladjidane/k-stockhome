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
    
    onAdd(productWithDefaults);
    setShowScanner(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowScanner(true)}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Camera className="w-5 h-5 mr-2" />
        Scanner un produit
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