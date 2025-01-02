
import React from "react";
import AutocompleteInput from "./AutocompleteInput";
import ProductItem from "../features/products/components/ProductItem";
import { Product } from "../types";
import { useStore } from "../store/productStore";
import { removeProduct, updateProduct } from "../store/productStore";

interface SearchBarProps {
  displayProduct?: boolean;
}

export default function SearchBar({ displayProduct = false }: SearchBarProps) {
  const { products, searchQuery, setSearchQuery } = useStore();

  const normalizeString = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredProducts = searchQuery
    ? products.filter((p) =>
        normalizeString(p.name).includes(normalizeString(searchQuery))
      )
    : [];

  return (
    <div className="w-full relative">
      <AutocompleteInput
        suggestions={products.map((p) => p.name)}
        selectedItem={searchQuery}
        onItemChange={setSearchQuery}
        normalizeFunction={normalizeString}
        placeholder="Rechercher un produit..."
        name="search"
        label=""
      />
      
      {displayProduct && searchQuery && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {filteredProducts.map((product) => (
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
  );
}
