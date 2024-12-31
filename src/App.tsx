import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Menu } from "lucide-react";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import ThemeToggle from "./shared/components/ThemeToggle";
import ProductForm from "./components/ProductForm";
import ProductList from "./features/products/components/ProductList";
import ShoppingList from "./features/shopping-list/components/ShoppingList";
import { useStore } from "./store/productStore";

function App() {
  const { fetchProducts, fetchShoppingList } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchShoppingList();
  }, []);

  const {
    products,
    shoppingList,
    searchQuery,
    setSearchQuery,
    addProduct,
    updateProduct,
    removeProduct,
    removeFromShoppingList,
    updateShoppingItem,
    getFilteredProducts,
    addToShoppingList,
  } = useStore();

  const [showScanner, setShowScanner] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("pantry-products", JSON.stringify(products));
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Le Placard à Ju
              </h1>
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

          <div className="max-w-md mx-auto">
            {!showCategories && !showCart && (
              <div className="flex items-center gap-4 mb-4">
                <ProductForm
                  onAdd={addProduct}
                  products={products}
                  onUpdateQuantity={(id, quantity) =>
                    updateProduct(id, { quantity })
                  }
                />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            )}

            {showCategories && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ProductList
                  products={products}
                  onUpdateQuantity={(id, quantity) =>
                    updateProduct(id, { quantity })
                  }
                  onUpdateLocation={(id, location) =>
                    updateProduct(id, { location })
                  }
                  onDelete={removeProduct}
                  onAddToShoppingList={addToShoppingList}
                />
              </div>
            )}

            {showCart && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ShoppingList
                  items={shoppingList}
                  products={products}
                  onUpdateQuantity={(id, quantity) =>
                    updateShoppingItem(id, { quantity })
                  }
                  onRemoveItem={removeFromShoppingList}
                  onUpdateProduct={updateProduct}
                  onPurchaseComplete={removeFromShoppingList}
                />
              </div>
            ) : (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ProductList
                  products={products}
                  onUpdateQuantity={(id, quantity) =>
                    updateProduct(id, { quantity })
                  }
                  onUpdateLocation={(id, location) =>
                    updateProduct(id, { location })
                  }
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