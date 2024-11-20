import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function ProductList({ products, onDelete, onUpdateQuantity }: ProductListProps) {
  const groupedProducts = products.reduce((acc, product) => {
    const key = product.location;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedProducts).map(([location, locationProducts]) => (
        <div key={location} className="bg-white rounded-lg shadow-md overflow-hidden">
          <h3 className="bg-gray-50 px-4 py-2 text-lg font-medium text-gray-900">
            {location}
          </h3>
          <div className="divide-y divide-gray-200">
            {locationProducts.map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    {product.category === 'product' ? 'Produit' : 'Ingrédient'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(product.id, Math.max(0, product.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="text-lg font-medium min-w-[3rem] text-center">
                      {product.quantity} {product.unit}
                    </span>
                    
                    <button
                      onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}