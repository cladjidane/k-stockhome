
import React, { useState } from "react";
import { Product } from "../types";
import { useStore } from "../store/productStore";
import AutocompleteInput from "./AutocompleteInput";
import FormField from "./FormField";

interface ProductFormProps {
  onAdd: (product: Omit<Product, "id">) => Promise<void>;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const LOCATIONS = [
  "Placard cuisine",
  "Réfrigérateur",
  "Congélateur",
  "Garde-manger",
  "Boîte à pain",
];

const NUTRISCORES = ["A", "B", "C", "D", "E"];

const UNITS = ["unité", "kg", "g", "L", "mL", "paquet"];

export default function ProductForm({
  onAdd,
  products,
}: ProductFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [unit, setUnit] = useState("unité");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [nutriscore, setNutriscore] = useState<string>("");
  
  const { getSuggestions } = useStore();

  const existingCategories = [...new Set(products.map(p => p.category))];
  const existingNames = [...new Set(products.map(p => p.name))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNames.length === 0) return;
    
    await onAdd({
      name: selectedNames[0],
      category: selectedCategories[0] || "Non catégorisé",
      quantity,
      unit,
      location,
      nutriscore: nutriscore || undefined,
    });

    setSelectedNames([]);
    setSelectedCategories([]);
    setQuantity(1);
    setUnit("unité");
    setLocation(LOCATIONS[0]);
    setNutriscore("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AutocompleteInput
        suggestions={existingNames}
        selectedItems={selectedNames}
        onItemsChange={setSelectedNames}
        placeholder="Nom du produit"
        label="Nom"
        helpText="Entrez le nom du produit"
        name="product-name"
      />

      <AutocompleteInput
        suggestions={existingCategories}
        selectedItems={selectedCategories}
        onItemsChange={setSelectedCategories}
        placeholder="Catégorie"
        label="Catégorie"
        helpText="Choisissez ou créez une catégorie"
        name="category"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Quantité"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={0}
        />

        <FormField
          label="Unité"
          type="select"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          options={UNITS}
        />
      </div>

      <FormField
        label="Emplacement"
        type="select"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        options={LOCATIONS}
      />

      <FormField
        label="Nutriscore"
        type="select"
        value={nutriscore}
        onChange={(e) => setNutriscore(e.target.value)}
        options={["", ...NUTRISCORES]}
      />

      <button
        type="submit"
        disabled={selectedNames.length === 0}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        Ajouter le produit
      </button>
    </form>
  );
}
