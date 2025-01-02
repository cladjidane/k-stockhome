
import { useState, useEffect } from "react";
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
  const { mainCategories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    // Grouper les produits par catégorie
    const groups: Record<string, Product[]> = {};
    products.forEach((product) => {
      // Normalisation de la catégorie
      const productCategories = (product.category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let assigned = false;

      // Recherche de correspondance dans les catégories principales
      for (const [mainCat, subCats] of Object.entries(mainCategories)) {
        const normalizedMainCat = mainCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedSubCats = subCats.map(cat => 
          cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );

        if (productCategories.includes(normalizedMainCat) || 
            normalizedSubCats.some(subCat => productCategories.includes(subCat))) {
          if (!groups[mainCat]) {
            groups[mainCat] = [];
          }
          groups[mainCat].push(product);
          assigned = true;
          break;
        }
      }

      // Si aucune correspondance n'est trouvée, mettre dans "Autres"
      if (!assigned) {
        if (!groups['Autres']) {
          groups['Autres'] = [];
        }
        groups['Autres'].push(product);
      }
    });

    setGroupedProducts(groups);
  }, [products, mainCategories]);

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
