import React, { useState } from 'react';
import { Plus, Camera } from 'lucide-react';
import { Product } from '../types';
import BarcodeScanner from './BarcodeScanner';

interface ProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function ProductForm({ onAdd, products, onUpdateQuantity }: ProductFormProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'unité',
    category: 'product',
    location: 'Placard cuisine'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      quantity: 1,
      unit: 'unité',
      category: 'product',
      location: 'Placard cuisine'
    });
  };

  const handleProductScanned = (product: Omit<Product, 'id'>) => {
    setFormData(product);
    setShowScanner(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="mb-[1px] p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Scanner un code-barres"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantité</label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unité</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option>unité</option>
              <option>kg</option>
              <option>g</option>
              <option>L</option>
              <option>mL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'product' | 'ingredient' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="product">Produit</option>
              <option value="ingredient">Ingrédient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emplacement</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option>Placard cuisine</option>
              <option>Réfrigérateur</option>
              <option>Congélateur</option>
              <option>Garde-manger</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>
        </div>
      </form>

      {showScanner && (
        <BarcodeScanner
          onProductFound={handleProductScanned}
          onClose={() => setShowScanner(false)}
          products={products}
          onUpdateQuantity={onUpdateQuantity}
        />
      )}
    </>
  );
}