import React, { useState, useMemo } from "react";
import CategoryFilters from "./CategoryFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ShoppingListItem } from "../../../types";
import { groupProductsByCategory } from "../../../utils/categoryUtils";
import AnimatedTransition from "../../../shared/components/AnimatedTransition";
import CategoryGroup from "../../../components/CategoryGroup";
import { availableLocations } from "../../../utils/productUtils";

interface ProductListProps {
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
  onAddToShoppingList: (item: ShoppingListItem) => void;
}

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProductList({
  products,
  onUpdateQuantity,
  onUpdateLocation,
  onDelete,
  onAddToShoppingList,
}: ProductListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    products.forEach((product) => {
      if (product.categories) {
        product.categories.split(",").forEach((cat) => {
          categories.add(cat.trim());
        });
      }
    });
    return Array.from(categories).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategories =
        selectedCategories.length === 0 ||
        (product.categories &&
          selectedCategories.some((cat) =>
            product.categories
              .split(",")
              .map((c) => c.trim())
              .includes(cat),
          ));

      const locations = Array.isArray(product.location)
        ? product.location
        : product.location.split(",").map((l) => l.trim());

      const matchesLocations =
        selectedLocations.length === 0 ||
        selectedLocations.some((loc) => locations.includes(loc));

      return matchesCategories && matchesLocations;
    });
  }, [products, selectedCategories, selectedLocations]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      }
      return [...prev, category];
    });
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) => {
      if (prev.includes(location)) {
        return prev.filter((loc) => loc !== location);
      }
      return [...prev, location];
    });
  };

  const groupedProducts = groupProductsByCategory(filteredProducts);

  return (
    <AnimatedTransition animation="fade">
      <div className="space-y-4 py-16">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {availableLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationToggle(location)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors
                  ${
                    selectedLocations.includes(location)
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedProducts).map(
              ([category, categoryProducts]) => (
                <motion.div
                  key={category}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <CategoryGroup
                    title={category}
                    products={categoryProducts}
                    onUpdateQuantity={onUpdateQuantity}
                    onUpdateLocation={onUpdateLocation}
                    onDelete={onDelete}
                    onAddToShoppingList={onAddToShoppingList}
                  />
                </motion.div>
              ),
            )}
          </AnimatePresence>

          {Object.keys(groupedProducts).length === 0 && (
            <AnimatedTransition animation="scale">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {products.length === 0
                  ? "Aucun produit dans votre stock"
                  : "Aucun produit ne correspond aux filtres sélectionnés"}
              </div>
            </AnimatedTransition>
          )}
        </motion.div>
      </div>
    </AnimatedTransition>
  );
}
