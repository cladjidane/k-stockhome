
import { useState } from "react";
import { Product } from "../../../types";
import CategoryGroup from "../../../components/CategoryGroup";
import { useStore } from "../../../store/productStore";
import CategoryFilters from "./CategoryFilters";

interface ProductListProps {
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
  onAddToShoppingList: (product: Product) => void;
}

export default function ProductList({
  products,
  onUpdateQuantity,
  onUpdateLocation,
  onDelete,
  onAddToShoppingList,
}: ProductListProps) {
  const { mainCategories, getMainCategory } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Grouper les produits par catégorie
  const groupedProducts: Record<string, Product[]> = {};
  products.forEach((product) => {
    const category = getMainCategory(product.category || '') || 'Autres';
    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(product);
  });

  // Filtrer les produits si une catégorie est sélectionnée
  const filteredGroups = selectedCategory
    ? { [selectedCategory]: groupedProducts[selectedCategory] || [] }
    : groupedProducts;

  return (
    <div className="py-16">
      <CategoryFilters
        categories={Object.keys(mainCategories)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="space-y-4">
        {Object.entries(filteredGroups).map(([category, categoryProducts]) => (
          <CategoryGroup
            key={category}
            title={category}
            products={categoryProducts}
            onUpdateQuantity={onUpdateQuantity}
            onUpdateLocation={onUpdateLocation}
            onDelete={onDelete}
            onAddToShoppingList={onAddToShoppingList}
          />
        ))}
      </div>
    </div>
  );
}
