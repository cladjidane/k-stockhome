
import { useState } from 'react';
import { Product } from '../types';
import FormField from './FormField';
import { availableLocations } from '../utils/productUtils';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      location: Array.isArray(formData.location) ? formData.location.join(', ') : formData.location,
      categories: '',
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Emplacements
        </label>
        <div className="flex flex-wrap gap-2">
          {availableLocations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => {
                const locations = Array.isArray(formData.location)
                  ? formData.location
                  : [formData.location];
                
                if (locations.includes(location)) {
                  setFormData(prev => ({
                    ...prev,
                    location: locations.filter(loc => loc !== location)
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    location: [...locations, location]
                  }));
                }
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                (Array.isArray(formData.location) 
                  ? formData.location.includes(location)
                  : formData.location === location)
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              } border`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

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
