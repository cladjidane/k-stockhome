import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pantry-products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pantry-products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, {
      ...newProduct,
      id: crypto.randomUUID()
    }]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mon Placard</h1>
          </div>
          <div className="text-sm text-gray-500">
            {products.length} article{products.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-[400px,1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Ajouter un article</h2>
            <ProductForm 
              onAdd={handleAddProduct} 
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Mes articles</h2>
            <ProductList
              products={products}
              onDelete={handleDeleteProduct}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;