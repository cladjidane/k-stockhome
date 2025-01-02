import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Package, ShoppingCart, Menu, Search, Home, User } from "lucide-react";
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
} from "./store/productStore";

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
          <header className="pt-safe-top bg-gradient-to-b from-primary-600 to-primary-500 text-white shadow-lg relative mb-16">
            <div className="max-w-2xl mx-auto py-8 pb-24">
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
                <div className="">
                  <AutocompleteInput
                    suggestions={products.map((p) => p.name)}
                    selectedItem={searchQuery}
                    onItemChange={setSearchQuery}
                    placeholder="Rechercher un produit..."
                    name="search"
                    label=""
                  />
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-2xl mx-auto pb-safe-bottom pb-16">
            {/* Categories */}
            <div className="mb-8 dark:bg-gray-800 rounded-lg">
              {" "}
              {/*Added background color and padding for better visibility */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Emplacements
                </h2>
                <button className="text-primary-600 text-sm font-medium">
                  Voir tout
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {["Réfrigérateur", "Congélateur", "Placard", "Tiroir"].map(
                  (location) => (
                    <button
                      key={location}
                      className="aspect-square rounded-card bg-white dark:bg-gray-800 p-4 flex flex-col items-center justify-center shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="text-2xl mb-2">
                        {location === "Réfrigérateur"
                          ? "❄️"
                          : location === "Congélateur"
                            ? "🧊"
                            : location === "Placard"
                              ? "🏠"
                              : "🗄️"}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 text-center">
                        {location}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe-bottom">
              <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
                <NavLink to="/" className="p-2 flex flex-col items-center">
                  <Home className="w-6 h-6" />
                  <span className="text-xs mt-1">Accueil</span>
                </NavLink>
                <NavLink
                  to="/search"
                  className="p-2 flex flex-col items-center"
                >
                  <Search className="w-6 h-6" />
                  <span className="text-xs mt-1">Rechercher</span>
                </NavLink>
                <NavLink
                  to="/shopping-list"
                  className="p-2 flex flex-col items-center"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-xs mt-1">Liste</span>
                </NavLink>
                <button className="p-2 flex flex-col items-center">
                  <User className="w-6 h-6" />
                  <span className="text-xs mt-1">Profil</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
