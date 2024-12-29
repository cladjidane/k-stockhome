import { useState } from 'react';
import { Product } from '../types';
import AutocompleteInput from './AutocompleteInput';
import FormField from './FormField';
import { commonCategories, commonLabels } from '../data/suggestions';

interface ManualProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export default function ManualProductForm({ onSubmit, onCancel }: ManualProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'unité',
    category: 'product' as const,
    location: 'Placard cuisine',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categories: categories.join(', '),
      labels: labels.join(', '),
      nutriscore: undefined,
      nutriments: {
        energy_100g: 0,
        proteins_100g: 0,
        carbohydrates_100g: 0,
        fat_100g: 0,
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Nom du produit"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Yaourt nature"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Quantité"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          min={0}
          required
        />

        <FormField
          label="Unité"
          name="unit"
          type="select"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="unité">Unité</option>
          <option value="g">Grammes</option>
          <option value="kg">Kilogrammes</option>
          <option value="l">Litres</option>
          <option value="ml">Millilitres</option>
        </FormField>
      </div>

      <FormField
        label="Emplacement"
        name="location"
        type="select"
        value={formData.location}
        onChange={handleChange}
        required
      >
        <option value="Placard cuisine">Placard cuisine</option>
        <option value="Réfrigérateur">Réfrigérateur</option>
        <option value="Congélateur">Congélateur</option>
        <option value="Garde-manger">Garde-manger</option>
        <option value="Boîte à pain">Boîte à pain</option>
      </FormField>

      <AutocompleteInput
        name="categories"
        label="Catégories"
        suggestions={commonCategories}
        selectedItems={categories}
        onItemsChange={setCategories}
        placeholder="Ajouter une catégorie"
        helpText="Appuyez sur Entrée pour ajouter une nouvelle catégorie"
      />

      <AutocompleteInput
        name="labels"
        label="Labels"
        suggestions={commonLabels}
        selectedItems={labels}
        onItemsChange={setLabels}
        placeholder="Ajouter un label"
        helpText="Appuyez sur Entrée pour ajouter un nouveau label"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}
