import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Package, ShoppingCart, Menu } from "lucide-react";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import ThemeToggle from "./shared/components/ThemeToggle";
import ProductForm from "./components/ProductForm";
import ProductList from "./features/products/components/ProductList";
import ShoppingList from "./features/shopping-list/components/ShoppingList";
import { useStore } from "./store/productStore";
import AutocompleteInput from "./components/AutocompleteInput";
import ProductItem from "./features/products/components/ProductItem";

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
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-12">
            <nav className="flex items-center justify-between mb-6 md:mb-12">
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
                  {shoppingList.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                      {shoppingList.length}
                    </span>
                  )}
                </NavLink>
                <ThemeToggle />
              </div>
            </nav>

            <div className="max-w-2xl mx-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="flex items-center grid gap-6 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                      <ProductForm
                        onAdd={addProduct}
                        products={products}
                        onUpdateQuantity={(id, quantity) =>
                          updateProduct(id, { quantity })
                        }
                      />
                      <div className="space-y-4">
                        <AutocompleteInput
                          suggestions={products.map((p) => p.name)}
                          selectedItem={searchQuery}
                          onItemChange={setSearchQuery}
                          placeholder="Rechercher un produit..."
                          label=""
                          name="search"
                        />
                        {searchQuery && (
                          <div className="mt-4 relative">
                            {products
                              .filter((p) => p.name === searchQuery)
                              .map((product) => (
                                <ProductItem
                                  key={product.id}
                                  product={product}
                                  onDelete={removeProduct}
                                  onUpdateQuantity={(id, quantity) =>
                                    updateProduct(id, { quantity })
                                  }
                                  onUpdateLocation={(id, location) =>
                                    updateProduct(id, { location })
                                  }
                                />
                              ))}
                          </div>
                        )}
                      </div>
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
