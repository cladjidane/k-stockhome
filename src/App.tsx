
import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Menu } from 'lucide-react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import ThemeToggle from './shared/components/ThemeToggle';
import { Product } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './features/products/components/ProductList';
import ShoppingList from './features/shopping-list/components/ShoppingList';
import { useShoppingList } from './features/shopping-list/hooks/useShoppingList';

function App() {
  const { items, addItem, removeItem, updateItem, clearList } = useShoppingList();
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pantry-products');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);

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
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Le Placard à Ju</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCart(!showCart)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            
            {showCategories && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Catégories</h2>
                <ProductList
                  products={products}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateLocation={(id, location) => {}}
                  onDelete={() => {}}
                  onAddToShoppingList={() => {}}
                />
              </div>
            )}

            {showCart && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Liste de courses</h2>
                <ShoppingList
                  items={items}
                  products={products}
                  onUpdateQuantity={(id, quantity) => updateItem(id, { quantity })}
                  onRemoveItem={removeItem}
                  onUpdateProduct={handleUpdateQuantity}
                  onPurchaseComplete={removeItem}
                />
              </div>
            )}

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
