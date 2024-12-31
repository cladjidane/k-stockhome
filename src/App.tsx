
import React, { useEffect } from 'react';
import { Package, ShoppingCart, Menu } from 'lucide-react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import ThemeToggle from './shared/components/ThemeToggle';
import { Product } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './features/products/components/ProductList';
import ShoppingList from './features/shopping-list/components/ShoppingList';
import { useStore } from './store/productStore';

function App() {
  const { 
    products, 
    shoppingList, 
    searchQuery,
    setSearchQuery,
    updateProduct,
    removeFromShoppingList,
    updateShoppingItem,
    getFilteredProducts
  } = useStore();

  const [showScanner, setShowScanner] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('pantry-products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = getFilteredProducts();

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            
            {showCategories && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Catégories</h2>
                <ProductList
                  products={products}
                  onUpdateQuantity={(id, quantity) => updateProduct(id, { quantity })}
                  onUpdateLocation={(id, location) => updateProduct(id, { location })}
                  onDelete={removeProduct}
                  onAddToShoppingList={addToShoppingList}
                />
              </div>
            )}

            {showCart && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-lg font-medium mb-4">Liste de courses</h2>
                <ShoppingList
                  items={shoppingList}
                  products={products}
                  onUpdateQuantity={(id, quantity) => updateShoppingItem(id, { quantity })}
                  onRemoveItem={removeFromShoppingList}
                  onUpdateProduct={updateProduct}
                  onPurchaseComplete={removeFromShoppingList}
                />
              </div>
            )}

            <ProductForm
              onAdd={addProduct}
              products={products}
              onUpdateQuantity={(id, quantity) => updateProduct(id, { quantity })}
            />

            {searchQuery && filteredProducts.length > 0 && (
              <div className="mt-4">
                <ProductList
                  products={filteredProducts}
                  onUpdateQuantity={(id, quantity) => updateProduct(id, { quantity })}
                  onUpdateLocation={(id, location) => updateProduct(id, { location })}
                  onDelete={removeProduct}
                  onAddToShoppingList={addToShoppingList}
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
