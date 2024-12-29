import React, { useState, useMemo } from 'react';
import { Product, ShoppingListItem } from '../types';
import { groupProductsByCategory, MAIN_CATEGORIES } from '../utils/categoryUtils';
import CategoryGroup from './CategoryGroup';
import CategoryFilters from './CategoryFilters';
import AnimatedTransition from './AnimatedTransition';
import { motion, AnimatePresence } from 'framer-motion';

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
      staggerChildren: 0.1
    }
  }
};

export default function ProductList({ 
  products, 
  onUpdateQuantity, 
  onUpdateLocation, 
  onDelete,
  onAddToShoppingList 
}: ProductListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Extraire toutes les catégories uniques
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.categories) {
        product.categories.split(',').forEach(cat => {
          categories.add(cat.trim());
        });
      }
    });
    return Array.from(categories).sort();
  }, [products]);

  // Filtrer les produits selon les catégories sélectionnées
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    
    return products.filter(product => {
      if (!product.categories) return false;
      const productCategories = product.categories.split(',').map(cat => cat.trim());
      return selectedCategories.some(cat => productCategories.includes(cat));
    });
  }, [products, selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      return [...prev, category];
    });
  };

  const groupedProducts = groupProductsByCategory(filteredProducts);
  
  return (
    <AnimatedTransition animation="fade">
      <div className="space-y-4">
        <CategoryFilters
          categories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
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
            ))}
          </AnimatePresence>
          
          {Object.keys(groupedProducts).length === 0 && (
            <AnimatedTransition animation="scale">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {products.length === 0 ? (
                  "Aucun produit dans votre stock"
                ) : (
                  "Aucun produit ne correspond aux filtres sélectionnés"
                )}
              </div>
            </AnimatedTransition>
          )}
        </motion.div>
      </div>
    </AnimatedTransition>
  );
}