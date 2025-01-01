import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
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
    addToShoppingList,
  } = useStore();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <nav className="flex items-center justify-between mb-12">
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
                    isActive ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`
                }
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </NavLink>

              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-blue-600 dark:text-white" />
                <NavLink to="/">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Le Placard à Ju
                  </h1>
                </NavLink>
              </div>

              <div className="flex items-center space-x-4">
                <NavLink
                  to="/shopping-list"
                  className={({ isActive }) =>
                    `p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative ${
                      isActive ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`
                  }
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </NavLink>
                <ThemeToggle />
              </div>
            </nav>

            <div className="max-w-2xl mx-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="flex items-center gap-6 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                      <ProductForm
                        onAdd={addProduct}
                        products={products}
                        onUpdateQuantity={(id, quantity) =>
                          updateProduct(id, { quantity })
                        }
                      />
                      <AutocompleteInput
                        suggestions={products.map(p => p.name)}
                        selectedItems={searchQuery ? [searchQuery] : []}
                        onItemsChange={(items) => setSearchQuery(items[0] || '')}
                        placeholder="Rechercher un produit..."
                        label=""
                        name="search"
                      />
                    </div>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
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
                  }
                />
                <Route
                  path="/shopping-list"
                  element={
                    <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
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
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
