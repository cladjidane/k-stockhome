
import { useState, useEffect } from "react";
import { Product } from "../../../types";
import CategoryGroup from "../../../components/CategoryGroup";
import { useStore } from "../../../store/productStore";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});

  // Trier les produits une seule fois par ordre alphabétique
  const sortedProducts = [...products].sort((a, b) => 
    a.name.localeCompare(b.name, 'fr', { ignorePunctuation: true, sensitivity: 'base' })
  );

  useEffect(() => {
    // Filtrer les produits selon la recherche
    const filteredProducts = searchTerm 
      ? sortedProducts.filter(product => 
          product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        )
      : sortedProducts;

    // Grouper les produits par catégorie
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach((product) => {
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

      if (!assigned) {
        if (!groups['Autres']) {
          groups['Autres'] = [];
        }
        groups['Autres'].push(product);
      }
    });

    setGroupedProducts(groups);
  }, [products, mainCategories, searchTerm]);

  return (
    <div className="py-16">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
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
