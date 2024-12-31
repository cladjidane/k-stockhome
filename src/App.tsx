
import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import ThemeToggle from './shared/components/ThemeToggle';
import { Product, ShoppingListItem } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './features/products/components/ProductList';

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pantry-products');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    localStorage.setItem('pantry-products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, {
      ...newProduct,
      id: crypto.randomUUID()
    }]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity } : p
    ));
  };

  const filteredProducts = searchTerm
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Le Placard à Ju</h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            
            <ProductForm
              onAdd={handleAddProduct}
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
            />

            {searchTerm && filteredProducts.length > 0 && (
              <div className="mt-4">
                <ProductList
                  products={filteredProducts}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateLocation={(id, location) => {}}
                  onDelete={() => {}}
                  onAddToShoppingList={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
