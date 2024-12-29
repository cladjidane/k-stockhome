import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { Product, ShoppingListItem } from './types';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ShoppingList from './components/ShoppingList';

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pantry-products');
    return saved ? JSON.parse(saved) : [];
  });

  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem('shopping-list');
    if (!saved) return [];
    const items = JSON.parse(saved);
    // Convertir les dates
    return items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt)
    }));
  });

  // Sauvegarder les produits
  useEffect(() => {
    localStorage.setItem('pantry-products', JSON.stringify(products));
  }, [products]);

  // Sauvegarder la liste de courses
  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(shoppingList));
  }, [shoppingList]);

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

  const handleUpdateLocation = (id: string, location: string) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, location } 
        : product
    ));
  };

  const handleAddToShoppingList = (item: Omit<ShoppingListItem, 'addedAt'>) => {
    // Vérifier si le produit est déjà dans la liste
    const existingItem = shoppingList.find(i => i.productId === item.productId);
    
    if (existingItem) {
      // Mettre à jour la quantité si le produit existe déjà
      setShoppingList(prev => prev.map(i => 
        i.productId === item.productId 
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      // Ajouter le nouveau produit avec la date actuelle
      setShoppingList(prev => [...prev, {
        ...item,
        addedAt: new Date()
      }]);
    }
  };

  const handleUpdateShoppingListQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } else {
      setShoppingList(prev => prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveFromShoppingList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handlePurchaseComplete = (itemId: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateProductStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, quantity: product.quantity + quantity }
        : product
    ));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Le Placard à Ju</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {products.length} article{products.length !== 1 ? 's' : ''}
            </div>
            <ThemeToggle />
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-[400px,1fr]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ajouter un article</h2>
                <ProductForm 
                  onAdd={handleAddProduct} 
                  products={products}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-white" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Liste de courses</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({shoppingList.length} article{shoppingList.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <ShoppingList
                  items={shoppingList}
                  products={products}
                  onUpdateQuantity={handleUpdateShoppingListQuantity}
                  onRemoveItem={handleRemoveFromShoppingList}
                  onUpdateProduct={handleUpdateProductStock}
                  onPurchaseComplete={handlePurchaseComplete}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mes articles</h2>
              <ProductList
                products={products}
                onDelete={handleDeleteProduct}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdateLocation={handleUpdateLocation}
                onAddToShoppingList={handleAddToShoppingList}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;