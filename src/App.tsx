import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Menu,
  Search,
  Home,
  User,
  Camera,
} from "lucide-react";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import ProductForm from "./components/ProductForm";
import ProductList from "./features/products/components/ProductList";
import ShoppingList from "./features/shopping-list/components/ShoppingList";
import { useStore } from "./store/productStore";
import AutocompleteInput from "./components/AutocompleteInput";
import {
  updateProduct,
  removeProduct,
  addToShoppingList,
  removeFromShoppingList,
  updateShoppingItem,
} from "./store/productStore";
import ProductItem from "./features/products/components/ProductItem";
import SearchBar from "./components/SearchBar";

function App() {
  const {
    fetchProducts,
    fetchShoppingList,
    products,
    shoppingList,
    searchQuery,
    setSearchQuery,
  } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchShoppingList();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
          {/* Header */}
          <header className="pt-safe-top bg-gradient-to-b from-primary-600 to-primary-500 text-white shadow-lg relative">
            <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
              <h1 className="text-4xl font-display font-bold tracking-tight">
                Le Placard à Ju
              </h1>
              <p className="text-lg text-primary-50 font-light">
                Gérez votre inventaire facilement
              </p>
            </div>

            {/* Search Bar */}
            <div className="absolute -bottom-7 left-4 right-4">
              <div className="max-w-2xl mx-auto">
                <SearchBar displayProduct={true} />
              </div>
            </div>
          </header>
          <div className="max-w-2xl mx-auto px-4 pb-safe-bottom">

            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex justify-center items-center my-8">
                    <ProductForm
                      onAdd={(product) => addProduct(product)}
                      products={products}
                      onUpdateQuantity={(id, quantity) =>
                        updateProduct(id, { quantity })
                      }
                    />
                  </div>
                }
              />
              <Route
                path="/products"
                element={
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
                }
              />
              <Route
                path="/cart"
                element={
                  <ShoppingList
                    items={shoppingList}
                    products={products}
                    onRemoveItem={removeFromShoppingList}
                    onUpdateQuantity={updateShoppingItem}
                    onUpdateProduct={updateProduct}
                    onPurchaseComplete={removeFromShoppingList}
                  />
                }
              />
            </Routes>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe-bottom">
              <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
                <NavLink to="/" className="p-2 flex flex-col items-center">
                  <Home className="w-6 h-6" />
                  <span className="text-xs mt-1">Accueil</span>
                </NavLink>
                <NavLink
                  to="/products"
                  className="p-2 flex flex-col items-center"
                >
                  <Search className="w-6 h-6" />
                  <span className="text-xs mt-1">Rechercher</span>
                </NavLink>
                <NavLink to="/cart" className="p-2 flex flex-col items-center">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-xs mt-1">Liste</span>
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
